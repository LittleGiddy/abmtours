// lib/models/Package.ts
import mongoose from "mongoose";

// --- Sub-schemas for new enhanced fields ---

// Itinerary block: morning/afternoon/evening
const ItineraryBlockSchema = new mongoose.Schema({
  time: { type: String, default: "" },            // e.g., "Morning", "Afternoon", "Evening"
  description: { type: String, default: "" },
  activities: [{ type: String }],                 // optional list of activities
});

// Itinerary day: can contain multiple blocks
const ItineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, default: "" },
  blocks: [ItineraryBlockSchema],                 // array of time blocks
  meals: [{ type: String }],                      // e.g., ["Breakfast", "Lunch", "Dinner"]
  overnight: { type: String, default: "" },       // name of lodge/camp
});

// Accommodation details (new version, replaces simple accommodationImages)
const AccommodationSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  images: [{ type: String }],                     // array of image URLs
});

// Price tier for group‑size based pricing
const PriceTierSchema = new mongoose.Schema({
  minPax: { type: Number, required: true },
  maxPax: { type: Number, required: true },
  pricePerPerson: { type: Number, required: true },
});

// Enhanced Option schema (backward compatible)
const OptionSchema = new mongoose.Schema({
  // --- Existing fields (keep) ---
  optionTitle: { type: String, required: true },
  description: { type: String, required: true },
  activities: { type: String, default: "" },
  itineraryText: { type: String, default: "" },        // old style simple text
  mainImage: { type: String, required: true },
  accommodationImages: [{ type: String }],             // deprecated, kept for migration
  priceType: { type: String, enum: ["fixed", "tiered", "contact"], default: "fixed" },
  priceAmount: { type: Number, default: null },
  showMoreContent: { type: String, default: "" },

  // --- New enhanced fields (optional) ---
  priceTiers: [PriceTierSchema],                       // for tiered pricing
  itineraryDays: [ItineraryDaySchema],                 // structured daily plan
  accommodation: AccommodationSchema,                  // rich accommodation object
});

// Main Package schema (backward compatible)
const PackageSchema = new mongoose.Schema(
  {
    // --- Existing fields ---
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["Northern Circuit", "Southern Circuit", "Beach Vacation"],
      required: true,
    },
    cardImage: { type: String, required: true },
    shortDescription: { type: String, required: true },
    heroImage: { type: String, required: true },
    overview: { type: String, required: true },
    highlights: [{ type: String }],
    arrivalText: { type: String, required: true },
    quickInfo: [{ type: String }],
    options: [OptionSchema],

    // --- New fields for enhanced experience ---
    mapImage: { type: String, default: "" },            // safari map image URL
    includedList: [{ type: String }],                   // list of "what's included"
    excludedList: [{ type: String }],                   // list of "what's excluded"

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    // Automatically update `updatedAt` on save
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export default mongoose.models.Package || mongoose.model("Package", PackageSchema);