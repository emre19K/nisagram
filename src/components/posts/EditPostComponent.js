import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { EasyImage } from "../../util/EasyUpload";
import CropImageModal from '../ImageCrop/CropImageModal'; // Import CropImageModal

export default function EditPostComponent({ post, onSave, onCancel }) {
  const [title, setTitle] = useState(post.title);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(post.image);
  const [error, setError] = useState("");
  const [cropModalVisible, setCropModalVisible] = useState(false); // State for modal visibility
  const [croppedImage, setCroppedImage] = useState(null); // State for cropped image

  // Update image preview when a new file is selected
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const handleFileChange = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setCropModalVisible(true); // Show the crop modal when a file is selected
  };

  const handleCropComplete = (croppedImageUrl) => {
    fetch(croppedImageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], imageFile.name, { type: blob.type });
        setCroppedImage(file); // Set the cropped image as a file
        setImagePreview(croppedImageUrl); // Set the cropped image URL for preview
        setCropModalVisible(false); // Hide the crop modal
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Include the cropped image file if it's selected
    const updatedPost = { title, image: croppedImage ? croppedImage : post.image };
    onSave(post._id, updatedPost, croppedImage);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input field for post title */}
      <label htmlFor="title" style={{ display: "block", margin: "10px 0 5px" }}>
        Description:
      </label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", margin: "5px 0 10px" }}
      />

      {/* File input for image upload */}
      <label htmlFor="image" style={{ display: "block", margin: "10px 0 5px" }}>
        Image:
      </label>
      <EasyImage setSelectedFile={handleFileChange} setError={setError} />
      {error && <p className="mt-2 text-red-500">{error}</p>}

      {/* Display image preview if a file is selected */}
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Post"
          style={{ width: "400px", height: "auto", margin: "10px 0" }}
        />
      )}

      {/* Save button with minimal styling */}
      <button
        style={{
          margin: "5px",
          padding: "5px 10px",
          background: "purple",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
        type="submit"
      >
        Save
      </button>

      {/* Cancel button with minimal styling */}
      <button
        style={{
          margin: "5px",
          padding: "5px 10px",
          background: "purple",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>

      {cropModalVisible && imageFile && (
        <CropImageModal
          visible={cropModalVisible}
          imageSrc={imagePreview}
          onCancel={() => setCropModalVisible(false)}
          onComplete={handleCropComplete}
        />
      )}
    </form>
  );
}

// PropTypes for validation
EditPostComponent.propTypes = {
  post: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
