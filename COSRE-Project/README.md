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
<img width="2381" height="212" alt="image" src="https://github.com/user-attachments/assets/908d3274-4275-437b-bde7-134cf3c15c39" />


### 2. Các chức năng chính theo vai trò
Staff:

- Import file để tạo Subjects/Syllabus.

- Import file để tạo Classes.

- Import file để tạo Lecturer/Student accounts.

- Phân giảng viên và sinh viên vào lớp.

- Quản lý danh sách môn học/syllabus/lớp/tài khoản.

Head Department:

- Xem danh sách lớp, môn học/syllabus.

- Duyệt/từ chối Projects do giảng viên gửi.

- Cập nhật project đã duyệt.

- Gán project (từ danh sách approved) cho các lớp.

Lecturer:

- Tạo project theo syllabus: description, objectives, milestones.

- AI hỗ trợ tạo milestones.

- Nộp project để Head Department duyệt.

- Gán project cho lớp được phân công; tạo teams; quản lý members.

- Theo dõi tiến độ team, đóng góp thành viên.

- Tạo milestones questions, xem câu trả lời.

- Quản lý checkpoints, xem submissions.

- Quản lý resources lớp/nhóm.

- Chat/call/schedule meeting với team.

- Đánh giá team và từng thành viên + xem peer review.

Student (Team Member):

- Xem lớp, syllabus, project được giao.

- Tham gia team/workspace, tạo tasks, cập nhật tiến độ.

- Trả lời milestones questions; tham gia checkpoints.

- Chat/meeting với team và giảng viên.

- Quản lý resources của team.

- Thực hiện peer review và xem feedback.

Student (Team Leader):

- Quản lý team members.

- Đánh dấu hoàn thành milestones, quản lý checkpoints.

- Gán nhiệm vụ/checkpoint cho thành viên.

- Theo dõi tiến độ và đóng góp nhóm.

## III. Biểu đồ Use Case
### 1. Biểu đồ Use Case tổng quan

<details>
<summary>Code PlantUML</summary>

~~~plantuml
@startuml "Biểu đồ Use Case tổng quan - COSRE"
left to right direction
actor "Administrator" as Admin
actor "Staff" as Staff
actor "Head Department" as Head
actor "Lecturer" as Lec
actor "Student" as Stu

rectangle "CollabSphere (COSRE)" {
  usecase "Authentication" as UC_Auth
  usecase "Subject & Syllabus Mgmt" as UC_Sub
  usecase "Account Mgmt" as UC_Acc
  usecase "Class Mgmt" as UC_Class
  usecase "Project Mgmt" as UC_Project
  usecase "Project Approval" as UC_Approve
  usecase "Team & Workspace" as UC_Workspace
  usecase "Resources" as UC_Res
  usecase "Chat & Meetings" as UC_Comms
  usecase "Evaluation & Peer Review" as UC_Eval
  usecase "Notifications" as UC_Noti
  usecase "AI Assistance" as UC_AI
}

Admin --> UC_Auth
Admin --> UC_Acc
Admin --> UC_Noti

Staff --> UC_Auth
Staff --> UC_Sub
Staff --> UC_Acc
Staff --> UC_Class

Head --> UC_Auth
Head --> UC_Approve
Head --> UC_Project

Lec --> UC_Auth
Lec --> UC_Project
Lec --> UC_Workspace
Lec --> UC_Res
Lec --> UC_Comms
Lec --> UC_Eval
Lec --> UC_AI

Stu --> UC_Auth
Stu --> UC_Workspace
Stu --> UC_Res
Stu --> UC_Comms
Stu --> UC_Eval
Stu --> UC_AI

UC_Project --> UC_Approve : <<include>>
UC_Workspace --> UC_Noti : <<include>>
UC_Eval --> UC_Noti : <<include>>
@enduml
~~~

</details>
<img width="671" height="858" alt="image" src="https://github.com/user-attachments/assets/93c60ea4-a76c-47e5-82a6-9b0242f0d2b7" />


### 2. Biểu đồ Use Case chi tiết
#### 2.1. Chức năng Staff
<details>
<summary>Code PlantUML</summary>

~~~plantuml
@startuml "Use Case - Staff"
left to right direction
actor "Staff" as Staff

rectangle System {
  usecase "Log in" as UC1
  usecase "Import Subjects/Syllabus" as UC2
  usecase "Manage Subjects/Syllabus" as UC3
  usecase "Import Accounts" as UC4
  usecase "Manage Accounts" as UC5
  usecase "Import Classes" as UC6
  usecase "Manage Classes" as UC7
  usecase "Assign Lecturer/Students to Class" as UC8
}

