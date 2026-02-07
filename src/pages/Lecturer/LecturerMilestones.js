import React, { useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";

const milestonesSeed = [
  { id: "m1", title: "Milestone 1: Requirements", done: true },
  { id: "m2", title: "Milestone 2: SRS & UML", done: false },
  { id: "m3", title: "Milestone 3: Architecture", done: false },
];

const questionSeed = [
  { id: "q1", milestoneId: "m2", question: "What social contribution does this feature enable?" },
  { id: "q2", milestoneId: "m2", question: "List 3 key functional requirements." },
];

export default function LecturerMilestones() {
  const [milestones, setMilestones] = useState(milestonesSeed);
  const [questions, setQuestions] = useState(questionSeed);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(milestonesSeed[0].id);
  const [newQuestion, setNewQuestion] = useState("");

  const selected = useMemo(
    () => milestones.find((m) => m.id === selectedMilestoneId) || null,
    [milestones, selectedMilestoneId]
  );

  const selectedQuestions = useMemo(
    () => questions.filter((q) => q.milestoneId === selectedMilestoneId),
    [questions, selectedMilestoneId]
  );

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    setQuestions((prev) => [
      ...prev,
      { id: `q${Date.now()}`, milestoneId: selectedMilestoneId, question: newQuestion.trim() },
    ]);
    setNewQuestion("");
  };

  return (
    <div>
      <PageHeader
        title="Milestones & Questions"
        subtitle="Manage team milestones and create milestone questions to guide development (social contribution, reflection, etc.)."
      />

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <div className="card">
            <div className="card-body p-0">
              <div className="p-3 fw-bold">Milestones</div>
              <div className="list-group list-group-flush">
                {milestones.map((m) => (
                  <button
                    key={m.id}
                    className={`list-group-item list-group-item-action ${m.id === selectedMilestoneId ? "active" : ""}`}
                    onClick={() => setSelectedMilestoneId(m.id)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>{m.title}</div>
                      <span className={`badge ${m.done ? "text-bg-success" : "text-bg-secondary"}`}>{m.done ? "Done" : "Open"}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card">
            <div className="card-body">
              {selected ? (
                <>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold fs-5">{selected.title}</div>
                      <div className="text-muted">Questions and answers are shown per milestone.</div>
                    </div>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setMilestones((prev) => prev.map((x) => (x.id === selected.id ? { ...x, done: !x.done } : x)))
                      }
                    >
                      Toggle Done
                    </button>
                  </div>

                  <hr />

                  <div className="fw-bold">Questions</div>
                  {selectedQuestions.length === 0 ? (
                    <div className="text-muted mt-2">No questions for this milestone.</div>
                  ) : (
                    <ul className="mt-2">
                      {selectedQuestions.map((q) => (
                        <li key={q.id} className="mb-2">
                          {q.question}
                          <button
                            className="btn btn-sm btn-link text-danger"
                            onClick={() => setQuestions((prev) => prev.filter((x) => x.id !== q.id))}
                          >
                            remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="d-flex gap-2 mt-3">
                    <input
                      className="form-control"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Add a milestone question..."
                    />
                    <button className="btn btn-danger" onClick={addQuestion}>
                      Add
                    </button>
                  </div>

                  <div className="text-muted small mt-3">
                    Lecturer can view milestone answers and checkpoint submissions in the Evaluation module.
                  </div>
                </>
              ) : (
                <div className="text-muted">Select a milestone.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
