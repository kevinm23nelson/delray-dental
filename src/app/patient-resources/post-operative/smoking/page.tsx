"use client";
// src/app/patient-resources/pre-operative/page.tsx
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import Container from "@/components/shared/Container";
import Link from "next/link";
import ArrowCircleIcon from "@/components/shared/ArrowCircleIcon";
import { ChevronDown } from "lucide-react";
import { motion, useInView } from "framer-motion";
import BackToTop from "@/components/shared/BackToTop";

const AnimatedContent = ({ children, direction = "right" }) => {
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

const AnimatedSubmenu = ({ isOpen, children }) => {
  const contentRef = useRef(null);
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

const Smoking = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const toggleSection = (sectionName: string) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };

  const instructions = [
    {
      //   title: "BLEEDING",
      content: "High School students who smoke: 39%",
    },
    {
      //   title: "MEDICATIONS",
      content: "Kids who become daily smokers each year: 8,100",
    },
    {
      //   title: "EATING",
      content: "Kids alive today who will die from smoking: 35,000",
    },
    {
      //   title: "RINSING AND BRUSHING",
      content:
        "Number of illegally sold packs of cigarettes to kids: 1.7 Million*",
    },
    {
      //   title: "ICE PACKS",
      content: "Someone dies from oral cancer every hour in the U.S.",
    },
    {
      //   title: "ICE PACKS",
      content:
        "The life expectancy of people who smoke is decrease by 14 years.",
    },
  ];

  const smokingInstruction = [
    {
      content:
        "Smokers lose an average of 14 years of life due to their habit.",
    },
    {
      content:
        "With every puff of cigarette you breath in 4,700 different chemicals.",
    },
    {
      content:
        "Smoking turns your teeth yellow by leaving sticky tar deposits which can also cause brown stains.",
    },
    {
      content: "Your fingernails turn yellow",
    },
    {
      content: "Bad breath",
    },
    {
      content: "Second hand smoke harms those around you",
    },
    {
      content: "Smoker’s palate (red inflammation of roof of the your mouth).",
    },
    {
      content:
        "You are more likely to develop calculus, plaque that hardens on your teeth and can only be removed during a professional cleaning.",
    },
    {
      content:
        "Tobacco may also limit blood flow to gum tissue, restricting the necessary nutrients to the bone and periodontal support of the teeth.",
    },
    {
      content:
        "Increased risk and severity of gum recession and gum disease leading to tooth and bone loss.  Tooth loss in smokers occurs at a rate of 2.9 teeth every 10 years for men and 1.5 teeth every 10 years for women (two times the rate of tooth loss in nonsmokers). If you start smoking at age 18 and smoke a pack a day, you could lose four to five teeth by the time you are 35!",
    },
    {
      content:
        "Smoking delays healing after any dental treatment and can lead to a condition know as dry socket after oral surgery.",
    },
  ];

  const instructionTwo = [
    {
      content: "Smoking can cause a black hairy tongue.",
    },
    {
      content: "Frequent tobacco smoking leads to oral lesions.",
    },
    {
      content:
        "Oral cancer of the mouth, pharynx, larynx and esophagus.  Smoking causes 75 % of all oral cancer. The type of tobacco product used will dictate where the oral cancer will be located.",
    },
    {
      content:
        "Smoking before and immediately after receiving periodontal therapy, bleaching, cosmetic dentistry, or oral surgery is not recommended.",
    },
    {
      content:
        "Smokeless tobacco use leads to generalized early-onset periodontitis (gum disease) and an increased risk for oral cancer.",
    },
    {
      content: "Loss of taste.",
    },
    {
      content: "Less success with periodontal treatment and dental implants.",
    },
    {
      content:
        "Tobacco use reduces the delivery of oxygen and nutrients to gingival tissue.",
    },
    {
      content:
        "Tobacco use reduces the delivery of oxygen and nutrients to gingival tissue.",
    },
    {
      content:
        "There are over 4,000 chemicals in cigarette smoke including: formaldehyde, carbon monoxide, ammonia, arsenic.",
    },
    {
      content:
        "The rate of tooth loss due to smoking is about 2.9 teeth every 10 years!",
    },
  ];

  const whatCanYouDo = [
    `Stop smoking and chewing.`,
    `Regular checkups-every 3 months by your dentist for oral cancer examination and professional cleanings.`,
    `Use a mouthwash that is alcohol free and has a antibacterial agent in it, like BreathRX.`,
    `Floss daily (only 33% of people floss). Try the automatic flosser by Waterpik if you do not floss regularly.`,
    `Brush your teeth using an ultrasonic toothbrush 2 times a day, especially in the area where you chew, both before and after. Most importantly brush before you go to bed. (You swallow 3,000 a day while you are awake. Saliva helps neutralize the acids in your mouth. You only swallow about 30 times at night leaving your mouth dry and creating a great environment for dental decay) Brush for 2 to 5 minutes, especially being careful to thoroughly clean at the gum line. Use a timer because most people only brush 20 sec!`,
  ];

  const oralSelfCare = [
    `Checking for any sores on your face, neck or mouth that do not heal within two weeks.`,
    `White, red or dark patches in your mouth.  Use your fingers to pull out your cheek by taking your index finger on the inside of your check and your thumb on the outside and gently squeeze and roll your check with your fingers to check for these items, do this to both checks. Look in a mirror at the roof of your mouth by tilting your head back and with your mouth open looks for discoloration or lumps.`,
    `Swellings, lumps or bumps on your lips, gums, or other areas in your mouth.  You can do this by pulling your lower dip down and look inside for any sores or color changes and feel for lumps, do this with your upper lip too.`,
    `Numbness, pain or loss of feeling in any area of your mouth.`,
    `Check your tongue and floor of your mouth. Pull your tongue gently out and look at each side, top and underside for color changes and feel for any lumps or swelling.`,
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
            Dental Health Tips For Those Who Smoke{" "}
          </h1>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
          >
            Appointments
          </Link>
        </div>
      </div>

      {/* Top Smoking Section */}
      <section className="py-16 bg-gray-100">
        <Container>
          <div className="max-w-4xl mx-auto">
            <AnimatedContent>
              <div className="text-left mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Tobacco and Your Oral Health{" "}
                </h2>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Smoking is the number one worst bad dental habit!{" "}
                </h2>
                <p className="text-xl text-gray-600 mb-2">
                  Each day, more than 3,000 kids, over one million a year,
                  become regular smokers. One-third of them will die prematurely
                  from tobacco-related diseases. Several factors contribute to
                  this national health epidemic, including the roughly $5
                  billion tobacco companies spend each year on advertising and
                  marketing to attract new smokers. More than 30% of our
                  population smokes or chews. This deadly addiction kills more
                  than 400,000 Americans each year. More than 90% of all regular
                  smokers began using tobacco at or before age 18!
                </p>
              </div>
            </AnimatedContent>
            <div className="space-y-1.5">
              {instructions.map((instruction, index) => (
                <AnimatedContent>
                  <div
                    key={index}
                    className="flex gap-5 items-start bg-white p-2 rounded-lg shadow-sm"
                  >
                    <div className="flex-shrink-0">
                      {" "}
                      <ArrowCircleIcon />
                    </div>
                    <div className="text-gray-700 leading-relaxed">
                      {instruction.content}
                    </div>
                  </div>
                </AnimatedContent>
              ))}
            </div>
            {/* Expandable Sections */}
            <div className="space-y-8 mt-12">
              {/* First Consequences Section */}
              <AnimatedContent>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleSection("consequences1")}
                    className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h2 className="text-3xl font-bold text-gray-900">
                      Consequences of Smoking
                    </h2>
                    <ChevronDown
                      className={`h-6 w-6 text-gray-600 transform transition-transform duration-300 ${
                        expandedSection === "consequences1" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatedSubmenu isOpen={expandedSection === "consequences1"}>
                    <div className="px-6 pb-6">
                      <div className="space-y-1.5">
                        {smokingInstruction.map((instruction, index) => (
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
              {/* Second Consequences Section */}
              <AnimatedContent>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleSection("consequences2")}
                    className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h2 className="text-3xl font-bold text-gray-900">
                      Negative Health Effects of Smoking
                    </h2>
                    <ChevronDown
                      className={`h-6 w-6 text-gray-600 transform transition-transform duration-300 ${
                        expandedSection === "consequences2" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatedSubmenu isOpen={expandedSection === "consequences2"}>
                    <div className="px-6 pb-6">
                      <div className="space-y-1.5">
                        {instructionTwo.map((instruction, index) => (
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
              {/* What Can You Do Section */}
              <AnimatedContent>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleSection("whatCanYouDo")}
                    className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h2 className="text-3xl font-bold text-gray-900">
                      What Can You Do?
                    </h2>
                    <ChevronDown
                      className={`h-6 w-6 text-gray-600 transform transition-transform duration-300 ${
                        expandedSection === "whatCanYouDo" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatedSubmenu isOpen={expandedSection === "whatCanYouDo"}>
                    <div className="px-6 pb-6">
                      <div className="space-y-1.5">
                        {whatCanYouDo.map((instruction, index) => (
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
                      <p className="text-xl text-gray-600 mt-4">
                        Are you seriously considering quitting in the next 30
                        days? If you say no you are not ready to quit.
                      </p>
                    </div>
                  </AnimatedSubmenu>
                </div>
              </AnimatedContent>
              <div className="w-full h-px bg-gray-200" /> {/* Divider */}
              {/* Oral Self Care Section */}
              <AnimatedContent>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleSection("oralCare")}
                    className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h2 className="text-3xl font-bold text-gray-900">
                      Oral Cancer Self Examination
                    </h2>
                    <ChevronDown
                      className={`h-6 w-6 text-gray-600 transform transition-transform duration-300 ${
                        expandedSection === "oralCare" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatedSubmenu isOpen={expandedSection === "oralCare"}>
                    <div className="px-6 pb-6">
                      <p className="text-xl font-bold text-gray-900 mb-4">
                        If you have any of these symptoms, perform an oral
                        cancer self examination by:
                      </p>
                      <div className="space-y-1.5">
                        {oralSelfCare.map((instruction, index) => (
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
                      <p className="text-xl text-gray-600 mt-4">
                        If you find anything unusual call us immediately and
                        tell our receptionist about your findings so we can get
                        you in quickly.
                      </p>
                    </div>
                  </AnimatedSubmenu>
                </div>
              </AnimatedContent>
            </div>
            <div className="w-full h-px bg-gray-200 my-12" />{" "}
            {/* Final Divider */}
            {/* Bottom Informational Section */}
            <AnimatedContent>
              <div className="text-left mt-6 mb-12">
                {/* First section with links */}
                <div className="bg-white rounded-lg p-6 mb-8">
                  <p className="text-xl text-gray-600 mb-4">
                    For more information on smoking and dental health visit the{" "}
                    <Link
                      href="https://www.ada.org/"
                      target="_blank"
                      className="text-sky-500 hover:text-sky-600 transition-colors font-semibold"
                    >
                      American Dental Association
                    </Link>
                    .
                  </p>
                  <p className="text-xl text-gray-600 mb-4">
                    Also see:{" "}
                    <Link
                      href="https://www.perio.org/for-patients/gum-disease-information/gum-disease-risk-factors/"
                      target="_blank"
                      className="text-sky-500 hover:text-sky-600 transition-colors font-semibold"
                    >
                      Tobacco Use and Periodontal Disease
                    </Link>
                  </p>
                  <div className="space-y-2">
                    <p className="text-xl text-gray-600 font-semibold">
                      Progression of periodontal disease Smoking can lead to
                      periodontal disease!
                    </p>
                    <p className="text-xl text-gray-600 font-semibold">
                      Smokers are at risk for periodontal disease FOUR TIMES
                      more than nonsmokers!
                    </p>
                  </div>
                  <p className="text-xl text-gray-600 mt-4">
                    Visit{" "}
                    <Link
                      href="https://www.healthcentral.com/"
                      target="_blank"
                      className="text-sky-500 hover:text-sky-600 transition-colors font-semibold"
                    >
                      HealthCentral.com
                    </Link>{" "}
                    to learn more.
                  </p>
                </div>

                {/* Existing content */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Tobacco Quitline Information
                </h2>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Smoking Kills!
                </h2>
                <p className="text-xl text-gray-600">
                  Call 1-866-632-7848 for information, support and follow-up
                  calls as often as you need, anytime, day or night. Certified
                  counselors will develop a personalized "Quit Plan" to help you
                  by setting specific goals and target dates for quitting and
                  strategies for starving off cravings. Follow up calls are
                  offered on a regular schedule to provide ongoing support,
                  advice and encouragement. There is no limit to the number of
                  follow up sessions or calls for support. All information is
                  confidential.
                </p>
                <p className="mt-4 text-l text-gray-600">
                  <span className="font-bold">PLEASE NOTE:</span> The
                  information contained herein is intended for educational
                  purposes only. It is not intended and should not be construed
                  as the delivery of dental/medical care and is not a substitute
                  for personal hands on dental/medical attention, diagnosis or
                  treatment. Persons requiring diagnosis, treatment, or with
                  specific questions are urged to contact your family
                  dental/health care provider for appropriate care. This site is
                  privately and personally sponsored, funded and supported by
                  Drs. John P. & Theodore C. Ritota We have no outside funding.
                  Confidentiality of data including your identity, is respected
                  by this Web site. We undertake to honor or exceed the legal
                  requirements of medical/health information privacy that apply
                  in Florida.
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <Link
                  href="/patient-resources/post-operative/dry-socket"
                  className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
                >
                  Check Out the Effects of Dry Socket
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

export default Smoking;
