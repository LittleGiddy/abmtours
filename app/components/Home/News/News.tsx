import React from "react";
import SectionHeading from "../../Helper/SectionHeading";
import NewsCards from "./NewsCards";

const newsData = [
  {
    slug: "serengeti-national-park",
    image: "/images/Giraffe.jpg",
    title: "Serengeti National Park",
    description: "Serengeti is one of Africa’s most celebrated parks..."
  },
  {
    slug: "ruaha-national-park",
    image: "/images/elephant.jpg",
    title: "Ruaha National Park",

    description: "A remote wilderness teeming with wildlife, where..."
  },
  {
    slug: "ngorongoro-Conservation-area",
    image: "/images/ngorongoro3.jpg",
    title: "Ngorongoro Conservation Area",
    description: "The Ngorongoro Conservation Area, a UNESCO World..."
  },
  {
    slug: "tarangire-national-park",
    image: "/images/tarangire2.jpg",
    title: "Tarangire National Park",
    description: "Join fellow travelers on an unforgettable journey through Tanzania..."
  },
  {
    slug: "tourist-adventures",
    image: "/images/Tourists.jpg",
    title: "Ngorongoro Crater",
    description: "Join fellow travelers on an unforgettable journey through Tanzania..."
  },
  {
    slug: "waterfall-views",
    image: "/images/water.jpg",
    title: "Zanzibar Beach",
    description: "Discover breathtaking waterfalls hidden in Tanzania’s forests..."
  },
  {
    slug: "wild-elephantt",
    image: "/images/elephant.jpg",
    title: "Mafia Island",
    description: "Get up close with majestic elephants roaming the savannah..."
  },
  {
    slug: "giraffe-spottingg",
    image: "/images/Giraffe.jpg",
    title: "Mahale National Park",
    description: "Experience the beauty of giraffes in their natural habitat..."
  }
];

const News = () => {
  return (
    <div className="pt-16 pb-16">
      {/* Section Heading */}
      <SectionHeading
        heading="Visit your Desired Place in Tanzania"
        tagline="Discover & Experience Tanzania – Your Dream Destination Awaits!"
      />

      {/* Grid Container */}
      <div className="w-[80%] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {newsData.map((news) => (
          <NewsCards
            key={news.slug}
            slug={news.slug}
            image={news.image}
            title={news.title}
            description={news.description}
          />
        ))}
      </div>
    </div>
  );
};

export default News;
