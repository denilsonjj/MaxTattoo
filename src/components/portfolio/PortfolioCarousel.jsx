import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    const newIndex = currentIndex + newDirection;
    if (newIndex >= 0 && newIndex < images.length) {
      setDirection(newDirection);
      setCurrentIndex(newIndex);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[500px] bg-gradient-to-br from-[#151515] to-[#101010] rounded-3xl flex items-center justify-center border border-[#E60000]/20">
        <p className="text-[#FAFAFA]/40">Nenhuma imagem disponível</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#151515] to-[#101010] border-2 border-[#E60000]/30 shadow-2xl shadow-[#E60000]/20">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full h-full"
          >
            <img
              src={images[currentIndex].image_url}
              alt={images[currentIndex].title || 'Trabalho de tatuagem'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            {images[currentIndex].title && (
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-[#FAFAFA] font-bold text-xl md:text-2xl">{images[currentIndex].title}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {currentIndex > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#E60000] text-white z-10 w-12 h-12 rounded-full backdrop-blur-sm"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}
        {currentIndex < images.length - 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#E60000] text-white z-10 w-12 h-12 rounded-full backdrop-blur-sm"
            onClick={() => paginate(1)}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        )}

        {/* Counter */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-[#FAFAFA] font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-[#E60000] w-12 shadow-lg shadow-[#E60000]/50' 
                : 'bg-[#FAFAFA]/20 w-2 hover:bg-[#FAFAFA]/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}