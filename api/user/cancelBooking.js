const { ObjectId } = require("mongodb");
const connectDB = require("../..//db/dbConnect");

async function CancleBooking(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("bookings");

    //check session
    const sessionId = req.userData.user.user;
    if (!sessionId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized User!" });
    }

    const { bookingId, userId } = req.body;

    const updatedFields = {};

    const result = await collection.updateOne(
      {
        _id: ObjectId.createFromHexString(bookingId),
        userId: ObjectId.createFromHexString(req.userData.user.user._id),
      },
      {
        $set: {
          bookingStatus: "cancled",
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(402)
        .json({ success: false, message: "Already Cancelled" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Cancelled successfully." });
  } catch (error) {
    console.error("Edit Product Failed:", error);
    return res
      .status(500)
      .json({ success: false, error: "Cancelation Failed" });
  }
}

module.exports = { CancleBooking };
