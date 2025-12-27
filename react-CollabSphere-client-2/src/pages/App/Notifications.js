import React, { useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";

const seed = [
  {
    id: "n1",
    time: "Just now",
    type: "Real-time",
    title: "New resource uploaded",
    detail: "Lecturer uploaded 'SRS Template' to SE102 class.",
  },
  {
    id: "n2",
    time: "10 min ago",
    type: "Email",
    title: "Checkpoint submission received",
    detail: "Team Alpha submitted 'Sprint 2 Demo'.",
  },
  {
    id: "n3",
    time: "Yesterday",
    type: "Real-time",
    title: "Milestone marked done",
    detail: "Leader marked Milestone #3 as completed.",
  },
];

export default function Notifications() {
  const [filter, setFilter] = useState("All");

  const items = useMemo(() => {
    if (filter === "All") return seed;
    return seed.filter((n) => n.type === filter);
  }, [filter]);

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Real-time notifications and email events will be centralized here."
        actions={
          <select
            className="form-select"
            style={{ width: 180 }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Real-time</option>
            <option>Email</option>
          </select>
        }
      />

      <div className="card">
        <div className="card-body">
          {items.length === 0 ? (
            <div className="text-muted">No notifications.</div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {items.map((n) => (
                <div key={n.id} className="border rounded p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="fw-bold">{n.title}</div>
                    <span className="badge text-bg-light">{n.type}</span>
                  </div>
                  <div className="text-muted small mt-1">{n.time}</div>
                  <div className="mt-2">{n.detail}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
