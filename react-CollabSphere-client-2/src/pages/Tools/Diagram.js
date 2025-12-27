import React, { useMemo, useRef, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { nanoid } from "nanoid";

export default function Diagram() {
  const [nodes, setNodes] = useState([
    { id: "n1", label: "Start", x: 60, y: 80 },
    { id: "n2", label: "Process", x: 260, y: 180 },
    { id: "n3", label: "End", x: 480, y: 80 },
  ]);
  const [selectedId, setSelectedId] = useState("n2");
  const [json, setJson] = useState("");
  const dragRef = useRef(null);

  const selected = useMemo(
    () => nodes.find((n) => n.id === selectedId) || null,
    [nodes, selectedId]
  );

  const addNode = () => {
    const id = nanoid(8);
    const next = { id, label: `Node ${nodes.length + 1}`, x: 120, y: 120 };
    setNodes((prev) => [...prev, next]);
    setSelectedId(id);
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedId));
    setSelectedId((prev) => {
      const rest = nodes.filter((n) => n.id !== prev);
      return rest[0]?.id || "";
    });
  };

  const onMouseDown = (e, node) => {
    setSelectedId(node.id);
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    dragRef.current = {
      id: node.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: node.x,
      origY: node.y,
      rect,
    };
  };

  const onMouseMove = (e) => {
    if (!dragRef.current) return;
    const d = dragRef.current;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    setNodes((prev) =>
      prev.map((n) => (n.id === d.id ? { ...n, x: d.origX + dx, y: d.origY + dy } : n))
    );
  };

  const onMouseUp = () => {
    dragRef.current = null;
  };

  const exportJson = () => {
    setJson(JSON.stringify({ nodes }, null, 2));
  };

  const importJson = () => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed?.nodes || !Array.isArray(parsed.nodes)) throw new Error("Invalid format");
      setNodes(parsed.nodes);
      setSelectedId(parsed.nodes[0]?.id || "");
    } catch (e) {
      alert("Invalid JSON");
    }
  };

  return (
    <div>
      <PageHeader
        title="Diagram"
        subtitle="MVP diagram board (drag nodes + import/export). You can later integrate a full diagram library."
        actions={
          <>
            <button className="btn btn-outline-secondary" onClick={addNode}>
              Add Node
            </button>
            <button className="btn btn-outline-danger" onClick={removeSelected} disabled={!selected}>
              Delete Selected
            </button>
          </>
        }
      />

      <div className="row g-3" onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
        <div className="col-12 col-lg-8">
          <div className="card">
            <div className="card-body">
              <div
                className="border rounded position-relative"
                style={{ height: 520, background: "#fff", overflow: "hidden" }}
              >
                {/* Simple connectors: line between sequential nodes */}
                <svg
                  width="100%"
                  height="100%"
                  className="position-absolute top-0 start-0"
                  style={{ pointerEvents: "none" }}
                >
                  {nodes.slice(0, -1).map((n, i) => {
                    const m = nodes[i + 1];
                    return (
                      <line
                        key={`${n.id}-${m.id}`}
                        x1={n.x + 60}
                        y1={n.y + 22}
                        x2={m.x + 60}
                        y2={m.y + 22}
                        stroke="#cbd5e1"
                        strokeWidth={2}
                      />
                    );
                  })}
                </svg>

                {nodes.map((n) => (
                  <div
                    key={n.id}
                    className={`position-absolute border rounded px-3 py-2 shadow-sm ${
                      n.id === selectedId ? "border-danger" : "border-light"
                    }`}
                    style={{ left: n.x, top: n.y, minWidth: 120, cursor: "move", userSelect: "none" }}
                    onMouseDown={(e) => onMouseDown(e, n)}
                    onClick={() => setSelectedId(n.id)}
                  >
                    {n.label}
                  </div>
                ))}
              </div>
              <div className="text-muted small mt-2">
                Drag nodes to re-arrange. This MVP is enough for user stories & simple flows.
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card mb-3">
            <div className="card-body">
              <div className="fw-bold mb-2">Properties</div>
              {selected ? (
                <>
                  <div className="mb-2">
                    <label className="form-label">Label</label>
                    <input
                      className="form-control"
                      value={selected.label}
                      onChange={(e) =>
                        setNodes((prev) =>
                          prev.map((x) => (x.id === selected.id ? { ...x, label: e.target.value } : x))
                        )
                      }
                    />
                  </div>
                  <div className="text-muted small">Id: {selected.id}</div>
                </>
              ) : (
                <div className="text-muted">Select a node.</div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="fw-bold mb-2">Import / Export</div>
              <div className="d-flex gap-2 mb-2">
                <button className="btn btn-outline-secondary" onClick={exportJson}>
                  Export
                </button>
                <button className="btn btn-danger" onClick={importJson}>
                  Import
                </button>
              </div>
              <textarea
                className="form-control"
                style={{ minHeight: 240, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
                placeholder="JSON..."
                value={json}
                onChange={(e) => setJson(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
