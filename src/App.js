import { HashRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import LandingPage from "./pages/LandingPage/LandingPage";
import InRoom from "./pages/InRoom/InRoom";
import NoPage from "./pages/NoPage";
import InAssignment from "./components/LandingPageContent/Assignment/InAssignment";

import RequireAuth from "./auth/RequireAuth";
import RequireRole from "./auth/RequireRole";
import { ROLE } from "./auth/session";

import AppShell from "./pages/AppShell/AppShell";
import RoleRedirect from "./pages/App/RoleRedirect";
import AppNotFound from "./pages/App/AppNotFound";
import Notifications from "./pages/App/Notifications";

import Whiteboard from "./pages/Tools/Whiteboard";
import TextEditor from "./pages/Tools/TextEditor";
import Diagram from "./pages/Tools/Diagram";
import AIAssistant from "./pages/Tools/AIAssistant";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminAccounts from "./pages/Admin/AdminAccounts";
import AdminReports from "./pages/Admin/AdminReports";

import StaffDashboard from "./pages/Staff/StaffDashboard";
import StaffSubjects from "./pages/Staff/StaffSubjects";
import StaffClasses from "./pages/Staff/StaffClasses";
import StaffAccounts from "./pages/Staff/StaffAccounts";

import HeadDashboard from "./pages/Head/HeadDashboard";
import HeadProjects from "./pages/Head/HeadProjects";
import HeadAssign from "./pages/Head/HeadAssign";
import HeadClasses from "./pages/Head/HeadClasses";

import LecturerDashboard from "./pages/Lecturer/LecturerDashboard";
import LecturerProjects from "./pages/Lecturer/LecturerProjects";
import LecturerClasses from "./pages/Lecturer/LecturerClasses";
import LecturerTeams from "./pages/Lecturer/LecturerTeams";
import LecturerMilestones from "./pages/Lecturer/LecturerMilestones";
import LecturerResources from "./pages/Lecturer/LecturerResources";
import LecturerEvaluation from "./pages/Lecturer/LecturerEvaluation";
import LecturerMeetings from "./pages/Lecturer/LecturerMeetings";

import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentClasses from "./pages/Student/StudentClasses";
import StudentTeam from "./pages/Student/StudentTeam";
import StudentWorkspace from "./pages/Student/StudentWorkspace";
import StudentMilestones from "./pages/Student/StudentMilestones";
import StudentResources from "./pages/Student/StudentResources";
import StudentMeetings from "./pages/Student/StudentMeetings";


function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path='/react-CollabSphere-client' element={<Login />} />
          <Route path='/index' element={<Login />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Register' element={<Register />} />

          {/* Role-based app shell */}
          <Route
            path='/app'
            element={
              <RequireAuth>
                <AppShell />
              </RequireAuth>
            }
          >
            <Route index element={<RoleRedirect />} />
            <Route path='notifications' element={<Notifications />} />

            {/* Shared tools */}
            <Route path='tools/whiteboard' element={<Whiteboard />} />
            <Route path='tools/text-editor' element={<TextEditor />} />
            <Route path='tools/diagram' element={<Diagram />} />
            <Route path='tools/ai-assistant' element={<AIAssistant />} />

            {/* Admin */}
            <Route
              path='admin'
              element={
                <RequireRole allowed={[ROLE.ADMIN]}>
                  <AdminDashboard />
                </RequireRole>
              }
            />
            <Route
              path='admin/accounts'
              element={
                <RequireRole allowed={[ROLE.ADMIN]}>
                  <AdminAccounts />
                </RequireRole>
              }
            />
            <Route
              path='admin/reports'
              element={
                <RequireRole allowed={[ROLE.ADMIN]}>
                  <AdminReports />
                </RequireRole>
              }
            />

            {/* Staff */}
            <Route
              path='staff'
              element={
                <RequireRole allowed={[ROLE.STAFF]}>
                  <StaffDashboard />
                </RequireRole>
              }
            />
            <Route
              path='staff/subjects'
              element={
                <RequireRole allowed={[ROLE.STAFF]}>
                  <StaffSubjects />
                </RequireRole>
              }
            />
            <Route
              path='staff/classes'
              element={
                <RequireRole allowed={[ROLE.STAFF]}>
                  <StaffClasses />
                </RequireRole>
              }
            />
            <Route
              path='staff/accounts'
              element={
                <RequireRole allowed={[ROLE.STAFF]}>
                  <StaffAccounts />
                </RequireRole>
              }
            />

            {/* Head Department */}
            <Route
              path='head'
              element={
                <RequireRole allowed={[ROLE.HEAD_DEPARTMENT]}>
                  <HeadDashboard />
                </RequireRole>
              }
            />
            <Route
              path='head/projects'
              element={
                <RequireRole allowed={[ROLE.HEAD_DEPARTMENT]}>
                  <HeadProjects />
                </RequireRole>
              }
            />
            <Route
              path='head/assign'
              element={
                <RequireRole allowed={[ROLE.HEAD_DEPARTMENT]}>
                  <HeadAssign />
                </RequireRole>
              }
            />
            <Route
              path='head/classes'
              element={
                <RequireRole allowed={[ROLE.HEAD_DEPARTMENT]}>
                  <HeadClasses />
                </RequireRole>
              }
            />

            {/* Lecturer */}
            <Route
              path='lecturer'
              element={
                <RequireRole allowed={[ROLE.LECTURER]}>
                  <LecturerDashboard />
                </RequireRole>
              }
            />
            <Route
              path='lecturer/projects'
              element={
                <RequireRole allowed={[ROLE.LECTURER]}>
                  <LecturerProjects />
                </RequireRole>
              }
            />
            <Route
              path='lecturer/classes'
              element={
                <RequireRole allowed={[ROLE.LECTURER]}>
                  <LecturerClasses />
                </RequireRole>
              }
            />
            <Route
              path='lecturer/teams'
              element={
                <RequireRole allowed={[ROLE.LECTURER]}>
                  <LecturerTeams />
                </RequireRole>
              }
            />
            <Route
              path='lecturer/milestones'
              element={
                <RequireRole allowed={[ROLE.LECTURER]}>
                  <LecturerMilestones />
                </RequireRole>
              }
            />
            <Route
              path='lecturer/resources'
              element={
                <RequireRole allowed={[ROLE.LECTURER]}>
                  <LecturerResources />
                </RequireRole>
              }
            />
            <Route
              path='lecturer/evaluation'
              element={
                <RequireRole allowed={[ROLE.LECTURER]}>
                  <LecturerEvaluation />
                </RequireRole>
              }
            />
            <Route
              path='lecturer/meetings'
              element={
                <RequireRole allowed={[ROLE.LECTURER]}>
                  <LecturerMeetings />
                </RequireRole>
              }
            />

            {/* Student */}
            <Route
              path='student'
              element={
                <RequireRole allowed={[ROLE.STUDENT]}>
                  <StudentDashboard />
                </RequireRole>
              }
            />
            <Route
              path='student/classes'
              element={
                <RequireRole allowed={[ROLE.STUDENT]}>
                  <StudentClasses />
                </RequireRole>
              }
            />
            <Route
              path='student/team'
              element={
                <RequireRole allowed={[ROLE.STUDENT]}>
                  <StudentTeam />
                </RequireRole>
              }
            />
            <Route
              path='student/workspace'
              element={
                <RequireRole allowed={[ROLE.STUDENT]}>
                  <StudentWorkspace />
                </RequireRole>
              }
            />
            <Route
              path='student/milestones'
              element={
                <RequireRole allowed={[ROLE.STUDENT]}>
                  <StudentMilestones />
                </RequireRole>
              }
            />
            <Route
              path='student/resources'
              element={
                <RequireRole allowed={[ROLE.STUDENT]}>
                  <StudentResources />
                </RequireRole>
              }
            />
            <Route
              path='student/peer-review'
              element={
                <RequireRole allowed={[ROLE.STUDENT]}>
                  <AppNotFound />
                </RequireRole>
              }
            />
            <Route
              path='student/meetings'
              element={
                <RequireRole allowed={[ROLE.STUDENT]}>
                  <StudentMeetings />
                </RequireRole>
              }
            />

            <Route path='*' element={<AppNotFound />} />
          </Route>

          {/* Legacy routes */}
          <Route path='/LandingPage' element={<LandingPage />} />
          <Route path='/LandingPage/:id' element={<InAssignment />} />
          <Route path='/InRoom' element={<InRoom />} />

          <Route path='/*' element={<NoPage />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
