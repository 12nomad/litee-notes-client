import { Dispatch } from "react";
import { Socket } from "socket.io-client";

export interface IBoard {
  id: number;
  title: string;
  ownerId: number;
}

export interface IQueue extends IBoard {
  boardId: number;
  notes: INote[];
}

export interface INote extends IQueue {
  queueId: number;
  content: string;
}

export interface IBoardContext {
  boards: IBoard[];
  board: IBoard | null;
  queues: IQueue[];
  queue: IQueue | null;
  notes: INote[];
  note: INote | null;
  dispatch: Dispatch<TAppAction>;
  socketRef?: Socket;
  lastBoardId: number;
}

interface ISetLastBoardId {
  type: "SET_LAST_BOARD_ID";
  payload: { boardId: number };
}
interface ISetBoards {
  type: "SET_BOARDS";
  payload: { boards: IBoard[] };
}

interface ISetQueues {
  type: "SET_QUEUES";
  payload: { queues: IQueue[] };
}

interface ISetNotes {
  type: "SET_NOTES";
  payload: { notes: INote[] };
}

interface ISetBoard {
  type: "SET_BOARD";
  payload: { board: IBoard | null };
}

interface IAddBoard {
  type: "ADD_BOARD";
  payload: { board: IBoard };
}

interface IAddQueue {
  type: "ADD_QUEUE";
  payload: { queue: IQueue };
}

interface IAddNote {
  type: "ADD_NOTE";
  payload: { note: INote; queueId: number };
}

interface IUpdateQueue {
  type: "UPDATE_QUEUE";
  payload: { queue: IQueue; queueId: number };
}

interface IUpdateNote {
  type: "UPDATE_NOTE";
  payload: {
    note: INote;
    queueId: number;
    isAdded: boolean;
    content: string;
    currentQueueId: number;
  };
}

interface IDeleteQueue {
  type: "DELETE_QUEUE";
  payload: { queueId: number };
}

interface IDeleteNote {
  type: "DELETE_NOTE";
  payload: { noteId: number; queueId: number };
}

interface ISetSocket {
  type: "SET_SOCKET";
  payload: { socket: Socket };
}

export type TAppAction =
  | ISetBoards
  | ISetQueues
  | IUpdateQueue
  | ISetBoard
  | IAddBoard
  | IAddQueue
  | ISetNotes
  | IAddNote
  | IDeleteQueue
  | IDeleteNote
  | IUpdateNote
  | ISetSocket
  | ISetLastBoardId;
