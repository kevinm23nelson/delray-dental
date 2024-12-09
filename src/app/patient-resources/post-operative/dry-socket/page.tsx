"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect, ReactNode } from "react";
import Container from "@/components/shared/Container";
import Link from "next/link";
import ArrowCircleIcon from "@/components/shared/ArrowCircleIcon";
import { ChevronDown } from "lucide-react";
import { motion, useInView } from "framer-motion";
import BackToTop from "@/components/shared/BackToTop";

interface AnimatedContentProps {
  children: ReactNode;
  direction?: "left" | "right";
  isOpen?: boolean;
}

const AnimatedSubmenu = ({ isOpen, children }: AnimatedContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(isOpen ? contentHeight : 0);
    }
  }, [isOpen, children]);

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ height }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  direction = "right",
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, {
    once: true,  // Changed from false to true
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

const DrySocket = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (sectionName: string) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };
  const instructions = [
    {
      //   title: "BLEEDING",
      content:
        "In individuals who smoke too soon! before adequate healing occurs. Smoking: decreases healing, decrease blood supply to the protective blood clot, brings toxic products to the area, injuries the gum tissue and the negative pressure of sucking removes the blood clot from the surgery site.",
    },
    {
      //   title: "MEDICATIONS",
      content:
        "If you do not care for your extraction site as instructed by staff.",
    },
    {
      //   title: "EATING",
      content: "Not following your home care instruction.",
    },
    {
      //   title: "RINSING AND BRUSHING",
      content:
        "Sucking action from smoking, sneezing, coughing, spitting or sucking, within the first 24 hours.",
    },
    {
      //   title: "ICE PACKS",
      content: "Women taking oral contraceptives are more susceptible.",
    },
  ];

  const preventionInstruction = [
    {
      content:
        "Women who use birth control pills or have their teeth removed in the first 22 days of the menstrual cycle are twice as likely to develop dry socket after an extraction. Schedule extractions during the last week of your menstrual cycle (days 23 through 28) when estrogen levels are low or inactive.",
    },
    {
      content: "Avoid drinking through a straw.",
    },
    {
      content: "Avoid smoking, it contaminates the extraction sit.",
    },
    {
      content:
        "Avoid excessive mouth rinsing, it interferes with blood clotting.",
    },
    {
      content:
        "Keeping food from impacting in this area.  Chew on the other side of your mouth and gently rinse your mouth with warm salt water after the first 48 hours.",
      bigDetail: "DO NOT RINSE FOR THE FIRST TWO DAYS!",
    },
  ];

  const treatmentInstruction = [
    `Medication applied to the site.`,
    `Clove oil technique.`,
    `Gauze with medication.`,
  ];

  const additionalInstruction = [
    `Applying topical anesthetic.`,
    `Alvogyl by Septodont.`,
  ];

  const threeFourDaysInstruction = [
    `Good oral health care.`,
    `Avoid food with any residuals…popcorn, peanuts and pasta`,
    `Eat soft foods…mashed potatoes, clear or cream soups that don’t contain any residue, puddings.`,
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
            Dry Socket Treatment in Delray Beach, Florida{" "}
          </h1>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
          >
            Appointments
          </Link>
        </div>
      </div>

      {/* What is a Dry Socket Section */}
      <section className="py-16 bg-gray-100">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* What is a Dry Socket introduction */}
            <AnimatedContent>
              <div className="text-left mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  What is a Dry Socket?{" "}
                </h2>
                <p className="text-xl text-gray-600 mb-4">
                  A “socket” is the area where the tooth was removed.
                </p>
                <p className="text-xl text-gray-600 mb-4">
                  Dry socket is the most common complication of an extraction.
                  It develops in about 5% of tooth extractions. It is very
                  painful condition that is easily treated.
                </p>
                <p className="text-xl text-gray-600 mb-4">
                  Any socket in which a patient is having pain due to the loss
                  of the blood clot thus exposing the bone to air, food, and
                  fluids along with an offensive odor. This often occurs two or
                  more days after an extraction and can last about 5-6 days. It
                  is normal to have soreness and discomfort following an
                  extraction. However, pain should be lessening by the second
                  day.
                </p>
                <p className="text-xl text-gray-600 mb-4">
                  This condition exist when a blood clot is dislodged from the
                  surgery site thus exposing the bone and fine nerve endings.
                  The blood clot helps in the stopping of bleeding and lays the
                  foundation or framework for new tissue and bone to develop
                  over a two-month healing process. This condition is more
                  common in the mandibular area and in back teeth due to poorer
                  circulation in this area, with wisdom teeth being the most
                  common site. Dry socket delays the healing process.
                </p>
                <p className="text-xl text-gray-600">
                  It usually takes gum tissue about 3-4 weeks to heal where as
                  the bone can take up to six months to heal.
                </p>
              </div>
            </AnimatedContent>
            {/* Expandable sections */}
            {/* Commonly Found Section */}
            <AnimatedContent>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleSection("commonlyFound")}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <h2 className="text-3xl font-bold text-gray-900">
                    This condition is most commonly found:
                  </h2>
                  <ChevronDown
                    className={`h-6 w-6 text-gray-600 transform transition-transform duration-300 ${
                      expandedSection === "commonlyFound" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatedSubmenu isOpen={expandedSection === "commonlyFound"}>
                  <div className="px-6 pb-6">
                    <div className="space-y-1.5">
                      {instructions.map((instruction, index) => (
                        <div
                          key={index}
                          className="flex gap-5 items-start bg-white p-2 rounded-lg shadow-sm"
                        >
                          <div className="flex-shrink-0">
                            <ArrowCircleIcon />
                          </div>
                          <div className="text-gray-700 leading-relaxed">
                            {instruction.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedSubmenu>
              </div>
            </AnimatedContent>
            {/* Divider */}
            <div className="w-full h-px bg-gray-200" />
            {/* Prevention Section */}
            <AnimatedContent>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleSection("prevention")}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <h2 className="text-3xl font-bold text-gray-900">
                    Prevention of dry socket:
                  </h2>
                  <ChevronDown
                    className={`h-6 w-6 text-gray-600 transform transition-transform duration-300 ${
                      expandedSection === "prevention" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatedSubmenu isOpen={expandedSection === "prevention"}>
                  <div className="px-6 pb-6">
                    <div className="space-y-1.5">
                      {preventionInstruction.map((instruction, index) => (
                        <div
                          key={index}
                          className="flex gap-5 items-start bg-white p-2 rounded-lg shadow-sm"
                        >
                          <div className="flex-shrink-0">
                            <ArrowCircleIcon />
                          </div>
                          <div className="text-gray-700 leading-relaxed">
                            {instruction.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedSubmenu>
              </div>
            </AnimatedContent>
            <div className="w-full h-px bg-gray-200" /> {/* Divider */}
            {/* Treatment Section */}
            <AnimatedContent>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleSection("treatment")}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <h2 className="text-3xl font-bold text-gray-900">
                    Treatment could include the following:
                  </h2>
                  <ChevronDown
                    className={`h-6 w-6 text-gray-600 transform transition-transform duration-300 ${
                      expandedSection === "treatment" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatedSubmenu isOpen={expandedSection === "treatment"}>
                  <div className="px-6 pb-6">
                    <div className="space-y-1.5">
                      {treatmentInstruction.map((instruction, index) => (
                        <div
                          key={index}
                          className="flex gap-5 items-start bg-white p-2 rounded-lg shadow-sm"
                        >
                          <div className="flex-shrink-0">
                            <ArrowCircleIcon />
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {instruction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedSubmenu>
              </div>
            </AnimatedContent>
            {/* 3-4 Days Section */}
            <AnimatedContent>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleSection("threeFourDays")}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <h2 className="text-3xl font-bold text-gray-900">
                    Continue these instructions for 3-4 days:
                  </h2>
                  <ChevronDown
                    className={`h-6 w-6 text-gray-600 transform transition-transform duration-300 ${
                      expandedSection === "threeFourDays" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatedSubmenu isOpen={expandedSection === "threeFourDays"}>
                  <div className="px-6 pb-6">
                    <div className="space-y-1.5">
                      {threeFourDaysInstruction.map((instruction, index) => (
                        <div
                          key={index}
                          className="flex gap-5 items-start bg-white p-2 rounded-lg shadow-sm"
                        >
                          <div className="flex-shrink-0">
                            <ArrowCircleIcon />
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {instruction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>{" "}
                </AnimatedSubmenu>
              </div>
              {/* At Home Care Section */}
              <div className="text-left mb-6 mt-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Additonal home care instructions:{" "}
                </h2>
              </div>
              <div className="space-y-6">
                {additionalInstruction.map((instruction, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-center bg-white p-2 rounded-lg shadow-sm" // Changed items-start to items-center
                  >
                    <div className="flex-shrink-0">
                      {" "}
                      <ArrowCircleIcon />
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {instruction}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-4 mt-8">
                <Link
                  href="/patient-resources/post-operative/smoking"
                  className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
                >
                  Check Out the Effects of Smoking
                </Link>
              </div>
            </AnimatedContent>
          </div>
        </Container>
      </section>
      <BackToTop />
    </div>
  );
};

export default DrySocket;
