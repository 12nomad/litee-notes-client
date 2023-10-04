import {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";

import boardReducer, { initialState } from "./board.reducer";
import { IBoardContext } from "./board.interface";

const BoardContext = createContext<IBoardContext>(initialState);

export const BoardProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(boardReducer, useContext(BoardContext));

  return (
    <BoardContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoardContext = () => useContext(BoardContext);
