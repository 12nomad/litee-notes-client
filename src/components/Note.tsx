import { FormEvent, useEffect, useState } from "react";
import { Tooltip, Label } from "flowbite-react";
import { RiEditCircleFill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";

import { INote } from "../context/board/board.interface";
import { useBoardContext } from "../context/board/board.context";
import Event from "../enums/event.enum";

const Note = ({ title, content, id, queueId }: INote) => {
  const { queues, socketRef, board } = useBoardContext();
  const [modalState, setModalState] = useState({
    showModal: false,
    editModal: false,
  });
  const [noteInfo, setNoteInfo] = useState({
    title: title,
    description: content || "",
    queueId,
    currentQueueId: queueId,
  });

  useEffect(() => {
    setNoteInfo((prev) => ({ ...prev, title, description: content || "" }));
  }, [title, content]);

  const onClose = () => {
    setNoteInfo({
      title: title,
      description: content || "",
      queueId,
      currentQueueId: queueId,
    });
    setModalState({ editModal: false, showModal: false });
  };

  const onNoteUpdateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!noteInfo.title) return;

    socketRef?.emit<`${Event}`>("NOTE_UPDATE", {
      queueId: noteInfo.queueId.toString(),
      currentQueueId: noteInfo.currentQueueId.toString(),
      title: noteInfo.title,
      content: noteInfo.description,
      noteId: id.toString(),
      boardId: board?.id.toString(),
    });

    setNoteInfo({
      title: title,
      description: content || "",
      queueId,
      currentQueueId: queueId,
    });
    setModalState({ editModal: false, showModal: false });
  };

  const onDeleteNote = () => {
    if (!window.confirm("Delete the note?")) return;

    socketRef?.emit<`${Event}`>("NOTE_DELETE", {
      noteId: id.toString(),
      boardId: board?.id.toString(),
      queueId: queueId.toString(),
    });
    setNoteInfo({
      title: title,
      description: content || "",
      queueId,
      currentQueueId: queueId,
    });
    setModalState({ editModal: false, showModal: false });
  };

  return (
    <>
      <li
        className="bg-sky-50 w-full rounded-md py-2 px-4 mx-auto cursor-pointer"
        onClick={() => setModalState((prev) => ({ ...prev, showModal: true }))}
      >
        {title}
      </li>

      <div>
        <div
          className={`${
            modalState.showModal ? "block" : "hidden"
          }  fixed top-0 left-0 z-40 w-full h-full bg-slate-400/40`}
        ></div>

        <div
          className={`${
            modalState.showModal ? "grid" : "hidden"
          } place-items-center fixed top-0 left-0 right-0 z-50 w-full p overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}
        >
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow ">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                data-modal-hide="authentication-modal"
                onClick={onClose}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>

              <div className="px-12 pt-16 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-medium text-gray-900">
                    Your note
                  </h3>

                  <div className="flex items-center gap-2">
                    <Tooltip content="Edit Note" placement="top">
                      <RiEditCircleFill
                        className="text-sky-700 cursor-pointer"
                        size={20}
                        onClick={() =>
                          setModalState((prev) => ({
                            ...prev,
                            editModal: true,
                          }))
                        }
                      />
                    </Tooltip>
                    <Tooltip content="Delete Note" placement="top">
                      <TiDelete
                        className="cursor-pointer text-rose-700"
                        size={25}
                        onClick={onDeleteNote}
                      />
                    </Tooltip>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={onNoteUpdateSubmit}>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="title" value="Title" />
                    </div>
                    <input
                      type="text"
                      id="title"
                      value={noteInfo.title}
                      disabled={!modalState.editModal}
                      onChange={(e) =>
                        setNoteInfo((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 "
                    />
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="description" value="Description" />
                    </div>
                    <textarea
                      id="description"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 "
                      placeholder="Write your thoughts here..."
                      disabled={!modalState.editModal}
                      value={noteInfo.description}
                      onChange={(e) => {
                        setNoteInfo((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }));
                      }}
                    ></textarea>
                  </div>

                  {modalState.editModal && (
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="move" value="Move current note to..." />
                      </div>
                      <select
                        id="move"
                        name="move"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 "
                        value={noteInfo.queueId}
                        onChange={(e) =>
                          setNoteInfo((prev) => ({
                            ...prev,
                            queueId: +e.target.value,
                          }))
                        }
                      >
                        {queues.map((queue) => (
                          <option key={queue.id} value={queue.id}>
                            {queue.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {modalState.editModal && (
                    <button
                      type="submit"
                      className="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Update Note
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Note;
