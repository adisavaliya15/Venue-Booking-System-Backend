const connectDB = require("../../db/dbConnect");

async function ViewPayments(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('bookings');

        const bookings = await collection.find({}, {
            projection: {
                venueId: 1,
                userId: 1,
                ownerId: 1,
                paymentId: 1,
                paymentAmount: 1,
                paymentStatus: 1,
                paymentMethod: 1,
                paymentDate: 1
            }
        }).toArray();

        //check session
        const userId = req.userData.user.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

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

module.exports = { ViewPayments };