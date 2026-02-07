import React from "react";
import PageHeader from "../../components/common/PageHeader";
import { Link } from "react-router-dom";

const rows = [
  { code: "CNPM-01", subject: "Công nghệ phần mềm", lecturer: "(assigned later)" },
  { code: "SE102-01", subject: "Software Engineering", lecturer: "Bob" },
  { code: "SE103-01", subject: "Requirements Engineering", lecturer: "Dr. Nguyen" },
];

export default function StudentClasses() {
  return (
    <div>
      <PageHeader
        title="My Classes"
        subtitle="View list and detail of assigned classes."
      />

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover m-0">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Lecturer</th>
                  <th style={{ width: 180 }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.code}>
                    <td>{r.code}</td>
                    <td>{r.subject}</td>
                    <td>{r.lecturer}</td>
                    <td>
                      <Link className="btn btn-outline-secondary" to="/LandingPage">
                        Open Workspace
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="text-muted small mt-2">
        Legacy student workspace is currently available at <code>/LandingPage</code> and class room at <code>/InRoom</code>.
      </div>
    </div>
  );
}
