import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { easyPost, easyGet } from "../util/EasyFetch";
import React from "react";
import { setLoginCookie } from "../util/LoginCookie";
import logo from "../static/images/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    setError("");
    let credentials = {
      userID,
      password,
    };
    let data = await easyPost("/auth/login", credentials);
    if (data) {
      let isVerified = await easyGet(`/user/checkverification/${userID}`);
      if (!isVerified) {
        setError("Bitte verifizieren Sie ihre E-Mail.");
        return;
      }
      setLoginCookie(data.data.token);
      navigate("/");
    } else {
      setError("Anmeldedaten inkorrekt. Bitte versuchen Sie es erneut.");
    }
  }

  return (
    <div className="login-container flex items-center justify-center h-screen relative">
      <div className="login-container2 max-w-md mx-auto mt-10 space-y-6 relative">
        <img src={logo} alt="Logo" className="login-logo mx-auto" />
        <h1 className="text-30 flex justify-center font-light font-josefine">
          Login
        </h1>
        <div>
          <input
            type="text"
            onChange={(e) => setUserID(e.target.value)}
            className="login-input auth-input hover:bg-lightGray text-white font-josefine w-full pl-3 font-light"
            placeholder="Benutzername"
          />
        </div>
        <div>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="login-input auth-input hover:bg-lightGray text-white font-josefine w-full pl-3 font-light"
            placeholder="Passwort"
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleLogin}
            className="w-48 py-2 text-white bg-lila hover:bg-lilaLight rounded-button grid content-center font-josefine font-light"
          >
            Einloggen
          </button>
        </div>

        {error && (
          <div className="absolute top-full mt-2 w-full flex justify-center items-center">
            <p className="text-red text-center font-josefine">{error}</p>
          </div>
        )}

        <Link
          to="/forgotpassword"
          className="text-black hover:underline flex justify-center font-josefine font-light text-16"
        >
          Passwort vergessen
        </Link>
        <p className="text-black flex mt-8 justify-center font-josefine font-medium fontsize">
          Du hast noch kein Account ?
        </p>

        <Link
          to="/accounts/register"
          className="text-black -mt-0 hover:underline flex justify-center font-josefine font-bold"
        >
          Registrieren
        </Link>
      </div>
    </div>
  );
}
