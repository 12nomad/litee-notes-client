import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export interface IUser {
  id: number;
  username: string;
}

interface IUserContext extends IUser {
  setUser: Dispatch<SetStateAction<IUser>>;
}

const initialState = {
  id: 0,
  username: "",
  setUser: () => {},
};

const UserContext = createContext<IUserContext>(initialState);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<IUser>({
    id: 0,
    username: "",
  });

  return (
    <UserContext.Provider value={{ ...user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
