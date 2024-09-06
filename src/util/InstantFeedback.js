import { easyGet } from "../util/EasyFetch";

export default async function InstantFeedback(type, value) {
    try {
      let response;
      if (type === "email") {
        response = await easyGet(`/user/checkuseremail/${value}`, null);
      } else if (type === "nickname") {
        response = await easyGet(`/user/checkuserid/${value}`, null);
      }
      if (response) {
        return true;
      } return false;
    } catch (error) {
      console.error(`Fehler bei der Überprüfung des ${type}:`, error);
      return false;
    }
  }

  // return (
  //   <div>
  //     {loading ? (
  //       <span>Prüfung läuft...</span>
  //     ) : isAvailable ? (
  //       type === "email" ? (
  //         <span style={{ color: "green" }}>Email ist verfügbar</span>
  //       ) : (
  //         <span style={{ color: "green" }}>Nickname ist verfügbar</span>
  //       )
  //     ) : isAvailable === false ? (
  //       type === "email" ? (
  //         <span style={{ color: "red" }}>
  //           Diese email Adresse existiert bereits
  //         </span>
  //       ) : (
  //         <span style={{ color: "red" }}>
  //           Dieser Nickname existiert bereits
  //         </span>
  //       )
  //     ) : null}
  //   </div>
  // );
