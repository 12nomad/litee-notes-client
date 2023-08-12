import { Navigate, Outlet } from "react-router-dom";

import useUser from "../hooks/useUser";

const Private = () => {
  const user = useUser();

  return user && user.id > 0 ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default Private;
