import React, { createContext, useState, useContext, useCallback } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback((message) => {
    setAlert(message);
  }, []);

  const closeAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return (
    <AlertContext.Provider value={{ alert, showAlert, closeAlert }}>
      {children}
      {alert && <CustomAlert message={alert} onClose={closeAlert} />}
    </AlertContext.Provider>
  );
};

// HIER STYLEN!
const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg text-center">
        <p className="mb-4">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="w-48 py-2 text-white bg-lila rounded-button grid content-center font-josefine font-light"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
