import React from "react";


const BestTimeToVisit = () => {
  const destinations = [
    {
      title: "National Parks",
      color: "text-gray-900",
      details: [
        { text: "Best Time: June – October (Dry Season) → Best for game viewing & Great Migration" },
        { text: "Wet Season: November – May → Lush landscapes, fewer tourists, great for calving season & birdwatching" },
        { text: "Avoid: March – May (Heavy rains in some areas)", color: "text-gray-900" },
      ],
    },
    {
      title: "Zanzibar & The Coast",
      color: "text-gray-900",
      details: [
        { text: "Best Time: June – October → Cool, dry, perfect for beach relaxation" },
        { text: "Alternative: December – February → Warm & sunny, great for diving & snorkeling" },
        { text: "Avoid: March – May (Heavy rains can limit beach activities)", color: "text-gray-900" },
      ],
    },
    {
      title: "Mount Kilimanjaro",
      color: "text-gray-900",
      details: [
        { text: "Best Time: January – March & June – October → Clear skies & ideal trekking conditions" },
        { text: "Avoid: April – May (Heavy rains make trails slippery & difficult)", color: "text-gray-900" },
      ],
    },
  ];

  return (
    <div className="pt-20 pb-20 flex items-center justify-center flex-col bg-gray-300">
      <div className="w-[80%] mx-auto grid items-center grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Text content */}
        {destinations.map((destination, index) => (
        <div key={index} className="mb-6">
          <h2 className={`text-lg font-bold ${destination.color}`}>{destination.title}</h2>
          <ul className="list-disc list-inside text-gray-900">
            {destination.details.map((detail, idx) => (
              <li key={idx} className={detail.color || ""}>{detail.text}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  
    
    </div>
  );
};

export default BestTimeToVisit;
