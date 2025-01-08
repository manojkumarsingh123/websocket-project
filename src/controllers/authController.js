const bcrypt = require("bcrypt");
const { User, Organization } = require("../models");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwtUtils");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { username, email, password, organizationName, role } = req.body;

  console.log("details", username, email, password, organizationName, role);

  try {
    // Find or create organization
    let organization = await Organization.findOne({
      where: { name: organizationName },
    });
    console.log("organization", organization);
    if (!organization) {
      organization = await Organization.create({ name: organizationName });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      organization_id: organization.id,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error registering user", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role,
      organization_id: user.organization_id,
    });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  console.log(refreshToken, "refreshToken");

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token required" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    console.log(decoded, "decoded");
    const newAccessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res
      .status(403)
      .json({ message: "Invalid refresh token", error: error.message });
  }
};
