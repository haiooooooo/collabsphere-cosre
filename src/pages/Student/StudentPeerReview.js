import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";

export default function StudentPeerReview() {
  const [target, setTarget] = useState("Dan");
  const [score, setScore] = useState(4);
  const [comment, setComment] = useState("Strong contributor in UML tasks.");

  const submit = () => {
    alert("Submitted (UI). Connect backend to store peer reviews and expose to lecturers.");
  };

  return (
    <div>
      <PageHeader
        title="Peer Review"
        subtitle="Evaluate and give feedback for other team members (end of project / milestone answers)."
      />

      <div className="card" style={{ maxWidth: 980 }}>
        <div className="card-body">
          <div className="row g-2">
            <div className="col-12 col-md-4">
              <label className="form-label">Member</label>
              <select className="form-select" value={target} onChange={(e) => setTarget(e.target.value)}>
                <option>Dan</option>
                <option>Eve</option>
                <option>Frank</option>
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Score (1-5)</label>
              <input className="form-control" type="number" min={1} max={5} value={score} onChange={(e) => setScore(Number(e.target.value))} />
            </div>
          </div>

          <div className="mt-3">
            <label className="form-label">Comment</label>
            <textarea className="form-control" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>

          <button className="btn btn-danger mt-3" onClick={submit}>Submit</button>

          <div className="text-muted small mt-3">
            Notifications: team members receive feedback; lecturer can view peer reviews for future judgments.
          </div>
        </div>
      </div>
    </div>
  );
}
