import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import PageHeader from "../../components/common/PageHeader";

export default function StaffAccounts() {
  const [uploaded, setUploaded] = useState(null);
  const [rows, setRows] = useState([
    { name: "Bob", email: "bob@uni.edu", role: "Lecturer" },
    { name: "Carol", email: "carol@uni.edu", role: "Student" },
  ]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (files) => setUploaded(files[0]),
  });

  return (
    <div>
      <PageHeader
        title="Lecturer/Student Accounts"
        subtitle="Staff can import files to automatically create lecturer & student accounts and manage those accounts."
      />

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <div className="card">
            <div className="card-body">
              <div className="fw-bold mb-2">Import accounts</div>
              <div {...getRootProps()} className="border rounded p-3" style={{ cursor: "pointer" }}>
                <input {...getInputProps()} />
                <div className="fw-bold">Click to upload</div>
                <div className="text-muted small">CSV/Excel: name, email, role, class mapping...</div>
                {uploaded ? (
                  <div className="mt-2">
                    Selected: <code>{uploaded.name}</code>
                  </div>
                ) : null}
              </div>
              <div className="text-muted small mt-2">
                Backend suggestion: <code>POST /api/staff/accounts/import</code>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card">
            <div className="card-body p-0">
              <div className="p-3 fw-bold">Accounts</div>
              <div className="table-responsive">
                <table className="table table-hover m-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th style={{ width: 120 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, idx) => (
                      <tr key={idx}>
                        <td>{r.name}</td>
                        <td>{r.email}</td>
                        <td>{r.role}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => setRows((p) => p.filter((_, i) => i !== idx))}>
                            Remove
                          </button>
                        </td>
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
