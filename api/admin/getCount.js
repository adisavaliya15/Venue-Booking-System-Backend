// Import necessary modules
const connectDB = require("../../db/dbConnect");

// Define async function to fetch total bookings count, today's booking count, and total revenue
async function GetCounts(req, res) {
  try {
    const db = await connectDB();
    const bookingsCollection = db.collection("bookings");

    console.log("adminId: ", req.userData.user.user._id);
    // Fetch total bookings count
    const totalBookingsCount = await bookingsCollection.countDocuments();

    // Fetch today's booking count
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    // Fetch today's booking count for the owner
    const todayBookingsCount = await bookingsCollection.countDocuments({
      fromDate: { $lte: today },
      toDate: { $gte: today },
    });

    // Fetch total revenue
    const revenuePipeline = [
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

module.exports = { GetCounts };
