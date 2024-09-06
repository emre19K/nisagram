// Email Format Regex
export const regexEmail = new RegExp(
  "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
);

// Nickname darf nur Buchstaben und Zahlen beinhalten
export const regexNickname = new RegExp("^[a-zA-Z0-9]+$");

// Mindestens 8 Zeichen -> davon mindestens 2 Zahlen
export const regexPassword = new RegExp("^(?=.*[0-9].*[0-9]).{8,}$");

export function RegexValidationNickname(nickname) {
  if (!regexNickname.test(nickname)) {
    return false
  }
  return true
}

export function RegexValidationPassword(password) {
  if (!regexPassword.test(password)) {
    return false
  }
  return true
}

export function RegexValidationEmail(email) {
  if (!regexEmail.test(email)) {
    return false
  }
  return true;
}

// Überprüft, ob die Validierung fehlgeschlagen ist
export function RegexValidationCheck(email, nickname, password) {
  if (
    !regexEmail.test(email) ||
    !regexNickname.test(nickname) ||
    !regexPassword.test(password)
  )
    return null;
}
