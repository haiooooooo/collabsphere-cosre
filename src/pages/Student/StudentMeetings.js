import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";

export default function StudentMeetings() {
  const [rows] = useState([
    { id: "smt1", when: "2026-02-09 19:30", with: "Team Alpha", topic: "Sprint planning", link: "Join link (connect WebRTC)" },
    { id: "smt2", when: "2026-02-11 20:00", with: "Class SE102-01", topic: "Q&A", link: "Join link (connect WebRTC)" },
  ]);

  return (
    <div>
      <PageHeader
        title="Meetings"
        subtitle="View upcoming meetings and join audio/video calls (WebRTC module integration point)."
      />

      <div className="card">
        <div className="card-body p-0">
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
                      <button className="btn btn-sm btn-outline-danger" onClick={() => alert("Join meeting (connect WebRTC)")}>Join</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}