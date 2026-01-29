# CollabSphere (COSRE) - Project-Based Learning Collaboration Platform

## I. Tổng quan dự án

### 1. Mục tiêu
Trong bối cảnh giáo dục hiện đại, **Project-Based Learning (PBL)** giúp sinh viên phát triển kỹ năng thực hành, tư duy phản biện và làm việc nhóm. Tuy nhiên việc tổ chức dự án theo nhóm thường bị phân mảnh vì phải dùng nhiều nền tảng rời rạc (chat, họp, quản lý task, chia sẻ tài liệu, whiteboard/diagram...), gây gián đoạn workflow và khó theo dõi đóng góp cá nhân.

**CollabSphere (COSRE)** hướng tới một hệ thống hợp nhất, hỗ trợ:
- Quản lý môn học, syllabus, lớp học, dự án theo PBL.
- Tổ chức team và workspace làm việc (milestones/checkpoints/sprints/tasks).
- Giao tiếp (chat/meeting/schedule) và cộng tác thời gian thực.
- Đánh giá/feedback/peer review để minh bạch đóng góp cá nhân.
- AI hỗ trợ lên kế hoạch dự án, gợi ý milestones, tư vấn tiến độ.

### 2. Phạm vi
Hệ thống cung cấp web-app cho 5 nhóm người dùng:
- **Admin**
- **Staff**
- **Head Department**
- **Lecturer**
- **Student** (bao gồm vai trò con **Team Leader** trong nhóm)

Phạm vi chức năng chính:
- Subject & Syllabus Management
- Account & Class Management (import, phân lớp, phân giảng viên)
- Project lifecycle: tạo → nộp duyệt → duyệt/từ chối → giao project cho lớp → team chọn/được gán
- Team & Workspace: milestones, questions, checkpoints, tasks/sprints
- Communication: chat, meeting, schedule
- Resources: tài liệu lớp/nhóm (files/docs/slides)
- Evaluation: giảng viên + peer review, theo dõi đóng góp
- Notification: realtime + email
- AI: gợi ý milestones, guidance, review nội dung

### 3. Giả định và ràng buộc
- Hệ thống phục vụ môi trường học thuật PBL, không phải LMS tổng hợp thay thế toàn bộ nền tảng nhà trường.
- Hệ thống hỗ trợ cộng tác và ghi nhận tiến độ/đóng góp, không chịu trách nhiệm về nội dung học thuật sai lệch do người dùng nhập.
- AI hỗ trợ mang tính gợi ý, kết quả cuối cùng vẫn do giảng viên/nhóm quyết định.
- Realtime collaboration (whiteboard/diagram/editor) yêu cầu kết nối mạng ổn định, có cơ chế đồng bộ/khóa/xử lý xung đột trong giai đoạn triển khai.
- Bảo mật dữ liệu lớp học là yêu cầu bắt buộc (RBAC, audit log, phân quyền tài nguyên theo lớp/nhóm).

---

## II. Yêu cầu chức năng

### 1. Các tác nhân
Hệ thống có 5 tác nhân chính: **Administrators, Staff, Head Department, Lecturers, Students**.

<details>
<summary>Code PlantUML</summary>

~~~plantuml
@startuml "BIỂU ĐỒ TÁC NHÂN - COSRE"
actor "Administrator" as Admin
actor "Staff" as Staff
actor "Head Department" as Head
actor "Lecturer" as Lec
actor "Student" as Stu
actor "Team Leader" as Lead

rectangle "CollabSphere (COSRE)" {
  (Đăng nhập/Đăng xuất) as UC1
  (Quản lý môn học & Syllabus) as UC2
  (Quản lý tài khoản) as UC3
  (Quản lý lớp học) as UC4
  (Quản lý dự án PBL) as UC5
  (Duyệt dự án) as UC6
  (Quản lý team & workspace) as UC7
  (Giao tiếp & lịch họp) as UC8
  (Quản lý tài nguyên) as UC9
  (Đánh giá & Peer review) as UC10
  (Thông báo) as UC11
  (AI hỗ trợ) as UC12
}

Admin --> UC1
Admin --> UC3
Admin --> UC11

Staff --> UC1
Staff --> UC2
Staff --> UC3
Staff --> UC4

Head --> UC1
Head --> UC6
Head --> UC5

Lec --> UC1
Lec --> UC5
Lec --> UC7
Lec --> UC8
Lec --> UC9
Lec --> UC10
Lec --> UC12

Stu --> UC1
Stu --> UC7
Stu --> UC8
Stu --> UC9
Stu --> UC10
Stu --> UC12

Lead --> UC7
Lead --> UC8
Lead --> UC11
@enduml
~~~

</details>
