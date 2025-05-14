import React from "react";
import { FaStar } from "react-icons/fa";
import ReviewSlider from "./ReviewSlider";

const Review = () => {
  return (
    <div className="pt-20 pb-20 flex items-center justify-center flex-col bg-blue-950">
      <div className="w-[80%] mx-auto grid items-center grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Text content */}
        <div>
          <h1 className="text-2xl font-semibold text-white">
            What Do our Customers say about Us?
          </h1>
          <p className="mt-6 text-white">
            Our safari was an unforgettable adventure! The guides were
            knowledgeable, friendly, and made every moment special. We saw
            breathtaking wildlife and stunning landscapes. Highly recommend this
            team for anyone seeking an authentic safari experience!
          </p>

          {/* Ratings */}

          <div className="mt-6 flex items-center space-x-6">
            <div>
              <p className="text-2xl font-bold text-white">4.88</p>
              <p className="text-white mb-2">Overall Rating</p>
              <div className="flex items-center">
                <FaStar className="text-amber-600" />
                <FaStar className="text-amber-600" />
                <FaStar className="text-amber-600" />
                <FaStar className="text-amber-600" />
              </div>
            </div>
          </div>
        </div>
        {/* slider */}
        <div className="overflow-hidden ">
          <ReviewSlider />
        </div>
      </div>
    </div>
  );
};

export default Review;
