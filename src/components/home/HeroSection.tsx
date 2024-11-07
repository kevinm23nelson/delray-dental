// src/components/home/HeroSection.tsx
const HeroSection = () => {
    return (
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-sky-500 opacity-70 animate-in fade-in duration-700 ease-in-out" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[5.5rem] pb- sm:pt-[7rem] sm:pb-[2.5rem]">
          <div className="text-center animate-in slide-in-from-bottom-4 duration-700 ease-in-out">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-montserrat tracking-tight">
              Implant & Cosmetic Dentistry in Delray Beach, FL
            </h1>
            <p className="mt-6 text-xl sm:text-2xl text-gray-50 max-w-3xl mx-auto font-montserrat">
              Easy online scheduling for your dental care needs.
            </p>
            <p className="mt-6 text-xl sm:text-1xl text-gray-50 max-w-3xl mx-auto font-montserrat">
              We are a privately owned practice and are not part of a Wall Street Conglomerate or Hedge Fund. We work for you not someone else. We have no "quota" to meet! 
            </p>
            <div className="mt-8 flex justify-center gap-4">
              {/* <a
                href="tel:+15612726664"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-sky-500 hover:bg-sky-600 transition-colors duration-200"
              >
                Call Us
                <span className="ml-2">(561) 272-6664</span>
              </a> */}
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default HeroSection;