import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../static/images/logo.png";
import { getLoginCookie } from "../../util/LoginCookie";
import { jwtDecode } from "jwt-decode";
import LogoutComponent from "../auth/LogoutComponent";
import {
  CiLogout,
  CiCirclePlus,
  CiHome,
  CiSearch,
  CiImageOn,
  CiSettings,
} from "react-icons/ci";
import { GoHome } from "react-icons/go";
import { PiUserCircle } from "react-icons/pi";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("/");
  const location = useLocation();
  const token = getLoginCookie();
  const _id = token ? jwtDecode(token)._id : null;

  React.useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const getLinkClasses = (path) => {
    return `nav-link list-none ${
      activeLink === path ? "underline text-lila font-bold" : ""
    }`;
  };

  const getIconClasses = (path) => {
    return `${activeLink === path ? "text-lila" : "text-black"}`;
  };

  return (
    <>
      <ul className="nav-fixed list-none p-12 m-0 flex flex-col items-start space-y-0.5 hidden md:flex">
        <Link to="/" onClick={() => setActiveLink("/")}>
          <img src={logo} alt="Logo" className="mb-1" />
        </Link>

        <Link to="/" onClick={() => setActiveLink("/")}>
          <div className="nav-item flex items-center group hover:text-lila">
            <CiHome className={`icon ${getIconClasses("/")}`} size={24} />
            <li className={`link ${getLinkClasses("/")}`}>Home</li>
          </div>
        </Link>

        <Link to="/search" onClick={() => setActiveLink("/search")}>
          <div className="nav-item flex items-center group hover:text-lila">
            <CiSearch
              className={`icon ${getIconClasses("/search")}`}
              size={24}
            />
            <li className={`link ${getLinkClasses("/search")}`}>Suche</li>
          </div>
        </Link>

        <Link
          to={`/profile/${_id}`}
          onClick={() => setActiveLink(`/profile/${_id}`)}
        >
          <div className="nav-item flex items-center group hover:text-lila">
            <PiUserCircle
              className={`icon ${getIconClasses(`/profile/${_id}`)}`}
              size={24}
            />
            <li className={`link ${getLinkClasses(`/profile/${_id}`)}`}>
              Profil
            </li>
          </div>
        </Link>

        <Link to="/posts/create" onClick={() => setActiveLink("/posts/create")}>
          <div className="nav-item flex items-center group hover:text-lila">
            <CiImageOn
              className={`icon ${getIconClasses("/posts/create")}`}
              size={24}
            />
            <li className={`link ${getLinkClasses("/posts/create")}`}>
              Erstellen
            </li>
          </div>
        </Link>

        <Link to="/settings" onClick={() => setActiveLink("/settings")}>
          <div className="nav-item flex items-center group hover:text-lila">
            <CiSettings
              className={`icon ${getIconClasses("/settings")}`}
              size={24}
            />
            <li className={`link ${getLinkClasses("/settings")}`}>
              Einstellungen
            </li>
          </div>
        </Link>

        <div className="nav-item flex items-center group cursor-pointer hover:text-lila">
          <CiLogout className="icon text-black" size={24} />
          <LogoutComponent className="link list-none" />
        </div>
      </ul>

      {/* Icon Bar Mobile*/}
      <div
        className="fixed bottom-0 w-full bg-white shadow-lg md:hidden"
        style={{ zIndex: 1000 }}
      >
        <div className="flex justify-around py-2">
          <Link to="/" onClick={() => setActiveLink("/")}>
            <div >
              <GoHome className={`text-2xl ${getIconClasses("/")}`} size={33} />
            </div>
          </Link>

          <Link to="/search" onClick={() => setActiveLink("/search")}>
            <div className="nav-item  flex items-center group hover:text-lila ">
              <CiSearch
                className={`icon ${getIconClasses("/search")}`}
                size={33}
              />
            </div>
          </Link>

          <Link
            to="/posts/create"
            onClick={() => setActiveLink("/posts/create")}
          >
            <div>
              <CiCirclePlus
                className={`text-2xl ${getIconClasses("/posts/create")}`}
                size={33}
              />
            </div>
          </Link>

          <Link to="/settings" onClick={() => setActiveLink("/settings")}>
            <div>
              <CiSettings
                className={`text-2xl ${getIconClasses("/settings")}`}
                size={33}
              />
            </div>
          </Link>

          <Link
            to={`/profile/${_id}`}
            onClick={() => setActiveLink(`/profile/${_id}`)}
          >
            <div >
              <PiUserCircle
                className={`text-2xl ${getIconClasses(`/profile/${_id}`)}`}
                size={33}
              />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
