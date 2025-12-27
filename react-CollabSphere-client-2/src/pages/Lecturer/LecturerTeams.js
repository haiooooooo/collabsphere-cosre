import React, { useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";

const seed = [
  {
    id: "t1",
    classCode: "SE102-01",
    name: "Team Alpha",
    leader: "Carol",
    progress: 45,
    members: [
      { name: "Carol", contribution: 40 },
      { name: "Dan", contribution: 25 },
      { name: "Eve", contribution: 20 },
      { name: "Frank", contribution: 15 },
    ],
  },
  {
    id: "t2",
    classCode: "SE102-01",
    name: "Team Beta",
    leader: "Alice",
    progress: 20,
    members: [
      { name: "Alice", contribution: 50 },
      { name: "Bob", contribution: 20 },
      { name: "Chau", contribution: 30 },
    ],
  },
];

export default function LecturerTeams() {
  const [rows, setRows] = useState(seed);
  const [selectedId, setSelectedId] = useState(seed[0].id);
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    if (filter === "All") return rows;
    return rows.filter((r) => r.classCode === filter);
  }, [rows, filter]);

  const selected = useMemo(() => rows.find((r) => r.id === selectedId) || null, [rows, selectedId]);
  const classCodes = useMemo(() => Array.from(new Set(rows.map((r) => r.classCode))), [rows]);

  return (
    <div>
      <PageHeader
        title="Teams & Workspace"
        subtitle="Create/manage teams, monitor team progress, and view member contribution."
        actions={
          <select className="form-select" style={{ width: 180 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            {classCodes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        }
      />

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <div className="card">
            <div className="card-body p-0">
              <div className="p-3 fw-bold">Teams</div>
              <div className="list-group list-group-flush">
                {filtered.map((t) => (
                  <button
                    key={t.id}
                    className={`list-group-item list-group-item-action ${t.id === selectedId ? "active" : ""}`}
                    onClick={() => setSelectedId(t.id)}
                  >
                    <div className="d-flex justify-content-between">
                      <div>
                        <div className="fw-bold">{t.name}</div>
                        <div className="small">{t.classCode} · Leader: {t.leader}</div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold">{t.progress}%</div>
                        <div className="small">progress</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card">
            <div className="card-body">
              {selected ? (
                <>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold fs-5">{selected.name}</div>
                      <div className="text-muted">{selected.classCode} · Leader: {selected.leader}</div>
                    </div>
                    <button className="btn btn-outline-secondary" onClick={() => alert("Open team workspace board")}>Open Workspace</button>
                  </div>

                  <div className="mt-3">
                    <div className="fw-bold mb-2">Progress</div>
                    <div className="progress" role="progressbar" aria-valuenow={selected.progress} aria-valuemin="0" aria-valuemax="100">
                      <div className="progress-bar" style={{ width: `${selected.progress}%` }} />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="fw-bold mb-2">Member contribution</div>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Member</th>
                            <th>Contribution %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selected.members.map((m) => (
                            <tr key={m.name}>
                              <td>{m.name}</td>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <div className="progress w-100" style={{ height: 10 }}>
                                    <div className="progress-bar" style={{ width: `${m.contribution}%` }} />
                                  </div>
                                  <span className="text-muted small" style={{ width: 50 }}>{m.contribution}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-muted">Select a team.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-muted small mt-2">
        Contribution tracking can be computed from tasks, checkpoint entries, doc edits, and chat activity.
      </div>
    </div>
  );
}
