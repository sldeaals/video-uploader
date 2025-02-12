const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const { fileName, index } = req.body;
  const chunkPath = path.join(uploadDir, `${fileName}.part${index}`);

  fs.writeFileSync(chunkPath, req.file.buffer);

  res.json({ message: `Chunk ${index} uploaded.` });
});

app.post("/api/merge", (req, res) => {
  const { fileName, totalChunks } = req.body;
  const finalFilePath = path.join(uploadDir, fileName);
  const writeStream = fs.createWriteStream(finalFilePath);

  let chunkIndex = 0;

  const appendChunk = () => {
    if (chunkIndex >= totalChunks) {
      writeStream.end();
      return res.json({
        message: "File merged successfully",
        url: `http://localhost:${port}/uploads/${fileName}`,
      });
    }

    const chunkPath = path.join(uploadDir, `${fileName}.part${chunkIndex}`);

    if (!fs.existsSync(chunkPath)) {
      return res.status(400).json({ error: `Chunk ${chunkIndex} is missing.` });
    }

    const chunkStream = fs.createReadStream(chunkPath);
    chunkStream.pipe(writeStream, { end: false });
    
    chunkStream.on("end", () => {
      fs.unlinkSync(chunkPath);
      chunkIndex++;
      appendChunk();
    });
  };

  appendChunk();
});

app.use("/uploads", express.static(uploadDir));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
