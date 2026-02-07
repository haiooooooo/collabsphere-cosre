import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Workspace legacy restore
 *
 * The project already has a full-featured legacy student workspace at /LandingPage
 * (Home / Assignment / Chat). This route keeps backward compatibility for
 * /app/student/workspace and redirects to the restored workspace.
 */
export default function StudentWorkspace() {
  return <Navigate to="/LandingPage" replace />;
}
