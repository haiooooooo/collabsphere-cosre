import React from "react";
import PageHeader from "../../components/common/PageHeader";

export default function LecturerDashboard() {
  return (
    <div>
      <PageHeader
        title="Lecturer Dashboard"
        subtitle="Create projects, manage classes & teams, monitor progress, and evaluate contributions."
      />

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="card"><div className="card-body">
            <div className="text-muted">My Projects</div>
            <div className="fs-3 fw-bold">—</div>
            <div className="text-muted small">Pending / Approved / Denied</div>
          </div></div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card"><div className="card-body">
            <div className="text-muted">Assigned Classes</div>
            <div className="fs-3 fw-bold">—</div>
            <div className="text-muted small">Manage teams within classes</div>
          </div></div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card"><div className="card-body">
            <div className="text-muted">Teams</div>
            <div className="fs-3 fw-bold">—</div>
            <div className="text-muted small">Track progress & contribution</div>
          </div></div>
        </div>

        <div className="col-12">
          <div className="card"><div className="card-body">
            <div className="fw-bold">Lecturer features covered</div>
            <ul className="mb-0 mt-2">
              <li>Create/manage projects based on syllabus, submit for approval</li>
              <li>Assign approved projects to class & teams</li>
              <li>Manage team milestones, questions, checkpoints and resources</li>
              <li>Monitor progress and member contribution (UI ready)</li>
              <li>Evaluate & feedback teams, milestone answers, checkpoint submissions</li>
              <li>Chat + meetings + scheduling + collaboration tools</li>
            </ul>
          </div></div>
        </div>
      </div>
    </div>
  );
}
