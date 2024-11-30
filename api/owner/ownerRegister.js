const connectDB = require("../../db/dbConnect");

async function OwnerSignupApi(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('users');

        const { username, email, phoneNo, password } = req.body;

        if (!username || !email || !phoneNo || !password) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        const userExist = await collection.findOne({ email });
        console.log("UserExist:", userExist);

        if (userExist) {
            return res
                .status(400)
                .json({ success: false, message: "Email Already Exist!" });
        }

        // Create a unique index on the email field if it doesn't already exist
        await collection.createIndex({ email: 1 }, { unique: true, required: true });


        await collection.insertOne({
            username,
            email,
            role: "1",
            phoneNo,
            password
        });

        return res
            .status(201)
            .json({ success: true, message: "Registration Successful" });
    } catch (error) {
        console.error("Registration Failed:", error);
        return res.status(500).json({ success: false, error: "Registration Failed" });
    }
}

module.exports = { OwnerSignupApi };