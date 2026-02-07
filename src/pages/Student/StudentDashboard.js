import React from "react";
import PageHeader from "../../components/common/PageHeader";

export default function StudentDashboard() {
  return (
    <div>
      <PageHeader
        title="Student Dashboard"
        subtitle="Track classes, team progress, milestones, checkpoints, meetings, and lecturer feedback."
      />

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="card"><div className="card-body">
            <div className="text-muted">Assigned Classes</div>
            <div className="fs-3 fw-bold">—</div>
            <div className="text-muted small">Open class workspaces and resources.</div>
          </div></div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card"><div className="card-body">
            <div className="text-muted">My Team</div>
            <div className="fs-3 fw-bold">—</div>
            <div className="text-muted small">Monitor progress and contributions.</div>
          </div></div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card"><div className="card-body">
            <div className="text-muted">Upcoming Meetings</div>
            <div className="fs-3 fw-bold">—</div>
            <div className="text-muted small">Join video/audio calls.</div>
          </div></div>
        </div>

        <div className="col-12">
          <div className="card"><div className="card-body">
            <div className="fw-bold">Student features covered</div>
            <ul className="mb-0 mt-2">
              <li>View classes, subject/syllabus, team milestones and checkpoints</li>
              <li>Mark done milestones/checkpoints (team leader)</li>
              <li>Create/manage checkpoints and submit entries</li>
              <li>Workspace: cards/tasks/subtasks + sprints</li>
              <li>Chat + meetings + scheduling + collaboration tools</li>
              <li>View lecturer evaluation & feedback</li>
            </ul>
          </div></div>
        </div>
      </div>
    </div>
  );
}
