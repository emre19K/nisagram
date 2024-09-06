import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { easyGet } from "../util/EasyFetch";
import { useAlert } from "../util/CustomAlert";

export default function VerificationComplete() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const navigate = useNavigate()
  const { showAlert } = useAlert()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await easyGet(`/auth/verify?token=${token}`);
        navigate("/accounts/login")
        showAlert("E-Mail erfolgreich verifiziert!")
      } catch (error) {
        navigate("/forbidden")
      }
    };

    verifyEmail();
  }, []);
}
