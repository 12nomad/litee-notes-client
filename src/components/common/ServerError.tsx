import React from "react";

interface IServerError {
  serverError: string;
}

const ServerError = ({ serverError }: IServerError) => {
  if (!serverError) return null;

  return (
    <p role="alert" className="text-xs text-rose-700 mt-2 font-bold">
      <sup>*</sup> {serverError}
    </p>
  );
};

export default ServerError;
