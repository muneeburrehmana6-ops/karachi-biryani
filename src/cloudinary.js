// Photo / video upload Cloudinary par hoti hai (free plan kaafi hai).
// Setup README.md ke "Photo aur video upload" hisse mein likha hai.
const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const cloudConfigured = Boolean(CLOUD && PRESET);

export function uploadToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    const kind = file.type.startsWith("video/") ? "video" : "image";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD}/${kind}/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && res.secure_url) resolve(res.secure_url);
        else reject(new Error(res.error?.message || "Upload failed."));
      } catch {
        reject(new Error("Upload failed."));
      }
    };
    xhr.onerror = () => reject(new Error("Network problem. Please try again."));

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", PRESET);
    fd.append("folder", "karachi-biryani");
    xhr.send(fd);
  });
}

// Demo mode (Cloudinary ke baghair): photo ko chhota kar ke isi browser mein rakha jata hai
export function compressImageToDataUrl(file, maxW = 900, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not open the photo. Choose a JPG or PNG."));
    };
    img.src = url;
  });
}