Staff --> UC1
Staff --> UC2
Staff --> UC3
Staff --> UC4
Staff --> UC5
Staff --> UC6
Staff --> UC7
Staff --> UC8

UC2 --> UC3 : <<include>>
UC4 --> UC5 : <<include>>
UC6 --> UC7 : <<include>>
@enduml
</details>

2.2. Chức năng Head Department
<details> <summary>Code PlantUML</summary>
plantuml
Sao chép mã
@startuml "Use Case - Head Department"
left to right direction
actor "Head Department" as Head

rectangle System {
  usecase "Log in" as UC1
  usecase "View Subjects/Syllabus" as UC2
  usecase "View Pending Projects" as UC3
  usecase "Approve/Deny Project" as UC4
  usecase "Update Approved Project" as UC5
  usecase "Assign Project to Classes" as UC6
}

Head --> UC1
Head --> UC2
Head --> UC3
Head --> UC4
Head --> UC5
Head --> UC6

UC3 --> UC4 : <<include>>
UC4 --> UC6 : <<extend>>
@enduml
~~~

</details>
<img width="1009" height="457" alt="image" src="https://github.com/user-attachments/assets/51780134-f562-4831-b58e-7fec3cafae5a" />


#### 2.3. Chức năng Lecturer
<details>
<summary>Code PlantUML</summary>

~~~plantuml
@startuml "Use Case - Lecturer"
left to right direction
actor "Lecturer" as Lec

rectangle System {
  usecase "Log in" as UC1
  usecase "Create Project" as UC2
  usecase "Generate Milestones (AI)" as UC3
  usecase "Submit Project for Approval" as UC4
  usecase "Assign Project to Class" as UC5
  usecase "Create & Manage Teams" as UC6
  usecase "Manage Milestones & Questions" as UC7
  usecase "View Milestone Answers" as UC8
  usecase "Manage Checkpoints" as UC9
  usecase "View Checkpoint Submissions" as UC10
  usecase "Workspace (Tasks/Sprints)" as UC11
  usecase "Resources Management" as UC12
  usecase "Chat & Meetings" as UC13
  usecase "Evaluate & Feedback" as UC14
  usecase "View Peer Reviews" as UC15
}

Lec --> UC1
Lec --> UC2
Lec --> UC4
Lec --> UC5
Lec --> UC6
Lec --> UC7
Lec --> UC8
Lec --> UC9
Lec --> UC10
Lec --> UC11
Lec --> UC12
Lec --> UC13
Lec --> UC14
Lec --> UC15

UC2 --> UC3 : <<extend>>
UC2 --> UC4 : <<include>>
@enduml
~~~

</details>
<img width="708" height="1105" alt="image" src="https://github.com/user-attachments/assets/5b0be095-7eb3-499b-94ee-5db4a7efb657" />


#### 2.4. Chức năng Student
<details>
<summary>Code PlantUML</summary>

~~~plantuml
@startuml "Use Case - Student"
left to right direction
actor "Student" as Stu
actor "Team Leader" as Lead

rectangle System {
  usecase "Log in" as UC1
  usecase "View Class/Syllabus/Project" as UC2
  usecase "Join Team Workspace" as UC3
  usecase "Manage Tasks" as UC4
  usecase "Answer Milestone Questions" as UC5
  usecase "Submit Checkpoints" as UC6
  usecase "Chat & Meetings" as UC7
  usecase "Resources Management" as UC8
  usecase "Peer Review" as UC9
  usecase "View Feedback" as UC10

  usecase "Manage Team Members" as UC11
  usecase "Mark Milestones Done" as UC12
  usecase "Assign Checkpoints" as UC13
}

Stu --> UC1
Stu --> UC2
Stu --> UC3
Stu --> UC4
Stu --> UC5
Stu --> UC6
Stu --> UC7
Stu --> UC8
Stu --> UC9
Stu --> UC10

Lead --> UC11
Lead --> UC12
Lead --> UC13

UC3 --> UC4 : <<include>>
UC6 --> UC8 : <<extend>>
@enduml
~~~

</details>
<img width="701" height="966" alt="image" src="https://github.com/user-attachments/assets/af8c8a0c-89fd-4940-8b66-dee3715d4b23" />


