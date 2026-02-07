import React from "react";
import PageHeader from "../../components/common/PageHeader";

export default function StaffDashboard() {
  return (
    <div>
      <PageHeader
        title="Staff Dashboard"
        subtitle="Manage Subjects, Syllabus, Classes, and Lecturer/Student accounts via imports."
      />

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="card"><div className="card-body">
            <div className="fw-bold">Subjects & Syllabus</div>
            <div className="text-muted mt-1">Import files to auto-create subjects and syllabus.</div>
          </div></div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card"><div className="card-body">
            <div className="fw-bold">Classes</div>
            <div className="text-muted mt-1">Import class lists and assign lecturers/students.</div>
          </div></div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card"><div className="card-body">
            <div className="fw-bold">Accounts</div>
            <div className="text-muted mt-1">Batch import lecturer/student accounts.</div>
          </div></div>
        </div>

        <div className="col-12">
          <div className="card"><div className="card-body">
            <div className="fw-bold">Staff functions covered</div>
            <ul className="mb-0 mt-2">
              <li>Import & manage subjects and syllabus</li>
              <li>Import & manage classes (info and members)</li>
              <li>Import & manage lecturer/student accounts</li>
              <li>Assign lecturers and students to classes</li>
            </ul>
          </div></div>
        </div>
      </div>
    </div>
  );
}
