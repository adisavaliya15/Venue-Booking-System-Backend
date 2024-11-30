const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function AddVenue(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("venues");
    //check session
    const userId = req.userData.user.user._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized User!" });
    }

    const {
      name,
      address,
      city,
      about,
      enquiryNo,
      capacity,
      pricePerDay,
      isWifi,
      isAC,
    } = req.body;

    console.log("req.files: ", req.files);

    // Assuming images are sent as multipart form data with field name 'images'
    const images = req.files.map((files) => files.filename);

    const ownerId = req.userData.user.user._id;

    if (
      !ownerId ||
      !name ||
      !address ||
      !city ||
      !about ||
      !enquiryNo ||
      !capacity ||
      !pricePerDay ||
      !isWifi ||
      !isAC
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields!" });
    }

    // Check if owner has already added a venue
    const existingVenue = await collection.findOne({
      ownerId: ObjectId.createFromHexString(ownerId),
    });
    if (existingVenue) {
      return res
        .status(400)
        .json({ success: false, message: "Owner has already added a venue!" });
    }

    if (req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No images selected!" });
    }

    await collection.insertOne({
      ownerId: ObjectId.createFromHexString(ownerId),
      name,
      address,
      city,
      about,
      enquiryNo,
      capacity,
      pricePerDay,
      images,
      isWifi,
      isAC,
    });

    return res
      .status(201)
      .json({ success: true, message: "Venue added successfully" });
  } catch (error) {
    console.error("Venue addition failed:", error);
    return res
      .status(500)
      .json({ success: false, error: "Venue addition failed" });
  }
}

module.exports = { AddVenue };
