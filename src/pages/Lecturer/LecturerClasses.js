import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";

const classesSeed = [
  { id: "lc1", code: "SE102-01", students: 42, project: "(none)" },
  { id: "lc2", code: "SE103-01", students: 38, project: "(none)" },
];

const approvedProjects = ["CollabSphere", "Library Management", "Food Delivery"];

export default function LecturerClasses() {
  const [rows, setRows] = useState(classesSeed);

  const assignProject = (classId, proj) => {
    setRows((prev) => prev.map((c) => (c.id === classId ? { ...c, project: proj } : c)));
  };

  return (
    <div>
      <PageHeader
        title="Assigned Classes"
        subtitle="View your classes, assign projects (from approved list), and open team workspaces."
      />

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover m-0">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Students</th>
                  <th>Project</th>
                  <th style={{ width: 320 }}>Assign project</th>
                  <th style={{ width: 160 }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td>{c.code}</td>
                    <td>{c.students}</td>
                    <td>{c.project}</td>
                    <td>
                      <select
                        className="form-select"
                        value={c.project}
                        onChange={(e) => assignProject(c.id, e.target.value)}
                      >
                        <option>(none)</option>
                        {approvedProjects.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-outline-secondary" onClick={() => alert("Open class detail / team list")}>Open</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="text-muted small mt-2">
        Legacy class room (Announcements/Assignments/Files/Members) is at <code>/InRoom</code>.
      </div>
    </div>
  );
}
