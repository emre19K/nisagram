export function ValidateFile(file, callback) {
  // Prüfen ob eine Datei ausgewählt wurde
  if (!file) return callback("Bitte wählen Sie eine Datei aus.", null);

  // Regex -> Datei muss mit jpg, jpeg, png enden. Ansonsten ungültig. Schützt vor dem Hochladen von Scripts
  // Der Typ muss außerdem mit image/ starten
  if (!file.name.match(/\.(jpg|jpeg|png)$/i) || !file.type.startsWith("image/"))
    return callback("Bitte laden Sie ein gültiges Foto hoch.", null);

  // Maximum 40MB Fotos
  if (file.size > 40 * 1024 * 1024)
    return callback("Die Dateigröße darf nicht 40MB überschreiten.", null);

  return callback(null, file);
}
