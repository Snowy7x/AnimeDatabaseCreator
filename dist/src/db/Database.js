import mongoose from "mongoose";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
const uri = process.env.DB_URL;
mongoose.set("strictQuery", false);
mongoose.connect(uri, {
    autoIndex: true,
});
mongoose.connection.on("error", (err) => {
    console.log("Database Connection ERROR: " + err.message);
});
mongoose.connection.on("open", () => {
    console.log("Connected to db.");
});
export default mongoose;
