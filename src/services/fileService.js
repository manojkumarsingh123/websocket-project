const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../../uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Save a file
const saveFile = async (file) => {
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  return new Promise((resolve, reject) => {
    file.mv(filePath, (err) => {
      if (err) return reject(err);

      resolve({
        fileName,
        filePath,
        mimeType: file.mimetype,
        size: file.size,
      });
    });
  });
};

module.exports = { saveFile };
