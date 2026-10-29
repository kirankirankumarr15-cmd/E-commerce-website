import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X } from 'lucide-react';

const ImageZoom = ({ src, alt, className = '' }) => {
  const [zoomed, setZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <>
      <div
        className={`relative overflow-hidden cursor-zoom-in group ${className}`}
        onMouseMove={handleMouseMove}
        onClick={() => setZoomed(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setZoomed(true)}
        aria-label="Zoom image"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          style={{ transformOrigin: `${position.x}% ${position.y}%` }}
        />
        <div className="absolute bottom-3 right-3 p-2 bg-surface/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="h-4 w-4 text-text" />
        </div>
      </div>

      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setZoomed(false)}
          >
            <button onClick={() => setZoomed(false)} className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full" aria-label="Close zoom">
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={src}
              alt={alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageZoom;
