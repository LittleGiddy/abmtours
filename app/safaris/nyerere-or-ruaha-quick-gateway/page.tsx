"use client";
import { useState } from "react";
import Image from "next/image";

export default function NyerereRuahaPage() {
  const [showMoreOption1, setShowMoreOption1] = useState(false);
  const [showMoreOption2, setShowMoreOption2] = useState(false);

  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <Image
          src="/images/NyererePark.jpg"
          alt="Mikumi and Udzungwa"
          layout="fill"
          objectFit="cover"
          className="absolute z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div className="relative z-20 px-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Nyerere or Ruaha Quick Gateway
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4 text-orange-700">Overview</h2>
        <p className="mb-6">
          This tour gives you a chance to explore two of Tanzania&apos;s most
          breathtaking national parks, Nyerere and Ruaha. Each location offers
          a unique blend of wildlife, landscapes, and unforgettable safari
          experiences.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-orange-700">Highlights</h2>
        <ul className="list-disc list-inside mb-6">
          <li>Unforgettable wildlife encounters</li>
          <li>Boat and walking safaris in Nyerere</li>
          <li>Remote and less crowded Ruaha National Park</li>
          <li>Cultural village tours</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 text-orange-700">Arrival</h2>
        <p className="mb-6">
          You will take a shared or private air transfer from Dar Es Salaam or
          Zanzibar to either Nyerere or Ruaha depending on the package you
          select.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-orange-700">
          Quick Information
        </h2>
        <ul className="list-disc list-inside mb-6">
          <li>Destinations: Nyerere and/or Ruaha</li>
          <li>Activities: Game Drives, Walking Safaris, Boat Safaris, etc.</li>
          <li>Best Time to Visit: June - October (Dry Season)</li>
        </ul>

        {/* Option 1 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center text-orange-700">
            Option 1
          </h2>
          <div className="border rounded-lg p-4 mb-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">
                3 Nights Nyerere National Park
              </h3>
              <p className="text-orange-700 text-sm mb-2">
                Private Walking | Boat Safari | Game Drive | Bird Watching |
                Fishing | Village Tour
              </p>
              <p>
                Once you arrive at Nyerere National Park airstrip, you will meet
                our guide who will transfer you to the lodge/camp.
              </p>
              <p>
                For the next three days, you will discuss with your assigned
                tour guide any activities that are planned that day.
              </p>
              <p>
                Your tour guide may mention going on a game drive, which is
                usually the highlight of a safari.
              </p>
              <p>
                Game drives are the quintessential African adventure and allow
                you to see a wide variety of wildlife from the comfort of your
                pop-top roof or open-sided 4WD 4x4 vehicle.
              </p>

              {showMoreOption1 && (
                <>
                  <p>
                    Your guide will introduce you to the various African
                    wildlife spotted during your game drive and share his/her
                    knowledge of the wildlife and their habitats with you.
                  </p>
                  <p>
                    A huge variety of wildlife can be seen, such as elephants,
                    giraffes, impalas, lions, zebras, wildebeest, hippos,
                    warthogs, wild dogs, leopards, and waterbuck.
                  </p>

                  <p>
                    Nyerere National Park is one of the very few places in
                    Africa where it is possible to view wildlife from the water.
                    Boat Safari is a two to three-hour long boat ride along the
                    Rufiji River, preferably in the morning or in the afternoon.
                  </p>
                  <p>
                    Here you will see Hippos, Crocodiles, and plentiful diverse
                    bird species. Monkeys (Blue Monkeys, Savannah Baboons, and
                    Black and White Colobus Monkeys) are often spotted in the
                    trees along the banks of the river. The boat will stop off
                    on a sandbank where you can stretch your legs and enjoy a
                    cool drink.
                  </p>

                  <p>
                    Walking safaris are a fantastic way to get close to nature
                    and learn more about the smaller species and the bush
                    itself. You will get an opportunity to learn about the
                    things you missed from a vehicle or boat.
                  </p>
                  <p>
                    You will be accompanied by our tour guide and an armed
                    ranger for this two to three hours tour.
                  </p>

                  <p>
                    Other activities include Birdwatching and Fishing. All meals
                    and local wines will be provided.
                  </p>
                  <p>
                    You will have all-inclusive accommodation with three meals
                    daily.
                  </p>

                  <h3 className="text-lg font-semibold mt-4 mb-1">
                    Sample Itinerary:
                  </h3>
                  <p>Day 1 - Arrival, get your coffee/tea, then do an evening Game Drive.</p>
                  <p>Day 2 - All day private Game Drive with a picnic lunch.</p>
                  <p>Day 3 - Morning shared Boat Safari then Private Game Drive in the afternoon.</p>
                  <p>Day 4 - Shared air transfer back to Dar Es Salaam or Zanzibar.</p>
                </>
              )}

              <button
                onClick={() => setShowMoreOption1(!showMoreOption1)}
                className="text-orange-600 font-semibold mt-2 hover:underline cursor-pointer"
              >
                {showMoreOption1 ? "Show less" : "Read more"}
              </button>
            </div>
            <div>
              <Image
                src="/images/Nyerere2.jpg"
                alt="Buffalo at Nyerere"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">
            Nyerere National Park Accommodations
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
            <Image src="/images/Manze.jpg" alt="Camp 1" width={300} height={200} className="rounded-lg" />
            <Image src="/images/RufijiCamp.jpg" alt="Camp 2" width={300} height={200} className="rounded-lg" />
            <Image src="/images/Kulinda.jpg" alt="Camp 3" width={300} height={200} className="rounded-lg" />
            <Image src="/images/NyeereCamp.jpg" alt="Camp 4" width={300} height={200} className="rounded-lg" />
          </div>
        </section>

        {/* Option 2 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center text-orange-700">
            Option 2
          </h2>
          <div className="border rounded-lg p-4 mb-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">
                3 Nights in Ruaha National Park
              </h3>
              <p className="text-orange-700 text-sm mb-2">
                Game Drives | Walking Safari | Cultural Experience | Photography | Birdwatching
              </p>
              <p>
                Arrive at Ruaha via shared or private charter where your guide will meet you for transfer to your lodge.
              </p>
              <p>
                Ruaha offers dramatic landscapes and is known for its large elephant and predator populations.
              </p>
              <p>
                Your days will include morning and afternoon game drives through baobab-studded wilderness and along the Great Ruaha River.
              </p>

              {showMoreOption2 && (
                <>
                  <p>
                    Walking safaris will give you an intimate experience with the bush, guided by an expert and a park ranger.
                  </p>
                  <p>
                    Cultural visits to nearby villages are included where you&apos;ll learn about local traditions and lifestyle.
                  </p>
                  <p>
                    Meals are served at the lodge, offering scenic views and often visited by wildlife like elephants and kudu.
                  </p>

                  <h3 className="text-lg font-semibold mt-4 mb-1">
                    Sample Itinerary:
                  </h3>
                  <p>Day 1 - Arrival and sunset Game Drive</p>
                  <p>Day 2 - Full day Game Drive with picnic lunch</p>
                  <p>Day 3 - Walking Safari in the morning, Cultural Visit in the afternoon</p>
                  <p>Day 4 - Final Game Drive and air transfer back</p>
                </>
              )}

              <button
                onClick={() => setShowMoreOption2(!showMoreOption2)}
                className="text-orange-600 font-semibold mt-2 hover:underline cursor-pointer"
              >
                {showMoreOption2 ? "Show less" : "Read more"}
              </button>
            </div>
            <div>
              <Image
                src="/images/RuahaLast.jpg"
                alt="Ruaha Landscape"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">
            Ruaha National Park Accommodations
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
            <Image src="/images/Ikukaamp.jpg" alt="Ikuka Camp" width={300} height={200} className="rounded-lg" />
            <Image src="/images/MwagusiCamp.jpg" alt="MwagusiCamp" width={300} height={200} className="rounded-lg" />
            <Image src="/images/Kigelia.jpg" alt="Kigelia Camp" width={300} height={200} className="rounded-lg" />
            <Image src="/images/Mdonya.jpg" alt="Mdonya Camp " width={300} height={200} className="rounded-lg" />
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-16 text-center">
          <a
            href="/ContactUs"
            className="inline-block bg-blue-950 text-white py-3 px-6 rounded-full text-lg hover:bg-blue-900 transition"
          >
            Contact Us to Book
          </a>
        </section>
      </div>
    </main>
  );
}