## IV. Quy trình hoạt động
### 1. Quy trình tạo dự án và duyệt dự án (PBL Project Approval)
<details>
<summary>Code PlantUML</summary>

~~~plantuml
@startuml "Quy trình duyệt Project"
|Lecturer|
start
:Tạo project (desc, objectives, milestones);
if (Dùng AI tạo milestones?) then (Yes)
  :Yêu cầu AI gợi ý milestones;
endif
:Submit project để duyệt;

|System|
:Đặt trạng thái = Pending;
:Gửi thông báo cho Head Department;

|Head Department|
:Xem danh sách pending;
if (Duyệt?) then (Approve)
  :Approve project;
  |System|
  :Cập nhật trạng thái = Approved;
  :Cho phép assign project;
else (Deny)
  :Deny project;
  |System|
  :Cập nhật trạng thái = Denied;
  :Gửi phản hồi cho Lecturer;
endif
stop
@enduml
~~~

</details>
<img width="926" height="779" alt="image" src="https://github.com/user-attachments/assets/07b5f768-a987-4d19-9eda-15c32675d3b6" />



### 2. Quy trình team nộp checkpoint
<details>
<summary>Code PlantUML</summary>

~~~plantuml
@startuml "Quy trình nộp Checkpoint"
|Team Leader|
start
:Tạo checkpoint;
:Assign members;
:Đặt deadline;

|Team Member|
:Thực hiện task;
:Upload/submit entry;

|System|
:Validate submission;
:Lưu submission;
:Gửi thông báo cho Lecturer & Team;

|Lecturer|
:Xem submission;
:Feedback/đánh giá checkpoint;
stop
@enduml
~~~

</details>
<img width="720" height="664" alt="image" src="https://github.com/user-attachments/assets/6b649659-1ee8-4385-b990-1db68fc2ff79" />


### 3. Quy trình đánh giá cuối kỳ & peer review
<details>
<summary>Code PlantUML</summary>

~~~plantuml
@startuml "Quy trình đánh giá & Peer Review"
|Student|
start
:Thực hiện peer review cho các thành viên;
:Submit peer review;

|System|
:Tổng hợp điểm/nhận xét peer review;
:Thông báo Lecturer;

|Lecturer|
:Xem tổng hợp peer review;
:Chấm điểm team;
:Chấm điểm từng thành viên (rubric);
:Feedback cuối kỳ;

|System|
:Publish kết quả;
:Gửi thông báo cho team;
stop
@enduml
~~~


</details>
<img width="741" height="664" alt="image" src="https://github.com/user-attachments/assets/c15eb843-4a2c-49a8-b0a5-4ec3400b7899" />


## V. Luồng xử lý (Sequence)
### 1. Luồng xử lý duyệt Project
<details>
<summary>Code PlantUML</summary>

~~~plantuml
@startuml "Sequence - Project Approval"
autonumber
participant Lecturer as Lec
participant "COSRE Web" as UI
participant "COSRE API" as API
participant "Head Department" as Head
database "DB" as DB

Lec -> UI: Tạo project
UI -> API: POST /projects (draft)
API -> DB: INSERT Project(status=Draft)
DB --> API: OK
API --> UI: Project created

Lec -> UI: Submit for approval
UI -> API: POST /projects/{id}/submit
API -> DB: UPDATE Project(status=Pending)
DB --> API: OK
API --> UI: Submitted

Head -> UI: Review pending list
UI -> API: GET /projects?status=Pending
API -> DB: SELECT Pending Projects
DB --> API: List
API --> UI: Show list

Head -> UI: Approve/Deny
UI -> API: POST /projects/{id}/approve OR /deny
API -> DB: UPDATE Project(status=Approved/Denied)
DB --> API: OK
API --> UI: Result + notification
@enduml
~~~

</details>
<img width="765" height="774" alt="image" src="https://github.com/user-attachments/assets/f7d60331-440d-4b1e-8722-90c14406fedf" />


### 2. Luồng xử lý nộp Checkpoint
<details>
<summary>Code PlantUML</summary>

~~~plantuml
@startuml "Sequence - Checkpoint Submission"
autonumber
participant "Team Member" as Mem
participant "COSRE Web" as UI
participant "COSRE API" as API
database "DB" as DB
participant Lecturer as Lec

Mem -> UI: Upload submission
UI -> API: POST /checkpoints/{id}/submissions
API -> DB: INSERT submission + artifacts
DB --> API: OK
API --> UI: Submission saved
API -> Lec: Notify (realtime/email)
@enduml
~~~

