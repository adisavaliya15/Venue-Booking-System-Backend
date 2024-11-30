const connectDB = require("../../db/dbConnect");

async function ViewVenueOwner(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const user = await collection.find({ role: "2" }).toArray();

        //check session
        const userId = req.userData.user.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }
        
        if (user.length === 0) {
            return res.status(401).json({ success: false, message: "No any Venue Owner Registered!" });
        }
        res
            .status(200)
            .json({ ownerData: user, success: true, message: "Venue Owener Found Successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Something went wrong!" });
    }
}

module.exports = { ViewVenueOwner };