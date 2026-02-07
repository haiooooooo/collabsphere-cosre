import React from "react";
import PageHeader from "../../components/common/PageHeader";

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview of accounts, system health, and user reports."
      />

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="card"><div className="card-body">
            <div className="text-muted">Total Users</div>
            <div className="fs-3 fw-bold">—</div>
            <div className="text-muted small">Connect /api/admin/accounts for live data.</div>
          </div></div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card"><div className="card-body">
            <div className="text-muted">Active Reports (Email)</div>
            <div className="fs-3 fw-bold">—</div>
            <div className="text-muted small">Admin receives user reports via email notification.</div>
          </div></div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card"><div className="card-body">
            <div className="text-muted">System Status</div>
            <div className="fs-3 fw-bold">OK</div>
            <div className="text-muted small">Frontend: React · Backend: Python Web API · DB: PostgreSQL</div>
          </div></div>
        </div>

        <div className="col-12">
          <div className="card"><div className="card-body">
            <div className="fw-bold">Admin capabilities implemented in UI</div>
            <ul className="mb-0 mt-2">
              <li>View all accounts (Head Department, Staff, Lecturer, Student)</li>
              <li>Deactivate accounts (UI ready; connect API)</li>
              <li>View system reports (email + UI listing)</li>
            </ul>
          </div></div>
        </div>
      </div>
    </div>
  );
}
