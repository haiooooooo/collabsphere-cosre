import React, { useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import axios from "../../api/axios";

const seed = [
  {
    id: "lp1",
    title: "CollabSphere",
    subject: "SE102",
    status: "Pending",
    objectives: "Build a unified PBL collaboration platform.",
    milestones: [
      "Requirements elicitation",
      "SRS & UML",
      "Architecture design",
      "Implement core modules",
      "Testing & deployment",
    ],
  },
];

function naiveMilestoneGen(subject, objectives) {
  const base = [
    "Project kickoff & team charter",
    "Requirements & user stories",
    "System design (architecture + UI)",
    "Implementation sprint 1",
    "Implementation sprint 2",
    "Testing & demo",
    "Final report & reflection",
  ];
  return base.map((x) => `${x} — ${subject || "subject"}`);
}

export default function LecturerProjects() {
  const [rows, setRows] = useState(seed);
  const [status, setStatus] = useState("All");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "SE102", objectives: "" });
  const [generated, setGenerated] = useState([]);
  const [busyAI, setBusyAI] = useState(false);

  const filtered = useMemo(() => {
    if (status === "All") return rows;
    return rows.filter((r) => r.status === status);
  }, [rows, status]);

  const generate = async () => {
    setBusyAI(true);
    try {
      // Optional: connect Bedrock-powered endpoint
      const res = await axios.post(
        "/api/ai/milestones",
        { subject: form.subject, title: form.title, objectives: form.objectives },
        { validateStatus: () => true }
      );
      if (res.status >= 200 && res.status < 300 && Array.isArray(res.data?.milestones)) {
        setGenerated(res.data.milestones);
      } else {
        setGenerated(naiveMilestoneGen(form.subject, form.objectives));
      }
    } catch (e) {
      setGenerated(naiveMilestoneGen(form.subject, form.objectives));
    } finally {
      setBusyAI(false);
    }
  };

  const createProject = () => {
    const id = `lp${Date.now()}`;
    const newProject = {
      id,
      title: form.title,
      subject: form.subject,
      status: "Draft",
      objectives: form.objectives,
      milestones: generated.length ? generated : [],
    };
    setRows((prev) => [newProject, ...prev]);
    setCreating(false);
    setForm({ title: "", subject: "SE102", objectives: "" });
    setGenerated([]);
  };

  const submitForApproval = (id) => {
    setRows((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Pending" } : p)));
    alert("Submitted as Pending (UI). Connect API to notify Head Department.");
  };

  return (
    <div>
      <PageHeader
        title="My Projects"
        subtitle="Create and manage projects based on subject syllabus, then submit pending projects for Head Department approval."
        actions={
          <>
            <select
              className="form-select"
              style={{ width: 190 }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>All</option>
              <option>Draft</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Denied</option>
            </select>
            <button className="btn btn-danger" onClick={() => setCreating(true)}>
              Create Project
            </button>
          </>
        }
      />

      {creating ? (
        <div className="card mb-3">
          <div className="card-body">
            <div className="fw-bold mb-2">New project</div>
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Subject</label>
                <select
                  className="form-select"
                  value={form.subject}
                  onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                >
                  <option>SE102</option>
                  <option>SE103</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Objectives</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.objectives}
                  onChange={(e) => setForm((p) => ({ ...p, objectives: e.target.value }))}
                />
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-3">
              <button className="btn btn-outline-secondary" onClick={generate} disabled={busyAI}>
                {busyAI ? "Generating..." : "AI: Generate milestones"}
              </button>
              <button className="btn btn-danger" onClick={createProject} disabled={!form.title.trim()}>
                Save Draft
              </button>
              <button className="btn btn-outline-secondary" onClick={() => setCreating(false)}>
                Cancel
              </button>
            </div>

            {generated.length ? (
              <div className="mt-3">
                <div className="fw-bold">Generated milestones</div>
                <ol className="mt-2">
                  {generated.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover m-0">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Milestones</th>
                  <th style={{ width: 220 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>{p.subject}</td>
                    <td><span className="badge text-bg-light">{p.status}</span></td>
                    <td>{p.milestones?.length || 0}</td>
                    <td>
                      <div className="d-flex gap-2">
                        {p.status === "Draft" ? (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => submitForApproval(p.id)}>
                            Submit
                          </button>
                        ) : null}
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => alert("Open detail editor (connect API)")}>Details</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="text-muted small mt-2">
        Backend suggestion: <code>POST /api/lecturer/projects</code>, <code>POST /api/lecturer/projects/:id/submit</code>, <code>GET /api/lecturer/projects</code>.
      </div>
    </div>
  );
}
