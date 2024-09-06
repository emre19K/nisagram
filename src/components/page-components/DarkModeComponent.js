import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import useIsMobile from "../../util/useIsMobile";

export default function DarkModeComponent({ onToggle }) {
  const isMobile = useIsMobile();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "enabled"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    onToggle(darkMode); // Notify parent component about the change
  }, [darkMode, onToggle]);

  const handleToggle = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode ? "enabled" : "disabled");
      return newMode;
    });
  };

  return (
    <>
      {isMobile ? (
        <div className="flex justify-center mt-36">
          <div>
            {darkMode ? (
              <FaSun  onClick={handleToggle} style={{ fontSize: 40 }} />
            ) : (
              <FaMoon  onClick={handleToggle} style={{ fontSize: 40 }} />
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-36">
          <div
            className={`rounded-xl w-1/2 flex flex-col items-center justify-center ${
              darkMode ? "bg-dark-bg" : "bg-light-bg"
            }`}
          >
            <button
              className="mt-12 mb-12 hover:text-lila font-bold"
              onClick={handleToggle}
            >
              {darkMode ? "Darkmodus deaktivieren" : "Darkmodus aktivieren"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
