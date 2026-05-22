import React, { useMemo, useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const MotionDiv = motion.div;
const MotionButton = motion.button;

function buildWall(images) {
  if (!images || images.length === 0) return [];

  return Array.from({ length: 12 }, (_, index) => images[index % images.length]);
}

function VitrineCard({ image, index, className = '', rail = false, onOpen }) {
  return (
    <MotionButton
      type="button"
      initial={{ opacity: 0, y: 22, scale: 0.97, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: rail ? 'blur(4px)' : 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.045, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      whileHover={rail ? undefined : { y: -8, scale: 1.018 }}
      onClick={() => !rail && onOpen(image)}
      className={`vitrine-card ${rail ? 'vitrine-card-rail' : ''} ${className}`}
      aria-label={rail ? undefined : `Ampliar ${image.title || 'tatuagem'}`}
      tabIndex={rail ? -1 : 0}
    >
      <img src={image.image_url} alt={image.title || 'Tatuagem Max Tattoo'} />
      {!rail && (
        <span className="vitrine-card-action">
          <Maximize2 className="h-4 w-4" />
        </span>
      )}
    </MotionButton>
  );
}

export default function PortfolioCarousel({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const wall = useMemo(() => buildWall(images), [images]);

  if (!wall.length) {
    return (
      <div className="vitrine-empty">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#b7a27a]">Portfólio</p>
        <p className="mt-3 text-[#d4ccc0]/52">Nenhuma imagem disponível ainda.</p>
      </div>
    );
  }

  return (
    <>
      <MotionDiv
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="vitrine-stage"
      >
        <div className="vitrine-stage-label">
          <span>Max Tattoo</span>
          <span>{String(images.length).padStart(2, '0')} trabalhos</span>
        </div>

        <div className="tattoo-vitrine" aria-label="Vitrine de trabalhos Max Tattoo">
          <div className="vitrine-column vitrine-column-side">
            <VitrineCard image={wall[0]} index={0} className="vitrine-tall" onOpen={setSelectedImage} />
            <VitrineCard image={wall[1]} index={1} className="vitrine-tall" onOpen={setSelectedImage} />
          </div>

          <div className="vitrine-column vitrine-rail" aria-hidden="true">
            <VitrineCard image={wall[2]} index={2} rail className="vitrine-rail-short" onOpen={setSelectedImage} />
            <VitrineCard image={wall[3]} index={3} rail className="vitrine-rail-long" onOpen={setSelectedImage} />
          </div>

          <div className="vitrine-column vitrine-column-center">
            <VitrineCard image={wall[4]} index={4} className="vitrine-wide" onOpen={setSelectedImage} />
            <div className="vitrine-mini-grid">
              <VitrineCard image={wall[5]} index={5} className="vitrine-mini" onOpen={setSelectedImage} />
              <VitrineCard image={wall[6]} index={6} className="vitrine-mini" onOpen={setSelectedImage} />
              <VitrineCard image={wall[7]} index={7} className="vitrine-mini" onOpen={setSelectedImage} />
              <VitrineCard image={wall[8]} index={8} className="vitrine-mini" onOpen={setSelectedImage} />
            </div>
          </div>

          <div className="vitrine-column vitrine-rail" aria-hidden="true">
            <VitrineCard image={wall[9]} index={9} rail className="vitrine-rail-long" onOpen={setSelectedImage} />
            <VitrineCard image={wall[10]} index={10} rail className="vitrine-rail-short" onOpen={setSelectedImage} />
          </div>

          <div className="vitrine-column vitrine-column-side">
            <VitrineCard image={wall[11]} index={11} className="vitrine-tall" onOpen={setSelectedImage} />
            <VitrineCard image={wall[3]} index={12} className="vitrine-tall" onOpen={setSelectedImage} />
          </div>
        </div>
      </MotionDiv>

      <AnimatePresence>
        {selectedImage && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="vitrine-lightbox"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              className="vitrine-lightbox-close"
              onClick={() => setSelectedImage(null)}
              aria-label="Fechar imagem"
            >
              <X className="h-5 w-5" />
            </button>
            <MotionDiv
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="vitrine-lightbox-frame"
              onClick={(event) => event.stopPropagation()}
            >
              <img src={selectedImage.image_url} alt={selectedImage.title || 'Tatuagem Max Tattoo'} />
              {selectedImage.title && <p>{selectedImage.title}</p>}
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
}
