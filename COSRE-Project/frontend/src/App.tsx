import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, BookOpen, CheckCircle, Upload, LogOut, 
  LayoutDashboard, Plus, Trash2, Search, FileText, 
  Bell, Menu, X, ChevronRight, Settings, Shield,
  MessageSquare, Video, PenTool, Calendar, Award,
  MoreVertical, Clock, Paperclip, Send, Activity,
  Lock, Unlock, AlertTriangle, Database, Sparkles,
  Bot, RefreshCw, XCircle, Zap
} from 'lucide-react';

// --- Gemini API Configuration ---
const apiKey = ""; // API Key will be injected at runtime

async function callGemini(prompt: string): Promise<string> {
  if (!apiKey) {
    // Fallback if no key is present in dev environment
    return new Promise(resolve => setTimeout(() => resolve("✨ [Mô phỏng Gemini] Tôi cần API Key thực tế để trả lời câu hỏi: " + prompt), 1000));
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) throw new Error('API Error');

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi không thể trả lời lúc này.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Đã xảy ra lỗi khi kết nối với AI.";
  }
}

// --- Types & Interfaces ---
type Role = 'ADMIN' | 'STAFF' | 'HEAD' | 'LECTURER' | 'STUDENT';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  avatar?: string;
  lastLogin?: string;
}

interface LogEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
}

interface ChatMessage {
  id: number;
  user: string;
  text: string;
  time: string;
  isAi?: boolean;
}

interface Task {
  id: string;
  title: string;
  assignee: string;
  status: string;
  priority: string;
}

// --- Mock Data ---
const MOCK_USERS: User[] = [
  { id: '0', name: 'System Admin', email: 'admin@cosre.edu.vn', role: 'ADMIN', isActive: true, lastLogin: 'Just now' },
  { id: '1', name: 'Nguyễn Văn A', email: 'staff@cosre.edu.vn', role: 'STAFF', isActive: true, lastLogin: '2 mins ago' },
  { id: '2', name: 'TS. Trần B', email: 'head@cosre.edu.vn', role: 'HEAD', isActive: true, lastLogin: '1 hour ago' },
  { id: '3', name: 'ThS. Lê C', email: 'lecturer@cosre.edu.vn', role: 'LECTURER', isActive: true, lastLogin: '5 hours ago' },
  { id: '4', name: 'Sinh viên D', email: 'student@cosre.edu.vn', role: 'STUDENT', isActive: true, lastLogin: '1 day ago' },
  { id: '5', name: 'Sinh viên E (Locked)', email: 'locked@cosre.edu.vn', role: 'STUDENT', isActive: false, lastLogin: '1 month ago' },
];

const MOCK_LOGS: LogEntry[] = [
  { id: 'l1', action: 'LOGIN', user: 'staff@cosre.edu.vn', timestamp: '10:00 AM', status: 'SUCCESS' },
  { id: 'l2', action: 'CREATE_TEAM', user: 'student@cosre.edu.vn', timestamp: '10:05 AM', status: 'SUCCESS' },
  { id: 'l3', action: 'DELETE_SUBJECT', user: 'staff@cosre.edu.vn', timestamp: '10:15 AM', status: 'WARNING' },
  { id: 'l4', action: 'FAILED_LOGIN', user: 'unknown@ip.addr', timestamp: '10:20 AM', status: 'ERROR' },
  { id: 'l5', action: 'UPDATE_GRADE', user: 'lecturer@cosre.edu.vn', timestamp: '10:30 AM', status: 'SUCCESS' },
];

const MOCK_TEAMS = [
  { id: 't1', name: 'Team Alpha', topic: 'Hệ thống Quản lý Thư viện', progress: 75, status: 'APPROVED' },
  { id: 't2', name: 'Team Beta', topic: 'Ứng dụng Đặt đồ ăn', progress: 40, status: 'APPROVED' },
  { id: 't3', name: 'Team Gamma', topic: 'Chưa đăng ký', progress: 0, status: 'PENDING' },
];

const MOCK_TASKS: Task[] = [
  { id: 'tk1', title: 'Thiết kế Database', assignee: 'SV. D', status: 'DONE', priority: 'HIGH' },
  { id: 'tk2', title: 'Code API Authen', assignee: 'SV. E', status: 'IN_PROGRESS', priority: 'HIGH' },
  { id: 'tk3', title: 'Thiết kế UI Login', assignee: 'SV. D', status: 'TODO', priority: 'MEDIUM' },
];

