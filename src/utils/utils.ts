export const getFileName = (url: string) => url.split("/").pop() || "Unknown";

export const getFileNameWithoutExtension = (url: string): string => {
  const fileName = getFileName(url);
  return fileName.replace(/\.[^/.]+$/, "");
};
