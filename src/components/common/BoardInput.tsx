import React, { ChangeEvent, RefObject } from "react";

interface IBoardInput {
  refer?: RefObject<HTMLInputElement>;
  type?: string;
  id?: string;
  className?: string;
  isHidden?: boolean;
  name?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const BoardInput = ({
  className,
  isHidden,
  name,
  onChange,
  placeholder,
  type = "text",
  value,
  refer,
  id,
}: IBoardInput) => {
  return (
    <input
      ref={refer}
      id={id}
      type={isHidden ? "hidden" : type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 ${className}`}
    />
  );
};

export default BoardInput;
