const jwt = require("jsonwebtoken");

async function Session(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "your-secret-key");
    const userDatas = decodedToken.user;

    if (!token || !userDatas) {
      return res.status(401).json({ message: "No token created!" });
    } else {
      res.status(200).json({
        sessionData: userDatas,
        success: true,
        message: "got Successful",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = Session;
