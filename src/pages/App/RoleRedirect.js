import React from "react";
import { Navigate } from "react-router-dom";
import { getSession, ROLE } from "../../auth/session";

export default function RoleRedirect() {
  const { role } = getSession();

  if (role === ROLE.ADMIN) return <Navigate to="/app/admin" replace />;
  if (role === ROLE.STAFF) return <Navigate to="/app/staff" replace />;
  if (role === ROLE.HEAD_DEPARTMENT) return <Navigate to="/app/head" replace />;
  if (role === ROLE.LECTURER) return <Navigate to="/app/lecturer" replace />;
  return <Navigate to="/app/student" replace />;
}
