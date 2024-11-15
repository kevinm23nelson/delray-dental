// src/components/shared/WhiteCheckCircleIcon.tsx
const WhiteCheckCircleIcon = () => (
    <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center">
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-sky-500"
      >
        <path 
          d="M20 6L9 17L4 12"  // Changed path data to create a checkmark
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
  
  export default WhiteCheckCircleIcon;