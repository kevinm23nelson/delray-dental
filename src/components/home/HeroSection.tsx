import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative h-[500px]"> {/* Reduced height for banner look */}
      {/* Banner background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/backgrounds/main-smile-one.jpg"
          alt="Dental Office"
          fill
          className="object-cover object-center" // Added object-center for better image positioning
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4"> {/* Reduced space between elements */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-montserrat tracking-tight">
            Implant & Cosmetic Dentistry in Delray Beach, FL
          </h1>
          {/* <p className="text-lg sm:text-2xl text-gray-50 font-montserrat">
            Easy online scheduling for your dental care needs.
          </p> */}
         
        </div>
      </div>
    </section>
  );
};

export default HeroSection;