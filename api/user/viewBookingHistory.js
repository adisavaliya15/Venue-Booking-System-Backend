const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function UserBookingHistory(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("bookings");

    //check session
    const sessionId = req.userData.user.user._id;
    // console.log(sessionId);
    // if (!sessionId) {
    //     return res.status(401).json({ success: false, message: "Unauthorized User!" });
    // }

    const bookings = await collection
      .find({ userId: new ObjectId(sessionId) })
      .toArray();

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No any Bookings Found!" });
    }
    res.status(200).json({
      bookings: bookings,
      success: true,
      message: "Bookings Found Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Something went wrong!" });
  }
}

module.exports = { UserBookingHistory };
