import React, { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import PageHeader from "../../components/common/PageHeader";

const seed = [
  { id: "f1", name: "SRS Template.docx", scope: "Class SE102-01", uploadedAt: "2026-02-07" },
  { id: "f2", name: "UML Examples.pptx", scope: "Team Alpha", uploadedAt: "2026-02-06" },
];

export default function LecturerResources() {
  const [scope, setScope] = useState("Class SE102-01");
  const [rows, setRows] = useState(seed);
  const [file, setFile] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (files) => setFile(files[0]),
  });

  const filtered = useMemo(() => rows.filter((r) => r.scope === scope), [rows, scope]);

  const upload = () => {
    if (!file) return;
    setRows((prev) => [
      { id: `f${Date.now()}`, name: file.name, scope, uploadedAt: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
    setFile(null);
    alert("Uploaded (UI). Connect backend storage like Cloudinary/S3.");
  };

  return (
    <div>
      <PageHeader
        title="Resources"
        subtitle="Manage resources (files, docs, slides, ...) for classes and teams."
        actions={
          <select className="form-select" style={{ width: 220 }} value={scope} onChange={(e) => setScope(e.target.value)}>
            <option>Class SE102-01</option>
            <option>Class SE103-01</option>
            <option>Team Alpha</option>
            <option>Team Beta</option>
          </select>
        }
      />

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <div className="card"><div className="card-body">
            <div className="fw-bold mb-2">Upload to {scope}</div>
            <div {...getRootProps()} className="border rounded p-3" style={{ cursor: "pointer" }}>
              <input {...getInputProps()} />
              <div className="fw-bold">Click to choose a file</div>
              <div className="text-muted small">Docs, slides, images, etc.</div>
              {file ? <div className="mt-2">Selected: <code>{file.name}</code></div> : null}
            </div>
            <button className="btn btn-danger mt-3" onClick={upload} disabled={!file}>Upload</button>
            <div className="text-muted small mt-2">
              Backend suggestion: store media in Cloudinary/S3, metadata in DB. Notify class/team via realtime + email.
            </div>
          </div></div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card"><div className="card-body p-0">
            <div className="p-3 fw-bold">Files in {scope}</div>
            <div className="table-responsive">
              <table className="table table-hover m-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Uploaded</th>
                    <th style={{ width: 140 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td>{r.name}</td>
                      <td>{r.uploadedAt}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => alert("Download/open (connect storage URLs)")}>Open</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div></div>
        </div>
      </div>
    </div>
  );
}
