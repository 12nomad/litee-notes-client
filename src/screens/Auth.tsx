import { Outlet, Navigate } from "react-router-dom";
import Bg from "../assets/bg.png";
import { MdStickyNote2 } from "react-icons/md";
import useUser from "../hooks/useUser";
import { useUserContext } from "../context/user/user.context";

const Auth = () => {
  const { id, username } = useUserContext();

  if (username && id > 0) return <Navigate to="/" replace />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
      <div className="bg-sky-700 grid place-items-center text-center p-6">
        <div>
          <h2 className="flex items-center justify-center gap-1 text-4xl mb-2 lg:mb-6 text-white">
            <MdStickyNote2 />
            <span className="font-lobster underline">Litee Notes</span>{" "}
          </h2>
          <img src={Bg} alt="background" className="w-60 mx-auto" />
          <h4 className="text-xl lg:mt-4 text-white">
            A simple realtime note sharing app for your team.
          </h4>
        </div>
      </div>
      <div className="bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
