import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Conversation,
  ConversationList,
  ConversationHeader,
} from "@chatscope/chat-ui-kit-react";

import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import axios from "../../../api/axios";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Alert, List, Typography, styled } from "@mui/material";
import UserListItem from "../../../Assets/UserListItem";
import "./ChatSocket.css";
import socketApi from "../../../api/socketApi";

const uid = Cookies.get("uid");
const token = Cookies.get("token");
const urlIO = socketApi;

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const ChatSocket = () => {
  const socketRef = useRef(null);

  const [user] = useState({ _id: uid });
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [searchUsers, setSearchUsers] = useState("");
  const [offline, setOffline] = useState(false);
  const [banner, setBanner] = useState("");

  const demoChat = useMemo(
    () => ({
      _id: "demo-chat",
      users: [
        { _id: uid || "me", name: "You" },
        { _id: "cosre-bot", name: "COSRE Bot" },
      ],
      latestMessage: { sender: { name: "COSRE Bot" }, message: "Chào bạn! (Demo chat)" },
    }),
    []
  );

  const demoMessages = useMemo(
    () => [
      {
        _id: "demo-m1",
        message:
          "Mình đang ở chế độ demo vì chưa kết nối được backend (Network Error). Bạn có thể chạy backend hoặc chỉnh REACT_APP_API_BASE_URL để bật chat thật.",
        sender: { _id: "cosre-bot", name: "COSRE Bot" },
      },
    ],
    []
  );

  // Init socket once (doesn't crash if server is offline)
  useEffect(() => {
    if (!urlIO) return;
    if (socketRef.current) return;

    try {
      socketRef.current = io(`${urlIO}`, {
        autoConnect: true,
        transports: ["websocket", "polling"],
      });

      socketRef.current.emit("setup", user);
      socketRef.current.on("message-received", (data) => {
        setMessages((prev) => [...prev, data]);
      });
    } catch (e) {
      // Socket is optional; keep UI usable
    }

    return () => {
      try {
        socketRef.current?.off?.("message-received");
        socketRef.current?.disconnect?.();
      } catch (e) {
        // ignore
      }
      socketRef.current = null;
    };
  }, [user]);

  // Fetch chats
  useEffect(() => {
    let mounted = true;

    async function getChats() {
      if (!token || !uid) {
        setOffline(true);
        setChats([demoChat]);
        setBanner("Bạn chưa đăng nhập. Chat đang ở chế độ demo.");
        return;
      }

      const response = await axios.get("/api/chat/chat", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${token}`,
          uid,
        },
      });

      if (!mounted) return;

      if (response.status === 200 && Array.isArray(response.data)) {
        setOffline(false);
        setBanner("");
        setChats(response.data);
      } else if (response.status === 0) {
        setOffline(true);
        setChats([demoChat]);
        setBanner(
          "Không kết nối được backend (Network Error). Chat đang ở chế độ demo. Hãy chạy backend hoặc đặt REACT_APP_API_BASE_URL đúng."
        );
      } else {
        // Non-200
        setOffline(false);
        setBanner(`Không tải được danh sách chat (status ${response.status}).`);
      }
    }

    getChats();
    return () => {
      mounted = false;
    };
  }, [demoChat]);

  // Fetch messages for selected chat
  useEffect(() => {
    let mounted = true;

    async function getMessages() {
      if (!selectedChat?._id) {
        setMessages([]);
        return;
      }

      if (offline || selectedChat?._id === demoChat._id) {
        setMessages(demoMessages);
        return;
      }

      const response = await axios.post(
        "/api/message/chatId",
        JSON.stringify({ chatId: selectedChat?._id }),
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Token ${token}`,
            uid,
          },
        }
      );

      if (!mounted) return;

      if (response.status === 200 && Array.isArray(response.data)) {
        setMessages(response.data);
      } else if (response.status === 0) {
        setOffline(true);
        setMessages(demoMessages);
        setBanner(
          "Mất kết nối backend. Đã chuyển chat sang chế độ demo. Hãy kiểm tra server/API URL."
        );
      }
    }

    getMessages();
    return () => {
      mounted = false;
    };
  }, [selectedChat, offline, demoChat, demoMessages]);

  // Search users
  useEffect(() => {
    let mounted = true;

    async function getUsers() {
      if (!isDialogOpen) return;

      if (offline) {
        const q = (searchUsers || "").toLowerCase();
        const demoUsers = [
          { _id: "u1", name: "Sinh viên A", email: "a@student.demo" },
          { _id: "u2", name: "Sinh viên B", email: "b@student.demo" },
          { _id: "u3", name: "Giảng viên CNPM", email: "lecturer@demo" },
        ].filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
        setUsersList(demoUsers);
        return;
      }

      const response = await axios.get("/api/auth/searchUsers", {
        params: { search: searchUsers },
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${token}`,
        },
      });

      if (!mounted) return;

      if (response.status === 200 && Array.isArray(response.data)) {
        setUsersList(response.data);
      } else if (response.status === 0) {
        setOffline(true);
        setBanner(
          "Không kết nối được backend khi tìm user. Đã chuyển sang chế độ demo."
        );
      }
    }

    getUsers();
    return () => {
      mounted = false;
    };
  }, [searchUsers, isDialogOpen, offline]);

  const displayNameForConversation = (convo) => {
    if (!convo?.users || convo.users.length < 2) return "Chat";
    return uid === convo.users[0]?._id ? convo.users[1]?.name : convo.users[0]?.name;
  };

  const returnConversation = (convo) => {
    function handleChatClick() {
      setSelectedChat({
        _id: convo._id,
        userName: displayNameForConversation(convo),
      });
    }

    return (
      <Conversation
        key={convo._id}
        name={displayNameForConversation(convo)}
        lastSenderName={convo?.latestMessage?.sender?.name}
        info={convo?.latestMessage?.message}
        onClick={handleChatClick}
      />
    );
  };

  const returnMessages = (message) => {
    return (
      <Message
        key={message._id || Math.random().toString(16)}
        model={{
          message: message.message,
          sender: message?.sender?.name || "",
          direction: uid === message?.sender?._id ? "outgoing" : "incoming",
        }}
      />
    );
  };

  function createUsers(u) {
    async function handleCreateChat() {
      if (offline) {
        setSelectedChat({ _id: demoChat._id, userName: "COSRE Bot" });
        setIsDialogOpen(false);
        return;
      }

      const response = await axios.post(
        "/api/chat/chats",
        JSON.stringify({ userId: u._id }),
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Token ${token}`,
            uid,
          },
        }
      );

      if (response.status === 200 && response.data) {
        setSelectedChat({
          _id: response.data._id,
          userName: displayNameForConversation(response.data),
        });
        setIsDialogOpen(false);
      }
    }

    return (
      <Button key={u._id} onClick={handleCreateChat} style={{ width: "100%" }}>
        <UserListItem id={u._id} email={u.email} name={u.name} />
      </Button>
    );
  }

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  const handleMessageSend = async () => {
    const text = (inputMessage || "").trim();
    if (!text || !selectedChat?._id) return;

    if (offline || selectedChat?._id === demoChat._id) {
      const me = { _id: uid || "me", name: "You" };
      setMessages((prev) => [...prev, { _id: `local-${Date.now()}`, message: text, sender: me }]);
      setInputMessage("");

      // Demo bot reply
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            _id: `bot-${Date.now()}`,
            message:
              "(Demo) Mình đã nhận tin nhắn. Để chat thật, hãy chạy backend và sửa REACT_APP_API_BASE_URL / socketApi.",
            sender: { _id: "cosre-bot", name: "COSRE Bot" },
          },
        ]);
      }, 450);

      return;
    }

    const response = await axios.post(
      "/api/message/",
      JSON.stringify({ message: text, chatId: selectedChat?._id ?? "" }),
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${token}`,
          uid,
        },
      }
    );

    if (response.status === 200 && response.data) {
      try {
        socketRef.current?.emit?.("new-message", response.data);
      } catch (e) {
        // ignore
      }
      setMessages((prev) => [...prev, response.data]);
      setInputMessage("");
    } else if (response.status === 0) {
      setOffline(true);
      setBanner("Mất kết nối backend. Đã chuyển chat sang chế độ demo.");
    }
  };

  const addUserButton = (
    <Button
      className="mx-1 p-1 add-assignment"
      style={{
        display: "flow-root",
        position: "fixed",
        left: "10px",
        bottom: "20px",
        zIndex: "3",
        background: "white",
        borderRadius: "90%",
        height: "60px",
        width: "60px",
        boxShadow: "0px 0px 1px 1px var(--cosre-primary)",
      }}
      onClick={handleDialogOpen}
      title={offline ? "Demo: mở danh sách user" : "Add users"}
    >
      <AddCircleOutlinedIcon style={{ color: "var(--cosre-primary)", fontSize: "50px" }} />
    </Button>
  );

  return (
    <div
      style={{
        position: "relative",
        height: "94vh",
        width: "100vw",
        display: "flex",
        background: "white",
      }}
    >
      <div style={{ width: 320, borderRight: "1px solid var(--cosre-border)" }}>
        {banner ? (
          <div style={{ padding: 10 }}>
            <Alert severity={offline ? "warning" : "info"} sx={{ borderRadius: 3 }}>
              {banner}
            </Alert>
          </div>
        ) : null}
        <ConversationList>{chats.map(returnConversation)}</ConversationList>
      </div>

      <div style={{ width: "100%" }}>
        <MainContainer>
          {!selectedChat ? (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
              <div className="text-muted">Chọn một cuộc trò chuyện để bắt đầu.</div>
            </div>
          ) : (
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Back
                  onClick={() => {
                    setSelectedChat(null);
                    setInputMessage("");
                    setMessages([]);
                  }}
                />
                <ConversationHeader.Content userName={selectedChat.userName} />
              </ConversationHeader>
              <MessageList>{messages.map(returnMessages)}</MessageList>
              <MessageInput
                placeholder={offline ? "Demo mode (backend offline)" : "Type message here"}
                value={inputMessage}
                onChange={(newValue) => setInputMessage(newValue)}
                onSend={handleMessageSend}
                disabled={!selectedChat}
              />
            </ChatContainer>
          )}
        </MainContainer>
      </div>

      {addUserButton}

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Users</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="users"
            label="Search Users:"
            type="text"
            fullWidth
            value={searchUsers}
            onChange={(e) => setSearchUsers(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
          <Typography sx={{ mt: 0, mb: 0 }} variant="h6" component="div">
            Users:
          </Typography>
          <Demo>
            <List>{usersList?.map(createUsers)}</List>
          </Demo>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} style={{ color: "black" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChatSocket;
