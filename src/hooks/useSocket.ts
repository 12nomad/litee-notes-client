import { useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";

const useSocket = (): Socket => {
  const { current: socketRef } = useRef(
    io(import.meta.env.VITE_SOCKET_URL, {
      auth: { notes_at: localStorage.getItem("notes_at") },
      autoConnect: false,
    })
  );

  useEffect(() => {
    socketRef?.connect();

    return () => {
      socketRef?.disconnect();
    };
  }, []);

  return socketRef;
};

export default useSocket;
