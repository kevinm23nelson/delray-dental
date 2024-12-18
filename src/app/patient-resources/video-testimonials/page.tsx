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
      isShort: true
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative h-[400px] w-full">
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
            Our Video Testimonials in Delray Beach, FL
          </h1>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
          >
            Appointments
          </Link>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="flex-grow bg-gray-100 py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <AnimatedContent>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Check Out These Videos of What Our Patients Say
                </h2>
                <p className="text-xl text-gray-600">
                  Watch our patient testimonials to learn more about their experiences
                </p>
              </div>

              {/* Two-section layout */}
              <div className="space-y-12">
                {/* Featured Short Section */}
                <div className="max-w-xs mx-auto">
                  {videoTestimonials
                    .filter(video => video.isShort)
                    .map((video) => (
                      <div key={video.id} className="group relative">
                        <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg bg-gray-200">
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/60" />
                          <button
                            onClick={() => setActiveVideo(video.id)}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-sky-500 text-white transition-transform duration-300 group-hover:scale-110">
                              <Play size={32} fill="white" />
                            </div>
                          </button>
                          <Link
                            href={`https://www.youtube.com/watch?v=${video.id}`}
                            target="_blank"
                            className="absolute bottom-4 right-4 p-2 bg-white/90 rounded-lg shadow-md flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-white transition-colors"
                          >
                            <ExternalLink size={16} />
                            Watch Short
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Regular Videos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {videoTestimonials
                    .filter(video => !video.isShort)
                    .map((video) => (
                      <div key={video.id} className="group relative">
                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-200">
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/60" />
                          <button
                            onClick={() => setActiveVideo(video.id)}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-sky-500 text-white transition-transform duration-300 group-hover:scale-110">
                              <Play size={32} fill="white" />
                            </div>
                          </button>
                          <Link
                            href={`https://www.youtube.com/watch?v=${video.id}`}
                            target="_blank"
                            className="absolute bottom-4 right-4 p-2 bg-white/90 rounded-lg shadow-md flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-white transition-colors"
                          >
                            <ExternalLink size={16} />
                            Watch on YouTube
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </AnimatedContent>

            {/* Video Modal */}
            {activeVideo && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className={`relative w-full ${
                  videoTestimonials.find((v) => v.id === activeVideo)?.isShort
                    ? "max-w-[400px]"
                    : "max-w-4xl"
                }`}>
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="absolute -top-12 right-0 text-white hover:text-gray-300"
                  >
                    Close
                  </button>
                  <div className={
                    videoTestimonials.find((v) => v.id === activeVideo)?.isShort
                      ? "aspect-[9/16]"
                      : "aspect-video"
                  }>
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

            {/* Bottom Section */}
            <AnimatedContent>
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
            </AnimatedContent>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default VideoTestimonials;