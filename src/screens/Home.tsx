import { Outlet } from "react-router-dom";

import Nav from "../components/common/Nav";

const Home = () => {
  return (
    <div className="bg-gray-100 w-full">
      <Nav />
      <main className="mx-2 md:mx-7 xl:mx-9 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Home;
