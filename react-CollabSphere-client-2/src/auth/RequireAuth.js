import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "./session";

/**
 * Simple auth gate using cookies set at login.
 */
export default function RequireAuth({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }

  return children;
}
