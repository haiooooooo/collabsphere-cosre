# COSRE / CollabSphere – Updates (Frontend)

## Added / Updated features

### 1) CNPM class
- Added a default class `CNPM-01` and subject `CNPM – Công nghệ phần mềm` in the demo/stub lists:
  - Staff → Subjects & Syllabus
  - Staff → Classes
  - Head Department → All Classes
  - Student → My Classes

### 2) Gemini AI assistant
- Tools → **AI Assistant (Gemini)** now calls Google Gemini API (REST) using:
  - Dev mode: `REACT_APP_GEMINI_API_KEY` in `.env`
  - Production: a backend proxy endpoint (recommended) – see below.

### 3) Text Editor (document editor)
- Tools → **Text Editor** upgraded to a lightweight WYSIWYG editor:
  - Formatting toolbar (bold/italic/underline/headings/lists/links/code)
  - Autosave to localStorage by `roomKey`
  - Optional realtime sync via Socket.IO events `editor:join`, `editor:update` (last-write-wins)

### 4) Restore legacy Workspace
- Student Workspace menu now points to `/LandingPage` (legacy workspace).
- `/app/student/workspace` keeps backward compatibility and redirects to `/LandingPage`.
- Legacy workspace navbar now includes **Docs** and **AI** tabs.

### 5) Peer review
- Student Peer Review is hidden from the sidebar/menu (feature not required currently).

## Environment variables
Copy `.env.example` → `.env` and configure:

```bash
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_GEMINI_API_KEY=
REACT_APP_GEMINI_MODEL=gemini-2.0-flash
REACT_APP_AI_USE_PROXY=false
```

## Backend proxy (recommended for Gemini)
Implement a backend endpoint (example path): `POST /api/ai/gemini`.

### Request body
```json
{
  "model": "gemini-2.0-flash",
  "contents": [{"role": "user", "parts": [{"text": "Hello"}]}],
  "systemInstruction": "..."
}
```

### Response body
Return either:
- `{ "text": "..." }` (recommended) OR
- the raw Gemini response (frontend will try to extract text)
