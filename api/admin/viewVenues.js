const connectDB = require("../../db/dbConnect");

async function ViewVenues(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("venues");

    const venues = await collection.find({}).toArray();

    //check session
    const userId = req.userData.user.user;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized User!" });
    }

    if (venues.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "No any Venue Available!" });
    }
    res
      .status(200)
      .json({
        venueData: venues,
        success: true,
        message: "Venues Found Successfully!",
      });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong!" });
    return error;
  }
}

module.exports = { ViewVenues };
