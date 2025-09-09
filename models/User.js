import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: { type: String },
  googleId: { type: String },
  favStops: [{ type: String }],
  favRoutes: [{ type: String }]
});

export default mongoose.model("User", userSchema);
