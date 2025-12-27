import React from "react";
import PageHeader from "../../components/common/PageHeader";

const rows = [
  { code: "CNPM-01", lecturer: "(unassigned)", students: 45, project: "CollabSphere" },
  { code: "SE102-01", lecturer: "Bob", students: 42, project: "CollabSphere" },
  { code: "SE102-02", lecturer: "(unassigned)", students: 40, project: "Library Management" },
];

export default function HeadClasses() {
  return (
    <div>
      <PageHeader
        title="All Classes"
        subtitle="View list and details of classes (info, lecturer, students, assigned projects)."
      />

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover m-0">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Lecturer</th>
                  <th>Students</th>
                  <th>Assigned project</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.code}>
                    <td>{r.code}</td>
                    <td>{r.lecturer}</td>
                    <td>{r.students}</td>
                    <td>{r.project}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
