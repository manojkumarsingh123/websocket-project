const { hasPermission } = require("../utils/rbac");

const authorizeRole = (action) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (hasPermission(userRole, action)) {
      return next();
    }

    res.status(403).json({ message: "Forbidden: Insufficient permissions" });
  };
};

module.exports = authorizeRole;
