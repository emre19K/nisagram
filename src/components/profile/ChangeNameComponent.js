import React, { useState } from "react";
import { easyPatch } from "../../util/EasyFetch";
import { getLoginCookie } from "../../util/LoginCookie";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../util/CustomAlert";
import { jwtDecode } from "jwt-decode";
import { handleOnNicknameChange } from "../../util/CredentialsOnChange";

export default function ChangeNameComponent({ userID }) {
  const [inputUserID, setInputUserID] = useState(userID || "");
  const [inputUserIdAvailable, setInputUserIdAvailable] = useState("");
  const [inputUserIdError, setInputUserIdError] = useState("");
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [error, setError] = useState("");
  const token = getLoginCookie();
  const _id = jwtDecode(token)._id;

  async function handleOnClick() {
    if (error || inputUserID == userID) {
      return;
    }

    let credentials = {
      userID: inputUserID,
    };

    try {
      let updatedUser = await easyPatch(`/user/${_id}`, credentials, token);

      if (!updatedUser) {
        setError("Nickname nicht verfügbar!");
        return;
      }
      navigate(`/profile/${_id}`);
      showAlert("Nickname erfolgreich aktualisiert!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center">
        <input
          required
          onChange={(e) =>
            handleOnNicknameChange(
              e,
              setInputUserID,
              setInputUserIdError,
              setInputUserIdAvailable
            )
          }
          value={inputUserID}
          className="auth-input text-white w-1/2 dark:text-dark font-josefine ml-4 pl-3"
        />
        <button onClick={handleOnClick}>
          <p className="hover:text-lila md:ml-48 2xl:ml-60 font-bold ml-2 md:mr-4">Nickname ändern</p>
        </button>
      </div>
      <div className="relative w-full">
        {inputUserIdAvailable && (
          <p className="absolute ml-10 text-green mt-0 pl-1">
            {inputUserIdAvailable}
          </p>
        )}
        {inputUserIdError && (
          <p className="absolute ml-9 text-red mt-0 pl-1">{inputUserIdError}</p>
        )}
      </div>
    </div>
  );
}
