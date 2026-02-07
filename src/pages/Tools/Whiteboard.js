import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import PageHeader from "../../components/common/PageHeader";
import socketApi from "../../api/socketApi";

function drawStroke(ctx, stroke) {
  if (!stroke || !stroke.points || stroke.points.length < 2) return;
  ctx.strokeStyle = stroke.color || "#111";
  ctx.lineWidth = stroke.width || 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  for (let i = 1; i < stroke.points.length; i++) {
    ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
  }
  ctx.stroke();
}

export default function Whiteboard() {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const strokeRef = useRef(null);
  const [color, setColor] = useState("#111111");
  const [width, setWidth] = useState(2);
  const [roomKey, setRoomKey] = useState("default");
  const [connected, setConnected] = useState(false);

  const socket = useMemo(() => {
    // Safe: if server doesn't expose a namespace, this will just stay disconnected.
    return io(socketApi, { transports: ["websocket"], autoConnect: false });
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
  }, []);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("whiteboard:stroke", (payload) => {
      if (!payload?.stroke) return;
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      drawStroke(ctx, payload.stroke);
    });

    socket.on("whiteboard:clear", () => {
      clear();
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("whiteboard:stroke");
      socket.off("whiteboard:clear");
      socket.disconnect();
    };
  }, [socket]);

  const join = () => {
    if (socket.connected) return;
    socket.connect();
    socket.emit("whiteboard:join", { roomKey });
  };

  const clear = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
  };

  const pointerPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvasRef.current.width / rect.width),
      y: (e.clientY - rect.top) * (canvasRef.current.height / rect.height),
    };
  };

  const onDown = (e) => {
    drawingRef.current = true;
    const p = pointerPos(e);
    strokeRef.current = { color, width, points: [p] };
  };

  const onMove = (e) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const stroke = strokeRef.current;
    const p = pointerPos(e);
    stroke.points.push(p);
    drawStroke(ctx, stroke);
  };

  const onUp = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const stroke = strokeRef.current;
    strokeRef.current = null;
    // Try to broadcast; if server doesn't support it, still works locally.
    if (socket.connected) socket.emit("whiteboard:stroke", { roomKey, stroke });
  };

  return (
    <div>
      <PageHeader
        title="Whiteboard"
        subtitle="Real-time collaborative drawing (Socket.IO-ready)."
        actions={
          <>
            <input
              className="form-control"
              style={{ width: 180 }}
              value={roomKey}
              onChange={(e) => setRoomKey(e.target.value)}
              placeholder="roomKey"
            />
            <button className="btn btn-outline-secondary" onClick={join}>
              {connected ? "Connected" : "Connect"}
            </button>
          </>
        }
      />

      <div className="card" style={{ maxWidth: 980 }}>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
            <label className="form-label m-0">Color</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />

            <label className="form-label m-0 ms-2">Width</label>
            <input
              type="range"
              min={1}
              max={8}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
            <span className="text-muted">{width}px</span>

            <button
              className="btn btn-outline-danger ms-auto"
              onClick={() => {
                clear();
                if (socket.connected) socket.emit("whiteboard:clear", { roomKey });
              }}
            >
              Clear
            </button>
          </div>

          <div className="border rounded" style={{ overflow: "hidden", background: "#fff" }}>
            <canvas
              ref={canvasRef}
              width={900}
              height={500}
              style={{ width: "100%", height: "auto", touchAction: "none" }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onPointerLeave={onUp}
            />
          </div>

          <div className="text-muted small mt-2">
            Note: If the backend does not yet handle Socket.IO events, the whiteboard still works locally.
            When you add server handlers for <code>whiteboard:join</code>, <code>whiteboard:stroke</code>, and <code>whiteboard:clear</code>, it becomes real-time multi-user.
          </div>
        </div>
      </div>
    </div>
  );
}
