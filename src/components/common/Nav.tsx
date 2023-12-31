import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { RiListSettingsLine, RiTeamLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { MdStickyNote2 } from "react-icons/md";

import { useUserContext } from "../../context/user/user.context";

const Nav = () => {
  const { username, setUser } = useUserContext();
  const navigate = useNavigate();

  const onSignOut = () => {
    localStorage.removeItem("notes_at");
    setUser({ id: 0, username: "" });
    navigate("/auth", { replace: true });
  };

  return (
    <Navbar fluid={true}>
      <div className="w-full max-w-screen-xl mx-2 md:mx-8 lg:mx-auto flex justify-between items-center lg:py-2">
        <Link
          to="/"
          className="flex items-center gap-1 text-sky-700 font-lobster"
        >
          <MdStickyNote2 size={25} />
          <span className="self-center whitespace-nowrap text-2xl  dark:text-white">
            Litee Notes
          </span>
        </Link>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            placement="bottom-end"
            inline={true}
            label={
              <Avatar
                alt="user avatar"
                img={() => <RiListSettingsLine size={20} />}
                rounded={true}
                className="text-sky-700 border-2 border-sky-700 rounded-full p-1"
              />
            }
          >
            <Dropdown.Header>
              <span className="text-sm flex items-center gap-2">
                <RiTeamLine size={15} /> {username}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={onSignOut}>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </Navbar>
  );
};

export default Nav;
