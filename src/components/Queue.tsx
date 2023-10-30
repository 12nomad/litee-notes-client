import { Dropdown } from "flowbite-react";
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import { BiMessageSquareEdit } from "react-icons/bi";
import { HiClipboardList } from "react-icons/hi";
import { MdNoteAdd } from "react-icons/md";
import { Socket } from "socket.io-client";

import { IQueue } from "../context/board/board.interface";
import Event from "../enums/event.enum";
import useOutsideClick from "../hooks/useOutsideClick";
import Note from "./Note";
import BoardInput from "./common/BoardInput";

interface IQueueExtended extends IQueue {
  setSocketState: Dispatch<
    SetStateAction<{
      socketLoading: boolean;
      socketError: string;
    }>
  >;
  socketRef?: Socket;
}

const Queue = ({
  title,
  notes,
  socketRef,
  setSocketState,
  boardId,
  id,
}: IQueueExtended) => {
  const [taskInfo, setTaskInfo] = useState({
    title: "",
    content: "",
  });
  const [queueInfo, setQueueInfo] = useState({
    title,
    isHidden: true,
  });

  const queueInputRef = useRef<HTMLInputElement>(null);

  useOutsideClick(
    () => setQueueInfo((prev) => ({ ...prev, isHidden: true })),
    queueInputRef
  );

  const onTaskCreateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!taskInfo.title) return;

    socketRef?.emit<`${Event}`>("NOTE_CREATE", {
      boardId: boardId.toString(),
      title: taskInfo.title,
      queueId: id.toString(),
    });
    setSocketState((prev) => ({ ...prev, socketLoading: true }));
    setTaskInfo({ title: "", content: "" });
  };

  const onQueueUpdateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!queueInfo.title) return;

    socketRef?.emit<`${Event}`>("QUEUE_UPDATE", {
      boardId: boardId.toString(),
      queueId: id.toString(),
      title: queueInfo.title,
    });
    setSocketState((prev) => ({ ...prev, socketLoading: true }));
    setQueueInfo({ isHidden: true, title });
  };

  const onDeleteQueue = () => {
    if (!window.confirm("Delete the queue?")) return;

    socketRef?.emit<`${Event}`>("QUEUE_DELETE", {
      boardId: boardId.toString(),
      queueId: id.toString(),
    });
    setSocketState((prev) => ({ ...prev, socketLoading: true }));
    setQueueInfo({ isHidden: true, title: "" });
  };

  return (
    <>
      <li className="p-4 rounded-lg w-full md:w-[308px] bg-white border shadow">
        <div className="flex justify-between items-center mb-4">
          {queueInfo.isHidden ? (
            <div className="flex items-center gap-1">
              <HiClipboardList />
              <h4>{title}</h4>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BiMessageSquareEdit size={20} />
              </div>
              <form onSubmit={onQueueUpdateSubmit}>
                <BoardInput
                  refer={queueInputRef}
                  isHidden={queueInfo.isHidden}
                  name="queueTitle"
                  placeholder="set a new title..."
                  value={queueInfo.title}
                  onChange={(e) =>
                    setQueueInfo((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="pl-10 rounded-lg"
                />
              </form>
            </div>
          )}

          <Dropdown
            label=""
            dismissOnClick={true}
            inline={true}
            placement="bottom-end"
          >
            <Dropdown.Item
              onClick={() =>
                setQueueInfo((prev) => ({ ...prev, isHidden: false }))
              }
            >
              Edit Queue
            </Dropdown.Item>
            <Dropdown.Item onClick={onDeleteQueue}>Delete Queue</Dropdown.Item>
          </Dropdown>
        </div>

        <ul className="flex flex-col gap-2 mb-4">
          {notes.map((note) => (
            <Note key={note.id} {...note} />
          ))}
        </ul>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MdNoteAdd size={20} />
          </div>
          <form onSubmit={onTaskCreateSubmit}>
            <BoardInput
              isHidden={false}
              id="input-group-1"
              className="pl-10 rounded-lg"
              placeholder="add new note..."
              value={taskInfo.title}
              onChange={(e) =>
                setTaskInfo((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </form>
        </div>
      </li>
    </>
  );
};

export default Queue;