const MOCK_MESSAGES: ChatMessage[] = [
  { id: 1, user: 'SV. E', text: 'Mọi người ơi, tối nay họp nhé?', time: '10:00' },
  { id: 2, user: 'SV. D', text: 'Ok, mấy giờ thế?', time: '10:05' },
];

const MOCK_AI_MESSAGES: ChatMessage[] = [
  { id: 1, user: 'Gemini AI', text: 'Xin chào! Tôi là trợ lý AI. Bạn cần giúp gì về dự án "Hệ thống Quản lý Thư viện"?', time: 'Now', isAi: true },
];

// --- Shared Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles: {[key: string]: string} = {
    APPROVED: 'bg-green-100 text-green-700',
    PENDING: 'bg-orange-100 text-orange-700',
    REJECTED: 'bg-red-100 text-red-700',
    DONE: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-purple-100 text-purple-700',
    TODO: 'bg-slate-100 text-slate-700',
    SUCCESS: 'bg-green-50 text-green-600',
    WARNING: 'bg-orange-50 text-orange-600',
    ERROR: 'bg-red-50 text-red-600',
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};

// 1. Component: Login Screen
const LoginScreen = ({ onLogin }: { onLogin: (role: Role) => void }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (email.includes('admin')) onLogin('ADMIN');
      else if (email.includes('staff')) onLogin('STAFF');
      else if (email.includes('head')) onLogin('HEAD');
      else if (email.includes('lecturer')) onLogin('LECTURER');
      else if (email.includes('student')) onLogin('STUDENT');
      else alert('Vui lòng dùng email chứa tên role (vd: admin@cosre..., student@cosre...)');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="text-white h-8 w-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">CollabSphere (COSRE)</h2>
        <p className="text-center text-slate-500 mb-8">Hệ thống hỗ trợ Project-Based Learning</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Edu</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="student@cosre.edu.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex justify-center items-center">
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="mt-6 p-4 bg-slate-100 rounded-lg text-xs text-slate-600 space-y-1">
          <p>📧 <b>Student:</b> student@cosre.edu.vn (Có AI Chat & Task)</p>
          <p>📧 <b>Lecturer:</b> lecturer@cosre.edu.vn (Có AI Review)</p>
          <p>📧 <b>Admin:</b> admin@cosre.edu.vn</p>
        </div>
      </div>
    </div>
  );
};

