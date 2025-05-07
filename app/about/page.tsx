import Image from "next/image";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/images/HeroVideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative z-10 px-6">
          <h1 className="text-4xl font-bold">About Our Company</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            We are dedicated to innovation and excellence, striving to create
            meaningful solutions for our clients and communities.
          </p>
        </div>
      </section>

      {/* Company Background Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-semibold">Our Story</h2>
        <p className="mt-4 text-lg text-gray-700">
          ABM Tours and Safaris Ltd was officially registered on June 16, 2023,
          under BRELA with registration number 545389. The company was founded
          to promote domestic and international tourism while preserving and
          showcasing Tanzania’s rich cultural heritage.
        </p>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl text-blue-950 font-semibold">
            Our Mission & Vision
          </h2>
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl text-blue-950 font-bold">Our Mission</h3>
              <p className="mt-2 text-gray-700">
                To provide unique and immersive tourism experiences that
                highlight Tanzania’s natural beauty and rich cultural diversity
                while ensuring sustainable and responsible travel.
              </p>
            </div>
            {/* Vision */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl text-blue-950 font-bold">Our Vision</h3>
              <p className="mt-2 text-gray-700">
                To become one of the top 10 leading cultural and tourism
                companies in Tanzania and East Africa within the next 10 years,
                offering unparalleled services in adventure, wildlife, and
                cultural tourism.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-16 bg-gray-50 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl text-blue-950 font-semibold">
            Meet the Founders
          </h2>
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Image
                src="/images/Agness2.jpg"
                alt="Agness Mdee - CTO"
                width={250}
                height={250}
                className="rounded-full mx-auto"
              />
              <h3 className="mt-4 text-xl font-bold">Agness Mdee</h3>
              <p className="text-gray-600">Co-Founder & CTO</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Image
                src="/images/ossy.jpg"
                alt="Oscar Yesse - CEO"
                width={250}
                height={250}
                className="rounded-full mx-auto"
              />
              <h3 className="mt-4 text-blue-950 text-xl font-bold">
                Oscar Yesse
              </h3>
              <p className="text-gray-600">Co-Founder & CEO</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
