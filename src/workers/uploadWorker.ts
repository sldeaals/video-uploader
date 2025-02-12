/* eslint-disable no-restricted-globals */
export {};

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
