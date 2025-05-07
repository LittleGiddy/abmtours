import React from "react";
import Image from "next/image";


type Props = {
  image: string;
  title: string;
  description: string;
};
const WhyUsCard = ({ image, title, description }: Props) => {
  return (
    <div>
      <Image
        src={image}
        width={90}
        height={90}
        alt="image"
        className="mx-auto"
      />
      {/* content */}
      <h1 className="mt-6 text-center  text-gray-900 font-medium text-xl">
        {title}
      </h1>
      <p className="mt-2 text-center text-s font-medium text-gray-400">
       {description}
      </p>
    </div>
  );
};

export default WhyUsCard;
