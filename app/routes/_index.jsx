import {Await, useLoaderData, Link} from 'react-router';
import {Suspense, useRef, useState, useEffect, useMemo} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {MockShopNotice} from '~/components/MockShopNotice';

/* ═══════════════════════════════════════════════════════════════
   META — expanded with description, OG, Twitter
   ═══════════════════════════════════════════════════════════════ */

export const meta = () => {
  return [
    {title: 'VALORAERPY | Premium Fashion & Accessories'},
    {
      name: 'description',
      content:
        'Curated luxury fashion — clothing, bags, watches & jewelry. Free shipping over $75. Sustainable materials. Shop the new collection.',
    },
    {property: 'og:title', content: 'VALORAERPY | Premium Fashion & Accessories'},
    {
      property: 'og:description',
      content:
        'Curated luxury fashion essentials crafted to inspire sophistication every day.',
    },
    {property: 'og:image', content: 'https://yourdomain.com/og-image.jpg'},
    {property: 'og:type', content: 'website'},
    {name: 'twitter:card', content: 'summary_large_image'},
  ];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}) {
  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
  };
}

function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {recommendedProducts};
}

/* ═══════════════════════════════════════════════════════════════
   STORE CONFIG — update these values instead of editing components
   ═══════════════════════════════════════════════════════════════ */

