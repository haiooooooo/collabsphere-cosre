import React from "react";
import { Link } from "react-router-dom";

export default function AppNotFound() {
  return (
    <div className="text-center p-5">
      <h3>Page not found</h3>
      <p className="text-muted">This section does not exist.</p>
      <Link to="/app" className="btn btn-danger">Back to Dashboard</Link>
    </div>
  );
}
