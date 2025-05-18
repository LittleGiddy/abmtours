import { connectToDB } from "@/utils/database";
import Booking from "@/models/booking";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      travelType,
      tripEnhancements,
      accommodation,
      airportPickup,
      expectedDate,
      nights,
      budget,
      adults,
      children,
      destinations,
      additionalInfo,
      agreeToTerms,
      agreeToInfo,
    } = body;

    // Normalize children value
    const normalizedChildren =
      children === "None" || children === "0"
        ? 0
        : isNaN(Number(children))
        ? children
        : Number(children);

    // Basic validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !travelType ||
      !accommodation ||
      !airportPickup ||
      !expectedDate ||
      !nights ||
      !budget ||
      !adults ||
      normalizedChildren === undefined ||
      !destinations ||
      !agreeToTerms ||
      !agreeToInfo
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();

    const newBooking = new Booking({
      firstName,
      lastName,
      email,
      phone,
      travelType,
      tripEnhancements,
      accommodation,
      airportPickup,
      expectedDate,
      nights,
      budget,
      adults,
      children: normalizedChildren,
      destinations,
      additionalInfo,
      agreeToTerms,
      agreeToInfo,
    });

    await newBooking.save();

    return NextResponse.json({ message: "Booking request submitted successfully" }, { status: 201 });
  } catch (error) {
    console.error("Booking submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
