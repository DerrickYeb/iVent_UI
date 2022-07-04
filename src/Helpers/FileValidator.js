export function fileValidator(file) {
  const mimeTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/webp",
  ];
  //file length
  if (file.length === 0) {
    return {
      state: false,
      payload: "No file selected",
    };
  }
  //file size
  if (file[0].size > parseInt(1000000)) {
    return {
      state: false,
      payload: "Selected image size is above 1MB",
    };
  }

  //mime type
  if (!mimeTypes.includes(file[0].type)) {
    return {
      state: false,
      payload: "Accepted file type must be an image",
    };
  }
  return true;
}

export function returnFileSize(number) {
  if (number < 1024) {
    return number + "bytes";
  } else if (number >= 1024 && number < 1048576) {
    return (number / 1024).toFixed(1) + "KB";
  } else if (number >= 1048576) {
    return (number / 1048576).toFixed(1) + "MB";
  }
}

export function GenericFileValidator(file) {
  const mimeTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/webp",
    "video/mp4",
    "video/avi",
    "video/mov",
    "video/flv",
  ];
  //file length
  if (file.length === 0) {
    return {
      state: false,
      payload: "No file selected",
    };
  }
  //file size
  if (file[0].size > parseInt(1000000000)) {
    return {
      state: false,
      payload: "Selected file size is above 1GB",
    };
  }

  //mime type
  if (!mimeTypes.includes(file[0].type)) {
    return {
      state: false,
      payload: "Accepted file type must be an image or a video",
    };
  }
  return true;
}

export const ImageMimeType = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];
export const VideoMimeType = [
  "video/mp4",
  "video/avi",
  "video/mov",
  "video/flv",
];

export function videoValidator(file) {
  const mimeTypes = ["video/mp4", "video/avi", "video/mov", "video/flv"];
  //file length
  if (file.length === 0) {
    return {
      state: false,
      payload: "No file selected",
    };
  }
  //file size
  if (file[0].size > parseInt(5000000)) {
    return {
      state: false,
      payload: "Selected image size is above 5MB",
    };
  }

  //mime type
  if (!mimeTypes.includes(file[0].type)) {
    return {
      state: false,
      payload: "Accepted file type must be an image",
    };
  }
  return true;
}
export const ImageExtentions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
export const VideoExtensions = [".mp4", ".avi", ".mov", ".flv"];
