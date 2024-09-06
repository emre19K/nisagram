import {
  RegexValidationEmail,
  RegexValidationNickname,
  RegexValidationPassword,
} from "../util/CredentialsRegex";

import InstantFeedback from "../util/InstantFeedback";

export async function handleOnNicknameChange(
  e,
  setNickname,
  setNicknameError,
  setNicknameAvailable
) {
  let value = e.target.value;
  setNickname(value);
  let isValidRegex = RegexValidationNickname(value);
  if (!isValidRegex) {
    setNicknameError("Der Nickname darf keine Sonderzeichen beinhalten");
    setNicknameAvailable("");
    if (value === "") {
      setNicknameError("");
      setNicknameAvailable("");
    }
    return;
  }

  let isAvailable = await InstantFeedback("nickname", value);

  if (!isAvailable) {
    setNicknameError("Dieser Nickname existiert bereits");
    setNicknameAvailable("");
    return;
  }
  setNicknameError("");
  setNicknameAvailable("Nickname verfügbar");
}

export async function handleOnEmailChange(
  e,
  setEmail,
  setEmailError,
  setEmailAvailable
) {
  let value = e.target.value;
  setEmail(value);
  let isValidRegex = RegexValidationEmail(value);
  if (!isValidRegex) {
    setEmailError("Ungültiges E-Mail format");
    setEmailAvailable("");
    if (value === "") {
      setEmailError("");
      setEmailAvailable("");
    }
    return;
  }

  let isAvailable = await InstantFeedback("email", value);

  if (!isAvailable) {
    setEmailError("Diese E-Mail ist bereits vergeben");
    setEmailAvailable("");
    return;
  }
  setEmailError("");
  setEmailAvailable("E-Mail verfügbar");
}

export async function handleOnPasswordChange(e, setPassword, setPasswordError) {
  let value = e.target.value;
  setPassword(value);
  let isValidRegex = RegexValidationPassword(value);
  if (!isValidRegex) {
    setPasswordError(
      "Das Passwort muss mind. 8 Zeichen, davon 2 Zahlen beinhalten"
    );
    if (value === "") {
      setPasswordError("");
    }
    return;
  }
  setPasswordError("");
}
