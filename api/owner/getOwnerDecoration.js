const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function GetOwnDecoration(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("venuesDecorations");
    const venueCollection = db.collection("venues");

    //check session
    const userId = req.userData.user.user;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized User!" });
    }

    const ownerId = req.userData.user.user._id;

    const venueData = await venueCollection.findOne({
      ownerId: ObjectId.createFromHexString(ownerId),
    });

    if (!venueData) {
      return res
        .status(404)
        .json({ success: false, message: "Venue not found" });
    }

    const decorationData = await collection
      .find({ venueId: venueData._id })
      .toArray();

    return res
      .status(200)
      .json({ decorationData: decorationData, success: true });
  } catch (error) {
    console.error("Venue update failed:", error);
    return res
      .status(500)
      .json({ success: false, error: "Venue update failed" });
  }
}

module.exports = { GetOwnDecoration };
