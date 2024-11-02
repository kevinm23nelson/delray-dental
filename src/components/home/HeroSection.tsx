// src/components/home/HeroSection.tsx
const HeroSection = () => {
    return (
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-gray-50 opacity-70" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="text-center animate-in slide-in-from-bottom-4 duration-700 ease-in-out">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 font-montserrat tracking-tight">
              Schedule Your Visit Today
            </h1>
            <p className="mt-6 text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto font-montserrat">
              Easy online scheduling for your dental care needs. Choose a time that works best for you.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a
                href="tel:+15612726664"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-sky-500 hover:bg-sky-600 transition-colors duration-200"
              >
                Call Us
                <span className="ml-2">(561) 272-6664</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default HeroSection;