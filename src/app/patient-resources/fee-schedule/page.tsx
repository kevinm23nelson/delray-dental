// src/app/patient-resources/pre-operative/page.tsx
import Image from "next/image";
import React from "react";
import Container from "@/components/shared/Container";
import Link from "next/link";
import ArrowCircleIcon from "@/components/shared/ArrowCircleIcon";

const PreOperative = () => {
  const instructions = [
    <div key="notice" className="space-y-4">
      <p className="font-bold">Effective May 11, 2017</p>
      <p>
        Due to the changing economic times, come in for a FREE 2nd opinion and
        give us a chance to make you happy by matching or beating any written
        quote you have. Bring X-rays if you have them.
      </p>
      <p>
        These fees ranges are subject to change without notice and may differ
        from patient to patient depending upon individual variations and type of
        implants used. These are included here as an aid to assist you in
        evaluating the feasibility of these procedures for your own dental
        health care.
      </p>
    </div>,
  ];

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
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
            Our Pricing List in Delray Beach, FL
          </h1>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
          >
            Appointments
          </Link>
        </div>
      </div>

      {/* Instructions Section */}
      <section className="py-16 bg-gray-100">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Fee Schedule as of November 2024{" "}
              </h2>
            </div>

            <div className="space-y-8">
              {instructions.map((instruction, index) => (
                <div
                  key={index}
                  className="flex gap-6 items-start bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="pt-1">
                    <ArrowCircleIcon />
                  </div>
                  <div className="text-gray-700 leading-relaxed">
                    {instruction}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Informational Section */}
            <div className="text-left mt-12 mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Implants:
              </h2>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Base Implant Fee:{" "}
                <p className="text-sky-500 hover:text-sky-600 transition-colors font-semibold">
                  $1,500.00 - $2,000.00
                </p>
              </h2>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Abutments (the part that connects the implant to the crown/cap):{" "}
                <p className="text-sky-500 hover:text-sky-600 transition-colors font-semibold">
                  $350.00 - $600
                </p>
              </h2>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Implant Crown Fee (this is in addition to the Abutment Fee):{" "}
                <p className="text-sky-500 hover:text-sky-600 transition-colors font-semibold">
                  $1,500.00 - $2,000.00
                </p>
              </h2>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default PreOperative;
