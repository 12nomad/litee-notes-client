import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { UserProvider } from "./context/user/user.context";
import { BoardProvider } from "./context/board/board.context";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <UserProvider>
    <BoardProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BoardProvider>
  </UserProvider>
  // </React.StrictMode>
);