const STORE_CONFIG = {
  address: '123 Fashion Avenue, New York, NY 10001',
  hours: 'Mon–Sat 10am–7pm · Sun 11am–5pm',
  contactPage: '/pages/contact',
};

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function Homepage() {
  const data = useLoaderData();

  return (
    <div className="min-h-screen bg-white text-[#1B2A3D]">
      {data.isShopLinked ? null : <MockShopNotice />}
      <Hero />
      <TrustBar />
      <FeatureCardsCarousel />
      <CategorySection products={data.recommendedProducts} />
      <MaterialsBanner />
      <CollectionDuo />
      <TestimonialStrip />
      <NewsletterSignup />
      <VisitUs />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO
   FIX: poster on video (LCP), fetchpriority on first image,
        explicit width/height on img (CLS), preload="metadata"
   ═══════════════════════════════════════════════════════════════ */

const HERO_SLIDES = [
  {
    type: 'video',
    src: '/herovid.mp4',
    poster: '/hero-poster.jpg', // ← add a real poster frame here
    eyebrow: 'LUXURY FASHION',
    title: "Luxury Women's Fashion — Clothing, Bags & Accessories",
    sub: 'Curated collections crafted to inspire sophistication every day.',
    cta: 'Shop Now',
    href: '/collections/all',
  },
  {
    type: 'image',
    src: '/womens33.png',
    eyebrow: 'SIGNATURE STYLES',
    title: 'Designed for Modern Women',
    sub: 'Refined fashion essentials that blend beauty, comfort, and grace.',
    cta: 'Discover More',
    href: '/collections/all',
  },
];

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;

    const timer = setInterval(() => {
      setActiveSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <section className="relative h-[calc(100vh-100px)] min-h-[560px] w-full overflow-hidden bg-[#d8d1c6]">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        {slide.type === 'video' ? (
          <video
            key={slide.src}
            autoPlay
            muted
            loop
            playsInline
            /* FIX: metadata only — avoids downloading full video on mobile */
            preload="metadata"
            /* FIX: poster shown immediately while video loads → LCP */
            poster={slide.poster}
            className="h-full w-full object-cover"
          >
            <source src={slide.src} type="video/mp4" />
          </video>
        ) : (
          <img
            key={slide.src}
            src={slide.src}
            alt=""
            /* FIX: explicit dims prevent CLS */
            width={1920}
            height={1080}
            /* FIX: high priority for above-the-fold first slide */
            fetchpriority={activeSlide === 0 ? 'high' : 'auto'}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[8000ms] ease-out"
            style={{objectPosition: 'center', transform: 'scale(1.04)'}}
            onError={(e) => {
              console.error('Image failed:', slide.src);
              e.currentTarget.style.visibility = 'hidden';
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end px-6 pb-16 text-center sm:pb-20">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/65">
          {slide.eyebrow}
        </p>
        <h1
          className="mb-4 text-4xl font-light leading-tight text-white drop-shadow-lg sm:text-7xl"
          style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
        >
          {slide.title}
        </h1>
        <p className="mb-8 text-sm tracking-wide text-white/70">{slide.sub}</p>
        <Link
          to={slide.href}
          className="inline-flex min-w-[180px] items-center justify-center border border-white bg-white/10 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#1B2A3D] sm:min-w-[200px] sm:px-10"
        >
          {slide.cta}
        </Link>
        <div className="mt-8 flex items-center gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveSlide(index)}
              className="transition-all duration-300"
              style={{
                width: index === activeSlide ? '28px' : '6px',
                height: '6px',
                borderRadius: '999px',
                background:
                  index === activeSlide ? 'white' : 'rgba(255,255,255,0.35)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeSlide ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRUST BAR
   FIX: removed inline <style> — keyframes moved to app.css
   ═══════════════════════════════════════════════════════════════ */

function TrustBar() {
  const items = [
    '✦ Free shipping over $75',
    '✦ Sustainable materials',
    '✦ Crafted to last',
    '✦ 30-day returns',
    '✦ Exclusive designs',
    '✦ New arrivals weekly',
  ];

  return (
    <div
      className="overflow-hidden py-3"
      style={{
        background: '#1B2A3D',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* FIX: will-change promotes to compositor layer, reducing repaints */}
      <div
        className="marquee-track flex gap-12 whitespace-nowrap"
        style={{width: 'max-content'}}
      >
        {[...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="text-[11px] uppercase tracking-[0.22em] text-white/60"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FEATURE CARDS CAROUSEL
   FIX: fetchpriority="high" on first card image (above-fold mobile)
        explicit width/height on all card images (CLS)
   ═══════════════════════════════════════════════════════════════ */

function FeatureCardsCarousel() {
  const carouselRef = useRef(null);

  const cards = [
    {
      label: 'New Clothing',
      icon: 'spark',
      image: '/hero66.png',
      to: '/collections/clothing',
      titlePlain: 'Experience elegance in every',
      titleItalic: 'stitch',
    },
    {
      label: 'Luxury Bags',
      icon: 'heart',
      image: '/hero77.png',
      to: '/collections/bags',
      titlePlain: 'Complete your look with our',
      titleItalic: 'handbag collection',
    },
    {
      label: "Women's Watches",
      icon: 'wave',
      image: '/hero99.png',
      to: '/collections/womens-watches',
      titlePlain: 'Timeless beauty on your',
      titleItalic: 'wrist',
    },
    {
      label: 'Fine Jewelry',
      icon: 'spark',
      image: '/hero10.png',
      to: '/collections/womens-jewelry',
      titlePlain: 'Add a touch of sparkle to',
      titleItalic: 'your story',
    },
  ];

  const scroll = (dir) =>
    carouselRef.current?.scrollBy({left: dir * 520, behavior: 'smooth'});

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-24"
      style={{
        background:
          'linear-gradient(120deg, #eaf5f4 0%, #f7efe5 50%, #f0ebe3 100%)',
      }}
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-[#1B2A3D]/40">
              Explore
            </p>
            <h2
              className="text-3xl font-light text-[#1B2A3D] sm:text-4xl"
              style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
            >
              Shop by Category
            </h2>
          </div>
          <Link
            to="/collections/all"
            className="hidden text-xs font-semibold uppercase tracking-[0.15em] text-[#1B2A3D]/50 underline-offset-4 hover:text-[#1B2A3D] sm:block"
          >
            View All →
          </Link>
        </div>

        <div
          ref={carouselRef}
          className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
        >
          {cards.map((card, index) => (
            <FeatureCard key={card.label} card={card} priority={index === 0} />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div
            className="h-px flex-1"
            style={{background: 'rgba(27,42,61,0.15)'}}
          />
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Previous"
            className="flex h-11 w-11 items-center justify-center rounded-full transition-all hover:opacity-75"
            style={{background: 'rgba(27,42,61,0.12)', color: '#1B2A3D'}}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Next"
            className="flex h-11 w-11 items-center justify-center rounded-full transition-all hover:opacity-75"
            style={{background: '#1B2A3D', color: 'white'}}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({card, priority = false}) {
  const glyphs = {spark: '✦', heart: '♡', wave: '≋'};

  return (
    <Link
      to={card.to}
      className="group relative flex-shrink-0 snap-start overflow-hidden bg-[#d8d1c6]"
      style={{
        width: 'min(82vw, 460px)',
        height: 'clamp(380px, 56vh, 560px)',
        borderRadius: '16px',
      }}
    >
      <img
        src={card.image}
        alt={card.label}
        width={460}
        height={560}
        /* FIX: first card is above-fold on mobile */
        fetchpriority={priority ? 'high' : 'auto'}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.08) 100%)',
        }}
      />
      <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
        <span
          className="flex items-center gap-2.5 px-5 py-2 text-xs font-semibold text-white"
          style={{
            borderRadius: '999px',
            background: 'rgba(30,20,16,0.55)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.14)',
            letterSpacing: '0.08em',
          }}
        >
          <span style={{fontSize: '14px'}}>{glyphs[card.icon] || '✦'}</span>
          {card.label}
        </span>
        <span
          className="flex h-[46px] w-[46px] items-center justify-center rounded-full text-2xl font-light text-[#1B2A3D] transition-all duration-300 group-hover:rotate-90"
          style={{
            background: 'rgba(248,242,237,0.92)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            lineHeight: 1,
          }}
        >
          +
        </span>
      </div>
      <div className="absolute bottom-6 left-5 right-5">
        <h3 className="text-[28px] font-light leading-[1.05] tracking-[-0.02em] text-white sm:text-[36px]">
          {card.titlePlain}{' '}
          <em
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 300,
            }}
          >
            {card.titleItalic}
          </em>
        </h3>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORY SECTION
   FIX: useMemo on product filter to avoid re-running on every render
   ═══════════════════════════════════════════════════════════════ */

const PRODUCT_TYPE_MAP = {
  Tops: [
    'top', 'tee', 't-shirt', 'shirt', 'blouse', 'sweater', 'hoodie', 'tank',
    'mock neck', 'knit', 'cardigan', 'jacket', 'coat',
  ],
  Bottoms: [
    'bottom', 'pant', 'pants', 'trouser', 'trousers', 'skirt', 'short',
    'shorts', 'legging', 'leggings', 'jean', 'denim',
  ],
  Accessories: [
    'accessory', 'accessories', 'bag', 'hat', 'scarf', 'belt', 'jewelry',
    'necklace', 'ring', 'earring', 'bracelet', 'watch', 'sunglasses',
  ],
};

function productMatchesTab(product, tab) {
  const keywords = PRODUCT_TYPE_MAP[tab];
  if (!keywords) return false;
  const typeMatch = keywords.some((kw) =>
    product.productType?.toLowerCase().includes(kw),
  );
  if (typeMatch) return true;
  const searchable = [product.title, ...(product.tags || [])].join(' ').toLowerCase();
  return keywords.some((kw) => searchable.includes(kw));
}

function CategorySection({products}) {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Tops', 'Bottoms', 'Accessories'];

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-[#1B2A3D]/40">
            Curated For You
          </p>
          <h2
            className="text-3xl font-light text-[#1B2A3D] sm:text-4xl"
            style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
          >
            Popular Right Now
          </h2>
        </div>
        <div
          className="flex items-center gap-1 rounded-full p-1"
          style={{background: 'rgba(27,42,61,0.05)'}}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1.5 text-xs font-semibold tracking-wide transition-all sm:px-4"
              style={{
                borderRadius: '999px',
                background: activeTab === tab ? '#1B2A3D' : 'transparent',
                color: activeTab === tab ? 'white' : 'rgba(27,42,61,0.5)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <Suspense fallback={<ProductsSkeleton />}>
        <Await resolve={products} errorElement={<ProductsError />}>
          {(response) => {
            const allProducts = response?.products?.nodes ?? [];

            /* FIX: memoised — only re-filters when tab or products change */
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const visibleProducts = useMemo(
              () =>
                activeTab === 'All'
                  ? allProducts
                  : allProducts.filter((p) => productMatchesTab(p, activeTab)),
              [activeTab, allProducts],
            );

            if (!visibleProducts.length) {
              return (
                <div className="rounded-2xl bg-[#F7F4F0] px-6 py-12 text-center">
                  <p className="text-sm text-[#1B2A3D]/55">
                    No {activeTab.toLowerCase()} found. Make sure your Shopify
                    products have a matching <strong>Product Type</strong> (e.g.
                    "Top", "Pant") or tag.
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {visibleProducts.slice(0, 8).map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    featured={index === 0}
                  />
                ))}
              </div>
            );
          }}
        </Await>
      </Suspense>

      <div className="mt-10 flex justify-center">
        <Link
          to="/collections/all"
          className="inline-flex items-center gap-3 border border-[#000000] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1B2A3D] transition-all hover:bg-[#25455A] hover:text-white sm:px-10"
        >
          View All Products
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT CARD
   ═══════════════════════════════════════════════════════════════ */

const COLOR_NAME_MAP = {
  white: '#F5F1ED', ivory: '#F3EFE4', cream: '#F0E9D6', stone: '#C5B9A8',
  sand: '#D4C5A9', beige: '#D9C9AD', tan: '#C8A882', camel: '#C19A6B',
  brown: '#8B6347', black: '#1B2A3D', navy: '#1B2A4D', slate: '#3B4D6B',
  grey: '#888888', gray: '#888888', charcoal: '#4A4A4A', pink: '#E8C8D0',
  blush: '#F2D0D0', rose: '#D4687E', red: '#C04040', burgundy: '#722F37',
  wine: '#722F37', green: '#5A7A5A', sage: '#7D9B76', olive: '#6B7340',
  blue: '#4A7CB5', sky: '#8BB8D4', lavender: '#C4AEDA', purple: '#7B5EA7',
  yellow: '#E8CC70', mustard: '#C8922A', orange: '#D4703A', coral: '#E07060',
};

function getSwatchColor(colorName) {
  if (!colorName) return null;
  const key = colorName.toLowerCase().trim();
  return COLOR_NAME_MAP[key] ?? null;
}

function ProductCard({product, featured = false}) {
  const image = product.featuredImage;
  const price = product.priceRange?.minVariantPrice;
  const [wished, setWished] = useState(false);

  const colorOption = product.options?.find(
    (opt) =>
      opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour',
  );
  const swatchColors =
    colorOption?.values
      ?.map((v) => ({name: v, hex: getSwatchColor(v)}))
      .filter((s) => s.hex) ?? [];

  const visibleSwatches = swatchColors.slice(0, 5);
  const extraCount = swatchColors.length - visibleSwatches.length;

  return (
    <div className={`group ${featured ? 'col-span-2 sm:col-span-1' : ''}`}>
      <div
        className="relative mb-3 overflow-hidden bg-[#F5F1ED]"
        style={{aspectRatio: '3/4'}}
      >
        <Link to={`/products/${product.handle}`} className="block h-full">
          {image ? (
            <Image
              data={image}
              alt={image.altText || product.title}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#F5F1ED] to-[#E8DDD0]" />
          )}

          <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/[0.08]" />

          <div className="absolute bottom-0 left-0 right-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            <div
              className="mx-3 mb-3 flex items-center justify-center gap-3 py-2.5 text-[11px] font-semibold text-[#1B2A3D]"
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(8px)',
                letterSpacing: '0.08em',
              }}
            >
              {(product.sizeValues?.length
                ? product.sizeValues
                : ['XS', 'S', 'M', 'L', 'XL']
              ).map((size) => (
                <span
                  key={size}
                  className="cursor-pointer transition-all hover:font-black"
                  onClick={(e) => e.preventDefault()}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <span
            className="absolute left-3 top-3 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white"
            style={{background: '#1B2A3D', letterSpacing: '0.12em'}}
          >
            Popular
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setWished((v) => !v)}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all hover:scale-105"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(6px)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
          }}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={wished ? '#1B2A3D' : 'none'}
            stroke="#1B2A3D"
            strokeWidth="1.8"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>

      <Link
        to={`/products/${product.handle}`}
        className="flex items-start justify-between gap-2"
      >
        <div className="min-w-0 flex-1">
          <h4
            className="truncate text-sm font-medium text-[#1B2A3D] transition-colors group-hover:text-[#1B2A3D]/65"
            style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
          >
            {product.title}
          </h4>
          <div className="mt-1.5 flex items-center gap-1.5">
            {visibleSwatches.length > 0 ? (
              <>
                {visibleSwatches.map((swatch) => (
                  <span
                    key={swatch.name}
                    title={swatch.name}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: swatch.hex,
                      border: '1.5px solid rgba(27,42,61,0.15)',
                      display: 'block',
                      flexShrink: 0,
                    }}
                  />
                ))}
                {extraCount > 0 && (
                  <span className="text-[10px] text-[#1B2A3D]/35">
                    +{extraCount}
                  </span>
                )}
              </>
            ) : (
              ['#C5B9A8', '#1B2A3D', '#E8C8D0'].map((color, i) => (
                <span
                  key={i}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: color,
                    border: '1.5px solid rgba(27,42,61,0.15)',
                    display: 'block',
                    flexShrink: 0,
                  }}
                />
              ))
            )}
          </div>
        </div>
        {price ? (
          <span className="whitespace-nowrap text-sm font-semibold text-[#1B2A3D]">
            <Money data={price} />
          </span>
        ) : null}
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MATERIALS BANNER
   FIX: explicit width/height, loading="lazy" (below fold)
   ═══════════════════════════════════════════════════════════════ */

function MaterialsBanner() {
  return (
    <section className="relative mt-0 h-[70vh] w-full overflow-hidden">
      <img
        src="/ok.png"
        alt="Our Materials — sustainable luxury fabrics"
        width={1920}
        height={1080}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
      />
      <div className="absolute inset-0" style={{background: 'rgba(0,0,0,0.42)'}} />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-white/50">
          Crafted with Care
        </p>
        <h2
          className="mb-5 text-4xl font-light text-white sm:text-6xl"
          style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
        >
          Our Materials
        </h2>
        <p className="mb-10 max-w-md text-sm leading-relaxed text-white/60">
          Committed to creating the softest, most sustainable luxury essentials —
          crafted to last a lifetime.
        </p>
        <Link
          to="/pages/about"
          className="inline-flex items-center gap-3 border border-white/60 px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all hover:border-white hover:bg-white hover:text-[#1B2A3D]"
        >
          Discover Our Story
          <svg
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COLLECTION DUO
   FIX: explicit width/height, loading="lazy", descriptive alt text
   ═══════════════════════════════════════════════════════════════ */

function CollectionDuo() {
  const collections = [
    {
      title: "Women's Collection",
      sub: 'New Arrivals',
      handle: 'all',
      image: '/hero9.png',
      alt: "Women's fashion collection — new arrivals",
    },
    {
      title: 'Accessories',
      sub: 'Shop the Look',
      handle: 'all',
      image: '/hero10.png',
      alt: 'Luxury accessories — bags, jewelry and more',
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-0 md:grid-cols-2">
      {collections.map((collection) => (
        <Link
          key={collection.title}
          to={`/collections/${collection.handle}`}
          className="group relative block overflow-hidden"
          style={{aspectRatio: '4/5'}}
        >
          <img
            src={collection.image}
            alt={collection.alt}
            width={720}
            height={900}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
          />
          <div
            className="absolute inset-0"
            style={{background: 'rgba(0,0,0,0.2)'}}
          />
          <div className="absolute bottom-0 left-0 right-0 pb-14 text-center">
            <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-white/55">
              {collection.sub}
            </p>
            <h3
              className="mb-6 text-3xl font-light italic text-white sm:text-4xl"
              style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
            >
              {collection.title}
            </h3>
            <span
              className="inline-block px-8 py-3 text-xs font-semibold uppercase tracking-widest text-[#1B2A3D] transition-all group-hover:bg-[#1B2A3D] group-hover:text-white"
              style={{background: 'white'}}
            >
              Shop Now
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIAL STRIP
   FIX: removed incorrect Product schema wrapper — reviews stand alone
   ═══════════════════════════════════════════════════════════════ */

const REVIEWS = [
  {
    quote:
      'Absolutely beautiful quality. The fabric feels luxurious and the fit is perfect.',
    author: 'Sarah M.',
    location: 'New York',
    rating: 5,
  },
  {
    quote:
      'My go-to for elegant essentials. Every piece I own from VALORAERPY is always perfect.',
    author: 'Clara D.',
    location: 'Los Angeles',
    rating: 5,
  },
  {
    quote:
      'Sustainable and stunning. Worth every penny — I get compliments every time I wear it.',
    author: 'Priya K.',
    location: 'Chicago',
    rating: 5,
  },
];

function TestimonialStrip() {
  return (
    <section className="py-16" style={{background: '#F7F4F0'}}>
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
        <div className="mb-10 text-center">
          <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-[#1B2A3D]/40">
            What They Say
          </p>
          <h2
            className="text-3xl font-light text-[#1B2A3D]"
            style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
          >
            Customer Love
          </h2>
        </div>
        {/* FIX: removed incorrect wrapping Product schema — reviews are standalone */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {REVIEWS.map((review) => (
            <div
              key={review.author}
              className="rounded-2xl p-6 sm:p-8"
              style={{background: 'white'}}
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="flex gap-0.5"
                  itemProp="reviewRating"
                  itemScope
                  itemType="https://schema.org/Rating"
                >
                  {Array.from({length: review.rating}).map((_, i) => (
                    <span
                      key={i}
                      className="text-sm text-[#1B2A3D]"
                      aria-hidden="true"
                    >
                      ★
                    </span>
                  ))}
                  <meta itemProp="ratingValue" content={String(review.rating)} />
                  <meta itemProp="bestRating" content="5" />
                  <span className="sr-only">
                    {review.rating} out of 5 stars
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#1B2A3D]/30">
                  Verified
                </span>
              </div>
              <p
                className="mb-5 text-base font-light italic leading-relaxed text-[#1B2A3D]/75"
                style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
                itemProp="reviewBody"
              >
                &ldquo;{review.quote}&rdquo;
              </p>
              <div
                itemScope
                itemType="https://schema.org/Person"
                itemProp="author"
              >
                <p
                  className="text-xs font-semibold tracking-wide text-[#1B2A3D]"
                  itemProp="name"
                >
                  {review.author}
                </p>
                <p className="text-[11px] text-[#1B2A3D]/40">
                  {review.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NEWSLETTER SIGNUP
   NOTE: wire handleSubmit to a real provider (Klaviyo, etc.)
         before launch — currently a placeholder delay only
   ═══════════════════════════════════════════════════════════════ */

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    // TODO: replace with real API call, e.g. Klaviyo subscribe endpoint
    await new Promise((resolve) => setTimeout(resolve, 950));
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 6000);
  };

  return (
    <section className="py-20" style={{background: '#1B2A3D'}}>
      <div className="mx-auto max-w-xl px-6 text-center sm:px-10">
        <p
          className="mb-3 text-[11px] uppercase tracking-[0.25em] text-white/40"
          style={{fontFamily: 'sans-serif'}}
        >
          Stay in the loop
        </p>
        <h2
          className="mb-4 text-3xl font-light text-white sm:text-4xl"
          style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
        >
          Join the Inner Circle
        </h2>
        <p className="mb-10 mx-auto max-w-md text-sm leading-relaxed text-white/60">
          Be the first to know about new arrivals, private events, and
          member-only offers.
        </p>
        {status === 'success' ? (
          <div className="mx-auto max-w-xs rounded-2xl border border-white/20 bg-white/5 px-8 py-6 text-center">
            <div className="mx-auto mb-3 text-2xl">✦</div>
            <p className="text-[15px] font-light text-white/90">
              Thank you. You&apos;re now part of the inner circle.
            </p>
            <p className="mt-1 text-xs text-white/40">Welcome to VALORAERPY.</p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row sm:gap-0">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="Your email address"
              aria-label="Email address"
              className="flex-1 border border-white/20 bg-white/5 px-6 py-4 text-sm text-white outline-none transition-all placeholder:text-white/35 focus:border-white/40 focus:bg-white/10 rounded-2xl sm:rounded-r-none sm:rounded-l-2xl"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={status === 'loading'}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={status === 'loading'}
              className="whitespace-nowrap rounded-2xl bg-white px-10 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#1B2A3D] transition-all hover:bg-[#d8d1c6] disabled:opacity-60 active:scale-[0.985] sm:rounded-l-none sm:rounded-r-2xl"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        )}
        {status === 'error' && (
          <p className="mt-3 text-xs text-white/60">
            Please enter a valid email address.
          </p>
        )}
        <p
          className="mt-8 text-[10px] tracking-wide text-white/25"
          style={{fontFamily: 'sans-serif'}}
        >
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VISIT US
   FIX: loading="lazy", explicit dims, descriptive alt
   ═══════════════════════════════════════════════════════════════ */

function VisitUs() {
  return (
    <section className="grid grid-cols-1 items-stretch gap-0 md:grid-cols-2">
      <div
        className="flex flex-col justify-center px-8 py-16 sm:px-20 sm:py-20"
        style={{background: '#F7F4F0'}}
      >
        <p className="mb-4 text-[11px] uppercase tracking-[0.25em] text-[#1B2A3D]/40">
          Find Us
        </p>
        <h2
          className="mb-5 text-3xl font-light text-[#1B2A3D] sm:text-4xl"
          style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
        >
          Visit Our Store
        </h2>
        <p className="mb-6 max-w-xs text-sm leading-relaxed text-[#1B2A3D]/55">
          Meet us in store to try on our newest arrivals and shop exclusives in
          person. Our stylists are ready to help.
        </p>
        <div className="mb-8 space-y-1.5">
          <p className="text-xs text-[#1B2A3D]/45">{STORE_CONFIG.address}</p>
          <p className="text-xs text-[#1B2A3D]/45">{STORE_CONFIG.hours}</p>
        </div>
        <Link
          to={STORE_CONFIG.contactPage}
          className="inline-flex w-fit items-center gap-3 bg-[#1B2A3D] px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:opacity-[0.85]"
        >
          Get Directions
          <svg
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="overflow-hidden" style={{minHeight: '400px'}}>
        <img
          src="/hero5.png"
          alt="VALORAERPY store interior — 123 Fashion Avenue, New York"
          width={720}
          height={900}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
          style={{minHeight: '400px'}}
          onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
        />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SKELETON / ERROR
   ═══════════════════════════════════════════════════════════════ */

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({length: 8}).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="mb-3 bg-[#F5F1ED]" style={{aspectRatio: '3/4'}} />
          <div className="h-3.5 w-3/4 rounded bg-[#F5F1ED]" />
          <div className="mt-2 flex gap-1.5">
            {[1, 2, 3].map((d) => (
              <div key={d} className="h-3 w-3 rounded-full bg-[#F5F1ED]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsError() {
  return (
    <div className="rounded-2xl bg-[#F7F4F0] px-6 py-12 text-center">
      <p className="text-sm text-[#1B2A3D]/55">
        Products could not be loaded right now.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GRAPHQL
   ═══════════════════════════════════════════════════════════════ */

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    productType
    tags
    options { name values }
    priceRange { minVariantPrice { amount currencyCode } }
    featuredImage { id url altText width height }
  }
  query RecommendedProducts($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    products(first: 16, sortKey: UPDATED_AT, reverse: true) { nodes { ...RecommendedProduct } }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */