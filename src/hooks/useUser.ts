import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import client from "../utils/axios.util";
import { IUser, useUserContext } from "../context/user/user.context";

const useUser = (): IUser | null => {
  const { setUser, ...rest } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    client
      .get<IUser>("/user")
      .then((res) => setUser(res.data))
      .catch((err) => {
        if (err instanceof AxiosError && err.response?.status === 401)
          return navigate("/auth");
        else throw new Error(err);
      });
  }, []);

  return rest;
};

export default useUser;
