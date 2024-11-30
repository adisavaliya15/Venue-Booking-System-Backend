const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function GetDecorations(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection("venuesDecorations");

        const { venueId } = req.body;


        if (!venueId) {
            return res.status(400).json({ success: false, message: "Missing venueId in request body" });
        }

        // Check if the venueId exists in the collection
        const decorations = await collection.findOne({ venueId: new ObjectId(venueId) });

        if (!decorations) {
            return res.status(404).json({ success: false, message: "Decorations not found" });
        }

        return res.status(200).json({ decorations, success: true, message: "Decorations found successfully" });
    } catch (error) {
        console.error("Error getting decorations:", error);
        res.status(500).json({ success: false, error: "Error getting decorations" });
    }
}

module.exports = { GetDecorations };
