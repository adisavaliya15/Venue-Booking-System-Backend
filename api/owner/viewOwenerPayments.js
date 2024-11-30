const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function ViewOwnerPayments(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('bookings');

        
        //check session
        const userId = req.userData.user.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }
        
        // Get ownerId from the session
        const ownerId = req.userData.user.user._id;
        if (!ownerId) {
            return res.status(401).json({ success: false, message: "No ownerId found!" });
        } 

        const ownerId1 = ObjectId.createFromHexString(ownerId);

        const bookings = await collection.find({ ownerId: ownerId1 }, {
            projection: {
                venueId: 1,
                userId: 1,
                paymentId: 1,
                paymentAmount: 1,
                paymentStatus: 1,
                paymentMethod: 1
            }
        }).toArray();


        if (bookings.length === 0) {
            return res.status(401).json({ success: false, message: "No any payments Found!" });
        }
        res
            .status(200)
            .json({ payments: bookings, success: true, message: "Payments Found Successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Something went wrong!" });
    }
}

module.exports = { ViewOwnerPayments };