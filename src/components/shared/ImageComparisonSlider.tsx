"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  priority?: boolean; 
}

const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  priority = false, 
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!isResizing || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = "touches" in event ? event.touches[0].clientX : event.clientX;
      const position = ((x - rect.left) / rect.width) * 100;

      setPosition(Math.min(Math.max(position, 0), 100));
    },
    [isResizing]
  );

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleMove);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isResizing, handleMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] select-none overflow-hidden rounded-lg"
    >
      <div className="absolute inset-0">
        <Image 
          src={afterImage} 
          alt={afterAlt} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={priority}
        />
      </div>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        <Image
          src={beforeImage}
          alt={beforeAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={priority}
        />
      </div>


      {/* Slider */}
      <div className="absolute inset-y-0" style={{ left: `${position}%` }}>
        <div className="absolute inset-y-0 w-0.5 bg-white shadow-lg" />
        <button
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize"
          aria-label="Comparison slider"
        >
          <div className="flex items-center gap-2">
            <svg
              width="8"
              height="12"
              viewBox="0 0 8 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-400"
            >
              <path
                d="M7 1L2 6L7 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              width="8"
              height="12"
              viewBox="0 0 8 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-400"
            >
              <path
                d="M1 1L6 6L1 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-4 bottom-4 px-2 py-1 bg-black/50 text-white text-sm rounded">
          Before
        </div>
        <div className="absolute right-4 bottom-4 px-2 py-1 bg-black/50 text-white text-sm rounded">
          After
        </div>
      </div>
    </div>
  );
};

export default ImageComparisonSlider;