// 2. Component: Admin Dashboard
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'LOGS'>('USERS');
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản trị Hệ thống</h2>
          <p className="text-slate-500">Giám sát hoạt động và quản lý người dùng</p>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={20} /></div>
            <div>
              <div className="text-slate-500 text-xs">Tổng Users</div>
              <div className="text-xl font-bold text-slate-800">{users.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Activity size={20} /></div>
            <div>
              <div className="text-slate-500 text-xs">Đang Online</div>
              <div className="text-xl font-bold text-slate-800">124</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Database size={20} /></div>
            <div>
              <div className="text-slate-500 text-xs">Dung lượng DB</div>
              <div className="text-xl font-bold text-slate-800">45%</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={20} /></div>
            <div>
              <div className="text-slate-500 text-xs">Cảnh báo</div>
              <div className="text-xl font-bold text-slate-800">3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('USERS')}
            className={`px-6 py-4 text-sm font-medium transition ${activeTab === 'USERS' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Quản lý Người dùng
          </button>
          <button 
            onClick={() => setActiveTab('LOGS')}
            className={`px-6 py-4 text-sm font-medium transition ${activeTab === 'LOGS' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Nhật ký (Audit Logs)
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'USERS' ? (
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Tìm theo tên hoặc email..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 font-semibold text-slate-600">User</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Role</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Status</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Last Login</th>
                      <th className="px-6 py-3 font-semibold text-slate-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{u.name}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">{u.role}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {u.isActive ? 'Active' : 'Locked'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{u.lastLogin}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => toggleUserStatus(u.id)}
                            className={`p-2 rounded-lg transition ${u.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                            title={u.isActive ? "Lock Account" : "Unlock Account"}
                          >
                            {u.isActive ? <Lock size={16} /> : <Unlock size={16} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-slate-600">Timestamp</th>
                    <th className="px-6 py-3 font-semibold text-slate-600">Action</th>
                    <th className="px-6 py-3 font-semibold text-slate-600">User</th>
                    <th className="px-6 py-3 font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.timestamp}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{log.action}</td>
                      <td className="px-6 py-4 text-slate-600">{log.user}</td>
                      <td className="px-6 py-4"><StatusBadge status={log.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. Component: Lecturer Dashboard
const LecturerDashboard = () => {
  const [aiAnalysis, setAiAnalysis] = useState<{topic: string, content: string} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeProject = async (teamName: string, topic: string) => {
    setIsAnalyzing(true);
    setAiAnalysis({ topic: teamName, content: "Đang phân tích..." });
    
    const prompt = `Với tư cách là một giảng viên đại học, hãy phân tích ngắn gọn đề tài dự án "${topic}" của nhóm sinh viên ${teamName}.
    Hãy đưa ra:
    1. 2 Điểm mạnh tiềm năng của đề tài.
    2. 2 Rủi ro hoặc thách thức kỹ thuật lớn nhất.
    3. 1 Gợi ý để cải thiện hoặc mở rộng tính năng.
    Trả lời ngắn gọn, format đẹp.`;

    const result = await callGemini(prompt);
    setAiAnalysis({ topic: `Phân tích AI: ${teamName}`, content: result });
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Bảng điều khiển Giảng viên</h2>
          <p className="text-slate-500">Quản lý lớp học và tiến độ dự án của sinh viên</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-blue-700">
            <Plus size={16} /> Tạo Milestone
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stats Cards (Same as before) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm mb-1">Tổng số lớp</div>
          <div className="text-2xl font-bold text-slate-800">3</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm mb-1">Số nhóm dự án</div>
          <div className="text-2xl font-bold text-slate-800">12</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm mb-1">Cần duyệt đề tài</div>
          <div className="text-2xl font-bold text-orange-600">2</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm mb-1">Deadline sắp tới</div>
          <div className="text-2xl font-bold text-blue-600">15/12</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Tiến độ các nhóm (Lớp SE104.N11)</h3>
          <button className="text-blue-600 text-sm hover:underline">Xem tất cả</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-600">Tên Nhóm</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Đề tài</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Tiến độ</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Trạng thái</th>
                <th className="px-6 py-3 font-semibold text-slate-600 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_TEAMS.map((team) => (
                <tr key={team.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{team.name}</td>
                  <td className="px-6 py-4 text-slate-600">{team.topic}</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${team.progress}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-500 mt-1 block">{team.progress}%</span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={team.status} /></td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => handleAnalyzeProject(team.name, team.topic)}
                      className="text-purple-600 hover:bg-purple-50 p-2 rounded-full transition"
                      title="Phân tích đề tài với AI"
                    >
                      <Sparkles size={18} />
                    </button>
                    <button className="text-slate-500 hover:text-green-600 p-2"><Award size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Analysis Modal */}
      {aiAnalysis && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-purple-50 rounded-t-xl">
              <div className="flex items-center gap-2 text-purple-700">
                <Sparkles size={20} />
                <h3 className="font-bold">{aiAnalysis.topic}</h3>
              </div>
              <button onClick={() => setAiAnalysis(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto whitespace-pre-wrap text-slate-700 leading-relaxed">
              {isAnalyzing ? (
                 <div className="flex flex-col items-center justify-center py-8 text-purple-500">
                   <RefreshCw className="animate-spin mb-2" size={32} />
                   <p>Gemini đang đọc đề tài và suy nghĩ...</p>
                 </div>
              ) : (
                aiAnalysis.content
              )}
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button onClick={() => setAiAnalysis(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Component: Student Workspace
const StudentWorkspace = () => {
  const [activeTab, setActiveTab] = useState('BOARD');
  const [tasks, setTasks] = useState(MOCK_TASKS);
  
  // Chat States
  const [chatMode, setChatMode] = useState<'TEAM' | 'AI'>('TEAM');
  const [teamMessages, setTeamMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>(MOCK_AI_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false); // New state for Task Gen
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [teamMessages, aiMessages, chatMode]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: ChatMessage = { id: Date.now(), user: 'Tôi', text: newMessage, time: 'Now' };

    if (chatMode === 'TEAM') {
      setTeamMessages([...teamMessages, msg]);
    } else {
      setAiMessages(prev => [...prev, msg]);
      setIsAiTyping(true);
      
      const prompt = `Bạn là một trợ lý AI hỗ trợ nhóm sinh viên làm dự án. Người dùng hỏi: "${newMessage}". Hãy trả lời ngắn gọn, hữu ích và mang tính khích lệ.`;
      
      const aiReplyText = await callGemini(prompt);
      
      const aiReply: ChatMessage = { 
        id: Date.now() + 1, 
        user: 'Gemini AI', 
        text: aiReplyText, 
        time: 'Now', 
        isAi: true 
      };
      
      setAiMessages(prev => [...prev, aiReply]);
      setIsAiTyping(false);
    }
    setNewMessage('');
  };

  // --- NEW: AI Task Suggestion Handler ---
  const handleSuggestTasks = async () => {
    setIsGeneratingTasks(true);
    const projectTopic = "Hệ thống Quản lý Thư viện"; // Mock topic for current user's team
    
    const prompt = `Cho dự án phần mềm có tên "${projectTopic}", hãy gợi ý 3 đầu việc (Tasks) quan trọng tiếp theo cần làm cho nhóm sinh viên.
    Trả về định dạng JSON thuần (không markdown) array object với các trường: title (string), priority ("HIGH"|"MEDIUM"|"LOW"), status ("TODO").
    Ví dụ: [{"title": "Xây dựng ERD", "priority": "HIGH", "status": "TODO"}]`;

    try {
      let result = await callGemini(prompt);
      
      // FIX: Handle Mock Mode for JSON parsing
      if (result.includes("[Mô phỏng Gemini]")) {
        // Mock JSON response for demo purposes when no API key is set
        result = `[
          {"title": "Phân tích yêu cầu chi tiết", "priority": "HIGH", "status": "TODO"},
          {"title": "Thiết kế sơ đồ CSDL (ERD)", "priority": "HIGH", "status": "TODO"},
          {"title": "Cài đặt môi trường Dev", "priority": "MEDIUM", "status": "TODO"}
        ]`;
        // Optional: Add a small delay to simulate thinking if needed, but callGemini already has timeout
      }

      // Clean markdown if present
      result = result.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const suggestedTasks = JSON.parse(result);
      if (Array.isArray(suggestedTasks)) {
        const newTasks = suggestedTasks.map((t: any) => ({
          id: `ai-${Date.now()}-${Math.random()}`,
          title: t.title || "New Task",
          assignee: "Unassigned",
          status: "TODO",
          priority: t.priority || "MEDIUM"
        }));
        setTasks(prev => [...prev, ...newTasks]);
        alert(`Đã thêm ${newTasks.length} task mới từ Gemini!`);
      }
    } catch (e) {
      console.error(e);
      alert("Không thể tạo task tự động lúc này. Hãy thử lại sau.");
    }
    setIsGeneratingTasks(false);
  };

  const moveTask = (taskId: string, newStatus: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const renderKanban = () => {
    const columns = ['TODO', 'IN_PROGRESS', 'DONE'];
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col">
        {/* Kanban Toolbar */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-slate-500 italic">Kéo thả để cập nhật trạng thái công việc</p>
          <button 
            onClick={handleSuggestTasks}
            disabled={isGeneratingTasks}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow hover:opacity-90 transition font-medium text-sm"
          >
            {isGeneratingTasks ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
            {isGeneratingTasks ? "Đang suy nghĩ..." : "Gợi ý Task với AI"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto flex-1 pb-4">
          {columns.map(status => (
            <div key={status} className="bg-slate-100 p-4 rounded-xl flex flex-col gap-3 h-full">
              <h4 className="font-semibold text-slate-600 mb-2 flex justify-between">
                {status} <span className="bg-slate-200 px-2 rounded-full text-xs py-1 text-slate-600">{tasks.filter(t => t.status === status).length}</span>
              </h4>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {tasks.filter(t => t.status === status).map(task => (
                  <div key={task.id} className={`bg-white p-3 rounded-lg shadow-sm border border-slate-200 cursor-grab hover:shadow-md transition ${task.id.toString().startsWith('ai') ? 'border-l-4 border-l-purple-400' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${task.priority === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        {task.priority}
                      </span>
                      <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={14} /></button>
                    </div>
                    <h5 className="text-sm font-medium text-slate-800 mb-2">{task.title}</h5>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <div className="flex items-center gap-1"><Users size={12} /> {task.assignee}</div>
                      <div className="flex gap-1">
                        {status !== 'TODO' && <button onClick={() => moveTask(task.id, 'TODO')} className="p-1 hover:bg-slate-100 rounded">⬅</button>}
                        {status !== 'DONE' && <button onClick={() => moveTask(task.id, 'DONE')} className="p-1 hover:bg-slate-100 rounded">➡</button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 text-sm text-slate-500 border border-dashed border-slate-300 rounded-lg hover:bg-white transition mt-auto">
                + Thêm thẻ
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderChat = () => {
    const activeMessages = chatMode === 'TEAM' ? teamMessages : aiMessages;
    
    return (
      <div className="flex flex-col h-[calc(100vh-200px)] bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Chat Header with Toggle */}
        <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="flex bg-slate-200 p-1 rounded-lg">
            <button 
              onClick={() => setChatMode('TEAM')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-2 ${chatMode === 'TEAM' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Users size={14} /> Team Chat
            </button>
            <button 
              onClick={() => setChatMode('AI')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-2 ${chatMode === 'AI' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Sparkles size={14} /> Hỏi Gemini
            </button>
          </div>
          {chatMode === 'TEAM' && <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full"><Video size={18} /></button>}
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {activeMessages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.user === 'Tôi' ? 'items-end' : 'items-start'}`}>
               <div className="flex items-end gap-2 max-w-[85%]">
                 {msg.user !== 'Tôi' && (
                   <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${msg.isAi ? 'bg-gradient-to-br from-purple-100 to-blue-100 border border-purple-200 text-purple-600' : 'bg-white border border-slate-200 text-slate-600'}`}>
                     {msg.isAi ? <Bot size={16} /> : msg.user.charAt(0)}
                   </div>
                 )}
                 <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm whitespace-pre-wrap leading-relaxed ${
                   msg.user === 'Tôi' 
                     ? 'bg-blue-600 text-white rounded-br-none' 
                     : msg.isAi 
                       ? 'bg-white border border-purple-100 text-slate-800 rounded-bl-none' 
                       : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                 }`}>
                   {msg.text}
                 </div>
               </div>
               <span className="text-[10px] text-slate-400 mt-1 px-2 flex items-center gap-1">
                 {msg.isAi && <Sparkles size={8} className="text-purple-400" />} {msg.time}
               </span>
            </div>
          ))}
          {isAiTyping && (
             <div className="flex items-start gap-2">
                <div className="h-8 w-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-500"><Bot size={16}/></div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-purple-100 shadow-sm flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <button type="button" className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"><Paperclip size={20} /></button>
            <input 
              type="text" 
              placeholder={chatMode === 'AI' ? "Hỏi Gemini về dự án, code, ý tưởng..." : "Nhập tin nhắn cho nhóm..."}
              className="flex-1 bg-slate-50 border-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2 text-sm outline-none transition"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button 
              type="submit" 
              className={`p-2 text-white rounded-lg transition shadow-sm ${chatMode === 'AI' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {chatMode === 'AI' ? <Sparkles size={18} /> : <Send size={18} />}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-slate-800">Team Alpha</h2>
            <StatusBadge status="APPROVED" />
          </div>
          <p className="text-slate-500 flex items-center gap-2">
            <BookOpen size={16} /> Đề tài: Hệ thống Quản lý Thư viện
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex -space-x-2 mr-4">
            {[1,2,3].map(i => <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white"></div>)}
            <div className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">+2</div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-blue-700 shadow-sm">
             <Video size={16} /> Họp Nhanh
          </button>
        </div>
      </div>
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button onClick={() => setActiveTab('BOARD')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'BOARD' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Công việc (Kanban)</button>
        <button onClick={() => setActiveTab('CHAT')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'CHAT' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Thảo luận & AI</button>
        <button onClick={() => setActiveTab('FILES')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'FILES' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Tài liệu</button>
      </div>
      {activeTab === 'BOARD' ? renderKanban() : activeTab === 'CHAT' ? renderChat() : <div className="p-8 text-center text-slate-500">Chức năng quản lý file đang phát triển</div>}
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const handleLogin = (role: Role) => {
    const mockUser = MOCK_USERS.find(u => u.role === role);
    if (mockUser) setUser(mockUser);
  };
  return !user ? <LoginScreen onLogin={handleLogin} /> : <MainLayout user={user} onLogout={() => setUser(null)} />;
}
