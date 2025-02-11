/* eslint-disable no-restricted-globals */
export {}; // 👈 Fixes the TS1208 error

self.onmessage = (event) => {
  const { file, chunkSize } = event.data;
  const chunks = [];
  let offset = 0;
  let index = 0;

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    chunks.push({ index, data: chunk });
    offset += chunkSize;
    index++;
  }

  self.postMessage({ chunks });
};
