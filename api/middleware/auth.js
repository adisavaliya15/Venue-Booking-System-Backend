const jwt = require("jsonwebtoken");
const secretKey = "your-secret-key";

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, secretKey);
    req.userData = { user: decodedToken };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed try Again" });
  }
};
