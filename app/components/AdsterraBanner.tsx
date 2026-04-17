// components/AdsterraBanner.tsx
"use client";
import React from "react";

const AdsterraBanner = () => {
  // Your specific key
  const adKey = "a76e1d096eab2353ff5c7af1f6d5ff0f";

  return (
    <div className="flex justify-center items-center my-4">
      <iframe
        src={`https://www.highperformanceformat.com/watchnew?key=${adKey}`}
        width="320"
        height="50"
        scrolling="no"
        style={{ border: "none", overflow: "hidden" }}
      />
    </div>
  );
};

export default AdsterraBanner;