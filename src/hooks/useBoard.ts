import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import client from "../utils/axios.util";
import { IBoard, INote, IQueue } from "../context/board/board.interface";
import { useBoardContext } from "../context/board/board.context";
import { IResponse } from "../interfaces/response.interface";
import Event from "../enums/event.enum";

const useBoard = (boardId: string) => {
  const [boardState, setBoardState] = useState({
    boardLoading: false,
    boardError: "",
  });
  const [socketState, setSocketState] = useState({
    socketLoading: false,
    socketError: "",
  });
  const state = useBoardContext();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setBoardState({ boardError: "", boardLoading: true });

        const [
          {
            data: { data: board },
          },
          {
            data: { data: queues },
          },
        ] = await Promise.all([
          await client.get<IResponse<IBoard>>(`/boards/${boardId}`, {
            signal: controller.signal,
          }),
          await client.get<IResponse<IQueue[]>>(`/boards/${boardId}/queues`, {
            signal: controller.signal,
          }),
        ]);

        state.dispatch({
          type: "SET_BOARD",
          payload: { board: board },
        });
        state.dispatch({
          type: "SET_QUEUES",
          payload: { queues: queues || [] },
        });
        setBoardState((prev) => ({ ...prev, boardLoading: false }));
      } catch (error) {
        if (error instanceof AxiosError)
          setBoardState({
            boardError: error.response?.data,
            boardLoading: false,
          });
        else if (error instanceof Error)
          setBoardState({ boardError: error.message, boardLoading: false });
      }
    };
    fetchData();

    state.socketRef?.connect();
    state.socketRef?.emit<`${Event}`>("BOARD_JOIN", { boardId });

    state.socketRef?.on<`${Event}`>("QUEUE_CREATE_SUCCESS", (data: IQueue) => {
      if (!data) return;
      state.dispatch({ type: "ADD_QUEUE", payload: { queue: data } });
      setSocketState((prev) => ({ ...prev, socketLoading: false }));
    });
    state.socketRef?.on<`${Event}`>("QUEUE_CREATE_FAILED", (data: string) => {
      if (!data) return;
      setSocketState({ socketError: data, socketLoading: false });
    });

    state.socketRef?.on<`${Event}`>(
      "NOTE_CREATE_SUCCESS",
      (data: { note: INote; queueId: string }) => {
        if (!data) return;
        state.dispatch({
          type: "ADD_NOTE",
          payload: { note: data.note, queueId: +data.queueId },
        });
        setSocketState((prev) => ({ ...prev, socketLoading: false }));
      }
    );
    state.socketRef?.on<`${Event}`>("NOTE_CREATE_FAILED", (data: string) => {
      if (!data) return;
      setSocketState({ socketError: data, socketLoading: false });
    });

    state.socketRef?.on<`${Event}`>(
      "BOARD_UPDATE_SUCCESS",
      (data: { board: IBoard }) => {
        if (!data) return;
        state.dispatch({
          type: "SET_BOARD",
          payload: { board: data.board },
        });
        setSocketState((prev) => ({ ...prev, socketLoading: false }));
      }
    );
    state.socketRef?.on<`${Event}`>("BOARD_UPDATE_FAILED", (data: string) => {
      if (!data) return;
      setSocketState({ socketError: data, socketLoading: false });
    });

    state.socketRef?.on<`${Event}`>(
      "QUEUE_UPDATE_SUCCESS",
      (data: { queue: IQueue; queueId: string }) => {
        if (!data) return;
        state.dispatch({
          type: "UPDATE_QUEUE",
          payload: { queue: data.queue, queueId: +data.queueId },
        });
        setSocketState((prev) => ({ ...prev, socketLoading: false }));
      }
    );
    state.socketRef?.on<`${Event}`>("QUEUE_UPDATE_FAILED", (data: string) => {
      if (!data) return;
      setSocketState({ socketError: data, socketLoading: false });
    });

    state.socketRef?.on<`${Event}`>(
      "QUEUE_DELETE_SUCCESS",
      (data: { queueId: string }) => {
        if (!data) return;
        state.dispatch({
          type: "DELETE_QUEUE",
          payload: { queueId: +data.queueId },
        });
        setSocketState((prev) => ({ ...prev, socketLoading: false }));
      }
    );
    state.socketRef?.on<`${Event}`>("QUEUE_DELETE_FAILED", (data: string) => {
      if (!data) return;
      setSocketState({ socketError: data, socketLoading: false });
    });

    state.socketRef?.on<`${Event}`>(
      "NOTE_UPDATE_SUCCESS",
      (data: {
        note: INote;
        queueId: string;
        isAdded: boolean;
        content: string;
        currentQueueId: string;
      }) => {
        if (!data) return;
        state.dispatch({
          type: "UPDATE_NOTE",
          payload: {
            note: data.note,
            queueId: +data.queueId,
            isAdded: data.isAdded,
            content: data.content,
            currentQueueId: +data.currentQueueId,
          },
        });
        setSocketState((prev) => ({ ...prev, socketLoading: false }));
      }
    );
    state.socketRef?.on<`${Event}`>("NOTE_UPDATE_FAILED", (data: string) => {
      if (!data) return;
      setSocketState({ socketError: data, socketLoading: false });
    });

    state.socketRef?.on<`${Event}`>(
      "NOTE_DELETE_SUCCESS",
      (data: { noteId: string; queueId: string }) => {
        if (!data) return;
        state.dispatch({
          type: "DELETE_NOTE",
          payload: { noteId: +data.noteId, queueId: +data.queueId },
        });
        setSocketState((prev) => ({ ...prev, socketLoading: false }));
      }
    );
    state.socketRef?.on<`${Event}`>("NOTE_DELETE_FAILED", (data: string) => {
      if (!data) return;
      setSocketState({ socketError: data, socketLoading: false });
    });

    return () => {
      if (state.socketRef?.io._readyState === "closed") {
        // <-- This is important
        state.socketRef?.emit("BOARD_LEAVE", { boardId });
        state.socketRef?.off<`${Event}`>("QUEUE_CREATE_SUCCESS");
        state.socketRef?.off<`${Event}`>("QUEUE_CREATE_FAILED");
        state.socketRef?.off<`${Event}`>("NOTE_CREATE_SUCCESS");
        state.socketRef?.off<`${Event}`>("NOTE_CREATE_FAILED");
        state.socketRef?.off<`${Event}`>("BOARD_UPDATE_SUCCESS");
        state.socketRef?.off<`${Event}`>("BOARD_UPDATE_FAILED");
        state.socketRef?.off<`${Event}`>("QUEUE_UPDATE_SUCCESS");
        state.socketRef?.off<`${Event}`>("QUEUE_UPDATE_FAILED");
        state.socketRef?.off<`${Event}`>("QUEUE_DELETE_SUCCESS");
        state.socketRef?.off<`${Event}`>("QUEUE_DELETE_FAILED");
        state.socketRef?.off<`${Event}`>("NOTE_UPDATE_SUCCESS");
        state.socketRef?.off<`${Event}`>("NOTE_UPDATE_FAILED");
        state.socketRef?.off<`${Event}`>("NOTE_DELETE_SUCCESS");
        state.socketRef?.off<`${Event}`>("NOTE_DELETE_FAILED");
      }
      controller.abort();
    };
  }, []);

  return { ...state, ...socketState, setSocketState, ...boardState };
};

export default useBoard;
