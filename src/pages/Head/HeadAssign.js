import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";

const classesSeed = ["SE102-01", "SE102-02", "SE103-01"];
const projectsSeed = ["CollabSphere", "Library Management"];

export default function HeadAssign() {
  const [target, setTarget] = useState("All Classes");
  const [cls, setCls] = useState(classesSeed[0]);
  const [proj, setProj] = useState(projectsSeed[0]);
  const [result, setResult] = useState([]);

  const apply = () => {
    const scope = target === "All Classes" ? "All" : cls;
    setResult((prev) => [...prev, { scope, proj, at: new Date().toLocaleString() }]);
  };

  return (
    <div>
      <PageHeader
        title="Assign Projects to Classes"
        subtitle="Head Department assigns projects (from approved list) for all classes or a specific class."
      />

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <div className="card"><div className="card-body">
            <div className="mb-3">
              <label className="form-label">Target</label>
              <select className="form-select" value={target} onChange={(e) => setTarget(e.target.value)}>
                <option>All Classes</option>
                <option>Specific Class</option>
              </select>
            </div>
            {target === "Specific Class" ? (
              <div className="mb-3">
                <label className="form-label">Class</label>
                <select className="form-select" value={cls} onChange={(e) => setCls(e.target.value)}>
                  {classesSeed.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className="mb-3">
              <label className="form-label">Approved project</label>
              <select className="form-select" value={proj} onChange={(e) => setProj(e.target.value)}>
                {projectsSeed.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-danger" onClick={apply}>Assign</button>
            <div className="text-muted small mt-2">
              Backend suggestion: <code>POST /api/head/classes/assign-project</code>
            </div>
          </div></div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card"><div className="card-body">
            <div className="fw-bold">Recent assignments</div>
            {result.length === 0 ? (
              <div className="text-muted mt-2">No assignments yet.</div>
            ) : (
              <ul className="mt-2 mb-0">
                {result.map((r, i) => (
                  <li key={i}>
                    <span className="fw-bold">{r.proj}</span> → <span className="text-muted">{r.scope}</span> <span className="text-muted">({r.at})</span>
                  </li>
                ))}
              </ul>
            )}
          </div></div>
        </div>
      </div>
    </div>
  );
}
