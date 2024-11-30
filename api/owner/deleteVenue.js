const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function DeleteVenue(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('venues');
        
        //check session
        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { venueId, ownerId } = req.body;

        if (!venueId || !ownerId) {
            return res.status(400).json({ success: false, message: "Missing venueId or ownerId" });
        }

        // Check if the user making the request is the owner of the venue
        const venue = await collection.findOne({ _id: ObjectId.createFromHexString(venueId) });
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }

        if (venue.ownerId.toString() !== ownerId) {
            return res.status(403).json({ success: false, message: "Unauthorized access: You are not the owner of this venue" });
        }

        // Delete the venue
        await collection.deleteOne({ _id: ObjectId.createFromHexString(venueId) });

        return res.status(200).json({ success: true, message: "Venue deleted successfully" });
    } catch (error) {
        console.error("Venue deletion failed:", error);
        return res.status(500).json({ success: false, error: "Venue deletion failed" });
    }
}

module.exports = { DeleteVenue };
