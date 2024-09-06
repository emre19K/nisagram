import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { easyPost } from "../util/EasyFetch";
import { useAlert } from "../util/CustomAlert";
import logo from "../static/images/logo.png";

export default function ResetPasswordPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const [error, setError] = useState("");
  const [inputPassword1, setInputPassword1] = useState("");
  const [inputPassword2, setInputPassword2] = useState("");
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Mindestens 8 Zeichen -> davon mindestens 2 Zahlen
  const regexPassword = new RegExp("^(?=.*[0-9].*[0-9]).{8,}$");

  useEffect(() => {
    token ? null : navigate("/forbidden");
  }, []);

  function validateInput() {
    if (inputPassword1 !== inputPassword2) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }
    if (!regexPassword.test(inputPassword2)) {
      setError(
        "Das neue Passwort muss mindestens 8 Zeichen, davon 2 Zahlen beinhalten."
      );
      return;
    }
    handleOnClick();
  }

  async function handleOnClick() {
    let email = jwtDecode(token).email;

    let body = {
        password: inputPassword2,
        email: email 
    }
    try{
        await easyPost(`/user/resetpassword?token=${token}`, body)
        navigate("/accounts/login")
        showAlert("Passwort zurückgesetzt!")
    }catch(err){
        setError(err)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md mx-auto mt-10 space-y-6">
        <img src={logo} alt="Logo" className="mx-auto" />
        <h1 className="text-2xl flex justify-center font-light font-josefine text-center">
          <p>Bitte geben Sie ihr neues Passwort ein:</p>
        </h1>
        <input
          type="password"
          onChange={(e) => setInputPassword1(e.target.value)}
          className="auth-input text-white font-josefine w-full pl-3 font-light"
          placeholder="Neues Passwort"
        />
        <input
          type="password"
          onChange={(e) => setInputPassword2(e.target.value)}
          className="auth-input text-white font-josefine w-full pl-3 font-light"
          placeholder="Passwort bestätigen"
        />
        <div className="flex justify-center">
          <button
            className="w-48 py-2 text-white bg-lila rounded-button grid content-center font-josefine font-light"
            onClick={validateInput}
          >
            Passwort ändern
          </button>
        </div>
        {error && <p className="text-red text-center">{error}</p>}
      </div>
    </div>
  );
}
