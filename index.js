const express = require("express");
const connectDB = require("./db/dbConnect");
const cors = require("cors");
const { adminLoginApi } = require("./api/admin/adminLoginApi");
const { SignUpApi } = require("./api/registerApi");
const { ViewVenueOwner } = require("./api/admin/viewVenueOwner");
const { ViewVenues } = require("./api/admin/viewVenues");
const { BookVenue } = require("./api/user/bookVenue");
const { ViewVenueBookings } = require("./api/admin/viewBooking");
const multer = require("multer");
const { AddVenue } = require("./api/owner/addVenue");
const { ViewPayments } = require("./api/admin/viewPayments");
const { UserBookingHistory } = require("./api/user/viewBookingHistory");
const { CancleBooking } = require("./api/user/cancelBooking");
const { EditVenue } = require("./api/owner/editVenue");
const { DeleteVenue } = require("./api/owner/deleteVenue");
const { ViewOwnerPayments } = require("./api/owner/viewOwenerPayments");
const { ViewOwenerBooking } = require("./api/owner/viewOwnerBookings");
const { AddReview } = require("./api/user/addReview");
const { GetVenueReviews } = require("./api/owner/getVenueReviews");
const { GetAllReviews } = require("./api/admin/getReviews");
const { SubmitComplaint } = require("./api/user/submitComplaint");
const { GetAllComplaints } = require("./api/admin/viewComplaints");
const session = require("express-session");
const Session = require("./api/session");
const Logout = require("./api/logout");
const { GetCounts } = require("./api/admin/getCount");
const { ViewVenuesbyCity } = require("./api/user/viewVenueByCity");
const { AddDecoration } = require("./api/owner/addDecoration");
const { EditDecoration } = require("./api/owner/editDecoration");
const { DeleteDecoration } = require("./api/owner/deleteDecoration");
const { ownerLoginApi } = require("./api/owner/ownerLoginApi");
const { OwnerSignupApi } = require("./api/owner/ownerRegister");
const { OwnerGetCounts } = require("./api/owner/getCounts");
const { GetOwnVenueDetail } = require("./api/owner/getOwnVenueDetail");
const { GetOwnDecoration } = require("./api/owner/getOwnerDecoration");
const { LoginApi } = require("./api/LoginApi");
const { GetDecorations } = require("./api/user/getDecorations");
const auth = require("./api/middleware/auth");

//initialize app
const app = express();

//initialize PORT No
const PORT = 8000;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Configure express-session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/images", express.static("images"));

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

//!Admin API
app.post("/api/admin/login", adminLoginApi);
app.post("/api/admin/view_venue_bookings", auth, ViewVenueBookings);
app.post("/api/admin/view_payments", auth, ViewPayments);
app.post("/api/admin/view_venue_owner", auth, ViewVenueOwner);
app.post("/api/admin/view_reviews", auth, GetAllReviews);
app.post("/api/admin/view_complaints", auth, GetAllComplaints);
app.post("/api/admin/view_counts", auth, GetCounts);

//!Owener API
app.post("/api/owner/login", ownerLoginApi);
app.post("/api/owner/signup", OwnerSignupApi);
app.post("/api/owner/getOwnVenueDetail", auth, GetOwnVenueDetail);
app.post("/api/owner/getCounts", auth, OwnerGetCounts);
app.post("/api/owner/add_venue", auth, upload.array("images", 3), AddVenue);
app.post("/api/owner/edit_venue", upload.array("images", 3), auth, EditVenue);
app.post("/api/owener/add_decoration", upload.single("image"), AddDecoration);
app.post("/api/owener/get_decoration", auth, GetOwnDecoration);
app.post("/api/owener/editDecoration", upload.single("image"), EditDecoration);
app.post("/api/owener/deleteDecoration", DeleteDecoration);
app.post("/api/owner/delete_venue", DeleteVenue);
app.post("/api/owner/view_bookings", auth, ViewOwenerBooking);
app.post("/api/owner/view_payments", auth, ViewOwnerPayments);
app.post("/api/owner/view_venue_reviews", auth, GetVenueReviews);

//!User API
app.post("/api/signup", SignUpApi);
app.post("/api/login", LoginApi);
app.post("/api/user/book_venue", auth, BookVenue);
app.post("/api/user/view_venue_by_city", ViewVenuesbyCity);
app.post("/api/user/view_decorations", GetDecorations);
app.post("/api/user/view_booking_history", auth, UserBookingHistory);
app.post("/api/user/cancle_booking", auth, CancleBooking);
app.post("/api/user/add_review", auth, AddReview);
app.post("/api/user/submit_complaint", auth, SubmitComplaint);

//!Common APIs
app.post("/api/session", auth, Session);
app.post("/api/view_venues", auth, ViewVenues);
app.post("/api/signup", SignUpApi);
app.post("/api/logout", Logout);

//callback to connect MongoDB
connectDB();

//Activate Server
app.listen(PORT, () => {
  console.log("Server Started on port: ", PORT);
});
