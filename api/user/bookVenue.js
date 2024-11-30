const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

// Generate a random alphanumeric payment ID
function generatePaymentId(length) {
  const chars = "abcdef0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
async function BookVenue(req, res) {
  try {
    const db = await connectDB();
    const bookingsCollection = db.collection("bookings");

    // Check session
    const sessionId = req.userData.user.user;
    if (!sessionId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized User!" });
    }

    const { venueId, ownerId, fromDate, toDate, paymentMethod, paymentAmount } =
      req.body;

    // Check if there is an existing booking for the selected dates
    const bookingExists = await bookingsCollection.findOne({
      venueId: ObjectId.createFromHexString(venueId),
      $or: [
        { fromDate: { $gte: fromDate, $lte: toDate } }, // Check if fromDate is between existing booking fromDate and toDate
        { toDate: { $gte: fromDate, $lte: toDate } }, // Check if toDate is between existing booking fromDate and toDate
        {
          $and: [
            { fromDate: { $lte: fromDate } },
            { toDate: { $gte: toDate } },
          ],
        }, // Check if existing booking covers the selected dates
      ],
    });

    if (bookingExists) {
      return res.status(400).json({
        success: false,
        message: "Venue is already booked for the selected dates",
      });
    } else {
      // Assuming you generate the payment ID here
      const paymentId = generatePaymentId(24);
      console.log("paymentId: ", paymentId);

      const booking = {
        venueId: ObjectId.createFromHexString(venueId),
        userId: ObjectId.createFromHexString(req.userData.user.user._id),
        ownerId: ObjectId.createFromHexString(ownerId),
        fromDate,
        toDate,
        bookingStatus: "booked",
        paymentId: new ObjectId(paymentId),
        paymentMethod,
        paymentAmount,
        paymentStatus: "success",
        paymentDate: new Date(),
      };

      await bookingsCollection.insertOne(booking);
      res
        .status(201)
        .json({ success: true, message: "Venue booked successfully" });
    }
  } catch (error) {
    console.error("Error booking venue:", error);
    res.status(500).json({ success: false, error: "Error booking venue" });
  }
}

module.exports = { BookVenue };
