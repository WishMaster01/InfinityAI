export const sanitizeText = (value, maxLength = 4000) => {
  return String(value || "")
    .replace(/\0/g, "")
    .trim()
    .slice(0, maxLength);
};

export const requireText = (value, fieldName, maxLength) => {
  const sanitized = sanitizeText(value, maxLength);

  if (!sanitized) {
    const error = new Error(`${fieldName} is required.`);
    error.statusCode = 400;
    throw error;
  }

  return sanitized;
};

export const assertAllowedMime = (file, allowedTypes, label) => {
  if (!file) {
    const error = new Error(`${label} file is required.`);
    error.statusCode = 400;
    throw error;
  }

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error(`Unsupported ${label} file type.`);
    error.statusCode = 400;
    throw error;
  }
};
