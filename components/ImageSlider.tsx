import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ImageSliderProps {
  images: string[];
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, images.length]);

  return (
    <div className="w-[500px] h-[600px] rounded-2xl shadow-2xl overflow-hidden relative">
      {images.map((src, idx) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <Image
            src={src}
            alt={`slider-img-${idx}`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 500px) 100vw, 500px"
          />
        </div>
      ))}
    </div>
  );
};
