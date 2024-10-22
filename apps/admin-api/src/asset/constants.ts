export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// List of allowed MIME types for common file formats
export const ALLOWED_FILE_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',

  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOC, DOCX
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLS, XLSX
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPT, PPTX
  'text/plain',
  'application/rtf',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.oasis.opendocument.spreadsheet',

  // Audio
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/mp4',
  'audio/aac',
  'audio/flac',
  'audio/x-ms-wma',

  // Video
  'video/mp4',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/quicktime',
  'video/mpeg',
  'video/webm',
  'video/ogg',
  'video/x-matroska',

  // Compressed Files
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'application/x-tar',

  // Other formats
  'application/json',
  'application/xml',
  'application/x-yaml',
];
