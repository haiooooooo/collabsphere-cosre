import React, { useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { DEFAULT_GEMINI_MODEL, geminiGenerate } from "../../api/gemini";

const DEFAULT_SYSTEM_INSTRUCTION =
  "You are CollabSphere's AI assistant for project-based learning. " +
  "Help with brainstorming, requirements, user stories, UML, milestones, and testing. " +
  "Be practical, structured, and concise. Ask clarifying questions only when absolutely necessary.";

export default function AIAssistant() {
  const envKey = process.env.REACT_APP_GEMINI_API_KEY || "";
  const [apiKey, setApiKey] = useState(envKey);
  const [useProxy, setUseProxy] = useState(process.env.REACT_APP_AI_USE_PROXY === "true");
  const [model, setModel] = useState(DEFAULT_GEMINI_MODEL);
  const [systemInstruction, setSystemInstruction] = useState(DEFAULT_SYSTEM_INSTRUCTION);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Chào bạn! Mình là trợ lý AI (Gemini). Bạn có thể nhờ mình: tạo milestone theo syllabus, viết user stories, gợi ý UML, lập kế hoạch sprint, viết test cases…",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const templates = useMemo(
    () => [
      {
        label: "Tạo milestones cho dự án COSRE",
        prompt:
          "Dựa trên mô tả hệ thống CollabSphere (COSRE) hỗ trợ project-based learning, hãy đề xuất 8–12 milestones theo tuần (12 tuần), mỗi milestone có: mục tiêu, đầu ra (deliverables), tiêu chí hoàn thành, rủi ro, và ai chịu trách nhiệm (role).",
      },
      {
        label: "Viết user stories + acceptance criteria",
        prompt:
          "Hãy viết danh sách user stories theo role (Admin/Staff/Head Department/Lecturer/Student) cho hệ thống CollabSphere. Mỗi user story có 2–4 acceptance criteria dạng Given/When/Then.",
      },
      {
        label: "Gợi ý sơ đồ Use Case UML",
        prompt:
          "Hãy đề xuất các Use Cases chính cho hệ thống CollabSphere theo 5 role và nhóm theo module (Subject/Syllabus, Account, Project, Class, Teams/Workspace, Communication, Resources, Tools, Evaluation, Notification).",
      },
      {
        label: "Test plan (SRS → test cases)",
        prompt:
          "Hãy tạo Test Plan mức hệ thống cho CollabSphere gồm: phạm vi, môi trường, chiến lược, và tối thiểu 15 test cases quan trọng (functional + security + realtime) với steps + expected result.",
      },
    ],
    []
  );

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;

    setError("");
    const userMsg = { role: "user", content: text };
    const nextHistory = [...messages, userMsg];

    setMessages(nextHistory);
    setInput("");
    setBusy(true);

    try {
      const reply = await geminiGenerate({
        apiKey,
        model,
        messages: nextHistory,
        systemInstruction,
        useProxy,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply || "(Không có phản hồi từ Gemini — thử lại hoặc đổi model.)",
        },
      ]);
    } catch (e) {
      setError(e?.message || "Đã xảy ra lỗi khi gọi Gemini.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Mình không gọi được Gemini. Kiểm tra API key / model hoặc bật chế độ Proxy (backend) nếu bạn không muốn lộ key trên client.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="AI Assistant (Gemini)"
        subtitle="Brainstorming, project guidance, milestones, UML, and testing — powered by Google Gemini API."
      />

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="fw-bold mb-2">Settings</div>

              <label className="form-label small">Model</label>
              <input
                className="form-control"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="gemini-2.0-flash"
              />
              <div className="text-muted small mt-1">
                Mẫu theo docs: <code>gemini-2.0-flash</code>
              </div>

              <div className="form-check form-switch mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="useProxy"
                  checked={useProxy}
                  onChange={(e) => setUseProxy(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="useProxy">
                  Use backend proxy (recommended)
                </label>
              </div>

              {!useProxy ? (
                <>
                  <label className="form-label small mt-3">Gemini API Key</label>
                  <input
                    className="form-control"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste your key or set REACT_APP_GEMINI_API_KEY"
                    type="password"
                  />
                  <div className="text-muted small mt-1">
                    Dev only. Production nên dùng proxy để không lộ key.
                  </div>
                </>
              ) : (
                <div className="text-muted small mt-2">
                  Proxy endpoint mặc định: <code>/api/ai/gemini</code> (trên backend).
                </div>
              )}

              <label className="form-label small mt-3">System instruction</label>
              <textarea
                className="form-control"
                style={{ minHeight: 150 }}
                value={systemInstruction}
                onChange={(e) => setSystemInstruction(e.target.value)}
              />

              {error ? (
                <div className="alert alert-warning mt-3 mb-0">{error}</div>
              ) : null}
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-body">
              <div className="fw-bold mb-2">Quick prompts</div>
              <div className="d-flex flex-column gap-2">
                {templates.map((t) => (
                  <button
                    key={t.label}
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setInput(t.prompt)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card">
            <div className="card-body">
              <div
                className="border rounded p-3"
                style={{ height: 520, overflowY: "auto", background: "#fff" }}
              >
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`d-flex mb-2 ${
                      m.role === "user" ? "justify-content-end" : "justify-content-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded ${
                        m.role === "user" ? "bg-danger text-white" : "bg-light"
                      }`}
                      style={{ maxWidth: "90%", whiteSpace: "pre-wrap" }}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex gap-2 mt-3">
                <input
                  className="form-control"
                  placeholder="Nhập câu hỏi…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  disabled={busy}
                />
                <button className="btn btn-danger" onClick={send} disabled={busy}>
                  {busy ? "Đang gửi…" : "Gửi"}
                </button>
              </div>

              <div className="text-muted small mt-2">
                Endpoint REST: <code>v1beta/models/*:generateContent</code>. Nếu bạn dùng proxy,
                hãy để backend giữ key và forward request.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
