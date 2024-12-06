"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Container from "@/components/shared/Container";
import Link from "next/link";
import BlueCheckCircleIcon from "@/components/shared/BlueCheckCircleIcon";
import WhiteCheckCircleIcon from "@/components/shared/WhiteCheckCircleIcon";
import BackToTop from "@/components/shared/BackToTop";
import { motion, useInView } from "framer-motion";

interface Service {
  title: string;
  description: string;
  showDetailsButton?: boolean;
}

interface ServiceSectionProps {
  services: Service[];
  imageSrc?: string;
  isBlue?: boolean;
  imageFirst?: boolean;
  id?: string;
}

interface ServiceContentProps {
  service: Service;
  buttonStyles: string;
  CheckIcon: React.ComponentType;
  itemVariants: any;
}

const ServiceContent: React.FC<ServiceContentProps> = ({
  service,
  buttonStyles,
  CheckIcon,
  itemVariants,
}) => (
  <motion.div className="space-y-4" variants={itemVariants}>
    <h2 className="text-3xl font-bold">{service.title}</h2>
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 pt-1">
        <CheckIcon />
      </div>
      <p className="text-xl leading-relaxed">{service.description}</p>
    </div>
    {service.showDetailsButton && (
      <div className="flex justify-center pt-6">
        <Link
          href={`/services/${service.title
            .toLowerCase()
            .replace(/[\s®™]+/g, "-")}`}
          className={`inline-flex items-center px-8 py-3 ${buttonStyles} text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out`}
        >
          Details
        </Link>
      </div>
    )}
  </motion.div>
);

