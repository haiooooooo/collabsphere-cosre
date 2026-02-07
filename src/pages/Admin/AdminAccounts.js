import React, { useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { ROLE } from "../../auth/session";

const mock = [
  { id: "u1", name: "Alice", email: "alice@uni.edu", role: ROLE.STAFF, status: "Active" },
  { id: "u2", name: "Bob", email: "bob@uni.edu", role: ROLE.LECTURER, status: "Active" },
  { id: "u3", name: "Carol", email: "carol@uni.edu", role: ROLE.STUDENT, status: "Active" },
  { id: "u4", name: "Dave", email: "dave@uni.edu", role: ROLE.HEAD_DEPARTMENT, status: "Deactivated" },
];

export default function AdminAccounts() {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [rows, setRows] = useState(mock);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "All" || r.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [rows, query, roleFilter]);

  const toggleDeactivate = (id) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === "Active" ? "Deactivated" : "Active" } : r
      )
    );
  };

  return (
    <div>
      <PageHeader
        title="Accounts"
        subtitle="View and deactivate Head Department, Staff, Lecturer, and Student accounts (UI ready)."
      />

      <div className="card mb-3">
        <div className="card-body d-flex flex-wrap gap-2 align-items-center">
          <input
            className="form-control"
            style={{ maxWidth: 360 }}
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="form-select"
            style={{ width: 220 }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option>All</option>
            <option>{ROLE.ADMIN}</option>
            <option>{ROLE.HEAD_DEPARTMENT}</option>
            <option>{ROLE.STAFF}</option>
            <option>{ROLE.LECTURER}</option>
            <option>{ROLE.STUDENT}</option>
          </select>

          <div className="text-muted small ms-auto">
            Connect backend: <code>/api/admin/accounts</code>, <code>/api/admin/users/:id/deactivate</code>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover m-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th style={{ width: 160 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.role}</td>
                    <td>
                      <span className={`badge ${r.status === "Active" ? "text-bg-success" : "text-bg-secondary"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${r.status === "Active" ? "btn-outline-danger" : "btn-outline-success"}`}
                        onClick={() => toggleDeactivate(r.id)}
                      >
                        {r.status === "Active" ? "Deactivate" : "Activate"}
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
  );
}
