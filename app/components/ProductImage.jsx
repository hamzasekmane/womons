import {useState, useRef, useEffect, useCallback} from 'react';
import {Link, useLocation} from 'react-router';
import {Image} from '@shopify/hydrogen';

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
      if (e.key === 'ArrowRight') { goNext(); /* update lightbox logic or keep separate */ }
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, goNext, goPrev]);

  const handleMouseMove = (e) => {
    if (!isZoomed || !mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const currentImage = allImages[activeIndex];

  if (!allImages.length) {
    return (
      <div className="relative w-full overflow-hidden rounded-sm bg-[#F5F1ED]" style={{aspectRatio: '3 / 4'}}>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F5F1ED] to-[#E8DDD0]">
          <span className="text-xs uppercase tracking-[0.18em] text-[#1B2A3D]/35">
            No Image Available
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col-reverse gap-2 lg:flex-row lg:gap-3">
        
        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 lg:max-h-[700px] lg:flex-col lg:overflow-y-auto scrollbar-hide lg:pb-0 lg:pr-1">
            {allImages.map((img, i) => (
              <button
                key={img?.id || i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-20 w-16 flex-shrink-0 overflow-hidden transition-all duration-300 lg:h-[90px] lg:w-[72px] ${
                  activeIndex === i
                    ? 'ring-2 ring-[#1B2A3D] opacity-100'
                    : 'ring-1 ring-[#1B2A3D]/10 opacity-60 hover:opacity-90 hover:ring-[#1B2A3D]/30'
                }`}
              >
                {img ? (
                  <Image
                    data={img}
                    alt={`${productTitle} view ${i + 1}`}
                    sizes="72px"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[#E8DDD0]" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main Image Area */}
        <div className="group relative flex-1">
          <div
            ref={mainRef}
            className={`relative overflow-hidden bg-[#F5F1ED] ${
              isMobile ? '' : isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            style={{aspectRatio: '3 / 4'}}
            onClick={() => {
              if (isMobile) return;
              setIsZoomed((prev) => !prev);
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
          >
            {/* Main Image with smooth transition */}
            <div
              key={currentImage?.id || activeIndex}
              className="absolute inset-0 animate-fadeIn"
              style={{
                transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transition: 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              {currentImage ? (
                <Image
                  data={currentImage}
                  alt={currentImage.altText || productTitle}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className={`h-full w-full object-cover ${
                    isHoverable() && !isZoomed ? 'group-hover:scale-[1.03]' : ''
                  }`}
                  loading={activeIndex === 0 ? 'eager' : 'lazy'}
                  style={{transition: 'transform 700ms ease'}}
                />
              ) : null}
            </div>

            {/* Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm opacity-0 shadow-lg transition-all duration-200 hover:bg-white hover:scale-105 group-hover:opacity-100 active:scale-95"
                  aria-label="Previous image"
                >
                  <svg className="h-4 w-4 text-[#1B2A3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm opacity-0 shadow-lg transition-all duration-200 hover:bg-white hover:scale-105 group-hover:opacity-100 active:scale-95"
                  aria-label="Next image"
                >
                  <svg className="h-4 w-4 text-[#1B2A3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </>
            )}

            {/* Expand Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
                setIsZoomed(false);
              }}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm opacity-0 shadow-md transition-all duration-200 hover:bg-white group-hover:opacity-100"
              aria-label="Expand image"
            >
              <svg className="h-4 w-4 text-[#1B2A3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>

            {/* Mobile Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-medium tracking-wider text-white backdrop-blur-sm lg:hidden">
                {activeIndex + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Mobile Dots */}
          {allImages.length > 1 && (
            <div className="mt-3 flex items-center justify-center gap-1.5 lg:hidden">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    activeIndex === i
                      ? 'h-1.5 w-6 bg-[#1B2A3D]'
                      : 'h-1.5 w-1.5 bg-[#1B2A3D]/20'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
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
    </>
  );
}

/* ─── Helper ─── */
function isHoverable() {
  // Check if device supports hover (not touchscreen primarily)
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(hover: hover)').matches;
}

/* ─── Lightweight Lightbox (No extra libs) ─── */
function ImageLightbox({images, activeIndex, onClose, onNext, onPrev, productTitle}) {
  const [idx, setIdx] = useState(activeIndex);

  // Sync with parent props when opened
  useEffect(() => {
    setIdx(activeIndex);
  }, [activeIndex]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
        aria-label="Close"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute left-1/2 top-6 -translate-x-1/2 text-sm font-light tracking-wider text-white/60">
        {idx + 1} / {images.length}
      </div>

      {/* Nav Buttons */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIdx((p) => (p - 1 + images.length) % images.length); onPrev(); }}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors md:left-8"
            aria-label="Previous"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIdx((p) => (p + 1) % images.length); onNext(); }}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors md:right-8"
            aria-label="Next"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Image Display */}
      <div
        className="max-h-[85vh] w-full max-w-4xl px-16 md:px-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full w-full items-center justify-center">
          <Image
            data={images[idx]}
            alt={`${productTitle} - View ${idx + 1}`}
            sizes="80vw"
            className="max-h-[85vh] max-w-full object-contain"
          />
        </div>
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {images.slice(0, 8).map((img, i) => (
            <button
              key={img?.id || i}
              type="button"
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
              className={`h-14 w-12 overflow-hidden rounded-sm transition-all cursor-pointer ${
                i === idx ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            >
              {img ? (
                <Image data={img} alt="" sizes="48px" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-[#333]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */