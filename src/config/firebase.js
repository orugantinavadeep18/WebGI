/**
 * ImageKit Configuration for Frontend
 * NOTE: ImageKit public key is used only for direct uploads if needed.
 * Most operations go through backend API for security.
 */

const imageKitConfig = {
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
};

export { imageKitConfig };
