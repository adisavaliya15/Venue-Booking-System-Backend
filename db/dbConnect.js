const MongoClient = require("mongodb").MongoClient;

//MongoDB Connection
const connectDB = async () => {
  const dbUrl =
    "YOUR_MONGODB_URL";
  try {
    const client = await MongoClient.connect(dbUrl);
    console.log("DB Connected!");
    return client.db(); // Return the database object for further usage
  } catch (error) {
    console.log("DB Connection Error: ", error);
    throw error;
  }
};

module.exports = connectDB;
