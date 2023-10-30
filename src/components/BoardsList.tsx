import { useState, MouseEvent, FormEvent, ChangeEvent } from "react";
import { AxiosError } from "axios";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineSpaceDashboard } from "react-icons/md";

import { IResponse } from "../interfaces/response.interface";
import client from "../utils/axios.util";
import useBoards from "../hooks/useBoards";
import BoardSkeleton from "./common/BoardSkeleton";
import BoardInput from "./common/BoardInput";
import ServerError from "./common/ServerError";
import { useBoardContext } from "../context/board/board.context";
import Event from "../enums/event.enum";

interface IBoard {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  ownerId: number;
}

const BoardsList = () => {
  const { boards, dispatch, boardsLoading, boardsError } = useBoards();
  const [boardInfo, setBoardInfo] = useState({
    title: "",
    isHidden: true,
  });
  const [boardsPostError, setBoardsPostError] = useState("");
  const { socketRef } = useBoardContext();
  const navigate = useNavigate();

  const onClick = (boardId: number) => {
    socketRef?.emit<`${Event}`>("BOARD_JOIN", { boardId });
    return navigate(`/boards/${boardId}`);
  };

  if (boardsLoading)
    return (
      <>
        <h2 className="mb-4">Your boards:</h2>
        <BoardSkeleton />
      </>
    );

  if (!boardsLoading && boardsError)
    return (
      <>
        <h2 className="mb-4">Your boards:</h2>
        <h4 role="alert" className="text-large text-rose-700 mt-2 font-bold">
          {boardsError}
        </h4>
      </>
    );

  const onSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      if (!boardInfo.title) return;

      setBoardInfo((prev) => ({ ...prev, title: "" }));
      const {
        data: { data: newBoard },
      } = await client.post<IResponse<IBoard>>("/boards", {
        title: boardInfo.title,
      });

      if (!newBoard) return;

      dispatch({ type: "ADD_BOARD", payload: { board: newBoard } });
      setBoardsPostError("");
    } catch (error) {
      if (error instanceof AxiosError) setBoardsPostError(error.response?.data);
    }
  };

  return (
    <>
      <h2 className="mb-4 text-2xl">Boards:</h2>

      <ul className="flex flex-wrap gap-4">
        {boards.map((board) => (
          <li
            key={board.id}
            className="w-full md:w-[308px] h-[153px] grid place-items-center p-6 bg-white border border-gray-200 rounded-md shadow hover:bg-gray-50"
          >
            <div onClick={() => onClick(board.id)}>
              <h6 className="cursor-pointer text-lg tracking-tight text-gray-900 flex items-center gap-1">
                <MdOutlineSpaceDashboard />
                {board.title}
              </h6>
            </div>
          </li>
        ))}

        <li
          onClick={() => setBoardInfo((prev) => ({ ...prev, isHidden: false }))}
          className="cursor-pointer w-full md:w-[308px] h-[153px] flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-md shadow hover:bg-gray-50"
        >
          <IoIosAddCircleOutline size={25} />
          <h6 className="text-lg tracking-tight text-gray-900">
            Create a new board
          </h6>
          <form onSubmit={onSubmit}>
            <BoardInput
              isHidden={boardInfo.isHidden}
              name="title"
              value={boardInfo.title}
              onChange={(e) =>
                setBoardInfo((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="add a title..."
              className="mt-2"
            />
          </form>
          <ServerError serverError={boardsPostError} />
        </li>
      </ul>
    </>
  );
};

export default BoardsList;
