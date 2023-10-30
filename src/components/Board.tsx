import { Navigate, useParams } from "react-router-dom";
import { useState, FormEvent, useRef } from "react";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoIosAddCircleOutline, IoMdWarning } from "react-icons/io";
import { Toast, Tooltip } from "flowbite-react";
import { BiMessageSquareEdit } from "react-icons/bi";

import useBoard from "../hooks/useBoard";
import Queue from "./Queue";
import Event from "../enums/event.enum";
import useOutsideClick from "../hooks/useOutsideClick";
import ErrorToast from "./common/ToastError";
import BoardSkeleton from "./common/BoardSkeleton";
import BoardInput from "./common/BoardInput";

const Board = () => {
  const { boardId } = useParams();
  if (!boardId) return <Navigate to="/not-found" />;

  const {
    board,
    boardLoading,
    boardError,
    queues,
    socketRef,
    socketError,
    setSocketState,
  } = useBoard(boardId);
  const [queueInfo, setQueueInfo] = useState({
    title: board?.title || "",
    isHidden: true,
  });
  const [boardInfo, setBoardInfo] = useState({
    title: "",
    isHidden: true,
  });
  const boardInputRef = useRef<HTMLInputElement>(null);

  useOutsideClick(
    () => setBoardInfo((prev) => ({ ...prev, isHidden: true })),
    boardInputRef
  );

  const onBoardUpdateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!boardInfo.title || boardInfo.title === board?.title) return;

    socketRef?.emit<`${Event}`>("BOARD_UPDATE", {
      boardId: boardId.toString(),
      title: boardInfo.title,
    });
    setBoardInfo({ isHidden: true, title: board?.title || "" });
  };

  const onQueueCreateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!queueInfo.title) return;

    socketRef?.emit<`${Event}`>("QUEUE_CREATE", {
      boardId: boardId.toString(),
      title: queueInfo.title,
    });

    setQueueInfo((prev) => ({ ...prev, title: "" }));
  };

  if (boardLoading) return <BoardSkeleton />;

  if (!boardLoading && boardError)
    return (
      <h4 role="alert" className="text-large text-rose-700 mt-2 font-bold">
        {boardError}
      </h4>
    );

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Tooltip content="Edit board title..." placement="top">
          <h2 className=" flex items-center gap-1 text-2xl ">
            <MdOutlineSpaceDashboard />{" "}
            {boardInfo.isHidden ? (
              <span
                className="cursor-pointer"
                onClick={() =>
                  setBoardInfo((prev) => ({ ...prev, isHidden: false }))
                }
              >
                {board?.title}
              </span>
            ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BiMessageSquareEdit size={20} />
                </div>
                <form onSubmit={onBoardUpdateSubmit}>
                  <BoardInput
                    refer={boardInputRef}
                    isHidden={boardInfo.isHidden}
                    name="boardTitle"
                    placeholder="set a new title..."
                    value={boardInfo.title}
                    onChange={(e) =>
                      setBoardInfo((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="pl-10 rounded-l"
                  />
                </form>
              </div>
            )}
          </h2>
        </Tooltip>
      </div>

      <ul className="flex flex-wrap gap-4 items-start w-full mt-4">
        {queues.map((el) => (
          <Queue
            key={el.id}
            socketRef={socketRef}
            setSocketState={setSocketState}
            {...el}
          />
        ))}

        <li
          onClick={() =>
            setQueueInfo((prev) => ({ ...prev, isHidden: false, title: "" }))
          }
          className="cursor-pointer w-full md:w-[308px] flex flex-col items-center p-4 bg-white border border-gray-200 rounded-md shadow hover:bg-gray-100 "
        >
          <div className="flex items-center gap-2">
            <IoIosAddCircleOutline size={25} />
            <h4 className="tracking-tight text-gray-900 ">Create a new list</h4>
          </div>
          <form onSubmit={onQueueCreateSubmit}>
            <BoardInput
              isHidden={queueInfo.isHidden}
              name="title"
              value={queueInfo.title}
              onChange={(e) =>
                setQueueInfo((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="add a title..."
              className="mt-2"
            />
          </form>
        </li>
      </ul>

      {socketError && (
        <ErrorToast error={socketError} setSocketState={setSocketState} />
      )}
    </div>
  );
};

export default Board;
