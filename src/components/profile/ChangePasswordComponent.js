import React, { useState } from "react";
import { easyPatch, easyPost } from "../../util/EasyFetch";
import { getLoginCookie } from "../../util/LoginCookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../util/CustomAlert";
import { RegexValidationPassword } from "../../util/CredentialsRegex";

export default function ChangePasswordComponent() {
  const [currentInputPassword, setCurrentInputPassword] = useState("");
  const [inputPassword1, setInputPassword1] = useState("");
  const [inputPassword2, setInputPassword2] = useState("");
  const [error, setError] = useState("");

  const token = getLoginCookie();
  const _id = jwtDecode(token)._id;

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  async function validateGivenPasswords() {
    if (!inputPassword1 || !inputPassword2 || !currentInputPassword) {
      setError("Bitte füllen Sie alle Felder aus.");
      return;
    }
    if (inputPassword1 !== inputPassword2) {
      setError("Die beiden neuen Passwörter stimmten nicht überein.");
      return;
    }

    if (!RegexValidationPassword(inputPassword2)) {
      setError("Das neue Passwort muss mind. 8 Zeichen, davon 2 Zahlen beinhalten");
      return;
    }

    let body = {
      password: currentInputPassword,
    };

    try {
      let isValid = await easyPost("/user/checkpassword", body, token);
      if (isValid) {
        handleOnClick();
        return;
      }
      setError("Aktuelles Passwort inkorrekt.");
      return;
    } catch (err) {
      setError(err);
    }
  }

  async function handleOnClick() {
    let credentials = {
      password: inputPassword2,
    };

    try {
      let newUser = await easyPatch(`/user/${_id}`, credentials, token);
      if (newUser.userID) {
        navigate(`/profile/${_id}`);
        showAlert("Passwort erfolgreich aktualisiert!");
        return;
      }
      setError(newUser);
      return;
    } catch (error) {
      setError(error);
    }
  }

  return (
    <div className="flex justify-center mt-36">
      <div className="rounded-xl w-1/2 flex flex-col items-center justify-center settings-box">
        <input
          type="password"
          className="mt-12 w-full md:w-2/3 auth-input text-white font-josefine md:pl-3"
          placeholder="Altes Passwort"
          onChange={(e) => setCurrentInputPassword(e.target.value)}
        />
        <input
          type="password"
          className="mt-4 w-full md:w-2/3 auth-input text-white font-josefine md:pl-3"
          placeholder="Neues Passwort"
          onChange={(e) => setInputPassword1(e.target.value)}
        />
        <input
          type="password"
          className="mt-4 w-full md:w-2/3 auth-input text-white font-josefine md:pl-3"
          placeholder="Neues Passwort"
          onChange={(e) => setInputPassword2(e.target.value)}
        />
        {error && <p className="mt-2 text-red">{error}</p>}
        <button
          className="mt-8 mb-12 hover:text-lila font-bold"
          onClick={validateGivenPasswords}
        >
          Passwort ändern
        </button>
      </div>
    </div>
  );
}
