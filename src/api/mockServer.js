/*
  Lightweight in-browser mock server for DEMO mode.

  Goal:
  - Keep the whole frontend usable when backend is NOT running.
  - Return stable shapes for legacy pages (/LandingPage, /InRoom) so they don't render empty.

  How it works:
  - axios.js interceptor will call `mockNetworkResponse(config)` when a NETWORK error happens.
  - If DEMO mode is enabled, we return a resolved response-like object (status 200/4xx) with demo data.
  - Unknown endpoints return `null` so the caller can still show "offline" or fall back.

  Turn DEMO mode off by setting:
    REACT_APP_DEMO_MODE=false
*/

/* eslint-disable no-restricted-globals */

const DEMO_MODE = String(process.env.REACT_APP_DEMO_MODE || "true").toLowerCase() !== "false";

const DB_KEY = "cosre:mock-db:v1";

function safeJsonParse(s, fallback) {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function seedDb() {
  const uid = "demo-user";
  const teams = [
    {
      _id: "team-cnpm",
      code: "CNPM01",
      name: "CNPM - CollabSphere (COSRE)",
      createdBy: { _id: "lecturer-1", name: "Giảng viên CNPM" },
      image: "",
      createdAt: nowIso(),
    },
    {
      _id: "team-se102",
      code: "SE1021",
      name: "SE102 - Sprint Team A",
      createdBy: { _id: "lecturer-2", name: "Lecturer Demo" },
      image: "",
      createdAt: nowIso(),
    },
  ];

  const assignments = [
    {
      _id: "ass-1",
      title: "CNPM - SRS + UML Use Case",
      dueDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(),
      dueTime: "23:59",
      grade: 10,
      desc: "Viết SRS phần 1 + vẽ Use Case Diagram cho CollabSphere.",
      description: "Viết SRS phần 1 + vẽ Use Case Diagram cho CollabSphere.",
      submitted: false,
      files: [],
    },
    {
      _id: "ass-2",
      title: "CNPM - Architecture + ERD",
      dueDate: new Date(Date.now() + 8 * 24 * 3600 * 1000).toISOString(),
      dueTime: "23:59",
      grade: 10,
      desc: "Thiết kế kiến trúc + ERD PostgreSQL.",
      description: "Thiết kế kiến trúc + ERD PostgreSQL.",
      submitted: true,
      files: [],
    },
  ];

  const posts = [
    {
      _id: "post-1",
      title: "Thông báo: Kickoff dự án COSRE",
      content: "Tuần này chúng ta chốt requirements + lập SRS. Mỗi team chuẩn bị user stories.",
      createdAt: nowIso(),
      createdBy: { _id: "lecturer-1", name: "Giảng viên CNPM" },
    },
  ];

  const users = [
    { _id: uid, name: "Demo User", email: "demo@student" },
    { _id: "u1", name: "Sinh viên A", email: "a@student.demo" },
    { _id: "u2", name: "Sinh viên B", email: "b@student.demo" },
    { _id: "u3", name: "Giảng viên CNPM", email: "lecturer@demo" },
  ];

  const chats = [
    {
      _id: "chat-1",
      users: [
        { _id: uid, name: "Bạn" },
        { _id: "u3", name: "Giảng viên CNPM" },
      ],
      latestMessage: { sender: { name: "Giảng viên CNPM" }, message: "Chào nhóm, tuần này làm SRS nhé." },
    },
  ];

  const messages = {
    "chat-1": [
      {
        _id: "m1",
        sender: { _id: "u3", name: "Giảng viên CNPM" },
        message: "Chào nhóm, tuần này làm SRS nhé.",
      },
      {
        _id: "m2",
        sender: { _id: uid, name: "Bạn" },
        message: "Dạ ok thầy/cô!", 
      },
    ],
  };

  return {
    uid,
    teams,
    assignments,
    posts,
    users,
    chats,
    messages,
  };
}

function loadDb() {
  if (typeof window === "undefined") return seedDb();
  const raw = window.localStorage.getItem(DB_KEY);
  const db = safeJsonParse(raw, null);
  if (!db) {
    const seeded = seedDb();
    window.localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
  return db;
}

function saveDb(db) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function makeResponse(config, status, data) {
  return {
    status,
    data,
    headers: {},
    config,
  };
}

function getUrlPath(url) {
  if (!url) return "";
  // axios config.url is typically a path like "/api/..."
  return String(url).split("?")[0];
}

function match(method, url, expectedMethod, expectedPath) {
  return (
    String(method || "get").toLowerCase() === String(expectedMethod).toLowerCase() &&
    getUrlPath(url) === expectedPath
  );
}

export function mockNetworkResponse(config) {
  if (!DEMO_MODE) return null;

  const db = loadDb();
  const method = String(config?.method || "get").toLowerCase();
  const url = config?.url || "";
  const path = getUrlPath(url);

  // AUTH
  if (match(method, url, "post", "/api/auth/") || match(method, url, "post", "/api/auth/login")) {
    // Accept any credentials in demo
    const body = safeJsonParse(config?.data, {});
    return makeResponse(config, 200, {
      token: "demo-token",
      _id: db.uid,
      uid: db.uid,
      email: body?.email || "demo@student",
      name: "Demo User",
      role: "Student",
    });
  }

  // LandingPage / teams
  if (match(method, url, "post", "/api/teams/getTeams")) {
    return makeResponse(config, 200, db.teams);
  }

  if (match(method, url, "put", "/api/teams/joinTeam")) {
    // No-op
    return makeResponse(config, 200, { ok: true });
  }

  if (match(method, url, "post", "/api/teams/createTeams")) {
    const body = safeJsonParse(config?.data, {});
    const newTeam = {
      _id: `team-${Date.now()}`,
      code: String(body?.code || "TEAM01").slice(0, 6).padEnd(6, "0"),
      name: body?.name || "New Team",
      createdBy: { _id: "lecturer-1", name: "Giảng viên CNPM" },
      image: "",
      createdAt: nowIso(),
    };
    db.teams = [newTeam, ...db.teams];
    saveDb(db);
    return makeResponse(config, 200, newTeam);
  }

  // Assignments
  if (match(method, url, "get", "/api/assignment/assignments")) {
    return makeResponse(config, 200, { assignments: db.assignments });
  }

  if (match(method, url, "post", "/api/assignment/getAssignment")) {
    const body = safeJsonParse(config?.data, {});
    const assId = body?.assignmentID;
    const ass = db.assignments.find((a) => a._id === assId) || db.assignments[0];
    return makeResponse(config, 200, { assignment: ass, isAdmin: false });
  }

  if (match(method, url, "post", "/api/assignment/submitAssignment")) {
    // Mark submitted
    const assId = config?.headers?.assid || null;
    if (assId) {
      db.assignments = db.assignments.map((a) => (a._id === assId ? { ...a, submitted: true } : a));
      saveDb(db);
    }
    return makeResponse(config, 200, { ok: true });
  }

  if (match(method, url, "put", "/api/assignment/unSubmitAssignment")) {
    const assId = config?.headers?.assid || null;
    if (assId) {
      db.assignments = db.assignments.map((a) => (a._id === assId ? { ...a, submitted: false } : a));
      saveDb(db);
    }
    return makeResponse(config, 200, { ok: true });
  }

  // Chat
  if (match(method, url, "get", "/api/chat/chat")) {
    return makeResponse(config, 200, db.chats);
  }

  if (match(method, url, "post", "/api/message/chatId")) {
    const body = safeJsonParse(config?.data, {});
    const chatId = body?.chatId || "chat-1";
    return makeResponse(config, 200, db.messages?.[chatId] || []);
  }

  if (match(method, url, "post", "/api/chat/chats")) {
    const body = safeJsonParse(config?.data, {});
    const userId = body?.userId || "u3";
    const other = db.users.find((u) => u._id === userId) || db.users[3];
    const newChat = {
      _id: `chat-${Date.now()}`,
      users: [{ _id: db.uid, name: "Bạn" }, { _id: other._id, name: other.name }],
      latestMessage: { sender: { name: other.name }, message: "(Demo) Xin chào!" },
    };
    db.chats = [newChat, ...db.chats];
    db.messages[newChat._id] = [
      { _id: `m-${Date.now()}`, sender: { _id: other._id, name: other.name }, message: "(Demo) Xin chào!" },
    ];
    saveDb(db);
    return makeResponse(config, 200, newChat);
  }

  if (match(method, url, "post", "/api/message/")) {
    const body = safeJsonParse(config?.data, {});
    const chatId = body?.chatId || "chat-1";
    const msg = {
      _id: `m-${Date.now()}`,
      sender: { _id: db.uid, name: "Bạn" },
      message: body?.message || "",
    };
    db.messages[chatId] = [...(db.messages[chatId] || []), msg];
    // update latestMessage
    const idx = db.chats.findIndex((c) => c._id === chatId);
    if (idx >= 0) {
      db.chats[idx] = {
        ...db.chats[idx],
        latestMessage: { sender: { name: "Bạn" }, message: msg.message },
      };
    }
    saveDb(db);
    return makeResponse(config, 200, msg);
  }

  // Users search
  if (match(method, url, "get", "/api/auth/searchUsers")) {
    const q = String(config?.params?.search || "").toLowerCase();
    const filtered = db.users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
    return makeResponse(config, 200, filtered);
  }

  // InRoom: Members / Files / Announcement / Assignment modules
  if (match(method, url, "post", "/api/teams/teamMembers")) {
    return makeResponse(config, 200, { members: db.users });
  }

  if (match(method, url, "put", "/api/teams/addMember")) {
    return makeResponse(config, 200, { ok: true });
  }

  if (match(method, url, "delete", "/api/teams/removeMember")) {
    return makeResponse(config, 200, { ok: true });
  }

  if (match(method, url, "post", "/api/teams/teamFiles")) {
    return makeResponse(config, 200, { files: [] });
  }

  if (match(method, url, "post", "/api/teams/teamUploadFiles")) {
    return makeResponse(config, 200, { ok: true });
  }

  if (match(method, url, "post", "/api/teams/teamPosts")) {
    return makeResponse(config, 200, { posts: db.posts });
  }

  if (match(method, url, "post", "/api/post/createPost")) {
    return makeResponse(config, 200, { ok: true });
  }

  if (match(method, url, "post", "/api/teams/teamAssignments")) {
    return makeResponse(config, 200, { assignments: db.assignments });
  }

  if (match(method, url, "post", "/api/assignment/createAssignment")) {
    return makeResponse(config, 200, { ok: true });
  }

  // AI milestones (optional)
  if (match(method, url, "post", "/api/ai/milestones")) {
    return makeResponse(config, 200, {
      milestones: [
        "Kickoff & team charter",
        "Requirements + user stories",
        "UML (Use case + sequence)",
        "Architecture design",
        "Implementation sprint 1",
        "Implementation sprint 2",
        "Testing + deployment",
        "Final report + demo",
      ],
    });
  }

  // Unknown endpoint: let caller handle "offline" state
  // Return null to indicate no mock.
  // (Important: avoids masking real missing endpoints once backend is running.)
  //
  // console.debug("[DEMO MOCK] no match", method, path);
  return null;
}
