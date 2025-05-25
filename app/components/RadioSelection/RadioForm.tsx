"use client";

import React, { useState } from "react";

const TravelForm: React.FC = () => {
  const [selectedTravelType, setSelectedTravelType] = useState<string>("");
  const [selectedEnhancements, setSelectedEnhancements] = useState<string[]>([
    "Bush Drive",
    "Night Game Drive",
  ]);

  const travelOptions: string[] = [
    "Vacation",
    "Great Migration",
    "Big 5 Safari",
    "Honeymoon",
    "Safari & Beach",
    "Volunteer",
  ];

  const enhancementOptions: string[] = [
    "Walking Safari",
    "Boat Safari",
    "Bush Drive",
    "Night Game Drive",
    "Other",
    "Beach",
    "Chimps/Guerilla",
  ];

  const handleEnhancementChange = (option: string) => {
    setSelectedEnhancements((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="space-y-6 p-6 border rounded-lg shadow-md">
      {/* Radio Selection - Type of Travel */}
      <div className="space-y-3">
        <label className="block text-lg font-medium">Type of Travel</label>
        <div className="flex flex-wrap gap-4">
          {travelOptions.map((option) => (
            <label
              key={option}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-all ${
                selectedTravelType === option
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 border-gray-300 hover:bg-gray-200"
              }`}
            >
              <input
                type="radio"
                name="travelType"
                value={option}
                checked={selectedTravelType === option}
                onChange={() => setSelectedTravelType(option)}
                className="hidden"
                aria-label={option}
              />
              {option}
            </label>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Selected: {selectedTravelType || "None"}
        </p>
      </div>

      {/* Checkbox Selection - Trip Enhancements */}
      <hr className="border-gray-300" />
      <div className="space-y-3">
        <label className="block text-lg font-medium">Trip Enhancements *</label>
        <div className="flex flex-wrap items-center gap-4">
          {enhancementOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedEnhancements.includes(option)}
                onChange={() => handleEnhancementChange(option)}
                className="checkbox checkbox-primary"
                aria-label={option}
              />
              {option}
            </label>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Selected:{" "}
          {selectedEnhancements.length > 0
            ? selectedEnhancements.join(", ")
            : "None"}
        </p>
      </div>
    </div>
  );
};

export default TravelForm;
