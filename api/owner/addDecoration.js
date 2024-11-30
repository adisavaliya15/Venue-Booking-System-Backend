const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

function generateId(length) {
    const chars = 'abcdef0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function AddDecoration(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection("venuesDecorations");

        // Check session
        // const userId = req.session.user;
        // if (!userId) {
        //   return res.status(401).json({ success: false, message: "Unauthorized User!" });
        // }

        const { venueId, price } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!venueId || !price || !image) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        // Check if the venueId exists in the collection
        let existingVenue = await collection.findOne({ venueId: new ObjectId(venueId) });

        if (!existingVenue) {
            // If venue not found, add a new venue with the decoration
            const newVenue = {
                venueId: new ObjectId(venueId),
                Decorations: [{ decorId: new ObjectId(generateId(24)), image, price }]
            };
            await collection.insertOne(newVenue);
            return res.status(201).json({ success: true, message: "Venue added with decoration" });
        }

        // Update the existing venue with the new decoration
        const newDecoration = { decorId: new ObjectId(generateId(24)), image, price };
        await collection.updateOne(
            { venueId: new ObjectId(venueId) },
            { $push: { Decorations: newDecoration } }
        );
        res.status(200).json({ success: true, message: "Decoration added successfully" });
    } catch (error) {
        console.error("Error adding decoration:", error);
        res.status(500).json({ success: false, error: "Error adding decoration" });
    }
}

module.exports = { AddDecoration };
