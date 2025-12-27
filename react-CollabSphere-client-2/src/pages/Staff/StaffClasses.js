import React, { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import PageHeader from "../../components/common/PageHeader";

const seed = [
  {
    id: "c1",
    code: "SE102-01",
    subject: "SE102",
    lecturer: "Bob",
    members: 42,
  },
  {
    id: "c2",
    code: "SE102-02",
    subject: "SE102",
    lecturer: "(unassigned)",
    members: 40,
  },
  {
    id: "c3",
    code: "CNPM-01",
    subject: "CNPM",
    lecturer: "(unassigned)",
    members: 45,
  },
];

export default function StaffClasses() {
  const [classes, setClasses] = useState(seed);
  const [query, setQuery] = useState("");
  const [uploaded, setUploaded] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (files) => setUploaded(files[0]),
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return classes;
    return classes.filter((c) =>
      [c.code, c.subject, c.lecturer].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [classes, query]);

  const assignLecturer = (id, name) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, lecturer: name } : c)));
  };

  return (
    <div>
      <PageHeader
        title="Classes"
        subtitle="Import and manage classes, and assign lecturers and class members."
      />

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="fw-bold mb-2">Import classes</div>
              <div {...getRootProps()} className="border rounded p-3" style={{ cursor: "pointer" }}>
                <input {...getInputProps()} />
                <div className="fw-bold">Click to upload</div>
                <div className="text-muted small">CSV/Excel: class code, subject, lecturer email, student list...</div>
                {uploaded ? <div className="mt-2">Selected: <code>{uploaded.name}</code></div> : null}
              </div>
              <div className="text-muted small mt-2">
                Backend suggestion: <code>POST /api/staff/classes/import</code>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card mb-3">
            <div className="card-body d-flex gap-2 align-items-center flex-wrap">
              <input
                className="form-control"
                style={{ maxWidth: 360 }}
                placeholder="Search class / subject / lecturer..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="text-muted small ms-auto">Assigning students to classes is backend-driven.</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover m-0">
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Subject</th>
                      <th>Lecturer</th>
                      <th>Members</th>
                      <th style={{ width: 260 }}>Assign lecturer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c.id}>
                        <td>{c.code}</td>
                        <td>{c.subject}</td>
                        <td>{c.lecturer}</td>
                        <td>{c.members}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <select
                              className="form-select form-select-sm"
                              value={c.lecturer}
                              onChange={(e) => assignLecturer(c.id, e.target.value)}
                            >
                              <option>(unassigned)</option>
                              <option>Bob</option>
                              <option>Dr. Nguyen</option>
                              <option>Ms. Tran</option>
                            </select>
                            <button className="btn btn-sm btn-outline-secondary" type="button">
                              Save
                            </button>
                          </div>
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
