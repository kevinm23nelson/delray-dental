// src/app/about-us/page.tsx
import Image from 'next/image';
import React from 'react';
import Container from '../../components/shared/Container';

const AboutUs = () => {
  return (
    <>
      {/* Hero Banner Section */}
      <div className="relative h-[400px] w-full">
        <div className="absolute inset-0">
          <Image
            src="/images/backgrounds/dentist-chair.jpg"
            alt="Dental Office"
            fill
            className="object-cover"
            priority
          />
          {/* Darkening overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
            Meet Dr. John Ritota
          </h1>
        </div>
      </div>

      {/* Wrapper div with background color */}
      <div className="bg-gray-50 py-16 md:py-24">
        {/* About Content Section */}
        <section>
          <Container className="py-24 px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="md:float-left md:mr-12 md:mb-8 mb-12 relative">
                <Image
                  src="/images/about/john.jpg"
                  alt="Dr. John Ritota"
                  width={300}
                  height={400}
                  className="rounded-lg shadow-lg mx-auto"
                />
              </div>
              <div className="text-gray-900 space-y-6">
                <p className="text-lg leading-relaxed">
                  Dr. John Ritota graduated from Ithaca College and Georgetown University School of Dentistry. 
                  He is a member of the South Palm Beach County Dental Assn., The New Jersey Dental Assn., The 
                  American Dental Assn., and The Florida Academy of Dental Practice Administration...
                </p>
                <p className="text-lg leading-relaxed">
                  We can both surgically place and cosmetically restore your dental implants in one convenient location, 
                  avoiding the need to travel from office to office. We are always willing to provide a second opinion 
                  for FREE!
                </p>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default AboutUs;