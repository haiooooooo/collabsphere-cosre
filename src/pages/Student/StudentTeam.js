import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";

export default function StudentTeam() {
  const [isLeader, setIsLeader] = useState(true);
  const [progress, setProgress] = useState(45);
  const [milestones, setMilestones] = useState([
    { title: "Requirements", done: true },
    { title: "SRS & UML", done: false },
    { title: "Architecture", done: false },
  ]);

  const toggleDone = (idx) => {
    setMilestones((prev) => prev.map((m, i) => (i === idx ? { ...m, done: !m.done } : m)));
  };

  return (
    <div>
      <PageHeader
        title="My Team"
        subtitle="Monitor team progress and member contribution. Team leader can mark milestones/checkpoints done."
      />

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="card"><div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-bold fs-5">Team Alpha</div>
                <div className="text-muted">Class SE102-01 · Project: CollabSphere</div>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isLeader}
                  onChange={(e) => setIsLeader(e.target.checked)}
                />
                <label className="form-check-label">Leader mode</label>
              </div>
            </div>

            <div className="mt-3">
              <div className="fw-bold mb-2">Progress</div>
              <div className="progress" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-muted small mt-1">{progress}%</div>
            </div>
          </div></div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card"><div className="card-body">
            <div className="fw-bold mb-2">Milestones</div>
            <ul className="list-group">
              {milestones.map((m, idx) => (
                <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{m.title}</span>
                  <div className="d-flex gap-2 align-items-center">
                    <span className={`badge ${m.done ? "text-bg-success" : "text-bg-secondary"}`}>{m.done ? "Done" : "Open"}</span>
                    {isLeader ? (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => toggleDone(idx)}>
                        Toggle
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-muted small mt-2">
              Team leader can mark done; system notifies lecturer + team members (email + realtime).
            </div>
          </div></div>
        </div>
      </div>
    </div>
  );
}
