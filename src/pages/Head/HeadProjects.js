import React, { useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";

const seed = [
  {
    id: "p1",
    title: "CollabSphere",
    subject: "SE102",
    status: "Pending",
    milestones: 6,
  },
  {
    id: "p2",
    title: "Library Management",
    subject: "SE102",
    status: "Approved",
    milestones: 5,
  },
  {
    id: "p3",
    title: "Food Delivery",
    subject: "SE103",
    status: "Denied",
    milestones: 4,
  },
];

export default function HeadProjects() {
  const [status, setStatus] = useState("Pending");
  const [rows, setRows] = useState(seed);

  const filtered = useMemo(() => rows.filter((r) => r.status === status), [rows, status]);

  const setProjectStatus = (id, nextStatus) => {
    setRows((prev) => prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p)));
  };

  return (
    <div>
      <PageHeader
        title="Projects Approval"
        subtitle="Approve or deny projects submitted by lecturers. Approved projects can be assigned to classes."
        actions={
          <select className="form-select" style={{ width: 200 }} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Pending</option>
            <option>Approved</option>
            <option>Denied</option>
          </select>
        }
      />

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover m-0">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Subject</th>
                  <th>Milestones</th>
                  <th>Status</th>
                  <th style={{ width: 260 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>{p.subject}</td>
                    <td>{p.milestones}</td>
                    <td><span className="badge text-bg-light">{p.status}</span></td>
                    <td>
                      {p.status === "Pending" ? (
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-success" onClick={() => setProjectStatus(p.id, "Approved")}>Approve</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => setProjectStatus(p.id, "Denied")}>Deny</button>
                        </div>
                      ) : p.status === "Approved" ? (
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => alert("Open edit form (connect API)")}>Update</button>
                      ) : (
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setProjectStatus(p.id, "Pending")}>Re-review</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="text-muted small mt-2">
        Backend suggestion: <code>GET /api/head/projects</code>, <code>POST /api/head/projects/:id/approve</code>, <code>POST /api/head/projects/:id/deny</code>, <code>PUT /api/head/projects/:id</code>.
      </div>
    </div>
  );
}
