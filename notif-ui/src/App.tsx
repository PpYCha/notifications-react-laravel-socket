import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "./socket";

interface Notification {
  id: number;
  title: string;
  message: string;
}

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Join user room
    socket.connect();
    socket.emit("join", "user:1");

    socket.on("notification:new", (notif: Notification) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/notifications")
      .then((res) => setNotifications(res.data));
  }, []);

  const sendNotification = async () => {
    await axios.post("http://localhost:8000/api/notifications", {
      title: "Hello!",
      message: "This is a real-time notification",
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Notifications</h2>

      <button onClick={sendNotification}>Send Notification</button>

      <ul>
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
