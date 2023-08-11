import {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
  useRef,
} from "react";
import { io } from "socket.io-client";

import boardReducer, { initialState } from "./board.reducer";
import { IBoardContext } from "./board.interface";

const BoardContext = createContext<IBoardContext>(initialState);

export const BoardProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(boardReducer, useContext(BoardContext));
  const { current: socketRef } = useRef(
    io(import.meta.env.VITE_SOCKET_URL, {
      auth: { notes_at: localStorage.getItem("notes_at") },
      autoConnect: false,
    })
  );

  return (
    <BoardContext.Provider value={{ ...state, dispatch, socketRef }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoardContext = () => useContext(BoardContext);
