import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";

export default function LecturerMeetings() {
  const [rows, setRows] = useState([
    { id: "mt1", when: "2026-02-09 19:30", with: "Team Alpha", topic: "Sprint planning", link: "..." },
  ]);
  const [form, setForm] = useState({ when: "", with: "Team Alpha", topic: "" });

  const add = () => {
    if (!form.when || !form.topic.trim()) return;
    setRows((prev) => [
      { id: `mt${Date.now()}`, when: form.when, with: form.with, topic: form.topic, link: "Join link (connect WebRTC)" },
      ...prev,
    ]);
    setForm({ when: "", with: "Team Alpha", topic: "" });
  };

  return (
    <div>
      <PageHeader
        title="Meetings"
        subtitle="Schedule future meetings and start/join video calls (WebRTC module integration point)."
      />

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <div className="card"><div className="card-body">
            <div className="fw-bold mb-2">Schedule a meeting</div>
            <div className="mb-2">
              <label className="form-label">When</label>
              <input className="form-control" placeholder="YYYY-MM-DD HH:mm" value={form.when} onChange={(e) => setForm((p) => ({ ...p, when: e.target.value }))} />
            </div>
            <div className="mb-2">
              <label className="form-label">With</label>
              <select className="form-select" value={form.with} onChange={(e) => setForm((p) => ({ ...p, with: e.target.value }))}>
                <option>Team Alpha</option>
                <option>Team Beta</option>
                <option>Class SE102-01</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label">Topic</label>
              <input className="form-control" value={form.topic} onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))} />
            </div>
            <button className="btn btn-danger" onClick={add}>Create</button>
            <div className="text-muted small mt-2">
              When backend is ready: create a meeting room (WebRTC) + save schedule + notify participants via email + realtime.
            </div>
          </div></div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card"><div className="card-body p-0">
            <div className="p-3 fw-bold">Upcoming meetings</div>
            <div className="table-responsive">
              <table className="table table-hover m-0">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>With</th>
                    <th>Topic</th>
                    <th style={{ width: 160 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.when}</td>
                      <td>{r.with}</td>
                      <td>{r.topic}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => alert("Start meeting (connect WebRTC)")}>Start</button>
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
