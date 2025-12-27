import React from "react";
import PageHeader from "../../components/common/PageHeader";

export default function HeadDashboard() {
  return (
    <div>
      <PageHeader
        title="Head Department Dashboard"
        subtitle="Approve/deny projects, assign approved projects to classes, and oversee classes."
      />

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="card"><div className="card-body">
            <div className="text-muted">Pending Projects</div>
            <div className="fs-3 fw-bold">—</div>
            <div className="text-muted small">Connect /api/head/projects?status=pending</div>
          </div></div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card"><div className="card-body">
            <div className="text-muted">Approved Projects</div>
            <div className="fs-3 fw-bold">—</div>
            <div className="text-muted small">Approved projects become assignable.</div>
          </div></div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card"><div className="card-body">
            <div className="text-muted">Classes</div>
            <div className="fs-3 fw-bold">—</div>
            <div className="text-muted small">Oversee all classes in department.</div>
          </div></div>
        </div>

        <div className="col-12">
          <div className="card"><div className="card-body">
            <div className="fw-bold">Head Department functions covered</div>
            <ul className="mb-0 mt-2">
              <li>View classes, subjects & syllabus</li>
              <li>Approve / deny pending projects</li>
              <li>Update approved projects</li>
              <li>Assign approved projects for all classes</li>
            </ul>
          </div></div>
        </div>
      </div>
    </div>
  );
}
