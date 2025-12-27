import Cookies from "js-cookie";

/**
 * Session helpers.
 *
 * We store the minimal info in cookies so the app can do role-based routing.
 * Backend may use different field names for role; see Login page for mapping.
 */

export const ROLE = {
  ADMIN: "Admin",
  STAFF: "Staff",
  HEAD_DEPARTMENT: "HeadDepartment",
  LECTURER: "Lecturer",
  STUDENT: "Student",
};

export function getSession() {
  return {
    token: Cookies.get("token") || "",
    uid: Cookies.get("uid") || "",
    name: Cookies.get("name") || "",
    email: Cookies.get("email") || "",
    role: Cookies.get("role") || ROLE.STUDENT,
  };
}

export function isAuthenticated() {
  const { token, uid } = getSession();
  // Guard against accidental string values like "undefined" or "null".
  const bad = (v) => !v || v === "undefined" || v === "null";
  return !bad(token) && !bad(uid);
}

export function clearSession() {
  ["token", "uid", "email", "name", "role"].forEach((k) => Cookies.remove(k));
}

export function setSession({ token, uid, email, name, role }) {
  if (token) Cookies.set("token", token);
  if (uid) Cookies.set("uid", uid);
  if (email) Cookies.set("email", email);
  if (name) Cookies.set("name", name);
  if (role) Cookies.set("role", role);
}

export function normalizeRole(rawRole) {
  // Defensive mapping for inconsistent backend field values.
  const v = String(rawRole || "").trim().toLowerCase();

  if (["admin", "systemadmin", "system_administrator", "administrator"].includes(v)) {
    return ROLE.ADMIN;
  }
  if (["staff", "academicstaff", "office", "departmentstaff"].includes(v)) {
    return ROLE.STAFF;
  }
  if (["headdepartment", "head_department", "headofdepartment", "hod"].includes(v)) {
    return ROLE.HEAD_DEPARTMENT;
  }
  if (["lecturer", "teacher", "instructor"].includes(v)) {
    return ROLE.LECTURER;
  }
  return ROLE.STUDENT;
}
