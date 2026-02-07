import React from "react";
import PageHeader from "../../components/common/PageHeader";

const reports = [
  {
    id: "r1",
    createdAt: "2026-02-07",
    from: "student@uni.edu",
    subject: "Can't upload file",
    status: "Open",
  },
  {
    id: "r2",
    createdAt: "2026-02-06",
    from: "lecturer@uni.edu",
    subject: "Meeting room audio issue",
    status: "Resolved",
  },
];

export default function AdminReports() {
  return (
    <div>
      <PageHeader
        title="System Reports"
        subtitle="Users can report issues; admin receives email notifications and can review them here."
      />

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover m-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td>{r.createdAt}</td>
                    <td>{r.from}</td>
                    <td>{r.subject}</td>
                    <td>
                      <span className={`badge ${r.status === "Open" ? "text-bg-warning" : "text-bg-success"}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="text-muted small mt-2">
        Backend suggestion: store reports in DB, send email to admin, and expose API endpoints like <code>/api/admin/reports</code>.
      </div>
    </div>
  );
}
