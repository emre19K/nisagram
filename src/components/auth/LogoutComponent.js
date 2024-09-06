import { removeLoginCookie } from "../../util/LoginCookie";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function LogoutComponent() {
  const navigate = useNavigate();

  function handleLogout() {
    removeLoginCookie();
    navigate("/");
  }

  return (
      <button
        
        onClick={handleLogout}
        className="nav-link"
      >
        Abmelden
      </button>
  );
}
