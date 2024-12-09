"use client";
import Image from "next/image";
import React, { useRef, ReactNode } from "react";
import Container from "@/components/shared/Container";
import Link from "next/link";
import BlueCheckCircleIcon from "@/components/shared/BlueCheckCircleIcon";
import { motion, useInView } from "framer-motion";
import BackToTop from "@/components/shared/BackToTop";

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
const Testimonials = () => {
  const testimonials = [
    {
      content:
        "You are all so important to me! THANK YOU for making it so comfortable to come to a dentist's office! I will see you again soon for my recall visits. Sincerely!",
      author: "M.M.",
    },
    {
      content:
        "I have never in my life felt more comfortable and cared for in a dentist's office! I went to see Dr Ritota in extreme pain and very worried about my mouth. The Dr took such great care of me. He was very calming and soothing as he worked on my teeth. I never felt like he was in a rush to see the next patient, as a matter of fact I have never had to wait in the waiting room either. The girls in the office even called me the next day after each appointment. I have since bragged about my new dentist and will be bringing my children to this office!",
      author: "T.E.",
    },
    {
      content:
        "I am so happy with my new smile that I had to write this glowing review of my experience. I recently sought relief from a painful abcessed tooth. The professional courtesy and human understanding I received were beyond compare. Not only were my painful teeth removed by Dr.Ted with careful attention to discomfort but Dr. John gave me a new smile by fixing a chipped and stained front tooth. Plus, the process he used was affordable to me, costing only one forth of more expensive proceedures. Other areas of concern were pointed out to me and a treatment schedule was laid out in a way that fit my budget. Drs. John and Ted are great dentists and good people.",
      author: "R.W.",
    },
    {
      content:
        "Dr. Ritota knows his stuff. My crown was knocked out including the nub that holds it! He had to make a new one but it would have to be held in by magic. He did it. I’m back to normal and can eat apples again thanks to him. I highly recommend him!",
      author: "J.L.",
    },
    {
      content:
        "What can I say? I can start out by saying thank you Royal Palm Bch HS for taking care of your staff and sending me to these 2 great dentist. It’s been close to a month, but throug each stage of putting my permanent bridge back together I can’t believe how terrific my smile turned out. Thanks to your talent as that of your cordial and competent staff! It was your self-admtted “perfectionism” that really made the difference, and for that I give the thumbs up to tell anyone these Dentists are the real deal.",
      author: "C.B.",
    },
    {
      content:
        "Dr. Ritota has been my dentist for 15 yrs & recently did major replacement of old bridgework installed after an accident 18 yrs ago. Thanks to his skill, knowledge & patience I have the best & most comfortable, natural smile I’ve ever had. He’s the best! The staff is kind, competent & supportive.",
      author: "M.K.",
    },
    {
      content:
        "Dr. Ritota has done extensive work on myself, and my wife, over the years. This includes caps and implants. Fantastic staff-Wonderful, caring Doctor-Great smiles for us.",
      author: "W.D.",
    },
    {
      content:
        "Dr. Ritota has been a dentist for a long time and he’s up on the latest research and best practices. He took great care of my aching teeth. Now I’m proud to smile and can do so without any pain! Everyone in the office is friendly and informative. They even made my 5 year old son feel welcome while he waited for me in the comfortable waiting area. His office is in a convenient location in southeast Delray.",
      author: "L.G.",
    },
    {
      content:
        "I have seen many dentists in many, many years and I have to tell you that these guys are better than the best! They have been to the race track before. My treatment was totally professional, and done on a timely basis. Their pricing was completely fair and I might add it was less than the corporate dental firms charge practicing in the area today. My rating is `5/5!` I don’t usually comment, let alone give anybody a 5/5 star rating, but I couldn’t help it — These professionals are great!",
      author: "D.W.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative h-[425px] w-full">
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
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4 drop-shadow-lg">
            Why Our Patients Love Us in Delray Beach, FL{" "}
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
          <div className="max-w-8xl mx-auto">
            <AnimatedContent>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  What Our Patients Say
                </h2>
                <p className="text-xl text-gray-600">
                  Read what our patients have to say about their experience at
                  our practice
                </p>
              </div>
            </AnimatedContent>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {" "}
              {testimonials.map((testimony, index) => (
                <AnimatedContent key={index}>
                  <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 flex flex-col">
                    <div className="flex items-start gap-4 h-full">
                      {" "}
                      <div className="flex-shrink-0 mt-1">
                        <BlueCheckCircleIcon />
                      </div>
                      <div className="space-y-3 flex-grow">
                        {" "}
                        <p className="text-gray-700 text-lg leading-relaxed italic">
                          {`"`}
                          {testimony.content}
                          {`"`}
                        </p>
                        <div className="flex items-center gap-2 mt-auto">
                          {" "}
                          <span className="text-gray-400">•</span>
                          <span className="font-semibold text-gray-900">
                            {testimony.author}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedContent>
              ))}
            </div>

            {/* Bottom Section */}
            <div className="mt-16 text-center">
              <p className="text-lg text-gray-600">
                Want to share your experience? {"We'd"} love to hear from you!
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-sm transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </Container>
      </section>
      <BackToTop />
    </div>
  );
};

export default Testimonials;
