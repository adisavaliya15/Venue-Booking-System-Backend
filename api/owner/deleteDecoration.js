const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function DeleteDecoration(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection("venuesDecorations");

        const { venueId, decorId } = req.body;

        if (!venueId || !decorId) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        const existingVenue = await collection.findOne({ venueId: new ObjectId(venueId) });

        if (!existingVenue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }

        const existingDecoration = existingVenue.Decorations.find(d => d.decorId.toString() === decorId);

        if (!existingDecoration) {
            return res.status(404).json({ success: false, message: "Decoration not found" });
        }

        const updatedDecorations = existingVenue.Decorations.filter(d => d.decorId.toString() !== decorId);

        await collection.updateOne(
            { venueId: new ObjectId(venueId) },
            { $set: { Decorations: updatedDecorations } }
        );
        res.status(200).json({ success: true, message: "Decoration deleted successfully" });
    } catch (error) {
        console.error("Error deleting decoration:", error);
        res.status(500).json({ success: false, error: "Error deleting decoration" });
    }
}

module.exports = { DeleteDecoration };
