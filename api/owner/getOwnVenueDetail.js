const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function GetOwnVenueDetail(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('venues');
        
        //check session
        const userId = req.userData.user.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const ownerId = req.userData.user.user._id;
        
        if ( !ownerId) {
            return res.status(400).json({ success: false, message: "Missing ownerId" });
        }

        // Check if the user making the request is the owner of the venue
        const venue = await collection.findOne({ ownerId: ObjectId.createFromHexString(ownerId) });
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }
        return res.status(200).json({ success: true, venue: venue });

    } catch (error) {
        console.error("Venue update failed:", error);
        return res.status(500).json({ success: false, error: "Venue update failed" });
    }
}

module.exports = { GetOwnVenueDetail };