</details>
<img width="762" height="349" alt="image" src="https://github.com/user-attachments/assets/75b6c9cf-521a-4607-91a2-6f9d0c911293" />


## VI. Luồng dữ liệu (DFD)
<details>
<summary>Code PlantUML</summary>

~~~plantuml
@startuml "DFD - COSRE"
skinparam linetype ortho

actor Staff
actor Head
actor Lecturer
actor Student

rectangle "1.0 Subject/Syllabus Mgmt" as SSM
rectangle "2.0 Class Mgmt" as CM
rectangle "3.0 Project Mgmt" as PM
rectangle "4.0 Team/Workspace" as TW
rectangle "5.0 Communication" as COM
rectangle "6.0 Evaluation" as EVA
rectangle "7.0 Notification" as NOTI

database "D1 Users" as D1
database "D2 Subjects/Syllabus" as D2
database "D3 Classes" as D3
database "D4 Projects/Milestones" as D4
database "D5 Teams/Tasks/Checkpoints" as D5
database "D6 Messages/Meetings" as D6
database "D7 Evaluations/PeerReviews" as D7

Staff --> SSM
SSM --> D2
Staff --> CM
CM --> D3
CM --> D1

Lecturer --> PM
PM --> D4
Head --> PM
PM --> D4

Student --> TW
Lecturer --> TW
TW --> D5

Student --> COM
Lecturer --> COM
COM --> D6

Student --> EVA
Lecturer --> EVA
EVA --> D7

NOTI --> D1
NOTI --> D5
NOTI --> D7
@enduml
~~~

</details>
<img width="1340" height="304" alt="image" src="https://github.com/user-attachments/assets/1b63d618-3c9f-460e-8c07-74fcd8832726" />


## VII. Các trạng thái thực thể trong hệ thống
### 1. Trạng thái Project
<details>
<summary>Code PlantUML</summary>

~~~plantuml
@startuml "State - Project"
state "Draft" as Draft
state "PendingApproval" as Pending
state "Approved" as Approved
state "Denied" as Denied
state "AssignedToClass" as Assigned
state "InProgress" as InProgress
state "Completed" as Completed
state "Archived" as Archived

[*] --> Draft
Draft --> Pending : Submit
Pending --> Approved : Approve
Pending --> Denied : Deny
Approved --> Assigned : Assign to class
Assigned --> InProgress : Team starts
InProgress --> Completed : Final submission
Completed --> Archived : Archive
Denied --> Draft : Revise & resubmit
@enduml
~~~

</details>
<img width="301" height="910" alt="image" src="https://github.com/user-attachments/assets/1ba33a2c-7c0f-4d9d-b61a-135c8f958fe5" />


## VIII. Công nghệ
- Frontend: ReactJS (Web client cho Admin/Staff/Head/Lecturer/Student).

- Backend: Python Web API (FastAPI).

- Database: PostgreSQL.

- Cloud/Storage:

   - Azure (hosting server)

   - AWS (hosting frontend)

   - Cloudinary (media storage)

   - Upstash Redis (cache/queue)

- Realtime & Communication:

   - WebRTC (meeting/call/screen share)

   - Signal (team chat system)

   - Socket.IO (realtime whiteboard/notifications)

- AI:

  - AWS Bedrock (brainstorming, guidance, generate milestones/tasks)

- DevOps:

  - Docker (đóng gói/triển khai), CI/CD (mở rộng)

## IX. Yêu cầu thiết kế
### 1. Mô hình kiến trúc (high-level)
<details>
<summary>Code PlantUML</summary>

~~~plantuml
@startuml "Kiến trúc COSRE - High Level"
package "Client" {
  [React Web App]
}

package "Backend" {
  [FastAPI REST API]
  [Realtime Gateway (Socket.IO)]
  [Chat Service (Signal)]
  [Meeting Service (WebRTC)]
  [AI Integration (Bedrock)]
}

database "PostgreSQL" as DB
queue "Redis (Upstash)" as Redis
cloud "Cloudinary" as Media

[React Web App] ..> [FastAPI REST API] : HTTPS/REST
[React Web App] ..> [Realtime Gateway (Socket.IO)] : WS
[React Web App] ..> [Chat Service (Signal)] : Realtime chat
[React Web App] ..> [Meeting Service (WebRTC)] : WebRTC

[FastAPI REST API] --> DB
[FastAPI REST API] --> Redis
[FastAPI REST API] --> Media
[FastAPI REST API] --> [AI Integration (Bedrock)]
@enduml
~~~

