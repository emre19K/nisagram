import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: "/" });

const current = new Date();
const nextYear = new Date();

nextYear.setFullYear(current.getFullYear() + 1);

export function setLoginCookie(token) {
  cookies.set(
    "loginCookie",
    // statt { token } -> token, da ein objekt unnötig ist. es gibt nur einen wert.
    token,
    {
      path: "/",
      expires: nextYear,
    }
  );
}

export function getLoginCookie() {
  return cookies.get("loginCookie");
}

export function removeLoginCookie() {
  cookies.remove("loginCookie");
}
