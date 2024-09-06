/**
 * Creates an HTMLImageElement from a given URL
 * @param {string} url - The URL of the image
 * @returns {Promise<HTMLImageElement>} - A promise that resolves to an image element
 */
export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image)); // Resolve the promise when the image loads successfully
    image.addEventListener('error', (error) => reject(error)); // Reject the promise if there's an error loading the image
    image.setAttribute('crossOrigin', 'anonymous'); // Set crossOrigin attribute to handle CORS issues
    image.src = url; // Set the source of the image
  });

/**
 * Converts degrees to radians
 * @param {number} degreeValue - The degree value to be converted to radians
 * @returns {number} - The radian value
 */
export const getRadianAngle = (degreeValue) => {
  return (degreeValue * Math.PI) / 180; // Convert degrees to radians
};
