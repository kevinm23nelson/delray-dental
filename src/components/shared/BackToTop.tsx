import React, { useEffect, useState } from "react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset;
    const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
    
    // Show button when scrolled past 500px AND not at the bottom (within 100px margin)
    setIsVisible(scrollTop > 500 && distanceFromBottom > 100);
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    window.addEventListener('resize', toggleVisibility);
    
    // Initial check
    toggleVisibility();
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('resize', toggleVisibility);
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