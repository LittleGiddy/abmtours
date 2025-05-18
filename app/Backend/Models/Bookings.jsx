 import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  travelType: String,
  tripEnhancements: [String],
  accommodation: String,
  airportPickup: String,
  expectedDate: String,
  budget: String,
  startDate: String,
  nights: String,
  adults: String,
  children: String,
  destinations: [String],
  additionalInfo: String,
  agreeToTerms: Boolean,
  agreeToInfo: Boolean,
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
