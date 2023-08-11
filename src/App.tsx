import { Route, Routes } from "react-router-dom";

import Auth from "./screens/Auth";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import NotFound from "./components/common/NotFound";
import Home from "./screens/Home";
import Board from "./components/Board";
import Private from "./screens/Private";
import BoardsList from "./components/BoardsList";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<Private />}>
          <Route path="/" element={<Home />}>
            <Route index element={<BoardsList />} />
            <Route path="boards/:boardId" element={<Board />} />
          </Route>
        </Route>
        <Route path="/auth" element={<Auth />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
