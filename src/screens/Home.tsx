import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { io } from "socket.io-client";

import Nav from "../components/common/Nav";
import { useBoardContext } from "../context/board/board.context";

const Home = () => {
  const { dispatch } = useBoardContext();

  useEffect(() => {
    dispatch({
      type: "SET_SOCKET",
      payload: {
        socket: io(import.meta.env.VITE_SOCKET_URL, {
          auth: { notes_at: localStorage.getItem("notes_at")! },
        }),
      },
    });
  }, []);

  return (
    <div className="bg-gray-100 w-full">
      <Nav />
      <main className="mx-2 md:mx-7 xl:mx-9 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Home;
