// src/components/shared/ArrowCircleIcon.tsx
const ArrowCircleIcon = () => (
    <div className="flex-shrink-0 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <path 
          d="M5 12H19M19 12L12 5M19 12L12 19" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
  
  export default ArrowCircleIcon;