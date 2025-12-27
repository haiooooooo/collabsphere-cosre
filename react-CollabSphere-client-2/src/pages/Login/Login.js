import React, { useEffect, useMemo, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/CollabSphereLogoLinear.svg";
import "./Login.css";
import { ROLE, setSession, normalizeRole as normalizeRoleStrict } from "../../auth/session";

const DEFAULT_EMAIL = "";
const DEFAULT_PASSWORD = "";

const DEMO_MODE = String(process.env.REACT_APP_DEMO_MODE || "true").toLowerCase() !== "false";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("thong-bao-chung");
  const [demoRole, setDemoRole] = useState(ROLE.STUDENT);
  const [demoHint, setDemoHint] = useState("");

  // If already logged in, route user to the most relevant workspace.
  useEffect(() => {
    // With the new navigation spec, always land on /app (role-based dashboard).
    // Legacy workspace remains accessible from the menu.
    const token = document.cookie.includes("token=");
    const uid = document.cookie.includes("uid=");
    if (!token || !uid) return;
    navigate("/app", { replace: true });
  }, [navigate]);

  const doDemoLogin = (pickedRole = demoRole) => {
    const role = pickedRole || ROLE.STUDENT;
    const nameMap = {
      [ROLE.ADMIN]: "Admin Demo",
      [ROLE.STAFF]: "Staff Demo",
      [ROLE.HEAD_DEPARTMENT]: "Head Department Demo",
      [ROLE.LECTURER]: "Lecturer Demo",
      [ROLE.STUDENT]: "Student Demo",
    };

    setSession({
      token: "demo-token",
      uid: `demo-${String(role).toLowerCase()}`,
      email: email || "demo@collabsphere.local",
      name: nameMap[role] || "Demo User",
      role,
    });

    navigate("/app", { replace: true });
  };

  const announcements = useMemo(
    () => ({
      "thong-bao-chung": [
        {
          date: "23/01/2026",
          title: "Thông báo Điều chỉnh đăng ký học phần học kỳ 2 năm học 2025-2026",
        },
        {
          date: "20/01/2026",
          title: "Thông báo điều kiện sinh viên tham gia xét học bổng khuyến khích học tập",
        },
        {
          date: "13/01/2026",
          title: "Thông báo về việc đóng bảo hiểm y tế sinh viên đợt 2",
        },
      ],
      "ctct-qlsv": [
        { date: "18/01/2026", title: "Hướng dẫn cập nhật thông tin cá nhân trên hệ thống" },
        { date: "05/01/2026", title: "Quy định điểm danh và đánh giá hoạt động nhóm" },
      ],
      "thong-tin-dao-tao": [
        { date: "10/01/2026", title: "Lịch học CNPM (Công nghệ phần mềm) học kỳ 2" },
        { date: "02/01/2026", title: "Hướng dẫn nộp báo cáo Project-Based Learning" },
      ],
      "dao-tao": [
        { date: "31/12/2025", title: "Thông báo kế hoạch thi cuối kỳ" },
        { date: "25/12/2025", title: "Thông báo lịch nghỉ Tết" },
      ],
    }),
    []
  );

  const tabs = useMemo(
    () => [
      { id: "thong-bao-chung", label: "THÔNG BÁO CHUNG" },
      { id: "ctct-qlsv", label: "CTCT - QL SINH VIÊN" },
      { id: "thong-tin-dao-tao", label: "THÔNG TIN ĐÀO TẠO" },
      { id: "dao-tao", label: "ĐÀO TẠO" },
    ],
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);
    setDemoHint("");

    const response = await axios.post("/api/auth/", JSON.stringify({ email, password }), {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });

    // Network error is converted to status 0 by our axios interceptor.
    // If DEMO mode is on, we automatically log into demo so user can continue.
    if (response.status === 0) {
      if (DEMO_MODE) {
        setDemoHint(
          "Backend chưa chạy nên hệ thống đang ở DEMO mode (dữ liệu giả lập). Bạn vẫn có thể trải nghiệm đầy đủ giao diện."
        );
        doDemoLogin(demoRole);
        return;
      }

      setErrorMsg(
        "Không kết nối được backend (Network Error). Hãy chạy server hoặc chỉnh REACT_APP_API_BASE_URL."
      );
      setIsSubmitting(false);
      return;
    }

    if (response.status === 200 && response.data) {
      const data = response.data;
      const role = normalizeRoleStrict(data.role);
      setSession({
        token: data.token || "token",
        uid: data._id || data.uid || "uid",
        email: data.email || email,
        name: data.name || "User",
        role,
      });

      // New spec: always go to /app (role-based dashboard)
      navigate("/app", { replace: true });
      setIsSubmitting(false);
      return;
    }

    if (response.status === 401) setErrorMsg("Sai tài khoản hoặc mật khẩu.");
    else setErrorMsg(`Đăng nhập thất bại (status ${response.status}).`);

    setIsSubmitting(false);
  };

  const fillDemo = (kind) => {
    // Quick demo credentials (for UI only)
    const preset = {
      student: { email: "student@demo", password: "123456", role: ROLE.STUDENT },
      lecturer: { email: "lecturer@demo", password: "123456", role: ROLE.LECTURER },
      staff: { email: "staff@demo", password: "123456", role: ROLE.STAFF },
      head: { email: "head@demo", password: "123456", role: ROLE.HEAD_DEPARTMENT },
      admin: { email: "admin@demo", password: "123456", role: ROLE.ADMIN },
    };
    const v = preset[kind];
    if (!v) return;
    setEmail(v.email);
    setPassword(v.password);
    setDemoRole(v.role);
  };

  return (
    <div className="cosre-login-page">
      <div className="cosre-login-shell">
        {/* Left: announcements */}
        <div className="cosre-ann">
          <div className="cosre-ann-card">
            <div className="cosre-ann-tabs">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`cosre-tab ${activeTab === t.id ? "active" : ""}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="cosre-ann-list">
              {(announcements[activeTab] || []).map((it, idx) => (
                <div key={`${activeTab}-${idx}`} className="cosre-ann-item">
                  <div className="cosre-ann-title">{it.title}</div>
                  <div className="cosre-ann-meta">
                    <span>{it.date}</span>
                    <span className="cosre-ann-link">Xem chi tiết</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: login */}
        <div className="cosre-login">
          <div className="cosre-login-card">
            <div className="cosre-brand">
              <img src={logo} alt="CollabSphere" className="cosre-brand-logo" />
              <div className="cosre-brand-sub">
                UTH · University of Transport HCMC · Hệ thống hỗ trợ học theo Project-Based Learning
              </div>
            </div>

            <div className="cosre-login-title">ĐĂNG NHẬP HỆ THỐNG</div>
            {errorMsg ? <div className="cosre-error">{errorMsg}</div> : null}
            {demoHint ? <div className="cosre-demo-hint">{demoHint}</div> : null}

            <form onSubmit={onSubmit} className="cosre-form">
              <label className="cosre-label">Tài khoản đăng nhập</label>
              <input
                className="cosre-input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email / Mã số SV"
                autoComplete="username"
              />

              <label className="cosre-label">Mật khẩu</label>
              <div className="cosre-pass">
                <input
                  className="cosre-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="cosre-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="toggle password"
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>

              <button className="cosre-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
              </button>

              <div className="cosre-demo-row">
                <select
                  className="cosre-select"
                  value={demoRole}
                  onChange={(e) => setDemoRole(e.target.value)}
                >
                  <option value={ROLE.STUDENT}>Student</option>
                  <option value={ROLE.LECTURER}>Lecturer</option>
                  <option value={ROLE.STAFF}>Staff</option>
                  <option value={ROLE.HEAD_DEPARTMENT}>Head Department</option>
                  <option value={ROLE.ADMIN}>Admin</option>
                </select>
                <button
                  type="button"
                  className="cosre-demo-login"
                  onClick={() => doDemoLogin(demoRole)}
                >
                  Đăng nhập DEMO
                </button>
              </div>

              <div className="cosre-links">
                <button type="button" className="cosre-link" onClick={() => navigate("/Register")}
                >
                  Đăng ký
                </button>
                <button type="button" className="cosre-link" onClick={() => alert("Liên hệ quản trị viên để đặt lại mật khẩu.")}
                >
                  Quên mật khẩu?
                </button>
              </div>

              <div className="cosre-demo">
                <button type="button" className="cosre-demo-btn" onClick={() => fillDemo("student")}
                >
                  Demo Student
                </button>
                <button type="button" className="cosre-demo-btn" onClick={() => fillDemo("lecturer")}
                >
                  Demo Lecturer
                </button>
                <button type="button" className="cosre-demo-btn" onClick={() => fillDemo("staff")}
                >
                  Demo Staff
                </button>
                <button type="button" className="cosre-demo-btn" onClick={() => fillDemo("admin")}
                >
                  Demo Admin
                </button>
              </div>

              <div className="cosre-note">
                Màu sắc hệ thống đã được chuyển sang xanh lá &amp; trắng theo yêu cầu.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
