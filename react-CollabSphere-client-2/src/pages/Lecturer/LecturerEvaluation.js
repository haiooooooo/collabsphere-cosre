import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";

export default function LecturerEvaluation() {
  const [tab, setTab] = useState("Team");
  const [score, setScore] = useState(85);
  const [feedback, setFeedback] = useState("Good progress; focus on testing and documentation next sprint.");
  const [memberScore, setMemberScore] = useState(90);

  const submit = () => {
    alert("Saved (UI). Connect backend to persist evaluations and notify members.");
  };

  return (
    <div>
      <PageHeader
        title="Evaluation & Feedback"
        subtitle="Evaluate teams, milestone answers, checkpoint submissions, and view peer evaluations."
        actions={
          <select className="form-select" style={{ width: 220 }} value={tab} onChange={(e) => setTab(e.target.value)}>
            <option>Team</option>
            <option>Member</option>
            <option>Checkpoint</option>
            <option>Peer Reviews</option>
          </select>
        }
      />

      <div className="card" style={{ maxWidth: 980 }}>
        <div className="card-body">
          {tab === "Team" ? (
            <>
              <div className="fw-bold mb-2">Team evaluation</div>
              <div className="row g-2">
                <div className="col-12 col-md-4">
                  <label className="form-label">Team</label>
                  <select className="form-select">
                    <option>Team Alpha</option>
                    <option>Team Beta</option>
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Score</label>
                  <input className="form-control" type="number" value={score} onChange={(e) => setScore(Number(e.target.value))} />
                </div>
              </div>
              <div className="mt-3">
                <label className="form-label">Feedback</label>
                <textarea className="form-control" rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
              </div>
              <button className="btn btn-danger mt-3" onClick={submit}>Save</button>
            </>
          ) : null}

          {tab === "Member" ? (
            <>
              <div className="fw-bold mb-2">Member evaluation</div>
              <div className="row g-2">
                <div className="col-12 col-md-4">
                  <label className="form-label">Member</label>
                  <select className="form-select">
                    <option>Carol</option>
                    <option>Dan</option>
                    <option>Eve</option>
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Score</label>
                  <input className="form-control" type="number" value={memberScore} onChange={(e) => setMemberScore(Number(e.target.value))} />
                </div>
              </div>
              <div className="mt-3">
                <label className="form-label">Feedback</label>
                <textarea className="form-control" rows={4} placeholder="Feedback for this member..." />
              </div>
              <button className="btn btn-danger mt-3" onClick={submit}>Save</button>
            </>
          ) : null}

          {tab === "Checkpoint" ? (
            <>
              <div className="fw-bold mb-2">Checkpoint submissions</div>
              <div className="text-muted">List team checkpoint submissions here, open details, and grade them.</div>
              <ul className="mt-3">
                <li>Team Alpha — Sprint 2 Demo (submitted)</li>
                <li>Team Beta — Sprint 1 Report (submitted)</li>
              </ul>
              <div className="text-muted small">Connect: <code>GET /api/lecturer/checkpoints</code>, <code>POST /api/lecturer/checkpoints/:id/evaluate</code></div>
            </>
          ) : null}

          {tab === "Peer Reviews" ? (
            <>
              <div className="fw-bold mb-2">Peer evaluations</div>
              <div className="text-muted">View how team members rate each other to make informed judgments.</div>
              <div className="mt-3 border rounded p-3">
                <div className="fw-bold">Carol</div>
                <div className="text-muted small">Avg peer score: 4.3/5 · Comments: "Strong leadership"</div>
              </div>
              <div className="mt-2 border rounded p-3">
                <div className="fw-bold">Dan</div>
                <div className="text-muted small">Avg peer score: 3.7/5 · Comments: "Improving"</div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="text-muted small mt-2">
        When you save evaluations, send email + realtime notifications to affected users.
      </div>
    </div>
  );
}
