import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "./socket";

interface Notification {
  id: number;
  title: string;
  message: string;
}

/**
 * Axios instance using ENV
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  /**
   * Socket connection
   */
  useEffect(() => {
    socket.connect();
    socket.emit("join", "user:1");

    const handleNotification = (notif: Notification) => {
      setNotifications((prev) => [notif, ...prev]);
    };

    socket.on("notification:new", handleNotification);

    return () => {
      socket.off("notification:new", handleNotification);
      socket.disconnect();
    };
  }, []);

  /**
   * Fetch existing notifications
   */
  useEffect(() => {
    api.get("/notifications").then((res) => {
      setNotifications(res.data);
    });
  }, []);

  /**
   * Send notification
   */
  const sendNotification = async () => {
    if (!title || !message) return;

    await api.post("/notifications", {
      title,
      message,
    });

    // Clear inputs
    setTitle("");
    setMessage("");
  };

  // useEffect(() => {
  //   socket.connect();

  //   socket.on("connect", () => {
  //     console.log("✅ Socket connected:", socket.id);
  //   });

  //   socket.emit("join", "user:1");

  //   const handleNotification = (notif: Notification) => {
  //     console.log("📩 Socket received:", notif);
  //     setNotifications((prev) => [notif, ...prev]);
  //   };

  //   socket.on("notification:new", handleNotification);

  //   return () => {
  //     socket.off("notification:new", handleNotification);
  //     socket.disconnect();
  //   };
  // }, []);

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>
      <h2>Notifications</h2>

      {/* Sample Inputs */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Notification title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />

        <textarea
          placeholder="Notification message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <button onClick={sendNotification}>Send Notification</button>

      <ul style={{ marginTop: 20 }}>
        {notifications.map((n) => (
          <li key={n.id}>
            <strong>{n.title}</strong> – {n.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
