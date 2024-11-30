const connectDB = require("../db/dbConnect");

const jwt = require("jsonwebtoken");
const secretKey = "your-secret-key";

async function LoginApi(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("users");

    const { email, password, role } = req.body;
    const user = await collection.findOne({ email, password, role });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    //session creation
    // req.session.user = { session: user, isAuth: true };
    // const userDatas = req.session.user;

    // Create a JWT token
    const token = jwt.sign({ user }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token: token,
      success: true,
      message: "Login Successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Login Failed" });
  }
}

module.exports = { LoginApi };
