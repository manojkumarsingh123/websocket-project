const crypto = require("crypto");

const secretKey = process.env.SECRET_KEY || "your-secret-key"; // Use a secure key
const algorithm = "aes-256-cbc";
const ivLength = 16; // AES block size

// Encrypt a message
const encryptMessage = (message) => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

// Decrypt a message
const decryptMessage = (encryptedMessage) => {
  const [iv, content] = encryptedMessage.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(content, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = { encryptMessage, decryptMessage };
