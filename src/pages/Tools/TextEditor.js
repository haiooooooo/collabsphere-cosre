import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import PageHeader from "../../components/common/PageHeader";
import socketApi from "../../api/socketApi";

function storageKey(roomKey) {
  return `cosre:text-editor:${roomKey}`;
}

function ToolbarButton({ label, onClick }) {
  return (
    <button
      type="button"
      className="btn btn-sm btn-outline-secondary"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default function TextEditor() {
  const [roomKey, setRoomKey] = useState("default");
  const [connected, setConnected] = useState(false);
  const [docTitle, setDocTitle] = useState("Team Notes");
  const editorRef = useRef(null);
  const lastRemoteRef = useRef(0);

  const socket = useMemo(
    () => io(socketApi, { transports: ["websocket"], autoConnect: false }),
    []
  );

  // Load draft from localStorage when room changes
  useEffect(() => {
    const raw = localStorage.getItem(storageKey(roomKey));
    if (!raw) {
      setDocTitle("Team Notes");
      if (editorRef.current) {
        editorRef.current.innerHTML =
          "<h1>CollabSphere</h1><p>Ghi chú nhóm ở đây…</p>";
      }
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setDocTitle(parsed?.title || "Team Notes");
      if (editorRef.current) {
        editorRef.current.innerHTML = parsed?.html || "";
      }
    } catch {
      // ignore
    }
  }, [roomKey]);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("editor:update", (payload) => {
      if (!payload?.html) return;
      if (payload?.ts && payload.ts < lastRemoteRef.current) return;
      lastRemoteRef.current = payload.ts || Date.now();
      if (payload?.title) setDocTitle(payload.title);
      if (editorRef.current) editorRef.current.innerHTML = payload.html;
      // also persist locally
      localStorage.setItem(
        storageKey(roomKey),
        JSON.stringify({ title: payload?.title || docTitle, html: payload.html })
      );
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("editor:update");
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, roomKey]);

  const join = () => {
    if (socket.connected) return;
    socket.connect();
    socket.emit("editor:join", { roomKey });
  };

  const saveLocal = () => {
    const html = editorRef.current?.innerHTML || "";
    localStorage.setItem(storageKey(roomKey), JSON.stringify({ title: docTitle, html }));
  };

  const broadcast = () => {
    const html = editorRef.current?.innerHTML || "";
    const ts = Date.now();
    lastRemoteRef.current = ts;
    saveLocal();
    if (socket.connected) socket.emit("editor:update", { roomKey, title: docTitle, html, ts });
  };

  const exec = (cmd, value = null) => {
    // execCommand is deprecated but still works widely for lightweight editors.
    // If you want modern CRDT + rich editor, replace with TipTap/ProseMirror + Yjs.
    document.execCommand(cmd, false, value);
    broadcast();
  };

  const insertHeading = (level) => {
    exec("formatBlock", `H${level}`);
  };

  const insertLink = () => {
    const url = window.prompt("Link URL:");
    if (!url) return;
    exec("createLink", url);
  };

  return (
    <div>
      <PageHeader
        title="Text Editor"
        subtitle="Trình soạn thảo văn bản (có thể cộng tác realtime qua Socket.IO)."
        actions={
          <>
            <input
              className="form-control"
              style={{ width: 160 }}
              value={roomKey}
              onChange={(e) => setRoomKey(e.target.value)}
              placeholder="roomKey"
            />
            <button className="btn btn-outline-secondary" onClick={join} type="button">
              {connected ? "Connected" : "Connect"}
            </button>
            <button className="btn btn-outline-secondary" onClick={saveLocal} type="button">
              Save
            </button>
          </>
        }
      />

      <div className="card" style={{ maxWidth: 1080 }}>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
            <input
              className="form-control"
              style={{ maxWidth: 420 }}
              value={docTitle}
              onChange={(e) => {
                setDocTitle(e.target.value);
                // don't spam broadcast on each keypress in title
                saveLocal();
              }}
              placeholder="Document title"
            />

            <div className="d-flex flex-wrap gap-2">
              <ToolbarButton label="B" onClick={() => exec("bold")} />
              <ToolbarButton label="I" onClick={() => exec("italic")} />
              <ToolbarButton label="U" onClick={() => exec("underline")} />
              <ToolbarButton label="H1" onClick={() => insertHeading(1)} />
              <ToolbarButton label="H2" onClick={() => insertHeading(2)} />
              <ToolbarButton label="• List" onClick={() => exec("insertUnorderedList")} />
              <ToolbarButton label="1. List" onClick={() => exec("insertOrderedList")} />
              <ToolbarButton label="Link" onClick={insertLink} />
              <ToolbarButton label="Code" onClick={() => exec("formatBlock", "PRE")} />
              <ToolbarButton label="Clear" onClick={() => exec("removeFormat")} />
            </div>

            <div className="text-muted small ms-auto">
              {connected ? "Realtime ON" : "Realtime OFF"} · Local autosave
            </div>
          </div>

          <div
            ref={editorRef}
            className="form-control"
            contentEditable
            suppressContentEditableWarning
            style={{ minHeight: 560, overflowY: "auto" }}
            onInput={() => {
              // naive broadcast; backend can debounce or apply OT/CRDT later
              broadcast();
            }}
          />

          <div className="text-muted small mt-2">
            Sự kiện socket: <code>editor:join</code>, <code>editor:update</code>.
            Hiện tại dùng cơ chế <i>last-write-wins</i>; để tránh xung đột khi nhiều người gõ
            cùng lúc, bạn có thể nâng cấp server lên OT/CRDT (ví dụ: Yjs).
          </div>
        </div>
      </div>
    </div>
  );
}
