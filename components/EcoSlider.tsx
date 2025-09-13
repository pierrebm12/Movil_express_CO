"use client";
import { useState, useEffect } from "react";
import { EcoCard, EcoCardProps } from "@/components/EcoCard";

interface EcoSliderProps {
  productos: EcoCardProps[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function EcoSlider({ productos, autoPlay = true, autoPlayInterval = 5000 }: EcoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  // Auto play
  useEffect(() => {
    if (!isAutoPlaying || productos.length <= itemsPerView) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = productos.length - itemsPerView;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayInterval, productos.length, itemsPerView]);

  // Touch handlers
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    setIsAutoPlaying(false);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    const maxIndex = productos.length - itemsPerView;
    if (isLeftSwipe) setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    if (isRightSwipe) setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setTimeout(() => setIsAutoPlaying(autoPlay), 3000);
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
    setIsAutoPlaying(false);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    const maxIndex = productos.length - itemsPerView;
    if (isLeftSwipe) setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    if (isRightSwipe) setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setTimeout(() => setIsAutoPlaying(autoPlay), 3000);
  };

  if (productos.length === 0) return null;

  return (
    <div className="w-full">
      <div className="relative overflow-hidden">
        <div
          className={`flex transition-transform duration-300 ease-in-out select-none${productos.length < itemsPerView ? ' justify-center' : ''}`}
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            width: `${100}%`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / itemsPerView}%`, minHeight: '340px', height: '100%' }}
            >
              <EcoCard {...producto} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
