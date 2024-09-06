import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Modal, Slider, Button } from 'antd';
import getCroppedImg from './cropImageHelper';

const CropImageModal = ({ visible, imageSrc, onCancel, onComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // State to manage the crop position
  const [zoom, setZoom] = useState(1); // State to manage the zoom level
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // State to store the cropped area in pixels

  // Callback function to handle crop completion
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Function to handle the completion of cropping and return the cropped image
  const handleComplete = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    onComplete(croppedImage);
  };

  return (
    <Modal
      open={visible}
      title="Crop Image"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="complete" type="primary" onClick={handleComplete}>
          Crop
        </Button>,
      ]}
      className="custom-modal" // Custom class for modal styling
    >
      <div className="crop-container">
        <Cropper
          image={imageSrc} // Source image to be cropped
          crop={crop} // Crop position
          zoom={zoom} // Zoom level
          aspect={1} // Aspect ratio for the crop area (1 for square)
          onCropChange={setCrop} // Update crop position state
          onZoomChange={setZoom} // Update zoom level state
          onCropComplete={onCropComplete} // Handle crop completion
        />
      </div>
      <div className="mt-4">
        <p className="text-center mb-2 text-lila">Zoom</p> {/* Label for the slider */}
        <Slider
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(value) => setZoom(value)} // Update zoom level state
        />
      </div>
    </Modal>
  );
};

export default CropImageModal;
