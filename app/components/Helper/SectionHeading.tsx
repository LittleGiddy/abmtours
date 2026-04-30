import React from 'react';

type Props = {
  heading: string;
  tagline?: string;           // make tagline optional
  className?: string;         // allow custom styling
};

const SectionHeading = ({ heading, tagline, className = "" }: Props) => {
  return (
    <div className={`w-[80%] mx-auto text-center ${className}`}>
      <h1 className="text-xl sm:text-3xl text-blue-950 font-bold">
        {heading}
      </h1>
      {tagline && (
        <p className="mt-2 text-gray-700 sm:text-base text-sm font-medium">
          {tagline}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;