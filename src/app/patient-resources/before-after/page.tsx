// src/app/patient-resources/before-after/page.tsx
import Image from "next/image";
import React from "react";
import Container from "../../../components/shared/Container";
import Link from "next/link";
import ImageComparisonSlider from "@/components/shared/ImageComparisonSlider";

const BeforeAfter = () => {
  const beforeAfterCases = [
    {
      id: 1,
      beforeImage: "/images/before-after/before1.jpg",
      afterImage: "/images/before-after/after1.jpg",
      //   description: "Full Mouth Reconstruction"
    },
    {
      id: 2,
      beforeImage: "/images/before-after/before2.jpg",
      afterImage: "/images/before-after/after2.jpg",
      // description: "Full Mouth Reconstruction"
    },
    {
      id: 3,
      beforeImage: "/images/before-after/before3.jpg",
      afterImage: "/images/before-after/after3.jpg",
      // description: "Full Mouth Reconstruction"
    },
    {
      id: 4,
      beforeImage: "/images/before-after/before4.jpg",
      afterImage: "/images/before-after/after4.jpg",
      // description: "Full Mouth Reconstruction"
    },
    {
      id: 5,
      beforeImage: "/images/before-after/before5.jpg",
      afterImage: "/images/before-after/after5.jpg",
      // description: "Full Mouth Reconstruction"
    },
    {
      id: 6,
      beforeImage: "/images/before-after/before6.jpg",
      afterImage: "/images/before-after/after6.jpg",
      // description: "Full Mouth Reconstruction"
    },
    {
      id: 7,
      beforeImage: "/images/before-after/before7.jpg",
      afterImage: "/images/before-after/after7.jpg",
      // description: "Full Mouth Reconstruction"
    },
    {
      id: 8,
      beforeImage: "/images/before-after/before8.jpg",
      afterImage: "/images/before-after/after8.jpg",
      // description: "Full Mouth Reconstruction"
    },
    {
      id: 9,
      beforeImage: "/images/before-after/before9.jpg",
      afterImage: "/images/before-after/after9.jpg",
      // description: "Full Mouth Reconstruction"
    },
    {
      id: 10,
      beforeImage: "/images/before-after/before10.jpg",
      afterImage: "/images/before-after/after10.jpg",
      // description: "Full Mouth Reconstruction"
    },
    {
      id: 11,
      beforeImage: "/images/before-after/before11.jpg",
      afterImage: "/images/before-after/after11.jpg",
      // description: "Full Mouth Reconstruction"
    },
    {
      id: 12,
      beforeImage: "/images/before-after/before12.jpg",
      afterImage: "/images/before-after/after12.jpg",
      // description: "Full Mouth Reconstruction"
    },
    // Add more cases here
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative h-[500px] w-full">
        <div className="absolute inset-0">
          <Image
            src="/images/backgrounds/before-after.jpg"
            alt="Dental Office"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
            Before and After Gallery
          </h1>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
          >
            Appointments
          </Link>
        </div>
      </div>

      {/* Info Section */}
      <section className="bg-sky-500 py-12">
        <Container className="px-6 lg:px-8">
          <div className="items-center">
            <div className="text-white">
              <h2 className="text-4xl font-bold text-center">
                Pre-op and Post-op examples of{" "}
                <span className="font-black text-indigo-200 underline decoration-4">OUR</span> work!
                </h2>
              <h3 className="text-xl font-bold text-center mt-2">
                Click the tab in the middle of each photo to slide left to right
                to view the before and after
              </h3>
            </div>
          </div>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="bg-gray-100 py-20">
        <Container>
          <div className="bg-white p-[2.5rem] rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {beforeAfterCases.map((caseItem) => (
              <div key={caseItem.id} className="space-y-4">
                <ImageComparisonSlider
                  beforeImage={caseItem.beforeImage}
                  afterImage={caseItem.afterImage}
                  beforeAlt={`Before - ${caseItem.description}`}
                  afterAlt={`After - ${caseItem.description}`}
                />
                <h3 className="text-xl font-semibold text-center text-gray-800">
                  {caseItem.description}
                </h3>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default BeforeAfter;
