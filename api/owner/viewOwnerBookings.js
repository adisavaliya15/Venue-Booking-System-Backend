const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function ViewOwenerBooking(req, res) {
    try {
        const db = await connectDB();
        const bookingsCollection = db.collection('bookings');
        const usersCollection = db.collection('users');

        // Check session and get userId
        const userId = req.userData.user.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        // Get ownerId from the session
        const ownerId = req.userData.user.user._id;
        if (!ownerId) {
            return res.status(401).json({ success: false, message: "No ownerId found!" });
        } 

        const ownerIdObj = ObjectId.createFromHexString(ownerId);

        // Find bookings for the ownerId
        const bookings = await bookingsCollection.find({ ownerId: ownerIdObj }).toArray();

        if (bookings.length === 0) {
            return res.status(200).json({ bookings: bookings, success: false, message: "No bookings found!" });
        }

        // Get userIds from bookings
        const userIds = bookings.map(booking => booking.userId);

        // Find usernames from users collection using userIds
        const users = await usersCollection.aggregate([
            { $match: { _id: { $in: userIds.map(id => new ObjectId(id)) } } },
            { $project: { _id: 1, username: 1 } }
        ]).toArray();

        // Create a map of userId to username for easy lookup
        const userMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = user.username;
            return acc;
        }, {});

        // Add username to each booking
        const bookingsWithUsername = bookings.map(booking => ({
            ...booking,
            username: userMap[booking.userId] || "Unknown"
        }));

        res.status(200).json({ bookings: bookingsWithUsername, success: true, message: "Bookings found successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong!" });
    }
}

module.exports = { ViewOwenerBooking };