const ServiceSection: React.FC<ServiceSectionProps> = ({
  services,
  imageSrc,
  isBlue = false,
  imageFirst = false,
  id,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isInView = useInView(sectionRef, {
    once: true,
    margin: isMobile ? "0px" : "-100px",
    amount: isMobile ? 0.1 : 0.3,
  });

  const bgColor = isBlue ? "bg-sky-500" : "bg-gray-100";
  const textColor = isBlue ? "text-white" : "text-gray-800";
  const innerBgColor = isBlue ? "bg-sky-400" : "bg-white";
  const CheckIcon = isBlue ? WhiteCheckCircleIcon : BlueCheckCircleIcon;

  const buttonStyles = isBlue
    ? "bg-white text-sky-500 hover:bg-gray-100"
    : "bg-sky-500 text-white hover:bg-sky-600";

  const containerVariants = {
    hidden: {
      opacity: isMobile ? 1 : 0,
      y: isMobile ? 0 : 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: isMobile ? 0.1 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: isMobile ? 1 : 0,
      x: isMobile ? 0 : imageFirst ? -30 : 30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.5,
        ease: "easeOut",
      },
    },
  };


  return (
    <section className={`${bgColor} py-20`} ref={sectionRef} id={id}>
      <Container className="px-6 lg:px-8">
        <motion.div
          className={`max-w-6xl mx-auto ${innerBgColor} rounded-xl p-8 lg:p-12`}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {imageFirst ? (
              <>
                <motion.div variants={itemVariants}>
                  <Image
                    src={imageSrc || "/api/placeholder/600/800"}
                    alt="Services"
                    width={600}
                    height={800}
                    className="rounded-xl shadow-xl mx-auto"
                  />
                </motion.div>
                <motion.div
                  className={`${textColor} space-y-8`}
                  variants={itemVariants}
                >
                  {services.map((service) => (
                    <ServiceContent
                      key={service.title}
                      service={service}
                      buttonStyles={buttonStyles}
                      textColor={textColor}
                      CheckIcon={CheckIcon}
                    />
                  ))}
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  className={`${textColor} space-y-8`}
                  variants={itemVariants}
                >
                  {services.map((service) => (
  <ServiceContent
    key={service.title}
    service={service}
    buttonStyles={buttonStyles}
    CheckIcon={CheckIcon}
    itemVariants={itemVariants}
  />
))}
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Image
                    src={imageSrc || "/api/placeholder/600/800"}
                    alt="Services"
                    width={600}
                    height={800}
                    className="rounded-xl shadow-xl mx-auto"
                  />
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

type ServiceScrollMap = {
  [key: string]: string;
};

const serviceScrollMapping: ServiceScrollMap = {
  "cosmetic-bonding": "oral-cancer-screening",
  "teeth-cleanings": "veneers",
  "oral-surgery": "full-and-partial-dentures",
  "non-surgical-gum-treatment": "dental-diet-system",
  "root-canal-therapy": "dental-fillings",
  "invisalign®": "clearcorrect™",
};

interface DentalService {
  title: string;
  description: string;
  showDetailsButton?: boolean;
  imageSrc: string;
}

const DentalServicesPage = () => {
  const featuredServices: DentalService[] = [
    {
      title: "Dental Implants",
      description:
        "The ultimate tooth replacement option. Our dental implants look natural, are easy to care for, and help keep your jaw strong. All implant services are provided in-office, including immediate dental implants.",
      showDetailsButton: true,
      imageSrc: "/images/services/implant.jpg",
    },
    {
      title: "Teeth Whitening",
      description:
        "Professional teeth whitening services to give you a brighter, more confident smile. We offer both in-office and take-home whitening options.",
      showDetailsButton: true,
      imageSrc: "/images/services/whitening.jpg",
    },
  ];

  const regularServices: DentalService[] = [
    {
      title: "Oral Cancer Screening",
      description:
        "Early detection is key. We perform thorough oral cancer screenings as part of our commitment to your overall health.",
      imageSrc: "/images/services/cancer.jpg",
    },
    {
      title: "Cosmetic Bonding",
      description:
        "Fix chips, cracks, and discoloration with our advanced cosmetic bonding techniques.",
      imageSrc: "/images/services/bonding.jpg",
    },
    {
      title: "Veneers",
      description:
        "Transform your smile with custom-made porcelain veneers, creating a naturally beautiful appearance.",
      imageSrc: "/images/services/veneers.jpg",
    },
    {
      title: "Teeth Cleanings",
      description:
        "Professional cleaning and preventive care to maintain optimal oral health.",
      imageSrc: "/images/services/cleaning.jpg",
    },
    {
      title: "Full and Partial Dentures",
      description:
        "Custom-fitted dentures to restore your smile and functionality with comfort and confidence.",
      imageSrc: "/images/services/dentures.jpg",
    },
    {
      title: "Oral Surgery",
      description:
        "Specialized oral surgery services including extractions and other procedures, all performed with expert care.",
      imageSrc: "/images/services/surgery.jpg",
    },
    {
      title: "Dental Diet System",
      description:
        "Comprehensive dietary guidance to support your oral health and overall wellbeing.",
      imageSrc: "/images/services/diet.jpg",
    },
    {
      title: "Non-Surgical Gum Treatment",
      description:
        "Advanced periodontal care without surgery to treat gum disease and maintain healthy gums.",
      imageSrc: "/images/services/gumtreatment.jpg",
    },
    {
      title: "Dental Fillings",
      description:
        "High-quality, tooth-colored fillings to restore damaged teeth with natural-looking results.",
      imageSrc: "/images/services/fillings.jpg",
    },
    {
      title: "Root Canal Therapy",
      description:
        "Gentle and effective root canal treatments to save damaged teeth and relieve pain.",
      imageSrc: "/images/services/rootcanal.jpg",
    },
    {
      title: "ClearCorrect™",
      description:
        "Invisible aligners to straighten your teeth discreetly and comfortably.",
      imageSrc: "/images/services/invisalign.jpg",
    },
    {
      title: "Invisalign®",
      description:
        "The world's leading clear aligner system for a straighter smile without traditional braces.",
      imageSrc: "/images/services/invisalign.jpg",
    },
    {
      title: "Tooth Extractions",
      description:
        "Safe and comfortable tooth removal when necessary, with options for immediate replacement.",
      imageSrc: "/images/services/extraction.jpg",
    },
  ];

  const getServiceId = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-™®]/g, "");
  };

  useEffect(() => {
    const handleScroll = (hash: string) => {
      if (hash) {
        const targetId = serviceScrollMapping[hash] || hash;
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    };

    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (hash) {
      setTimeout(() => handleScroll(hash), 100);
    }

    const handleHashChange = () => {
      const newHash = decodeURIComponent(window.location.hash.replace("#", ""));
      handleScroll(newHash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const servicePairs: DentalService[][] = [];
  for (let i = 0; i < regularServices.length; i += 2) {
    servicePairs.push(regularServices.slice(i, i + 2));
  }

  const needsExtraPair =
    (featuredServices.length + servicePairs.length) % 2 !== 0;
  if (needsExtraPair && servicePairs.length > 0) {
    const lastPair: DentalService[] | undefined = servicePairs.pop();
    if (lastPair && lastPair.length > 0) {
      servicePairs.push([lastPair[0]]);
      if (lastPair.length > 1) {
        servicePairs.push([lastPair[1]]);
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
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
            Our Dental Services in Delray Beach, FL
          </h1>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
          >
            Schedule Appointment
          </Link>
        </div>
      </div>
      <div className="w-full bg-sky-500 animate-in fade-in duration-700 ease-in-out">
        <div className="max-w-8xl mx-auto py-12 px-4 sm:px-6 lg:px-10">
          <div className="max-w-5xl mx-auto text-center space-y-8 bg-sky-400 rounded-xl p-8">
            <div className="flex justify-center items-center gap-4">
              <div className="flex-shrink-0">
                <WhiteCheckCircleIcon />
              </div>
              <h2 className="text-3xl font-semibold text-white font-montserrat animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 ease-in-out">
                All Services
              </h2>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 lg:pl-8 md:grid-cols-3 gap-6 text-left">
              {[...featuredServices, ...regularServices].map(
                (service, index) => {
                  const serviceId = getServiceId(service.title);
                  const targetId = serviceScrollMapping[serviceId] || serviceId;

                  return (
                    <motion.button
                      key={service.title}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                      onClick={() => {
                        const element = document.getElementById(targetId);
                        if (element) {
                          element.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }
                      }}
                      className="flex items-center space-x-3 text-white hover:text-sky-100 transition-colors duration-200 group cursor-pointer whitespace-nowrap"
                    >
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                      <span className="text-lg">{service.title}</span>
                    </motion.button>
                  );
                }
              )}
            </div>

            <p className="text-white font-montserrat text-lg px-4 pt-6">
              Click any service to learn more about our comprehensive dental
              care options.
            </p>
          </div>
        </div>
      </div>
      {/* Featured Services */}
      {featuredServices.map((service, index) => (
        <ServiceSection
          key={service.title}
          services={[service]}
          imageSrc={service.imageSrc}
          isBlue={index % 2 === 1}
          imageFirst={index % 2 === 1}
          id={getServiceId(service.title)}
        />
      ))}

      {/* Paired Services */}
      {servicePairs.map((pair, index) => (
        <ServiceSection
          key={pair[0].title}
          services={pair}
          imageSrc={pair[0].imageSrc}
          isBlue={(index + featuredServices.length) % 2 === 1}
          imageFirst={
            (index + featuredServices.length) % 4 === 2 ||
            (index + featuredServices.length) % 4 === 3
          }
          id={getServiceId(pair[0].title)}
        />
      ))}
      <BackToTop />
    </div>
  );
};

export default DentalServicesPage;
