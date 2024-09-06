import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { easyPostWithFile } from "../../util/EasyFetch";
import { jwtDecode } from "jwt-decode";
import { getLoginCookie } from "../../util/LoginCookie";
import { EasyImage } from "../../util/EasyUpload";
import { useAlert } from "../../util/CustomAlert";
import CropImageModal from '../ImageCrop/CropImageModal';

export default function CreatePostComponent() {
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null); // State for cropped image
  const [cropModalVisible, setCropModalVisible] = useState(false); // State for modal visibility
  const [error, setError] = useState("");

  // token und userID aus dem LoginCookie schnappen
  const token = getLoginCookie();
  const _id = jwtDecode(token)._id;
  const navigate = useNavigate();
  const { showAlert } = useAlert("");

  // Function to handle post creation
  async function handleCreatePost() {
    if (!croppedImage) {
      setError("Bitte wählen Sie ein Foto aus.");
      return;
    }

    if (!title) {
      setError("Bitte fügen Sie eine Beschreibung hinzu.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", croppedImage); // Use the cropped image

    try {
      await easyPostWithFile(`/posts/create/`, formData, token);
      navigate("/profile/" + _id);
      showAlert("Beitrag erfolgreich erstellt!");
    } catch (error) {
      setError("Fehler beim Erstellen des Beitrags.");
    }
  }

  // Function to handle file change and show crop modal
  const handleFileChange = (file) => {
    setSelectedFile(file);
    setCropModalVisible(true); // Show the crop modal when a file is selected
  };

  // Function to handle crop completion and convert URL to File
  const handleCropComplete = (croppedImageUrl) => {
    fetch(croppedImageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], selectedFile.name, { type: blob.type });
        setCroppedImage(file); // Set the cropped image as a file
        setCropModalVisible(false); // Hide the crop modal
      });
  };

  return (
    <>
      <div className="font-josefine">
        <input
          className="border hover:border-gray-400 mt-2 pr-5 grid w-2/5 h-10 mb-8"
          id="DescriptionInputField"
          placeholder="Beschreibung"
          onChange={(e) => setTitle(e.target.value)}
        />
        <EasyImage
          customStyle={"mb-8"}
          setSelectedFile={handleFileChange}
          setError={setError}
        />
        {error && <p className="mt-2 text-red-500">{error}</p>}
        <button
          className="grid border rounded-button w-40 py-2 content-center text-white font-light bg-lila hover:bg-lilaLight"
          onClick={handleCreatePost}
        >
          Beitrag erstellen
        </button>
      </div>
      <CropImageModal
        visible={cropModalVisible}
        imageSrc={selectedFile ? URL.createObjectURL(selectedFile) : ''}
        onCancel={() => setCropModalVisible(false)}
        onComplete={handleCropComplete}
      />
    </>
  );
}
