"use client";
import Image from "next/image";
import React, { useRef, ReactNode } from "react";
import Container from "@/components/shared/Container";
import Link from "next/link";
import ArrowCircleIcon from "@/components/shared/ArrowCircleIcon";
import { motion, useInView } from "framer-motion";
import BackToTop from "@/components/shared/BackToTop";

interface AnimatedContentProps {
  children: ReactNode;
  direction?: "left" | "right";
}

const AnimatedContent = ({
  children,
  direction = "right",
}: AnimatedContentProps) => {
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

const PreOperative = () => {
  const instructions = [
    `Time is set aside specifically to place your dental implants. We have reserved enough time to insure that the operation proceeds smoothly so that the outcome will be successful. If you feel you will have any problem keeping your appointment, please give us as much notice as possible so that we might utilize your time for another patient.`,

    `Generally, patients are provided with three prescriptions prior to the surgical visit. The first prescription is an antibiotic and it should be started 24 hours before the scheduled surgery. The second prescription is an antibacterial mouth rinse. This too should be started one week prior to the surgery. The antibiotics are usually taken four times a day: once every 6 hours. The rinse is used in the morning after brushing your teeth and at night before bed. The third prescription is for any discomfort that you might have after the surgery. Fill that prescription and have the medication available if you should need it.`,

    `Please wear loose fitting clothing for the surgery. You may eat before the surgery since there will be no general anesthetic, but only a light meal is indicated. Stock up on some soft foods and liquids for the initial post-operative course.`,

    `You will be given a chemical ice pack after the surgery. That should be sufficient to get you home. Once at home, make sure that you have enough ice and the means of making an ice pack to use throughout the first two post-operative days.`,

    `You will have stitches in your mouth after the surgery. Whether or not you can use your temporary prosthesis will be discussed with you prior to surgery. If Dr. Ritota feels that it is best, for the success of the implant surgery, that you do not wear your temporary prosthesis, you are urged to comply. Pressure from a temporary prosthesis on healing implants can cause movement and loss of integration and that would cause failure!`,

    `Most people have very little pain following this type of surgery. There is usually, however, some degree of swelling and black and blue. The swelling can be controlled to a great degree by following the post-operative instructions faithfully.`,
  ];

  const instructionsTwo = [
    `Bleeding is excessive and cannot be controlled.`,

    `Discomfort is poorly controlled.`,

    `Swelling is excessive, spreading, or continuing to enlarge after 48 hours.`,

    `Allergies or other reactions to medications occur.`,
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
            Surgical Pre-Operative Instructions
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
            <AnimatedContent>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Pre-Operative Instructions
                </h2>
                <p className="text-xl text-gray-600">
                  The following instructions will help you to prepare for your
                  dental implant surgery.
                </p>
              </div>
            </AnimatedContent>

            <div className="space-y-8">
              {instructions.map((instruction, index) => (
                <AnimatedContent key={index} direction="right">
                  <div className="flex gap-6 items-start bg-white p-6 rounded-lg shadow-sm">
                    <div className="pt-1">
                      <ArrowCircleIcon />
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {instruction}
                    </p>
                  </div>
                </AnimatedContent>
              ))}
            </div>

            {/* Bottom Informational Section */}
            <AnimatedContent>
              <div className="text-left mt-12 mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Office:{" "}
                  <a
                    href="tel:5614953115"
                    className="text-sky-500 hover:text-sky-600 transition-colors font-semibold"
                  >
                    (561) 272-6664
                  </a>
                </h2>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Delray Community Hospital Emergency:{" "}
                  <a
                    href="tel:5614953115"
                    className="text-sky-500 hover:text-sky-600 transition-colors font-semibold"
                  >
                    (561) 495-3115
                  </a>
                </h2>
                <p className="text-xl text-gray-600">
                  Sometimes patients develop such things as allergies to
                  medications (generalized rash, itching, etc…) infection (foul
                  taste, unusual or prolonged swelling), or dry sockets
                  (throbbing pain occurring 3-7 days following the procedure).
                  These and other potential problems are treatable if brought to
                  our attention. If the doctor is not available to talk with you
                  about a problem you are having, you can call the Delray
                  Community Hospital at{" "}
                  <a
                    href="tel:5614953115"
                    className="text-sky-500 hover:text-sky-600 transition-colors font-semibold"
                  >
                    (561) 495-3115
                  </a>
                  , or{" "}
                  <a
                    href="tel:5614953115"
                    className="text-sky-500 hover:text-sky-600 transition-colors font-semibold"
                  >
                    911
                  </a>
                  . In our office, we are doing everything we can to make your
                  surgery as painless and uneventful as possible. However, what
                  you do or do not do following your surgery is important too.
                </p>
                <p className="mt-6 text-xl text-gray-600">
                  DISREGARDING THESE SUGGESTIONS may lead to severe pain and
                  discomfort.
                </p>
              </div>
         

           
              <div className="text-left mt-12 mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Contact the doctor if:
                </h2>
              </div>
            </AnimatedContent>

            <div className="space-y-6">
              {instructionsTwo.map((instruction, index) => (
                <AnimatedContent key={index} direction="right">
                  <div className="flex gap-4 items-center bg-white p-2 rounded-lg shadow-sm">
                    <div className="flex-shrink-0">
                      <ArrowCircleIcon />
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {instruction}
                    </p>
                  </div>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <BackToTop />
    </div>
  );
};

export default PreOperative;
