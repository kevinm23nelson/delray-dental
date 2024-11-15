"use client";
import Image from "next/image";
import React, { useRef, ReactNode } from "react";
import Container from "@/components/shared/Container";
import Link from "next/link";
import BlueCheckCircleIcon from "@/components/shared/BlueCheckCircleIcon";
import { motion, useInView } from "framer-motion";

interface AnimatedContentProps {
  children: ReactNode;
  direction?: "left" | "right";
}

const AnimatedContent = ({ children }: AnimatedContentProps) => {
  const contentRef = useRef(null);
  const isInView = useInView(contentRef, {
    once: false,
    margin: "-100px",
    amount: 0.3,
  });

  const variants = {
    hidden: {
      opacity: 0,
      x: 30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={contentRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

const Forms = () => {
  const forms = [
    {
      title: "New Patient Information Packet",
      description:
        "Complete packet for new patients including medical history, insurance information, and office policies.",
      fileName: "New-Patient-Packet-FILLABLE.pdf",
      downloadUrl: "/forms/New-Patient-Packet-FILLABLE.pdf",
    },
    {
      title: "Health History Update",
      description:
        "For established patients to update their medical and dental information.",
      fileName: "Health-History-Update.pdf",
      downloadUrl: "/forms/Health-History-Update.pdf",
    },
    {
      title: "Employment Application",
      description:
        "Application form for employment opportunities at Delray Dental.",
      fileName: "Employment-Delray-Dental-Application-Fillable.pdf",
      downloadUrl: "/forms/Employment-Delray-Dental-Application-Fillable.pdf",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative h-[500px] w-full">
        <div className="absolute inset-0">
          <Image
            src="/images/backgrounds/testimonials.jpg"
            alt="Dental Office"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
            Patient Forms
          </h1>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
          >
            Appointments
          </Link>
        </div>
      </div>

      <section className="py-16 bg-gray-100">
        <Container>
          <div className="max-w-6xl mx-auto">
            <AnimatedContent>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Downloadable Forms
                </h2>
                <p className="text-xl text-gray-600">
                  Save time at your appointment by downloading and completing
                  these forms in advance. Please bring the completed forms with
                  you to your visit.
                </p>
              </div>
            </AnimatedContent>

            {/* Forms Grid */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {forms.map((form, index) => (
    <div 
      key={index} // Move the key prop to the outermost element in the map
      className="overflow-hidden bg-white rounded-xl shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow duration-200"
    >
      <AnimatedContent>
        <a
          href={form.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4"
        >
          <div className="flex-shrink-0 mt-1">
            <BlueCheckCircleIcon />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">
              {form.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {form.description}
            </p>
            <div className="flex items-center text-sky-500 font-semibold">
              Download PDF
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>
          </div>
        </a>
      </AnimatedContent>
    </div>
  ))}
</div>

            {/* Instructions Section */}
            <AnimatedContent>
              <div className="mt-16 p-6 bg-white rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Important Instructions
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Please fill out all forms completely</li>
                  <li>• Bring your completed forms to your appointment</li>
                  <li>• {"Don't"} forget to bring your ID and insurance card</li>
                  <li>
                    • Arrive 15 minutes early if you {"haven't"} completed the forms
                  </li>
                </ul>
              </div>
            </AnimatedContent>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Forms;
