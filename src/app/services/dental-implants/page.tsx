"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import Container from "@/components/shared/Container";
import Link from "next/link";
import ArrowCircleIcon from "@/components/shared/ArrowCircleIcon";
import { ChevronDown } from "lucide-react";
import WhiteArrowCircleIcon from "@/components/shared/WhiteArrowCircleIcon";
import { motion, useInView } from "framer-motion";

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
const ContentSection = ({ children, isBlue = false }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: false,
    margin: "-100px",
    amount: 0.3,
  });

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
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
    <section ref={sectionRef}>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {children}
      </motion.div>
    </section>
  );
};

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

const DentalImplant = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (sectionName) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };

  const instructions = [
    {
      title:
        "The following instructions will help you to prepare for your dental implant surgery.",
      content:
        "Time is set aside specifically to place your dental implants.  We have reserved enough time to insure that the operation proceeds smoothly so that the outcome will be successful.  If you feel you will have any problem keeping your appointment, please give us as much notice as possible so that we might utilize your time for another patient.",
    },
    {
      //   title: "MEDICATIONS",
      content:
        "Generally, patients are provided with three prescriptions prior to the surgical visit.  The first prescription is an antibiotic and it should be started 24 hours before the scheduled surgery.  The second prescription is an antibacterial mouth rinse.  This too should be started one week prior to the surgery.  The antibiotics are usually taken four times a day: once every 6 hours.  The rinse is used in the morning after brushing your teeth and at night before bed.  The third prescription is for any discomfort that you might have after the surgery.  Fill that prescription and have the medication available if you should need it.",
    },
    {
      //   title: "EATING",
      content:
        "Please wear loose fitting clothing for the surgery.  You may eat before the surgery since there will be no general anesthetic, but only a light meal is indicated.  Stock up on some soft foods and liquids for the initial post-operative course.",
    },
    {
      //   title: "RINSING AND BRUSHING",
      content:
        "You will be given a chemical ice pack after the surgery.  That should be sufficient to get you home.  Once at home, make sure that you have enough ice and the means of making an ice pack to use throughout the first two post-operative days.",
    },
    {
      //   title: "ICE PACKS",
      content:
        "You will have stitches in your mouth after the surgery.  Whether or not you can use your temporary prosthesis will be discussed with you prior to surgery.  If Dr. Ritota feels that it is best, for the success of the implant surgery, that you do not wear your temporary prosthesis, you are urged to comply.  Pressure from a temporary prosthesis on healing implants can cause movement and loss of integration and that would cause failure!",
    },
    {
      //   title: "ICE PACKS",
      content:
        "You will have stitches in your mouth after the surgery.  Whether or not you can use your temporary prosthesis will be discussed with you prior to surgery.  If Dr. Ritota feels that it is best, for the success of the implant surgery, that you do not wear your temporary prosthesis, you are urged to comply.  Pressure from a temporary prosthesis on healing implants can cause movement and loss of integration and that would cause failure!",
    },
  ];

  const preventionInstruction = [
    {
      title:
        "It is important to follow the directions below during the first two weeks after the operation to insure adequate healing.",
      content:
        "Take your antibiotics and any other prescribed medications as directed and complete the course.  Failure to do so could lead to an infection or poor healing.",
    },
    {
      content:
        "Use ice packs over the surgical area for 20 minutes at a time during the first two days following the operation.  You may also fill your mouth with ice water until it warms up.  These two procedures will greatly reduce any swelling that you might have.",
    },
    {
      content:
        "Use an elevated headrest or an extra pillow for the first two nights after the operation.",
    },
    {
      content:
        "If bleeding begins in the surgical area, apply gentle pressure by biting on a roll of gauze for one hour.",
      bigDetail:
        "If the bleeding does not stop, please call the office immediately (561) 272-6664 where there will be a contact number available on our recording to reach one of the Drs. after hours.",
    },
    {
      content:
        "You may rinse your mouth out gently after the first post-operative day utilizing warm salt water.  Do not use any mouthwash other than what has been prescribed for this surgery.",
    },
    {
      content:
        "You may rinse your mouth out gently after the first post-operative day utilizing warm salt water.  Do not use any mouthwash other than what has been prescribed for this surgery.",
    },
    {
      content:
        "Do not do anything to irritate the surgical area or disturb the stitches.",
    },
    {
      content:
        "If you have any problems or any questions, please contact Dr. Ritota immediately! (561) 272-6664",
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
            Dental Implants in Delray Beach, Florida
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
                  <h2 className="text-3xl font-bold">Dental Implants</h2>
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 pt-1">
                      <WhiteArrowCircleIcon />
                    </div>
                    <p className="text-lg leading-relaxed">
                      Dental Implants are one of the best ways to replace a
                      missing tooth. A complete Implant restoration includes
                      three pieces{" "}
                      <span className="font-bold">
                        the implant, the abutment (which connects the implant to
                        the crown), and the crown,
                      </span>{" "}
                      which replaces your missing tooth. We are glad to provide
                      a FREE consult (with you bringing in appropriate X-rays)
                      to determine if you are a candidate for implants. Give us
                      a call and tell our receptionist you saw the offer for a{" "}
                      <span className="font-bold">
                        FREE DENTAL IMPLANT CONSULTATION
                      </span>{" "}
                      on our website.
                    </p>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent direction="right">
                <Image
                  src="/images/services/implant.jpg"
                  alt="Tooth Implant"
                  width={500}
                  height={600}
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
                    src="/images/services/fillings.jpg"
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
                          We will only recommend IMPLANTS when we feel they are
                          necessary.
                        </span>{" "}
                        We will give you your options, our recommendations, and
                        then together decide which is best for your particular
                        situation. There are often many factors that will
                        determine your individual treatment plan.
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Link
                        href="/services/teeth-whitening"
                        className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
                      >
                        Check Out Whitening
                      </Link>
                    </div>
                  </div>
                </AnimatedContent>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Instructions Sections */}
      <section className="bg-gray-100 py-12">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
              <AnimatedContent direction="right">
            {/* Pre-Operative Instructions */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection("commonlyFound")}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  Pre-Operative Instructions For Patients Receiving Implants
                </h2>
                <ChevronDown
                  className={`h-6 w-6 text-gray-600 transform transition-transform duration-300 ${
                    expandedSection === "commonlyFound" ? "rotate-180" : ""
                  }`}
                />
              </button>
                <AnimatedSubmenu isOpen={expandedSection === "commonlyFound"}>
                  <div className="px-6 pb-6">
                    <div className="font-bold text-gray-900 mb-4">
                      {instructions[0].title}
                    </div>
                    <div className="space-y-4">
                      {instructions.map((instruction, index) => (
                        <div
                          key={index}
                          className="flex gap-4 items-start bg-white rounded-lg"
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

            {/* Post-Operative Instructions */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <AnimatedContent direction="right">
              <button
                onClick={() => toggleSection("prevention")}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  Post-Operative Instructions For Patients Receiving Implants
                </h2>
                <ChevronDown
                  className={`h-6 w-6 text-gray-600 transform transition-transform duration-300 ${
                    expandedSection === "prevention" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatedSubmenu isOpen={expandedSection === "prevention"}>
                  <div className="px-6 pb-6">
                    {preventionInstruction.map((instruction, index) => (
                      <div
                        key={index}
                        className="flex p-1 gap-4 items-start bg-white rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <ArrowCircleIcon />
                        </div>
                        <div className="text-gray-700 leading-relaxed">
                          {index === 3 ? (
                            <>
                              {instruction.content}
                              <div className="font-bold mt-2">
                                If the bleeding does not stop, please call the
                                office immediately{" "}
                                <a
                                  href="tel:561-272-6664"
                                  className="text-sky-500 hover:text-sky-600"
                                >
                                  (561) 272-6664
                                </a>{" "}
                                where there will be a contact number available
                                on our recording to reach one of the Drs. after
                                hours.
                              </div>
                            </>
                          ) : (
                            instruction.content
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
              </AnimatedSubmenu>
                </AnimatedContent>
            </div>
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

export default DentalImplant;
