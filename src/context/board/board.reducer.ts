import { IBoardContext, INote, TAppAction } from "./board.interface";

export const initialState: IBoardContext = {
  boards: [],
  board: null,
  queues: [],
  queue: null,
  notes: [],
  note: null,
  dispatch: () => {},
};

const boardReducer = (
  state = initialState,
  action: TAppAction
): IBoardContext => {
  const { type, payload } = action;

  switch (type) {
    case "SET_BOARDS":
      return { ...state, boards: payload.boards };

    case "SET_QUEUES":
      return { ...state, queues: payload.queues };

    case "SET_NOTES":
      return { ...state, notes: payload.notes };

    case "SET_BOARD":
      return { ...state, board: payload.board };

    case "ADD_BOARD":
      return { ...state, boards: [...state.boards, payload.board] };

    case "ADD_QUEUE":
      return { ...state, queues: [...state.queues, payload.queue] };

    case "ADD_NOTE":
      return {
        ...state,
        queues: state.queues.map((queue) =>
          queue.id === payload.queueId
            ? { ...queue, notes: [...queue.notes, payload.note] }
            : queue
        ),
      };

    case "UPDATE_QUEUE":
      return {
        ...state,
        queues: state.queues.map((queue) =>
          queue.id === payload.queueId ? { ...payload.queue } : queue
        ),
      };

    case "UPDATE_NOTE":
      return {
        ...state,
        queues: state.queues.map((queue) => {
          if (payload.isAdded) {
            queue.notes = queue.notes.filter(
              (note) => note.id !== payload.note.id
            );

            if (queue.id === payload.queueId)
              queue.notes = [...queue.notes, payload.note];

            return queue;
          } else {
            if (queue.id === payload.currentQueueId) {
              queue.notes = queue.notes.map((note) => {
                return note.id === payload.note.id ? payload.note : note;
              });
            }

            return queue;
          }
        }),
      };

    case "DELETE_QUEUE":
      return {
        ...state,
        queues: state.queues.filter((queue) => queue.id !== payload.queueId),
      };

    case "DELETE_NOTE":
      return {
        ...state,
        queues: state.queues.map((queue) => {
          if (queue.id === payload.queueId) {
            queue.notes = queue.notes.filter(
              (note) => note.id !== payload.noteId
            );
            return queue;
          } else {
            return queue;
          }
        }),
      };

    default:
      return state;
  }
};

export default boardReducer;
