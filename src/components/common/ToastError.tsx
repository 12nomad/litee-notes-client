import { Toast } from "flowbite-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoMdWarning, IoMdCloseCircle } from "react-icons/io";
import { useBoardContext } from "../../context/board/board.context";

interface IErrorToast {
  setSocketState: Dispatch<
    SetStateAction<{
      socketLoading: boolean;
      socketError: string;
    }>
  >;
  error: string;
}

const ErrorToast = ({ error, setSocketState }: IErrorToast) => {
  const [popShow, setPopShow] = useState(false);

  useEffect(() => {
    setPopShow(true);
  }, [error]);

  const onToastClose = () => {
    setPopShow(false);
    setSocketState((prev) => ({ ...prev, socketError: "" }));
  };

  return (
    <Toast
      className={`${
        popShow ? "block" : "hidden"
      }  absolute right-1/2 top-0 translate-x-1/2 `}
    >
      <div className=" inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
        <IoMdWarning className="w-5 h-5" />
      </div>
      <div className="ml-3 text-sm font-normal ">{error}</div>
      <IoMdCloseCircle
        onClick={onToastClose}
        size={40}
        className="cursor-pointer "
      />
    </Toast>
  );
};

export default ErrorToast;
