"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect, ReactNode } from "react";
import Container from "@/components/shared/Container";
import Link from "next/link";
import ArrowCircleIcon from "@/components/shared/ArrowCircleIcon";
import { ChevronDown } from "lucide-react";
import WhiteArrowCircleIcon from "@/components/shared/WhiteArrowCircleIcon";
import { motion, useInView } from "framer-motion";
import { toast } from "react-hot-toast";
import emailjs from "@emailjs/browser";

const AnimatedSubmenu: React.FC<{
  isOpen: boolean;
  children: ReactNode;
}> = ({ isOpen, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

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

interface AnimatedContentProps {
  children: ReactNode;
  direction?: "left" | "right";
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  direction = "right",
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
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

type SectionName = "commonlyFound" | "prevention" | null;

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSection, setExpandedSection] = useState<SectionName>(null);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID!,
        {
          from_name: `${formData.firstName} ${formData.lastName}`,
          from_email: formData.email,
          phone: formData.phone || "Not provided",
          subject: formData.subject,
          message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY // Add this line
      );

      toast.success("Message sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (sectionName: SectionName) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };

  const instructions = [
    {
      title: "Content",
      content: "Placeholder",
    },
  ];

  const preventionInstruction = [
    {
      title: "Content",
      content: "Placeholder",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative h-[425px] w-full">
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
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4 drop-shadow-lg">
            Get in Touch With Us!
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
                <div className="text-white space-y-6">
                  <h2 className="text-3xl font-bold mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 pt-1">
                        <WhiteArrowCircleIcon />
                      </div>
                      <div>
                        <p className="text-lg font-semibold">Address:</p>
                        <p className="text-lg">3401 South Federal Highway</p>
                        <p className="text-lg">Delray Beach, FL 33483</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 pt-1">
                        <WhiteArrowCircleIcon />
                      </div>
                      <div>
                        <p className="text-lg font-semibold">Phone:</p>
                        <a
                          href="tel:561-272-6664"
                          className="text-lg hover:text-sky-100"
                        >
                          (561) 272-6664
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 pt-1">
                        <WhiteArrowCircleIcon />
                      </div>
                      <div>
                        <p className="text-lg font-semibold">Hours:</p>
                        <p className="text-lg">
                          Monday - Thursday: 8:00 AM - 5:00 PM
                        </p>
                        <p className="text-lg">Friday: 8:00 AM - 2:00 PM</p>
                        <p className="text-lg">Saturday - Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              <AnimatedContent direction="right">
                <div className="relative h-[400px] w-full">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyC1h7w0gjR4gdkVEdxlfFiKjRaHKPqzXE4&q=place_id:ChIJY_y__EDg2IgRgLI0mNHs_aw`}
                    className="absolute inset-0 w-full h-full rounded-xl"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </AnimatedContent>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-gray-100">
        <Container className="px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white p-8 lg:p-10 rounded-b-xl">
            <div className="grid md:grid-cols-1 gap-8">
              <AnimatedContent direction="right">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        First Name*
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Email*
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Subject*
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Message*
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      required
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              </AnimatedContent>
            </div>
          </div>
        </Container>
      </section>

      {/* Other Links Section */}
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
                    Other Important Links{" "}
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

            {/* Sponsors and Affiliates Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <AnimatedContent direction="right">
                <button
                  onClick={() => toggleSection("prevention")}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <h2 className="text-2xl font-bold text-gray-900">
                    Sponsors and Affiliates{" "}
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

export default ContactUs;
