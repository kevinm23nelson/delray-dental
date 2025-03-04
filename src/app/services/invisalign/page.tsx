"use client";
import Image from "next/image";
import React, { useRef, ReactNode } from "react";
import Container from "@/components/shared/Container";
import Link from "next/link";
import ArrowCircleIcon from "@/components/shared/ArrowCircleIcon";
import WhiteArrowCircleIcon from "@/components/shared/WhiteArrowCircleIcon";
import { motion, useInView } from "framer-motion";

interface AnimatedContentProps {
  children: ReactNode;
  direction?: "left" | "right";
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  direction = "right",
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, {
    once: true,
    margin: "-100px",
    amount: 0.3,
  });

  const variants = {
    hidden: {
      opacity: 0,
      x: direction === "right" ? 30 : -30,
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

const DentalImplant = () => {
  const instructions = [
    {
      title: "Step 1:",
      content:
        "Schedule a FREE Evenly Invisalign consultation at Delray Dental Ritota & Ritota",
    },
    {
      title: "Step 2:",
      content:
        "An Evenly expert treatment coordinator will scan your teeth and create an AI-powered model of what your smile will look like at the end of treatment.",
    },
    {
      title: "Step 3:",
      content:
        "After starting treatment, Evenly Orthodontics will manage your treatment weekly from the comfort of your home, resulting in faster results and fewer visits to the office.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative h-[400px] w-full">
        {" "}
        <div className="absolute inset-0">
          <Image
            src="/images/backgrounds/patient-resources.jpg"
            alt="Dental Office"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4 drop-shadow-lg">
            Invisalign in Delray Beach, Florida
          </h1>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
          >
            Appointments
          </Link>
        </div>
      </div>

      {/* Main Content Sections */}
      <section className="bg-sky-500 pt-12">
        <Container className="px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-sky-400 p-8 lg:p-10 rounded-t-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <AnimatedContent direction="left">
                <div className="text-white space-y-4">
                  <h2 className="text-3xl font-bold">Invisalign</h2>
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 pt-1">
                      <WhiteArrowCircleIcon />
                    </div>
                    <p className="text-lg leading-relaxed">
                      We&apos;ve partnered with Evenly Orthodontics to offer
                      Invisalign -{" "}
                      <span className="font-bold">
                        the world&apos;s most advanced clear aligner system.
                        With over twelve million successful cases, Invisalign is
                        the world&apos;s leading provider of healthy, beautiful
                        smiles.
                      </span>{" "}
                      To discuss Invisalign in the Delray Beach, FL area please
                      feel free to schedule your{" "}
                      <span className="font-bold bg-indigo-200 px-1 rounded">
                        FREE APPOINTMENT!
                      </span>{" "}
                    </p>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent direction="right">
                <Image
                  src="/images/services/invisalignLogo.png"
                  alt="Tooth Implant"
                  width={500}
                  height={600}
                  className="rounded-xl shadow-xl mx-auto bg-white"
                />
              </AnimatedContent>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-gray-100 pb-12">
        <Container className="px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white p-8 lg:p-10 rounded-b-xl">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1">
                <AnimatedContent direction="left">
                  <Image
                    src="/images/services/invisalign.jpg"
                    alt="Teeth Cleaning"
                    width={300}
                    height={400}
                    className="rounded-xl shadow-xl mx-auto"
                  />
                </AnimatedContent>
              </div>
              <div className="md:col-span-2">
                <AnimatedContent direction="right">
                  <div className="space-y-6">
                    <div className="space-y-4 text-gray-800">
                      <h2 className="text-3xl font-bold">
                        Why choose Evenly for Invisalign?
                      </h2>

                      <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0">
                          <ArrowCircleIcon />
                        </div>
                        <div>
                          <p className="text-lg leading-relaxed">
                            <span className="font-bold">
                              Invisalign clear aligners -
                            </span>{" "}
                            We exclusively use Invisalign, no other aligner
                            brand compares.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0">
                          <ArrowCircleIcon />
                        </div>
                        <div>
                          <p className="text-lg leading-relaxed">
                            <span className="font-bold">
                              Teeth straightening experts -
                            </span>{" "}
                            Evenly&apos;s expert Orthodontists supervise every
                            treatment.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0">
                          <ArrowCircleIcon />
                        </div>
                        <div>
                          <p className="text-lg leading-relaxed">
                            <span className="font-bold">Convenient -</span> No
                            unnecessary office visits with our remote treatment
                            management.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0">
                          <ArrowCircleIcon />
                        </div>
                        <div>
                          <p className="text-lg leading-relaxed">
                            <span className="font-bold">Fast results -</span>{" "}
                            Straighten your teeth in as little as 6 months.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0">
                          <ArrowCircleIcon />
                        </div>
                        <div>
                          <p className="text-lg leading-relaxed">
                            <span className="font-bold">Affordable -</span>{" "}
                            Finance up to 100% of your treatment with monthly
                            payments.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0">
                          <ArrowCircleIcon />
                        </div>
                        <div>
                          <p className="text-lg leading-relaxed">
                            <span className="font-bold">Kids and teens -</span>{" "}
                            We treat cases in kids and teens from ages 7 and up.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Link
                        href="/services/teeth-whitening"
                        className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
                      >
                        Book Here Through Evenly
                      </Link>
                    </div>
                  </div>
                </AnimatedContent>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Instructions Section */}
      <section className="bg-sky-500 py-12">
        <Container className="px-6 lg:px-8">
          <div className="max-w-5xl mx-auto bg-sky-400 p-6 lg:p-8 rounded-xl">
            <AnimatedContent direction="right">
              {/* Invisalign Instructions */}
              <div className="rounded-lg">
                <h2 className="text-3xl font-bold text-white text-center mb-8">
                  How does the Evenly Invisalign process work?
                </h2>
                <div className="space-y-8">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-6 items-start">
                      <div className="flex-shrink-0 pt-1">
                        <WhiteArrowCircleIcon />
                      </div>
                      <div>
                        <span className="text-xl font-bold text-white block mb-2">
                          {instruction.title}
                        </span>
                        <p className="text-lg text-white leading-relaxed">
                          {instruction.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 text-center">
                <p className="text-2xl text-white font-medium mb-6">
                  Book your{" "}
                  <span className="bg-indigo-200 text-sky-500 px-1 rounded">
                    FREE
                  </span>
                  <span> </span>
                  consultation and see just how quickly you can achieve the
                  smile you&apos;ve always wanted!
                </p>
                <Link
                  href="https://www.evenly.com//pages/evenly-orthodontics-delray-dental-ritota-ritota-p-a"
                  target="_blank"
                  className="inline-flex items-center px-8 py-3 bg-white hover:bg-gray-100 text-sky-500 text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
                >
                  Book Invisalign Appointment Here
                </Link>
              </div>
            </AnimatedContent>
          </div>
        </Container>
      </section>

      {/* Bottom Button Section */}
      <section className="bg-gray-100 py-16">
        <Container className="px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white p-8 lg:p-10 rounded-xl">
            <div className="text-center space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Check out our other great dental services
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/services"
                  className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out w-full sm:w-auto justify-center"
                >
                  All Services
                </Link>
                <Link
                  href="/services/teeth-whitening"
                  className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out w-full sm:w-auto justify-center"
                >
                  Whitening
                </Link>
                <Link
                  href="/services/dental-implants"
                  className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out w-full sm:w-auto justify-center"
                >
                  Implants
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default DentalImplant;