</details>
<img width="1331" height="371" alt="image" src="https://github.com/user-attachments/assets/508100c7-4c09-4e59-b0c4-d7adf4313929" />


### 2. Mô hình cơ sở dữ liệu (đề xuất)
<details>
<summary>Code PlantUML</summary>

~~~plantuml
@startuml "Mô hình CSDL - COSRE"
hide circle
skinparam classAttributeIconSize 0

class User {
  +id: uuid
  +email: string
  +full_name: string
  +role: enum
  +status: enum
  +created_at: datetime
}

class Subject {
  +id: uuid
  +code: string
  +name: string
}

class Syllabus {
  +id: uuid
  +subject_id: uuid
  +version: string
  +outcomes: text
}

class Class {
  +id: uuid
  +code: string
  +subject_id: uuid
  +semester: string
}

class Enrollment {
  +class_id: uuid
  +student_id: uuid
}

class Project {
  +id: uuid
  +subject_id: uuid
  +title: string
  +description: text
  +status: enum
  +created_by: uuid
}

class ProjectMilestone {
  +id: uuid
  +project_id: uuid
  +title: string
  +due_date: date
  +order: int
}

class Team {
  +id: uuid
  +class_id: uuid
  +project_id: uuid
  +name: string
  +leader_id: uuid
}

class TeamMember {
  +team_id: uuid
  +student_id: uuid
  +role_in_team: enum
}

class Sprint {
  +id: uuid
  +team_id: uuid
  +name: string
  +start_date: date
  +end_date: date
}

class Task {
  +id: uuid
  +sprint_id: uuid
  +title: string
  +status: enum
  +assignee_id: uuid
}

class Checkpoint {
  +id: uuid
  +team_id: uuid
  +title: string
  +deadline: datetime
}

class CheckpointSubmission {
  +id: uuid
  +checkpoint_id: uuid
  +submitted_by: uuid
  +content: text
  +submitted_at: datetime
}

class Resource {
  +id: uuid
  +owner_type: enum (Class/Team)
  +owner_id: uuid
  +name: string
  +url: string
}

class Meeting {
  +id: uuid
  +team_id: uuid
  +start_time: datetime
  +type: enum
}

class Message {
  +id: uuid
  +team_id: uuid
  +sender_id: uuid
  +content: text
  +created_at: datetime
}

class Evaluation {
  +id: uuid
  +team_id: uuid
  +lecturer_id: uuid
  +score: float
  +comment: text
}

class PeerReview {
  +id: uuid
  +team_id: uuid
  +from_student_id: uuid
  +to_student_id: uuid
  +score: float
  +comment: text
}

User "1" -- "0..*" Project : created_by
Subject "1" -- "0..*" Syllabus
Subject "1" -- "0..*" Class
Subject "1" -- "0..*" Project
Project "1" -- "0..*" ProjectMilestone
Class "1" -- "0..*" Enrollment
User "1" -- "0..*" Enrollment : student_id

Class "1" -- "0..*" Team
Team "1" -- "0..*" TeamMember
User "1" -- "0..*" TeamMember : student_id
Team "1" -- "0..*" Sprint
Sprint "1" -- "0..*" Task
Team "1" -- "0..*" Checkpoint
Checkpoint "1" -- "0..*" CheckpointSubmission
Team "1" -- "0..*" Resource
Team "1" -- "0..*" Meeting
Team "1" -- "0..*" Message
Team "1" -- "0..*" Evaluation
Team "1" -- "0..*" PeerReview
@enduml
~~~

</details>
<img width="1638" height="948" alt="image" src="https://github.com/user-attachments/assets/e7f6ab31-5182-4567-a27f-9ec1ec98a094" />


## X. Giao diện người dùng (đề xuất)
Trang đăng nhập/đăng xuất.

- Admin Dashboard: quản lý tài khoản, trạng thái user, xem báo cáo/thông báo.

- Staff: import subject/syllabus/class/accounts; quản lý lớp & phân công.

- Head Department: duyệt project; giao project cho lớp.

- Lecturer: tạo project, quản lý team/workspace; milestones/checkpoints; chat/meetings; đánh giá.

- Student/Team Leader: workspace tasks/sprints; milestones answers; checkpoints; chat/meetings; resources; peer review.
## XI. Đọc thêm
* CONFERENCE:https://ut-team-bdpcjpnc.atlassian.net/wiki/x/AYCn
* D.G:
