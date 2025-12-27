import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSession } from "./session";

/**
 * Role guard. If user does not have required role, redirect to /app.
 */
export default function RequireRole({ allowed = [], children }) {
  const location = useLocation();
  const { role } = getSession();

  if (allowed.length > 0 && !allowed.includes(role)) {
    return <Navigate to="/app" replace state={{ from: location }} />;
  }

  return children;
}
