const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function OwnerGetCounts(req, res) {
  try {
    //session check
    const ownerId = req.userData.user.user._id;
    console.log("ownerId: ", ownerId);
    if (!ownerId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized User!" });
    }

    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    console.log("Today's date:", today);

    const db = await connectDB();
    const bookingsCollection = db.collection("bookings");

    // Fetch total bookings count for the owner
    const totalBookingsCount = await bookingsCollection.countDocuments({
      ownerId: new ObjectId(ownerId),
    });

    // Fetch today's booking count for the owner
    const todayBookingsCount = await bookingsCollection.countDocuments({
      ownerId: new ObjectId(ownerId),
      fromDate: { $lte: today },
      toDate: { $gte: today },
    });

    // Fetch total revenue for the owner
    const revenuePipeline = [
      {
        $match: { ownerId: new ObjectId(ownerId) },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $toInt: "$paymentAmount" } }, // Convert paymentAmount to integer and sum
        },
      },
    ];
    const revenueResult = await bookingsCollection
      .aggregate(revenuePipeline)
      .toArray();
    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      totalBookings: totalBookingsCount,
      todayBookings: todayBookingsCount,
      totalRevenue,
      success: true,
      message: "Counts fetched successfully!",
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ success: false, error: "Something went wrong!" });
  }
}

module.exports = { OwnerGetCounts };
