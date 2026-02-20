import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../config/api";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    
    let id = sessionStorage.getItem("chat_user_id");

    if (!id) {
      id =
        (crypto && crypto.randomUUID && crypto.randomUUID()) ||
        Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem("chat_user_id", id);
    }

    setMyId(id);

    const newSocket = io(BASE_URL, {
      query: { userId: id },
      transports: ["websocket"],
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, myId }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);


// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const SocketContext = createContext();

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [myId, setMyId] = useState(null);

//   useEffect(() => {
//     let baseId = localStorage.getItem("chat_base_id");

//     if (!baseId) {
//       baseId = crypto.randomUUID();
//       localStorage.setItem("chat_base_id", baseId);
//     }

//     let tabId = sessionStorage.getItem("chat_tab_id");

//     if (!tabId) {
//       tabId = crypto.randomUUID();
//       sessionStorage.setItem("chat_tab_id", tabId);
//     }

//     const finalId = `${baseId}_${tabId}`;
//     setMyId(finalId);

//     const newSocket = io("http://localhost:5000", {
//       query: { userId: finalId },
//     });

//     setSocket(newSocket);

//     // cleanup
//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={{ socket, myId }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);
