import React, { useMemo } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { clearSession, getSession, ROLE } from "../../auth/session";
import logo from "../../Assets/CollabSphereLogoLinear.svg";

import "./AppShell.css";

function MenuGroup({ title, children }) {
  return (
    <div className="cs-menu-group">
      <div className="cs-menu-title">{title}</div>
      <div className="cs-menu-items">{children}</div>
    </div>
  );
}

function MenuItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `cs-menu-link ${isActive ? "active" : ""}`
      }
      end
    >
      {label}
    </NavLink>
  );
}

export default function AppShell() {
  const navigate = useNavigate();
  const session = getSession();

  const menu = useMemo(() => {
    // Common tools for all roles
    const tools = (
      <MenuGroup title="Tools">
        <MenuItem to="/app/tools/ai-assistant" label="AI Assistant (Gemini)" />
        <MenuItem to="/app/tools/whiteboard" label="Whiteboard" />
        <MenuItem to="/app/tools/text-editor" label="Text Editor" />
        <MenuItem to="/app/tools/diagram" label="Diagram" />
        <MenuItem to="/app/notifications" label="Notifications" />
      </MenuGroup>
    );

    if (session.role === ROLE.ADMIN) {
      return (
        <>
          <MenuGroup title="Admin">
            <MenuItem to="/app/admin" label="Dashboard" />
            <MenuItem to="/app/admin/accounts" label="Accounts" />
            <MenuItem to="/app/admin/reports" label="System Reports" />
          </MenuGroup>
          {tools}
        </>
      );
    }

    if (session.role === ROLE.STAFF) {
      return (
        <>
          <MenuGroup title="Staff">
            <MenuItem to="/app/staff" label="Dashboard" />
            <MenuItem to="/app/staff/subjects" label="Subjects & Syllabus" />
            <MenuItem to="/app/staff/classes" label="Classes" />
            <MenuItem to="/app/staff/accounts" label="Lecturer/Student Accounts" />
          </MenuGroup>
          {tools}
        </>
      );
    }

    if (session.role === ROLE.HEAD_DEPARTMENT) {
      return (
        <>
          <MenuGroup title="Head Department">
            <MenuItem to="/app/head" label="Dashboard" />
            <MenuItem to="/app/head/projects" label="Projects Approval" />
            <MenuItem to="/app/head/assign" label="Assign Projects to Classes" />
            <MenuItem to="/app/head/classes" label="View Classes" />
          </MenuGroup>
          {tools}
        </>
      );
    }

    if (session.role === ROLE.LECTURER) {
      return (
        <>
          <MenuGroup title="Lecturer">
            <MenuItem to="/app/lecturer" label="Dashboard" />
            <MenuItem to="/app/lecturer/projects" label="My Projects" />
            <MenuItem to="/app/lecturer/classes" label="Assigned Classes" />
            <MenuItem to="/app/lecturer/teams" label="Teams & Workspace" />
            <MenuItem to="/app/lecturer/milestones" label="Milestones & Questions" />
            <MenuItem to="/app/lecturer/resources" label="Resources" />
            <MenuItem to="/app/lecturer/evaluation" label="Evaluation & Feedback" />
            <MenuItem to="/app/lecturer/meetings" label="Meetings" />
            <MenuItem to="/LandingPage" label="Student Workspace (Legacy)" />
          </MenuGroup>
          {tools}
        </>
      );
    }

    // Default student
    return (
      <>
        <MenuGroup title="Student">
          <MenuItem to="/app/student" label="Dashboard" />
          <MenuItem to="/app/student/classes" label="My Classes" />
          <MenuItem to="/app/student/team" label="My Team" />
          {/* Restore the old/legacy workspace as the main workspace */}
          <MenuItem to="/LandingPage" label="Workspace" />
          <MenuItem to="/app/student/milestones" label="Milestones & Checkpoints" />
          <MenuItem to="/app/student/resources" label="Resources" />
          <MenuItem to="/app/student/meetings" label="Meetings" />
        </MenuGroup>
        {tools}
      </>
    );
  }, [session.role]);

  const handleLogout = () => {
    clearSession();
    // Some endpoints set HttpOnly cookies; clear client-side anyway.
    Cookies.remove("token");
    navigate("/Login");
    window.location.reload();
  };

  return (
    <div className="cs-shell">
      <aside className="cs-sidebar">
        <div className="cs-brand" onClick={() => navigate("/app")}>
          <img src={logo} alt="CollabSphere" className="cs-logo" />
        </div>

        <div className="cs-user">
          <div className="cs-user-name">{session.name || "User"}</div>
          <div className="cs-user-meta">
            {session.role} · {session.email || ""}
          </div>
        </div>

        <div className="cs-menu">{menu}</div>

        <div className="cs-sidebar-footer">
          <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="cs-main">
        <div className="cs-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
