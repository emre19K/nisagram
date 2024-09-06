import React, { useState } from "react";
import { easyGet, easyPost } from "../util/EasyFetch";
import { useAlert } from "../util/CustomAlert";
import logo from "../static/images/logo.png";
import { Link } from "react-router-dom";


export default function ForgotPassword(){

    const [inputMail, setInputMail] = useState("")
    const [error, setError] = useState("")
    const { showAlert } = useAlert()

     // Email Format Regex
  const regexEmail = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
  );

    async function validateGivenEmail() {
        // handleOnClick()
        if (!inputMail) {
          setError("Bitte geben Sie eine E-Mail an.");
          return;
        }

        if(!regexEmail.test(inputMail)){
            setError("Ungültige E-Mail.")
            return;
        }

        try {
          let isValid = await easyGet(`user/checkuseremail/${inputMail}`);
          if (!isValid) {
            handleOnClick()
            return;
          }
          setError("E-Mail existiert nicht.");
          return;
        } catch (err) {
          setError(err);
        }
      }

   async function handleOnClick(){

        let body = {
            email: inputMail
        }

        try{
            await easyPost("/user/forgotpassword", body)
            showAlert("E-Mail zur Passwortwiederherstellung wurde versendet!")
        }catch(err){ 
            setError(err)
        }
    }

    return(
        <div className="login-container">
        <div className="login-container2">
            <img src={logo} alt="Logo" className="login-logo" />
            <h1 className="text-24 flex justify-center font-light font-josefine">
                Passwort vergessen
            </h1>
            <div>
                <input
                    type="email"
                    onChange={(e) => setInputMail(e.target.value)}
                    className="login-input text-white mb-4 pl-3 hover:bg-lightGray"
                    placeholder="E-Mail"
                />
            </div>
            <div className="flex justify-center">
                <button
                    onClick={validateGivenEmail}
                    className="w-48 py-2 text-white bg-lila hover:bg-lilaLight rounded-button grid content-center font-josefine font-light"
                >
                    E-Mail anfordern
                </button>
            </div>
            {error && <p className="text-red flex justify-center font-josefine">{error}</p>}
            <Link className="flex justify-center hover:underline font-josefine" to="/accounts/login">Zurück</Link>
        </div>
    </div>
    )
}