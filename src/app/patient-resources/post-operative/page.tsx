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

const PostOperative = () => {
  const instructions = [
    {
      title: "BLEEDING",
      content:
        "To prevent unnecessary bleeding, maintain gentle pressure over the socket by biting on gauze placed over the surgical site. You have been given a supply of gauze pads. If more are required, they are readily available in supermarkets and drug stores. A tea bag, which has been moistened and wrapped in a piece of gauze, is also effective. This procedure should be continued for 2-3 hours or until most of the bleeding has stopped. Change the pack every 15-20 minutes or when necessary. It is not unusual to have some slight oozing for up to 24 hours. Rest today and keep your head slightly elevated. Do not engage in physical activity since this promotes bleeding.",
    },
    {
      title: "MEDICATIONS",
      content:
        "Unless you already have your medication, pick it up very soon and take as directed. Generally, a long-acting local anesthetic is used, which may prolong numbness and pain relief for up to 2-5 hours. Take a pain pill when you first feel discomfort. If sedative medications were administered, do not drive for at least 24 hours after the procedure.",
    },
    {
      title: "EATING",
      content:
        " It is important to get adequate nutrition after surgery to help the healing process. You may want to start with fruit juices and then progress to a soft diet. Begin chewing foods when you are able to do so without it hurting. Where your teeth were removed, your jaw is now hollow and somewhat weaker than before. For that reason, you should not chew forcefully for 5-6 weeks. Doing so could bring about a bone fracture.",
    },
    {
      title: "RINSING AND BRUSHING",
      content:
        "Do not rinse for the first 24 hours, since this will contribute to clot dislodgment and dry sockets. After 24 hours, rinse with warm salt water (1/2-teaspoon table salt to 8oz water) every few hours. Besides early rinsing, other actions that can contribute to loss of the clot and potentially painful dry sockets are using a straw and smoking. It is best to refrain from smoking for 4-5 days. Starting on the day after surgery carefully brush in areas of the mouth not affected by the extractions.",
    },
    {
      title: "ICE PACKS",
      content:
        "To help prevent swelling, Ice packs should be applied on the sides of your face adjacent to surgery sites. This is especially important if bone was removed. To the extent possible, apply for periods of 20 minutes on and 5 minutes off until bedtime on the day of surgery. By 48 hours, swelling should be noticeably down. If it is not, check with the doctor. In the event of facial or neck bruising, its resolution can be expedited with frequent heat packs and massage.",
    },
    {
      title: "UNFORSEEN COMPLICATIONS",
      content:
        "If you suspect any problems with the normal course of healing do not hesitate to call immediately. IF YOU SMOKE, AVOID SMOKING DURING THE FIRST WEEK AFTER SURGERY.",
    },
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
            Surgical Post-Operative Instructions
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
                  Post-Operative Instructions
                </h2>
                <p className="text-xl text-gray-600">
                  To insure rapid healing and to avoid complications that could
                  be both harmful and painful to you, please follow these
                  instructions carefully.
                </p>
                <div className="flex justify-center gap-4 mt-8">
                  <Link
                    href="/patient-resources/post-operative/dry-socket"
                    className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
                  >
                    Dry Socket Details
                  </Link>
                  <Link
                    href="/patient-resources/post-operative/smoking"
                    className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
                  >
                    Smoking Effects Details
                  </Link>
                </div>
              </div>
            </AnimatedContent>

            <div className="space-y-8">
              {instructions.map((instruction, index) => (
                <AnimatedContent
                  key={index}
                  direction="right"
                >
                  <div className="flex gap-6 items-start bg-white p-6 rounded-lg shadow-sm">
                    <div className="pt-1">
                      <ArrowCircleIcon />
                    </div>
                    <div className="text-gray-700 leading-relaxed">
                      <span className="font-bold">{instruction.title}:</span>{" "}
                      {instruction.content}
                    </div>
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
                    (561) 495-3115
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
                  about a problem you are having, you can call{" "}
                  <a
                    href="tel:5614953115"
                    className="text-sky-500 hover:text-sky-600 transition-colors font-semibold"
                  >
                    (561) 495-3115
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
            </AnimatedContent>

            <AnimatedContent>
              <div className="text-left mt-12 mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Contact the doctor if:
                </h2>
              </div>
            </AnimatedContent>

            <div className="space-y-6">
              {instructionsTwo.map((instruction, index) => (
                <AnimatedContent
                  key={index}
                  direction="right"
                >
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
      <BackToTop/>
    </div>
  );
};

export default PostOperative;
