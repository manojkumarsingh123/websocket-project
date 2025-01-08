const jwt = require("jsonwebtoken");

const generateAccessToken = (payload) => {
  console.log("payload data", payload);
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "7d" });
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
