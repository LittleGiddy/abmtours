// lib/types/package.ts
export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string;
  overnight: string;
}

export interface Accommodation {
  title: string;
  description: string;
  images: string[];
}

export interface TourOption {
  optionTitle: string;
  description: string;
  activities: string;
  itineraryDays: ItineraryDay[];
  mainImage: string;
  accommodation: Accommodation;
  priceType: "fixed" | "contact";
  priceAmount: number | null;
  showMoreContent: string;
}

export interface PackageData {
  _id?: string;
  title: string;
  slug: string;
  category: "Northern Circuit" | "Southern Circuit" | "Beach Vacation";
  shortDescription: string;
  cardImage: string;
  heroImage: string;
  mapImage: string;
  overview: string;
  highlights: string[];
  arrivalText: string;
  quickInfo: string[];
  options: TourOption[];
  createdAt?: Date;
  updatedAt?: Date;
}