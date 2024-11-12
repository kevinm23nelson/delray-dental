"use client";
import Image from "next/image";
import React, { useState } from "react";
import Container from "@/components/shared/Container";
import Link from "next/link";
import { ExternalLink, Play } from "lucide-react"; // Import icons

const VideoTestimonials = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  const videoTestimonials = [
    {
      id: "v5h42qKJV5g",
      title: "Patient Testimonial 1",
      thumbnail: `https://img.youtube.com/vi/v5h42qKJV5g/0.jpg`, // Changed to default quality
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
      {" "}
      {/* Hero Banner Section */}
      <div className="relative h-[500px] w-full">
        <div className="absolute inset-0">
          <Image
            src="/images/backgrounds/testimonials.jpg"
            alt="Dental Office"
            fill
            className="object-cover"
            priority
          />
          {/* Enhanced overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
            Our Video Testimonials in Delray Beach, FL{" "}
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
        {" "}
        {/* Added flex-grow */}
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Check Out These Videos of What Our Patients Say
              </h2>
              <p className="text-xl text-gray-600">
                Watch our patient testimonials to learn more about their
                experiences
              </p>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoTestimonials.map((video) => (
                <div key={video.id} className="group relative">
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-200">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/60" />

                    {/* Play Button */}
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

            {/* Video Modal */}
            {activeVideo && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="relative w-full max-w-4xl aspect-video">
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="absolute -top-12 right-0 text-white hover:text-gray-300"
                  >
                    Close
                  </button>
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Bottom Section */}
            <div className="mt-16 text-center">
              <p className="text-lg text-gray-600">
                Want to share your experience? We'd love to hear from you!
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
    </div>
  );
};

export default VideoTestimonials;
