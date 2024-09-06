import React, { useState } from "react";
import EditProfileComponent from "../components/page-components/EditProfileComponent";
import ChangePasswordComponent from "../components/profile/ChangePasswordComponent";
import LogoutComponent from "../components/auth/LogoutComponent";
import DarkModeComponent from "../components/page-components/DarkModeComponent";
import useIsMobile from "../util/useIsMobile";
import { IoIosLock } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { MdShieldMoon } from "react-icons/md";

export default function Settings() {
  const [activeComponent, setActiveComponent] = useState("editProfile");
  const isMobile = useIsMobile();
  const [isDarkMode, setIsDarkMode] = useState(
    document.body.classList.contains("dark-mode")
  );

  const handleToggle = (darkMode) => {
    setIsDarkMode(darkMode);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      {!isMobile ? (
        <div className="md:w-1/5 w-full border-b md:border-b-0 md:border-r border-black flex flex-col">
          <h1 className="text-xl mb-4 mt-8 text-center font-bold">
            Einstellungen
          </h1>
          <div className="flex-1 flex flex-col">
            <button
              className={`mb-2 h-24 w-full ${
                activeComponent === "editProfile" ? "text-lila" : ""
              }`}
              style={{
                backgroundColor:
                  activeComponent === "editProfile"
                    ? isDarkMode
                      ? "#444444"
                      : "#EDECE8"
                    : "",
                color:
                  activeComponent === "editProfile"
                    ? isDarkMode
                      ? "#AC82FF"
                      : ""
                    : "",
              }}
              onClick={() => setActiveComponent("editProfile")}
            >
              Profil bearbeiten
            </button>
            <button
              className={`mb-2 h-24 w-full ${
                activeComponent === "changePassword" ? "text-lila" : ""
              }`}
              style={{
                backgroundColor:
                  activeComponent === "changePassword"
                    ? isDarkMode
                      ? "#444444"
                      : "#EDECE8"
                    : "",
                color:
                  activeComponent === "changePassword"
                    ? isDarkMode
                      ? "#AC82FF"
                      : ""
                    : "",
              }}
              onClick={() => setActiveComponent("changePassword")}
            >
              Passwort
            </button>
            <button
              className={`mb-2 h-24 w-full ${
                activeComponent === "darkMode" ? "text-lila" : ""
              }`}
              style={{
                backgroundColor:
                  activeComponent === "darkMode"
                    ? isDarkMode
                      ? "#444444"
                      : "#EDECE8"
                    : "",
                color:
                  activeComponent === "darkMode"
                    ? isDarkMode
                      ? "#AC82FF"
                      : ""
                    : "",
              }}
              onClick={() => setActiveComponent("darkMode")}
            >
              Dark Mode
            </button>
          </div>
          <div className="mt-auto mb-6 flex justify-center">
            <LogoutComponent />
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-xl mb-4 text-center font-bold">Einstellungen</h1>
          <div className="flex flex-row justify-center">
            <div className="m-4">
              <CgProfile
                onClick={() => setActiveComponent("editProfile")}
                style={{
                  fontSize: 40,
                  color:
                    activeComponent === "editProfile"
                      ? isDarkMode
                        ? "#AC82FF"
                        : "#C2A3FF"
                      : "",
                }}
              />
            </div>
            <div className="m-4">
              <IoIosLock
                onClick={() => setActiveComponent("changePassword")}
                style={{
                  fontSize: 40,
                  color:
                    activeComponent === "changePassword"
                      ? isDarkMode
                        ? "#AC82FF"
                        : "#C2A3FF"
                      : "",
                }}
              />
            </div>
            <div className="m-4">
              <MdShieldMoon
                onClick={() => setActiveComponent("darkMode")}
                style={{
                  fontSize: 40,
                  color:
                    activeComponent === "darkMode"
                      ? isDarkMode
                        ? "#AC82FF"
                        : "#C2A3FF"
                      : "",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Right Panel */}
      <div className="md:w-4/5 w-full p-4 overflow-auto">
        {activeComponent === "editProfile" && <EditProfileComponent />}
        {activeComponent === "changePassword" && <ChangePasswordComponent />}
        {activeComponent === "darkMode" && (
          <DarkModeComponent onToggle={handleToggle} />
        )}
      </div>
      {isMobile ? (
        <div className="mt-auto mb-6 flex justify-center">
          <LogoutComponent />
        </div>
      ) : null}
    </div>
  );
}
