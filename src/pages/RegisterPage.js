import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { easyPost } from "../util/EasyFetch";
import React from "react";
import logo from "../static/images/logo.png";
import { useAlert } from "../util/CustomAlert";
import {
  regexEmail,
  regexNickname,
  regexPassword,
} from "../util/CredentialsRegex";
import {
  handleOnEmailChange,
  handleOnNicknameChange,
  handleOnPasswordChange,
} from "../util/CredentialsOnChange";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [emailAvailable, setEmailAvailable] = useState("");
  const [nicknameAvailable, setNicknameAvailable] = useState("");

  const [error, setError] = useState("");

  const { showAlert } = useAlert();

  async function handleRegister() {
    if (emailError || passwordError || nicknameError) return;

    // Fortfahren mit der Registrierung, wenn die Validierung erfolgreich ist
    let credentials = {
      email,
      password,
      userID: nickname,
    };
    try {
      const data = await easyPost("/auth/register", credentials);
      let msg = "Registrierung erfolgreich! Verifizierungsmail versendet!";
      if (data.data) alertAfterNavigating("/accounts/login", msg);
    } catch (err) {
      setError(true);
    }
  }

  function alertAfterNavigating(route, msg) {
    navigate(route);
    setTimeout(() => showAlert(msg), 350);
  }

  function splitPasswordError(){

    let first= passwordError.substring(0, Math.ceil(passwordError.length /2 + 4 ))
    let second = passwordError.substring(Math.ceil(passwordError.length /2 + 5))

    return <div>
      <p className="text-red">{first}</p>
      <p className="text-red">{second}</p>
    </div>
  }

  return (
    <div className="login-container min-h-screen flex items-center justify-center  bg-white">
      <div className="login-container2 max-w-md mx-auto mt-10 space-y-4">
        <img src={logo} alt="Logo" className="login-logo mx-auto" />
        <div className="text-center">
          <h1 className="text-24 font-light font-josefine">Registrieren</h1>
        </div>
        <div className="registrieren-container">
          {emailAvailable ? (
            <p className="text-green">{emailAvailable}</p>
          ) : null}
          {emailError ? (
            <div>
              <p className="text-red truncate max-w-xs overflow-hidden">
                {emailError}
              </p>
            </div>
          ) : null}
          <input
            type="email"
            pattern={regexEmail}
            required
            onChange={(e) =>
              handleOnEmailChange(e, setEmail, setEmailError, setEmailAvailable)
            }
            title="Please enter a valid email address."
            className="registrieren"
            placeholder="E-Mail"
          />

          {nicknameAvailable ? (
            <p className="text-green">{nicknameAvailable}</p>
          ) : null}
          {nicknameError ? (
            <div>
              <p className="text-red truncate max-w-xs overflow-hidden">
                {nicknameError}
              </p>
            </div>
          ) : null}
          <input
            type="nickname"
            pattern={regexNickname}
            required
            onChange={(e) =>
              handleOnNicknameChange(
                e,
                setNickname,
                setNicknameError,
                setNicknameAvailable
              )
            }
            title="The nickname may only consist of letters and numbers."
            className="registrieren"
            placeholder="Benutzername"
          />

          {passwordError ? (
            splitPasswordError()
          ) : null}
          <input
            type="password"
            pattern={regexPassword}
            required
            onChange={(e) =>
              handleOnPasswordChange(e, setPassword, setPasswordError)
            }
            title="The password must be at least 8 characters long and contain at least 2 numbers."
            className="registrieren"
            placeholder="Passwort"
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleRegister}
            className="w-48 py-2 text-white bg-lila hover:bg-lilaLight rounded-button grid content-center font-josefine font-light hover:bg-lila "
          >
            Account Erstellen
          </button>
        </div>

        <p className="text-black mt-8 flex justify-center font-josefine">
          Account vorhanden ?
        </p>

        {error && <p className="mt-2 text-red-500">{error}</p>}
        <Link
          to="/accounts/login"
          className="text-black -mt-0 hover:underline flex justify-center font-josefine font-bold"
        >
          Jetzt einloggen
        </Link>
      </div>
    </div>
  );
}
