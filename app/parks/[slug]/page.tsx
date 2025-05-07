// app/pages/ParkDetailsPage.tsx

"use client";

import { useParams } from "next/navigation";
import { parkData } from "@/app/data/parkData";
import Image from "next/image";
import HowToBook from "@/app/components/Home/HowToBook/HowToBook";

const ParkDetailsPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const park = parkData[slug];

  if (!park) {
    return (
      <div className="text-center py-20 text-red-600">Park not found.</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Banner Section */}
      <section className="w-full">
        <div className="relative w-full h-[60vh]">
          <Image
            src={park.gallery[0]}
            alt={park.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6 z-10">
            <div>
              <h1 className="text-4xl font-bold">{park.title}</h1>
              <p className="mt-4 text-lg max-w-2xl mx-auto">
                {park.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities */}
      <div className="mb-12 px-6 py-10 max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 text-blue-950">{park.title}</h1>

        {/* Description 2 */}
        <p className="text-lg text-gray-700 mb-4">{park.description2}</p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Activities
        </h2>
        <ul className="list-disc list-inside text-gray-700">
          {park.activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>

      {/* Gallery */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {park.gallery.map((img, index) => (
            <div
              key={index}
              className="w-full h-40 relative rounded overflow-hidden shadow"
            >
              <Image
                src={img}
                alt={`Gallery image ${index}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Wildlife */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Typical Wildlife
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {park.wildlife &&
            park.wildlife.map((animal, index) => (
              <div key={index} className="text-center">
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden shadow">
                  <Image
                    src={animal.image}
                    alt={animal.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700">
                  {animal.name}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Visit Table (optional, only if your data has it) */}
      {/* Visit Table (optional, only if your data has it) */}
      {park.visitTable && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Best Time to Visit
          </h2>
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="min-w-full table-auto text-center text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  {park.visitTable.months.map((month, i) => (
                    <th key={i} className="px-3 py-2">
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-t">
                  {park.visitTable.status.map((status, i) => {
                    const statusColor =
                      status === "BEST"
                        ? "text-green-600 font-bold"
                        : status === "GOOD"
                          ? "text-blue-600 font-semibold"
                          : status === "OKAY"
                            ? "text-gray-600 font-medium"
                            : "text-red-600 font-semibold";

                    return (
                      <td key={i} className={`px-3 py-2 ${statusColor}`}>
                        {status}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Optional Notes */}
          <div className="mt-4 text-sm text-gray-600">
            {park.visitTable.notes.map((note, i) => (
              <div key={i} className="mb-1">
                <span className="font-medium text-gray-800">
                  {`${park.visitTable.months[note.range[0]]} – ${park.visitTable.months[note.range[1]]}`}
                  :{" "}
                </span>
                {note.text}
              </div>
            ))}
          </div>
        </div>
      )}
      <HowToBook />
    </div>
  );
};

export default ParkDetailsPage;
