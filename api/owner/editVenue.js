const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function EditVenue(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("venues");

    //check session
    const userId = req.userData.user.user;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized User!" });
    }

    const {
      venueId,
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

    const ownerId = req.userData.user.user._id;

    if (!venueId || !ownerId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing venueId or ownerId" });
    }

    // Check if the user making the request is the owner of the venue
    const venue = await collection.findOne({
      _id: ObjectId.createFromHexString(venueId),
    });
    if (!venue) {
      return res
        .status(404)
        .json({ success: false, message: "Venue not found" });
    }

    if (venue.ownerId.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access: You are not the owner of this venue",
      });
    }

    // Construct update object with only provided fields
    const updateObject = {};
    if (name) updateObject.name = name;
    if (address) updateObject.address = address;
    if (about) updateObject.about = about;
    if (enquiryNo) updateObject.enquiryNo = enquiryNo;
    if (capacity) updateObject.capacity = capacity;
    if (city) updateObject.city = city;
    if (pricePerDay) updateObject.pricePerDay = pricePerDay;
    if (isWifi) updateObject.isWifi = isWifi;
    if (isAC) updateObject.isAC = isAC;
    if (req.files.length > 0) {
      const images = req.files.map((file) => file.filename);
      updateObject.images = images;
    }

    // Update venue only if there are fields to update
    if (Object.keys(updateObject).length > 0) {
      await collection.updateOne(
        { _id: ObjectId.createFromHexString(venueId) },
        { $set: updateObject }
      );
    }

    return res
      .status(200)
      .json({ success: true, message: "Venue updated successfully" });
  } catch (error) {
    console.error("Venue update failed:", error);
    return res
      .status(500)
      .json({ success: false, error: "Venue update failed" });
  }
}

module.exports = { EditVenue };
