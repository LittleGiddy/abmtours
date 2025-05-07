"use client";
import { destinationData } from "@/app/data/data";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1324 },
    items: 5,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1324, min: 764 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 764, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const DestinationSlider = () => {
  return (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={4000}
      keyBoardControl={true}
    >
      {destinationData.map((data) => {
        return (
          <div key={data.id} className="m-3">
            <div className="relative h-[400px]">
              {/* overlay */}
              <div className="absolute inset-0 bg-black opacity-25 rounded-lg"></div>
              {/* image */}
              <Image
                src={data.image}
                width={500}
                height={500}
                className="h-full w-full object-cover rounded-lg"
                alt=""
              />

              {/* Text Content */}
            </div>
           
            
          </div>
        );
      })}
    </Carousel>
  );
};

export default DestinationSlider;
