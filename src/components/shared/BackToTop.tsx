import React, { useEffect, useState } from "react";

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
  
    // Show button when page is scrolled up to given distance
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
  
    // Set the scroll event listener
    useEffect(() => {
      window.addEventListener('scroll', toggleVisibility);
      return () => {
        window.removeEventListener('scroll', toggleVisibility);
      };
    }, []);
  
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };
  
    return (
      <div
        className={`fixed bottom-8 right-8 z-50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToTop}
          className="px-6 py-3 bg-sky-400 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
        >
          Back to Top
        </button>
      </div>
    );
  };

  export default BackToTop;