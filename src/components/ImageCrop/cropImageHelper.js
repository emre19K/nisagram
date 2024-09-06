import { createImage } from "./imageUtils";

/**
 * Crops and resizes the image to 1080x1080.
 * @param {string} imageSrc - The source of the image.
 * @param {object} pixelCrop - The crop area pixels.
 * @returns {Promise<string>} - A promise that resolves to the URL of the cropped image.
 */
export default async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set the canvas size to 1080x1080
  canvas.width = 1080;
  canvas.height = 1080;

  // Draw the cropped area onto the canvas, resizing to 1080x1080
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    1080,
    1080
  );

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file));
    }, 'image/jpeg');
  });
}
