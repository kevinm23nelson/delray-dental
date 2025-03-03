"use client";
import Image from "next/image";
import React, { useState, useRef, ReactNode } from "react";
import Container from "@/components/shared/Container";
import Link from "next/link";
import { ExternalLink, Play } from "lucide-react";
import { motion, useInView } from "framer-motion";

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

interface VideoTestimonial {
  id: string;
  title: string;
  thumbnail: string;
  isShort?: boolean;
}

const VideoTestimonials = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const videoTestimonials: VideoTestimonial[] = [
    {
      id: "f6PldHwWJCs",
      title: "Patient Short Testimonial",
      thumbnail: `https://img.youtube.com/vi/f6PldHwWJCs/0.jpg`,
      isShort: true,
    },
    {
      id: "v5h42qKJV5g",
      title: "Patient Testimonial 1",
      thumbnail: `https://img.youtube.com/vi/v5h42qKJV5g/0.jpg`,
    },
    {
      id: "ouKrl7vqtzo",
      title: "Patient Testimonial 2",
      thumbnail: `https://img.youtube.com/vi/ouKrl7vqtzo/0.jpg`,
    },
    {
      id: "hc1iBed9WJs",
      title: "Patient Testimonial 3",
      thumbnail: `https://img.youtube.com/vi/hc1iBed9WJs/0.jpg`,
    },
    {
      id: "V4svDWDsgb4",
      title: "Patient Testimonial 4",
      thumbnail: `https://img.youtube.com/vi/V4svDWDsgb4/0.jpg`,
    },
    {
      id: "Pu_eA0elD54",
      title: "Patient Testimonial 5",
      thumbnail: `https://img.youtube.com/vi/Pu_eA0elD54/0.jpg`,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Banner Section */}
      <div className="relative h-[300px] sm:h-[400px] w-full">
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
        <div className="relative h-full flex flex-col items-center justify-center space-y-4 sm:space-y-6 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center drop-shadow-lg">
            Our Video Testimonials
          </h1>
          <Link
            href="/"
            className="inline-flex items-center px-6 sm:px-8 py-2 sm:py-3 bg-sky-500 hover:bg-sky-600 text-white text-base sm:text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
          >
            Appointments
          </Link>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="w-full bg-gray-100 py-8 sm:py-16">
        <Container>
          <div className="w-full max-w-6xl mx-auto px-4">
            <AnimatedContent>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Check Out What Our Patients Say
                </h2>
                <p className="text-base sm:text-xl text-gray-600">
                  Watch our patient testimonials
                </p>
              </div>
            </AnimatedContent>

            {/* Two-section layout */}
            <AnimatedContent>
              <div className="space-y-8">
                {/* Featured Short Section */}
                <div className="max-w-xs mx-auto">
                  {videoTestimonials
                    .filter((video) => video.isShort)
                    .map((video) => (
                      <div key={video.id} className="group relative">
                        <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg bg-gray-200">
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            sizes="(max-width: 640px) 80vw, 320px"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40" />
                          <button
                            onClick={() => setActiveVideo(video.id)}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-500 text-white">
                              <Play size={24} fill="white" />
                            </div>
                          </button>
                          <Link
                            href={`https://www.youtube.com/watch?v=${video.id}`}
                            target="_blank"
                            className="absolute bottom-2 right-2 p-1.5 bg-white/90 rounded-lg shadow-md flex items-center gap-1 text-xs font-medium text-gray-700"
                          >
                            <ExternalLink size={14} />
                            <span>Watch</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Regular Videos Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videoTestimonials
                    .filter((video) => !video.isShort)
                    .map((video) => (
                      <div key={video.id} className="group relative">
                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-200">
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40" />
                          <button
                            onClick={() => setActiveVideo(video.id)}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-500 text-white">
                              <Play size={24} fill="white" />
                            </div>
                          </button>
                          <Link
                            href={`https://www.youtube.com/watch?v=${video.id}`}
                            target="_blank"
                            className="absolute bottom-2 right-2 p-1.5 bg-white/90 rounded-lg shadow-md flex items-center gap-1 text-xs font-medium text-gray-700"
                          >
                            <ExternalLink size={14} />
                            <span>YouTube</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </AnimatedContent>

            {/* Bottom Section */}
            <AnimatedContent>
              <div className="mt-8 sm:mt-16 text-center">
                <p className="text-base sm:text-lg text-gray-600">
                  Want to share your experience? We&apos;d love to hear from
                  you!
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-sm"
                >
                  Contact Us
                </Link>
              </div>
            </AnimatedContent>
          </div>
        </Container>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 p-4 flex items-center justify-center"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className={`relative w-full ${
              videoTestimonials.find((v) => v.id === activeVideo)?.isShort
                ? "max-w-[280px]"
                : "max-w-[90vw] sm:max-w-3xl"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-8 right-0 text-white hover:text-gray-300 text-sm"
            >
              Close
            </button>
            <div
              className={
                videoTestimonials.find((v) => v.id === activeVideo)?.isShort
                  ? "aspect-[9/16]"
                  : "aspect-video"
              }
            >
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoTestimonials;
