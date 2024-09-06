import React from "react";
import { ValidateFile } from "./FileUpload";

export function EasyImage({ customStyle, setSelectedFile, setError }) {
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];

    // Gibt Callback zurück -> entweder Error oder die Datei. Wenn Validierung erfolgreich dann Datei ansonsten Error.
    ValidateFile(uploadedFile, (err, file) => {
      if (err) {
        setError(err);
      } else {
        setSelectedFile(file);
        setError("");
      }
    });
  };

  return <input className={customStyle} type="file" onChange={handleFileChange} />;
}