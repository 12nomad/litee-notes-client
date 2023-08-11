import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import client from "../utils/axios.util";
import { IBoard } from "../context/board/board.interface";
import { useBoardContext } from "../context/board/board.context";
import { IResponse } from "../interfaces/response.interface";

const useBoards = () => {
  const state = useBoardContext();
  const [boardsState, setBoardsState] = useState({
    boardsLoading: false,
    boardsError: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    setBoardsState({ boardsError: "", boardsLoading: true });
    client
      .get<IResponse<IBoard[]>>("/boards", { signal: controller.signal })
      .then(({ data: { data: boards } }) => {
        state.dispatch({
          type: "SET_BOARDS",
          payload: { boards: boards || [] },
        });
        setBoardsState((prev) => ({ ...prev, boardsLoading: false }));
      })
      .catch((error) => {
        if (error instanceof AxiosError)
          setBoardsState({
            boardsError: error.response?.data,
            boardsLoading: false,
          });
        else if (error instanceof Error)
          setBoardsState({ boardsError: error.message, boardsLoading: false });
      });

    return () => controller.abort();
  }, []);

  return { ...state, ...boardsState };
};

export default useBoards;
