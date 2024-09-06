import { useNavigate } from "react-router-dom";
import HomeComponent from "../components/page-components/HomeComponent";
import { getLoginCookie } from "../util/LoginCookie";
import React, { useEffect } from "react";
// import Navigationsleiste from "../components/Navigationsleiste";

/**
 * Die HomePage. Nimmt den Token aus dem Login Cookie und checkt ob es einen gibt ( null oder token ).
 * Wenn es einen Token gibt -> User ist eingeloggt, zeige HomePage
 * Ansonsten -> User nicht eingeloggt, zeige LoginComponent.
 *
 */
export default function Home() {
  const token = getLoginCookie();
  const navigate = useNavigate();

  useEffect(() => {
    !token ? navigate("/accounts/login") : null;
  });

  return <HomeComponent />;
}
