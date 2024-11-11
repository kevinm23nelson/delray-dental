import Image from "next/image";
import React from "react";
import Container from "../../components/shared/Container";
import Link from "next/link";
import ArrowCircleIcon from "@/components/shared/ArrowCircleIcon";
import WhiteArrowCircleIcon from "@/components/shared/WhiteArrowCircleIcon";

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative h-[500px] w-full">
        <div className="absolute inset-0">
          <Image
            src="/images/backgrounds/main-smile-one.jpg"
            alt="Dental Office"
            fill
            className="object-cover"
            priority
          />
          {/* Enhanced overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
            Serving Your Dental Needs in Delray Beach, FL
          </h1>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
          >
            Appointments
          </Link>
        </div>
      </div>

      {/* First Section - About Dr. */}
      <section className="bg-gray-100 py-20">
        <Container className="px-6 lg:px-8">
          <div className="bg-white p-[2.5rem] max-w-4xl mx-auto rounded-xl">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-1">
                <Image
                  src="/images/about/john.jpg"
                  alt="Dr. John Ritota"
                  width={400}
                  height={500}
                  className="rounded-xl shadow-xl mx-auto"
                />
              </div>
              <div className="md:col-span-2 text-gray-800 space-y-6">
                <h2 className="text-3xl font-bold mb-6">
                  Meet Dr. John Ritota
                </h2>

                {/* Bio sections with arrows */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 pt-1">
                    <ArrowCircleIcon />
                  </div>
                  <p className="text-lg leading-relaxed">
                    Dr. John Ritota graduated from Ithaca College and Georgetown
                    University School of Dentistry. He is a member of the South
                    Palm Beach County Dental Assn., The New Jersey Dental Assn.,
                    The American Dental Assn., and The Florida Academy of Dental
                    Practice Administration. Dr. John has additional training in
                    IMZ, Stryker, ITI Dental Implant System and completion of
                    the Alabama Implant Congress. His abstract “Observation of
                    thee Auriculotemporal Nerve in Human Specimens” was
                    presented to the American Academy of Oralfacial pain
                    Scientific Congress on temporal mandibular disorders. Dr.
                    John has been published in the Outstanding Young Men In
                    America as a recipient of the Van Cliburn Award and for
                    extensive TMJ Dental Research. Dr. John Ritota is licensed
                    to practice general dentistry in Washington D.C., New
                    Jersey, and Florida.
                  </p>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 pt-1">
                    <ArrowCircleIcon />
                  </div>
                  <p className="text-lg leading-relaxed">
                    Can surgically place and cosmetically restore your dental
                    implants in one convenient location, avoiding the need to
                    travel from office to office. We are always willing to
                    provide a second opinion for FREE!
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 pt-1">
                    <ArrowCircleIcon />
                  </div>
                  <p className="text-lg leading-relaxed">
                    Has been published in Guide to America’s Top Dentists.
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 pt-1">
                    <ArrowCircleIcon />
                  </div>
                  <p className="text-lg leading-relaxed">
                    Has been published in both the “Journal of Oral-Facial Pain”
                    and “Dental Survey”
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 pt-1">
                    <ArrowCircleIcon />
                  </div>
                  <p className="text-lg leading-relaxed">
                    Has lectured extensively in the United States and Canada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Middle Section - All Procedures */}
      <section className="bg-sky-500 py-24">
        <Container className="px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white space-y-6">
                <h2 className="text-3xl font-bold mb-6">
                  All Procedures in One Facility!
                </h2>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 pt-1">
                    <WhiteArrowCircleIcon />
                  </div>
                  <p className="text-xl leading-relaxed">
                    At Ritota & Ritota, patients are our top priority.{" "}
                    <span className="font-bold">"IN PAIN; CALL US!"</span> We
                    pride ourselves on providing the best and most comprehensive
                    dental care possible across a wide range of services,
                    focusing on{" "}
                    <span className="font-bold">
                      EMERGENCY PAIN RELIEF; IMPLANTS, COSMETIC, AND GENERAL
                      DENTISTRY.
                    </span>
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 pt-1">
                    <WhiteArrowCircleIcon />
                  </div>
                  <p className="text-xl leading-relaxed">
                    From teeth whitening, invisible braces and smile makeovers
                    to immediate implants and dental emergencies, we practice
                    the
                    <span className="font-bold"> OLD-FASHIONED WAY</span>;
                    treating you as a person; not a chart number!
                  </p>
                </div>
              </div>
              <div>
                <Image
                  src="/images/about/delray-dental-staff.jpg"
                  alt="Delray Dental Staff"
                  width={600}
                  height={800}
                  className="rounded-xl shadow-xl mx-auto"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Bottom Section - Magazine Feature */}
      <section className="bg-gray-100 py-20">
        <Container className="px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-[2.5rem]">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-1">
                <Image
                  src="/images/about/atlantic-ave-magazine-jan-2020-resized.jpg"
                  alt="Atlantic Ave Magazine Feature"
                  width={400}
                  height={500}
                  className="rounded-xl shadow-xl mx-auto"
                />
              </div>
              <div className="md:col-span-2 text-gray-800 space-y-6">
                <h2 className="text-3xl font-bold">
                  Now Celebrating 42 YEARS in the Same Location!
                </h2>
                <p className="text-lg leading-relaxed">
                  Proudly celebrating our 42nd year in the same location.
                  Conveniently located at the Boca Raton – Delray Beach City
                  line on Federal Highway. Click the image to view an amazing
                  January 2020 article about Drs. Ritotas' 40 years in business
                  as featured in the Atlantic Ave Magazine.
                </p>
                <div className="flex justify-center">
                  {" "}
                  <Link
                    href="https://www.atlanticavemagazine.com/celebrating-its-40th-birthday/"
                    className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
                  >
                    View Article
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AboutUs;
