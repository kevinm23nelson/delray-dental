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
const AnimatedContent = ({ children, direction = "right" }: AnimatedContentProps) => {
  const contentRef = useRef(null);
  const isInView = useInView(contentRef, {
    once: false,
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

const TeethWhitening = () => {
  const instructions = [
    {
      title: "Internet Special:",
      content:
        "New price, only $350.00 for bleaching/whitening tooth take-home kit.",
    },
  ];

  const instructionsTwo = [
    {
      title: "In-Office Special:",
      content: "`Brighten Up Your Smile` - Regularly $550",
      detail:
        "We charge $350 for one session or $500 for two or more in-office whitenings.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative h-[500px] w-full">
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
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
            Teeth Whitening in Delray Beach, Florida
          </h1>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
          >
            Appointments
          </Link>
        </div>
      </div>

      <section className="bg-sky-500 pt-12">
        <Container className="px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-sky-400 p-8 lg:p-10 rounded-t-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <AnimatedContent direction="left">
                <div className="text-white space-y-4">
                  <h2 className="text-3xl font-bold">
                    Teeth Whitening and Bleaching
                  </h2>
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 pt-1">
                      <WhiteArrowCircleIcon />
                    </div>
                    <p className="text-lg leading-relaxed">
                      The dentist office is the best place to start if you’re
                      interested in bleaching your teeth for a whiter smile.
                      While many people seek professional advice and treatment,
                      others try the{" "}
                      <span className="font-bold">
                        non-professional quick-fix solutions,
                      </span>{" "}
                      that may not deliver the desired whitening results. If you
                      are going to get your{" "}
                      <span className="font-bold">teeth whitened,</span> you
                      should do so under a dentist’s supervision.
                    </p>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent direction="right">
                <Image
                  src="/images/services/whitening.jpg"
                  alt="Tooth Implant"
                  width={250}
                  height={400}
                  className="rounded-xl shadow-xl mx-auto"
                />
              </AnimatedContent>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-gray-100">
        <Container className="px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white p-8 lg:p-10 rounded-b-xl">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1">
                <AnimatedContent direction="left">
                  <Image
                    src="/images/services/clear.jpg"
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
                    <div className="flex gap-4 items-start text-gray-800">
                      <div className="flex-shrink-0 pt-1">
                        <ArrowCircleIcon />
                      </div>
                      <p className="text-lg leading-relaxed">
                        <span className="font-bold">
                          We specialize in Whitening and Smile Makeover.
                        </span>{" "}
                        We are an authorized Smile Anew Center. Come in for a
                        brigther smile in just 1 hour! Make an appoint online or
                        give us a call anytime.
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Link
                        href="/services/dental-implants"
                        className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
                      >
                        Check Out Implants
                      </Link>
                    </div>
                  </div>
                </AnimatedContent>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Specials Sections */}
      <section className="bg-gray-100 py-12">
        <Container>
          <div className="space-y-8">
            {instructions.map((instruction, index) => (
              <AnimatedContent key={index} direction="right">
                <div className="flex gap-6 items-start bg-white p-4 rounded-lg shadow-sm">
                  <ArrowCircleIcon />
                  <div className="text-gray-700 leading-relaxed">
                    <span className="font-bold">{instruction.title}</span> New
                    price, only <span className="text-sky-500">$150.00</span>{" "}
                    for bleaching/whitening tooth take-home kit.
                  </div>
                </div>
              </AnimatedContent>
            ))}
          </div>
          <div className="space-y-8 mt-6">
            {instructionsTwo.map((instruction, index) => (
              <AnimatedContent key={index} direction="right">
                <div className="flex gap-6 items-start bg-white p-4 rounded-lg shadow-sm">
                  <ArrowCircleIcon />
                  <div className="text-gray-700 leading-relaxed space-y-2">
                    <div>
                      <span className="font-bold">{instruction.title}</span>{" "}
                      `Brighten Up Your Smile` - Regularly{" "}
                      <span className="text-sky-500">$550</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sky-500 font-bold">-</div>
                      We charge <span className="text-sky-500">$350</span> for
                      one session or <span className="text-sky-500">$500</span>{" "}
                      for two or more in-office whitenings.
                    </div>
                  </div>
                </div>
              </AnimatedContent>
            ))}
          </div>

          {/* View All Services Button */}
          <div className="flex justify-center mt-12">
            <AnimatedContent direction="right">
              <Link
                href="/services"
                className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
              >
                View All Services
              </Link>
            </AnimatedContent>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default TeethWhitening;
