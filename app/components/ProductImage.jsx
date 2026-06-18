import {useState, useRef, useEffect, useCallback} from 'react';
import {Link, useLocation} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {motion, AnimatePresence} from 'framer-motion';

/**
 * @param {{
 *   images: (ProductVariantFragment['image'])[];
 *   selectedVariant?: ProductVariantFragment;
 *   productTitle?: string;
 * }}
 */
export function ProductImage({
  images = [],
  selectedVariant,
  productTitle = 'Product',
}) {
  const location = useLocation();
  const mainRef = useRef(null);

  // Build display array: variant image first, then rest
  const allImages = (() => {
    if (!selectedVariant?.image) return images || [];
    const variantId = selectedVariant.image.id;
    const filtered = (images || []).filter((img) => img?.id !== variantId);
    return [selectedVariant.image, ...filtered];
  })();

  // Read initial index from URL or default to 0
  const getInitialIndex = () => {
    const params = new URLSearchParams(location.search);
    const imgIdx = params.get('image');
    if (imgIdx) {
      const num = parseInt(imgIdx, 10);
      if (!isNaN(num) && num >= 0 && num < allImages.length) return num;
    }
    return 0;
  };

  const [activeIndex, setActiveIndex] = useState(getInitialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({x: 50, y: 50});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Reset on variant change
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedVariant?.id]);

  // Sync with URL on internal navigation only
  useEffect(() => {
    const idx = getInitialIndex();
    if (idx !== activeIndex && location.search.includes('image=')) {
      setActiveIndex(idx);
    }
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = useCallback(
    (idx) => {
      const safeIdx = ((idx % allImages.length) + allImages.length) % allImages.length;
      setActiveIndex(safeIdx);
      setIsZoomed(false); // reset zoom on change
    },
    [allImages.length],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Keyboard nav when lightbox open
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, goNext, goPrev]);

  // Cinematic Zoom tracking
  const handleMouseMove = (e) => {
    if (!isZoomed || !mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  // Mobile Swipe Logic
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
    touchEndRef.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => { touchEndRef.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    const diff = touchStartRef.current - touchEndRef.current;
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
    touchStartRef.current = 0;
    touchEndRef.current = 0;
  };

  if (!allImages.length) {
    return (
      <div className="relative w-full overflow-hidden rounded-[24px] bg-gray-100 aspect-[4/5] lg:h-[85vh]">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs uppercase tracking-widest text-gray-400">
            No Image Available
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col-reverse gap-4 lg:flex-row h-full">
        
        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide lg:flex-col lg:overflow-y-auto lg:pb-0">
            {allImages.map((img, i) => (
              <button
                key={img?.id || i}
                type="button"
                onClick={() => goTo(i)}
                className={`relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-400 lg:h-[120px] lg:w-[96px] ${
                  activeIndex === i
                    ? 'ring-1 ring-black ring-offset-2'
                    : 'opacity-60 hover:opacity-100 hover:scale-105'
                }`}
              >
                {img ? (
                  <Image
                    data={img}
                    alt={`${productTitle} view ${i + 1}`}
                    sizes="96px"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main Image Area */}
        <div className="group relative flex-1 overflow-hidden rounded-[24px] bg-gray-100 aspect-[4/5] lg:aspect-auto lg:h-[85vh]">
          <div
            ref={mainRef}
            className={`absolute inset-0 h-full w-full ${isMobile ? '' : isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={() => { if (!isMobile) setIsZoomed(!isZoomed); }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Cinematic Crossfade */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{opacity: 0, scale: 1.02}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
                className="absolute inset-0 h-full w-full"
              >
                <div
                  className="h-full w-full"
                  style={{
                    transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transition: 'transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <Image
                    data={allImages[activeIndex]}
                    alt={allImages[activeIndex]?.altText || productTitle}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    loading={activeIndex === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-md opacity-0 shadow-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 hover:bg-white group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-md opacity-0 shadow-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 hover:bg-white group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </>
            )}

            {/* Expand / Lightbox Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
                setIsZoomed(false);
              }}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md opacity-0 shadow-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 hover:bg-white group-hover:opacity-100"
              aria-label="Expand image"
            >
              <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>

            {/* Mobile Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-white backdrop-blur-md lg:hidden">
                {activeIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <ImageLightbox
            images={allImages}
            activeIndex={activeIndex}
            onClose={() => setLightboxOpen(false)}
            onNext={goNext}
            onPrev={goPrev}
            productTitle={productTitle}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LIGHTBOX (Framer Motion Immersive Experience)
   ═══════════════════════════════════════════════════════════════ */
function ImageLightbox({images, activeIndex, onClose, onNext, onPrev, productTitle}) {
  const [idx, setIdx] = useState(activeIndex);

  useEffect(() => { setIdx(activeIndex); }, [activeIndex]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-2xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:scale-110 hover:bg-white hover:text-black"
        aria-label="Close"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Top Counter */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
        {idx + 1} / {images.length}
      </div>

      {/* Nav Buttons */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIdx((p) => (p - 1 + images.length) % images.length); onPrev(); }}
            className="absolute left-6 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-white/70 transition-all hover:scale-110 hover:bg-white hover:text-black md:left-12"
            aria-label="Previous"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIdx((p) => (p + 1) % images.length); onNext(); }}
            className="absolute right-6 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-white/70 transition-all hover:scale-110 hover:bg-white hover:text-black md:right-12"
            aria-label="Next"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Main Image Display */}
      <div className="max-h-[85vh] w-full max-w-5xl px-12 md:px-24" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{opacity: 0, scale: 0.98}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
            className="flex h-full w-full items-center justify-center"
          >
            <Image
              data={images[idx]}
              alt={`${productTitle} - View ${idx + 1}`}
              sizes="80vw"
              className="max-h-[80vh] max-w-full object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3" onClick={(e) => e.stopPropagation()}>
          {images.slice(0, 8).map((img, i) => (
            <button
              key={img?.id || i}
              type="button"
              onClick={() => { setIdx(i); if (i > idx) onNext(); else onPrev(); }}
              className={`h-16 w-12 overflow-hidden rounded-md transition-all duration-300 cursor-pointer ${
                i === idx ? 'ring-1 ring-white ring-offset-4 ring-offset-black opacity-100 scale-110' : 'opacity-40 hover:opacity-100'
              }`}
            >
              {img ? (
                <Image data={img} sizes="48px" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-white/10" />
              )}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */