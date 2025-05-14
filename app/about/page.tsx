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

      {/* New Sections (Membership, Services, Team, etc.) */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-left">
        {/* Membership and Certification */}
        <div className="mb-12">
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">Membership &amp; Certification</h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
            <li>Registered with BRELA (Business Registrations and Licensing Agency)</li>
            <li>In partnership with Tanzamerica Safaris for logistical support</li>
          </ul>
        </div>

        {/* Our Services */}
        <div className="mb-12">
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">Our Services</h2>
          <p className="mb-4 text-lg text-gray-700">
            ABM Tours and Safaris Ltd offers a variety of tourism services, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
            <li>Safari and Adventure Tours – Serengeti, Ngorongoro, Tarangire, Selous, and more</li>
            <li>Tour Planning &amp; Consultation – Custom-made travel packages tailored for local and international tourists</li>
            <li>Historical and Heritage Tours – Visits to Bagamoyo, Zanzibar, Kilwa, and other UNESCO heritage sites</li>
            <li>Eco-Tourism and Sustainable Travel – Promoting responsible tourism to conserve nature and support local communities</li>
            <li>Research &amp; Documentation – Studies on African cultures, traditions, and indigenous heritage</li>
            <li>Cultural Tourism – Engaging experiences with Tanzania’s 120+ ethnic groups, including traditional music, food, language, and attire</li>
          </ul>
        </div>

        {/* Our Team */}
        <div className="mb-12">
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">Our Team</h2>
          <p className="text-lg text-gray-700">
            Our team comprises dedicated professionals passionate about tourism, culture, and customer service. We work with certified tour guides, cultural experts, and local communities to deliver authentic and memorable experiences.
          </p>
        </div>

        {/* Safety Policy */}
        <div className="mb-12">
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">Safety Policy</h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
            <li>Partnering with certified tour operators for safe transportation and accommodation</li>
            <li>Providing trained guides and first aid kits for all tours</li>
            <li>Ensuring compliance with Tanzania&apos;s tourism safety regulations</li>
          </ul>
        </div>

        {/* Our Partners */}
        <div className="mb-12">
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">Our Partners</h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
            <li>Tanzamerica Safaris – Supporting with vehicles, tour guides, and logistics</li>
            <li>Local hotels, lodges, and eco-resorts</li>
            <li>Cultural institutions and local artisans</li>
          </ul>
        </div>

        {/* Our Clients */}
        <div className="mb-12">
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">Our Clients</h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
            <li>Local and international tourists</li>
            <li>Cultural enthusiasts and researchers</li>
            <li>Students and educational institutions</li>
            <li>Corporate and private groups</li>
          </ul>
        </div>

        {/* Projects Portfolio */}
        <div className="mb-12">
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">Projects Portfolio</h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
            <li>Community-based tourism initiatives</li>
            <li>Cultural preservation programs</li>
            <li>Social media campaigns for tourism awareness</li>
          </ul>
        </div>

        {/* Our Awards & Recognition */}
        <div>
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">Our Awards &amp; Recognition</h2>
          <p className="text-lg text-gray-700">
            As a young company, we are actively working towards earning industry certifications and awards for our commitment to excellence in tourism and cultural heritage.
          </p>
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
              <p className="text-gray-600">Founder</p>
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
              <p className="text-gray-600">Managing Director</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
