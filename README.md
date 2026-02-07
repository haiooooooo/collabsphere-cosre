  # CollabSphere (COSRE) — Hệ thống hỗ trợ học theo Project-Based Learning (PBL)

  > **CollabSphere (COSRE)** là hệ thống hỗ trợ việc học theo phương pháp **Project-Based Learning** bằng cách tích hợp quản lý lớp/môn/dự án, làm việc nhóm, milestone/tiến độ, lịch họp, tài nguyên học tập, đánh giá đóng góp và các công cụ cộng tác (chat realtime, workspace, AI hỗ trợ).

  ---

  ## Mục lục
  1. [Thông tin môn học](#1-thông-tin-môn-học)
  2. [Thông tin nhóm](#2-thông-tin-nhóm)
  3. [Giới thiệu đề tài](#3-giới-thiệu-đề-tài)
  4. [Mục tiêu](#4-mục-tiêu)
  5. [Phạm vi & đối tượng sử dụng](#5-phạm-vi--đối-tượng-sử-dụng)
  6. [Chức năng hệ thống](#6-chức-năng-hệ-thống)
  7. [Use Case tiêu biểu](#7-use-case-tiêu-biểu)
  8. [Kiến trúc & thiết kế](#8-kiến-trúc--thiết-kế)
  9. [Công nghệ sử dụng](#9-công-nghệ-sử-dụng)
  10. [Cấu trúc dự án](#10-cấu-trúc-dự-án)
  11. [Cài đặt & chạy chương trình](#11-cài-đặt--chạy-chương-trình)
  12. [Hướng dẫn trình diễn (Demo)](#12-hướng-dẫn-trình-diễn-demo)
  13. [Kiểm thử](#13-kiểm-thử)
  14. [Triển khai](#14-triển-khai)
  15. [Quy ước làm việc nhóm](#15-quy-ước-làm-việc-nhóm)
  16. [Tài liệu tham khảo](#16-tài-liệu-tham-khảo)

  ---

  ## 1) Thông tin môn học
  - **Môn:** Công nghệ phần mềm  
  - **Giảng viên:** _Nguyễn Văn Chiến_  
  - **Lớp/Nhóm:** _CORSE_  
  - **Học kỳ/Năm học:** _2_  

  ---

  ## 2) Thông tin nhóm
  > Điền bảng sau để đúng format nộp môn.

  | STT | Họ và tên | MSSV | Vai trò | Nhiệm vụ chính |
  |---:|---|---|---|---|
  | 1 | _Nguyễn Ngọc Hải_ | _089206007390_ | Team Lead / BA | Tổng hợp yêu cầu, điều phối, tài liệu |
  | 2 | _Nguyễn Nhật Huy_ | _079206020461_ | Frontend | UI, routing, tích hợp API |
  | 3 | _Nguyễn Hoàng Khánh Như_ | _060306009852_ | Backend | API, DB, auth, phân quyền |
  | 4 | _Lê Minh Khang_ | _074206001537_ | QA/Docs | Test, báo cáo, kịch bản demo |
  | 5 | _Lê Hồ Đăng Phong_ | _060206000197_ | QA/Docs | Test, báo cáo |
  | 6 | _Lê Thị Hà Yên_ | _054306005641_ | Frontend | không có đóng góp |
  | 4 | _Trương Thị Hồng Ngọc_ | _077306005613_ | Backend | Không có đóng góp |
  ---

  ## 3) Giới thiệu đề tài
  ### Bối cảnh
  Trong mô hình học tập hiện đại, **Project-Based Learning** giúp sinh viên phát triển kỹ năng thực hành, tư duy phản biện và làm việc nhóm. Tuy nhiên, quá trình quản lý dự án theo nhóm thường bị phân mảnh do phải dùng nhiều nền tảng (chat, họp, chia sẻ tài liệu, theo dõi tiến độ, đánh giá…).

  ### Vấn đề
  - Công cụ rời rạc → khó theo dõi tiến độ & đóng góp.
  - Thiếu một luồng chuẩn cho **milestone / checkpoint / đánh giá** trong dự án học tập.
  - Khó quản lý lớp, phân nhóm, phân dự án và duyệt đề tài.

  ### Giải pháp
  **COSRE** cung cấp một nền tảng tập trung để:
  - Quản lý lớp/môn/dự án theo vai trò.
  - Theo dõi tiến độ/milestone, lịch họp, tài nguyên, đánh giá.
  - Tích hợp công cụ cộng tác: chat realtime, workspace, AI hỗ trợ.

  ---

  ## 4) Mục tiêu
  - Tập trung hóa quản lý dự án học tập theo nhóm (PBL).
  - Hỗ trợ giảng viên theo dõi tiến độ và đánh giá minh bạch.
  - Hỗ trợ sinh viên tổ chức công việc, tài liệu, trao đổi và nộp bài.
  - Chuẩn hóa luồng milestone/checkpoint và góp phần cải thiện chất lượng học tập.

  ---

  ## 5) Phạm vi & đối tượng sử dụng
  ### Đối tượng sử dụng
  - **Admin**
  - **Staff (Phòng đào tạo/QL học vụ)**
  - **Head of Department (Trưởng bộ môn/khoa)**
  - **Lecturer (Giảng viên)**
  - **Student (Sinh viên)**

  ### Phạm vi triển khai
  - Repo hiện tại: **Frontend React**.
  - Backend dự kiến: REST API + Socket server (chat/notification).
  - Có hỗ trợ **DEMO mode** để trình diễn khi backend chưa sẵn sàng.

  ---

  ## 6) Chức năng hệ thống
  ### 6.1 Phân quyền theo vai trò (Role-based)
  - Admin: quản trị hệ thống (tài khoản/quyền/…)
  - Staff: quản lý môn học, syllabus, lớp, import dữ liệu
  - Head Department: duyệt đề tài, phân đề tài cho lớp
  - Lecturer: quản lý dự án, milestone, theo dõi team, đánh giá, lịch họp
  - Student: tham gia lớp/nhóm, workspace, milestone, tài nguyên, peer review, lịch họp

  ### 6.2 Danh sách route (theo codebase)
  **Entry point:** `/#/app` (đọc cookie: `token`, `uid`, `role`)

  **Role routing**
  - Admin: `/#/app/admin`
  - Staff: `/#/app/staff`
  - Head Department: `/#/app/head`
  - Lecturer: `/#/app/lecturer`
  - Student: `/#/app/student`

  **Core modules (routes)**
  - Tools/Workspace: `/#/app/tools/*`
  - AI Assistant (Gemini, API-ready): `/#/app/tools/ai-assistant`

  **Staff modules**
  - Subjects & Syllabus management + import UI: `/#/app/staff/subjects`
  - Class management + import UI: `/#/app/staff/classes`
  - Account import UI: `/#/app/staff/accounts`

  **Head Department modules**
  - Project approval workflow: `/#/app/head/projects`
  - Assign approved projects to classes: `/#/app/head/assign`
  - View all classes: `/#/app/head/classes`

  **Lecturer modules**
  - Project management + AI milestone draft UI: `/#/app/lecturer/projects`
  - Assigned classes + assign project: `/#/app/lecturer/classes`
  - Teams monitoring (progress + contribution): `/#/app/lecturer/teams`
  - Milestones questions + answers + checkpoints (UI): `/#/app/lecturer/milestones`
  - Resources upload UI: `/#/app/lecturer/resources`
  - Evaluation & feedback UI: `/#/app/lecturer/evaluation`
  - Meetings scheduling UI: `/#/app/lecturer/meetings`

  **Student modules**
  - My classes: `/#/app/student/classes`
  - My team: `/#/app/student/team`
  - Workspace (Kanban MVP): `/#/app/student/workspace`
  - Milestones & checkpoints UI: `/#/app/student/milestones`
  - Resources upload UI: `/#/app/student/resources`
  - Peer review UI: `/#/app/student/peer-review`
  - Meetings UI: `/#/app/student/meetings`

  > Legacy flows (nếu còn dùng): `/#/LandingPage`, `/#/InRoom`

  ---

  ## 7) Use Case tiêu biểu
  > Dùng mục này để khớp với phần “Use Case Diagram” trong báo cáo.

  ### Use Case của Student
  - Tham gia lớp / xem lớp của tôi
  - Vào team workspace, cập nhật tiến độ (Kanban)
  - Xem milestone/checkpoint, trả lời câu hỏi milestone
  - Upload tài nguyên / tài liệu
  - Peer review thành viên nhóm
  - Xem & tham gia meeting
  - Chat/nhận thông báo (realtime)

  ### Use Case của Lecturer
  - Tạo/duyệt dự án, gán dự án cho lớp
  - Tạo milestone/questions/checkpoint
  - Theo dõi tiến độ và đóng góp team
  - Upload tài nguyên
  - Đánh giá/feedback
  - Lập lịch meeting

  ### Use Case của Head Department / Staff
  - Duyệt đề tài (Head)
  - Quản lý môn/syllabus/lớp/tài khoản (Staff)

  ---

  ## 8) Kiến trúc & thiết kế
  ### Kiến trúc tổng quan
  - **Client–Server Architecture**
    - Frontend: React SPA
    - Backend (dự kiến): REST API + Auth + DB
    - Realtime: Socket server (chat/notification)

  ### Thiết kế chính
  - **Role-based routing**: điều hướng theo `role`
  - **Module hóa theo trang/role**: phân trang theo Admin/Staff/Head/Lecturer/Student
  - **Tách lớp truy cập dữ liệu**: Axios client + các API helper
  - **DEMO mode**: fallback mock data để trình diễn UI khi backend chưa có

  ---

  ## 9) Công nghệ sử dụng
  ### Frontend
  - React 18 (CRA), React Router
  - TailwindCSS, Material Tailwind, MUI, Styled Components
  - Axios
  - Socket.IO client (realtime)
  - Chat UI: Chatscope UI kit, Stream Chat React

  ### Testing
  - Jest (unit test)
  - Selenium (sample e2e test)

  ### DevOps/Deploy (có sẵn file mẫu)
  - Docker (multi-stage build → Nginx)
  - docker-compose (mẫu)
  - Kubernetes manifests: `deployment.yaml`, `service.yaml`
  - CI/CD sample: `.jenkins`, GitHub workflows

  ---

  ## 10) Cấu trúc dự án
  ```
  src/
    api/                 # axios client, socket config, Gemini helper, demo mock server
    auth/                # auth helpers / role routing
    components/          # reusable UI components
    pages/               # role-based pages + tools
    theme.css, index-*.css
  ```

  ---

  ## 11) Cài đặt & chạy chương trình
  ### Yêu cầu
  - Node.js 16+ (khuyến nghị 16.x)
  - npm 8+

  ### Chạy local
  1) Cài thư viện
  ```bash
  npm ci
  ```

  2) (Tuỳ chọn) Tạo `.env`
  ```bash
  cp .env.example .env
  ```

  3) Chạy dev server
  ```bash
  npm start
  ```
  Mở: http://localhost:3000

  ---

  ## 12) Hướng dẫn trình diễn (Demo)
  > Phần này dùng để “trình diễn trực tiếp chương trình” theo yêu cầu nộp môn.

  ### Demo mode
  - Mục tiêu: chạy được UI và thao tác luồng chính **khi backend chưa sẵn sàng**.
  - Nếu có biến môi trường hỗ trợ:
    - `REACT_APP_DEMO_MODE=true`

  ### Tài khoản demo (ví dụ)
  - `student@demo` / `123456`
  - `lecturer@demo` / `123456`
  - `staff@demo` / `123456`
  - `head@demo` / `123456`
  - `admin@demo` / `123456`

  ### Kịch bản demo gợi ý (5–8 phút)
  1) Login → điều hướng theo role
  2) Student: vào lớp → team → workspace (Kanban) → milestones → meetings
  3) Lecturer: tạo milestone/question → theo dõi team → đánh giá/feedback
  4) Head: duyệt đề tài → assign dự án cho lớp
  5) Staff: import accounts/classes/subjects

  ---

  ## 13) Kiểm thử
  Chạy unit tests:
  ```bash
  npm test
  ```

  Selenium sample (nếu dùng):
  ```bash
  python selenium.test.py
  ```

  ---

  ## 14) Triển khai
  ### Docker (gợi ý)
  ```bash
  docker build -t cosre-frontend:latest .
  docker run --rm -p 8080:80 cosre-frontend:latest
  ```
  Mở: http://localhost:8080

  ### Kubernetes (file mẫu)
  - `deployment.yaml` (đổi `__IMAGE_TAG__`)
  - `service.yaml`

  ### CI/CD
  - Jenkins pipeline mẫu: `.jenkins`
  - GitHub workflows: `.github/workflows/*`

  ---

  ## 15) Quy ước làm việc nhóm
  - Branching: `main` / `dev` / `feature/*`
  - Commit message rõ nghĩa: `feat:`, `fix:`, `docs:`, `refactor:`
  - Pull Request: code review tối thiểu 1 người trước khi merge
  - Quản lý task: Issues/Board (tuỳ nhóm)

  ---

  ## 16) Tài liệu tham khảo
  - BABOK v3 (Business Analysis Body of Knowledge)
  - Pressman — Software Engineering: A Practitioner’s Approach (7th edition)
  - Tài liệu môn học CNPM (slides/handouts)

  ---

  ### Liên kết 
  - Video demo: _(điền link)_
