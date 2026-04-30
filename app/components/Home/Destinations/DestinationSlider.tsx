"use client";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1324 }, items: 5, slidesToSlide: 1 },
  tablet: { breakpoint: { max: 1324, min: 764 }, items: 2, slidesToSlide: 2 },
  mobile: { breakpoint: { max: 764, min: 0 }, items: 1, slidesToSlide: 1 },
};

type SliderImage = {
  _id: string;
  url: string;
  alt: string;
};

// Tiny transparent base64 placeholder
const blurDataURL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCYAWTP/9k=";

const DestinationSlider = () => {
  const [images, setImages] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/destination-images');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load images', err);
      setError('Failed to load destination images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // ========== Initial skeleton while fetching from API ==========
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-[400px] rounded-lg w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (images.length === 0) {
    return <p className="text-center text-gray-500">No destination images yet. Please check back later.</p>;
  }

  // ========== Carousel with image‑level blur skeleton ==========
  return (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={4000}
      keyBoardControl={true}
      removeArrowOnDeviceType={["mobile"]}
      arrows={true}
      swipeable={true}
      draggable={true}
      shouldResetAutoplay={false}
    >
      {images.map((img) => (
        <div key={img._id} className="m-3">
          <div className="relative h-[400px] group">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 rounded-lg z-10"></div>
            <Image
              src={img.url}
              alt={img.alt}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 764px) 100vw, (max-width: 1324px) 50vw, 20vw"
              placeholder="blur"
              blurDataURL={blurDataURL}
              priority={false}
            />
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default DestinationSlider;