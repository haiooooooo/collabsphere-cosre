import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import PageHeader from "../../components/common/PageHeader";

export default function StaffSubjects() {
  const [uploaded, setUploaded] = useState(null);
  const [subjects, setSubjects] = useState([
    { code: "CNPM", name: "Công nghệ phần mềm", credits: 3 },
    { code: "SE102", name: "Software Engineering", credits: 3 },
    { code: "SE103", name: "Requirements Engineering", credits: 3 },
  ]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: (files) => {
      setUploaded(files[0]);
      // Later: send to backend for parsing & creating subjects/syllabus.
    },
  });

  return (
    <div>
      <PageHeader
        title="Subjects & Syllabus"
        subtitle="Staff can import files to automatically create and manage subjects and syllabus."
      />

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <div className="card">
            <div className="card-body">
              <div className="fw-bold mb-2">Import</div>
              <div
                {...getRootProps()}
                className={`border rounded p-4 text-center ${isDragActive ? "bg-light" : ""}`}
                style={{ cursor: "pointer" }}
              >
                <input {...getInputProps()} />
                <div className="fw-bold">Drag & drop a file here</div>
                <div className="text-muted">CSV / Excel / PDF syllabus templates supported by backend parser.</div>
                {uploaded ? <div className="mt-2">Selected: <code>{uploaded.name}</code></div> : null}
              </div>

              <div className="text-muted small mt-2">
                Backend suggestion: <code>POST /api/staff/subjects/import</code> to parse and create subjects + syllabus.
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card">
            <div className="card-body p-0">
              <div className="p-3 fw-bold">Subjects</div>
              <div className="table-responsive">
                <table className="table table-hover m-0">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((s) => (
                      <tr key={s.code}>
                        <td>{s.code}</td>
                        <td>{s.name}</td>
                        <td>{s.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
