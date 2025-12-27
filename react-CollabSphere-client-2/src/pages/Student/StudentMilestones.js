import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";

export default function StudentMilestones() {
  const [answers, setAnswers] = useState({});
  const questions = [
    { id: "q1", milestone: "SRS & UML", q: "List 3 key functional requirements." },
    { id: "q2", milestone: "SRS & UML", q: "Explain how your system supports real-time collaboration." },
  ];

  const [checkpoints, setCheckpoints] = useState([
    { id: "c1", title: "Sprint 1 Demo", assignees: ["Carol"], done: false },
  ]);
  const [newCheckpoint, setNewCheckpoint] = useState("");

  const addCheckpoint = () => {
    if (!newCheckpoint.trim()) return;
    setCheckpoints((prev) => [...prev, { id: `c${Date.now()}`, title: newCheckpoint.trim(), assignees: ["Carol"], done: false }]);
    setNewCheckpoint("");
  };

  return (
    <div>
      <PageHeader
        title="Milestones & Checkpoints"
        subtitle="View milestone questions, submit answers, create checkpoints, and mark them done."
      />

      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <div className="card"><div className="card-body">
            <div className="fw-bold mb-2">Milestone questions</div>
            {questions.map((x) => (
              <div key={x.id} className="border rounded p-3 mb-2">
                <div className="text-muted small">{x.milestone}</div>
                <div className="fw-bold">{x.q}</div>
                <textarea
                  className="form-control mt-2"
                  rows={3}
                  placeholder="Your answer..."
                  value={answers[x.id] || ""}
                  onChange={(e) => setAnswers((p) => ({ ...p, [x.id]: e.target.value }))}
                />
                <button className="btn btn-sm btn-danger mt-2" onClick={() => alert("Submitted (UI). Connect API.")}>Submit</button>
              </div>
            ))}
          </div></div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card"><div className="card-body">
            <div className="fw-bold mb-2">Checkpoints</div>
            <ul className="list-group">
              {checkpoints.map((c) => (
                <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold">{c.title}</div>
                    <div className="text-muted small">Assignees: {c.assignees.join(", ")}</div>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <span className={`badge ${c.done ? "text-bg-success" : "text-bg-secondary"}`}>{c.done ? "Done" : "Open"}</span>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setCheckpoints((prev) => prev.map((x) => (x.id === c.id ? { ...x, done: !x.done } : x)))}
                    >
                      Toggle
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="d-flex gap-2 mt-3">
              <input className="form-control" placeholder="New checkpoint title..." value={newCheckpoint} onChange={(e) => setNewCheckpoint(e.target.value)} />
              <button className="btn btn-danger" onClick={addCheckpoint}>Add</button>
            </div>
            <div className="text-muted small mt-2">
              Submitting checkpoint entries should notify lecturer + team members (email + realtime).
            </div>
          </div></div>
        </div>
      </div>
    </div>
  );
}
