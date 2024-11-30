const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function EditDecoration(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection("venuesDecorations");

        const { venueId, decorId, price } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!venueId || !decorId) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        const existingVenue = await collection.findOne({ venueId: new ObjectId(venueId) });

        if (!existingVenue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }

        const existingDecorationIndex = existingVenue.Decorations.findIndex(d => d.decorId.toString() === decorId);

        if (existingDecorationIndex === -1) {
            return res.status(404).json({ success: false, message: "Decoration not found" });
        }

        const existingDecoration = existingVenue.Decorations[existingDecorationIndex];
        const updatedDecoration = {
            decorId: new ObjectId(decorId),
            image: image || existingDecoration.image,
            price: price || existingDecoration.price
        };

        existingVenue.Decorations[existingDecorationIndex] = updatedDecoration;

        await collection.updateOne(
            { venueId: new ObjectId(venueId) },
            { $set: { Decorations: existingVenue.Decorations } }
        );
        res.status(200).json({ success: true, message: "Decoration updated successfully" });
    } catch (error) {
        console.error("Error editing decoration:", error);
        res.status(500).json({ success: false, error: "Error editing decoration" });
    }
}

module.exports = { EditDecoration };
