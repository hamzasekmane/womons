import {Await, useLoaderData, Link} from 'react-router';
import {Suspense, useRef, useState, useEffect, useMemo, useCallback} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {motion, AnimatePresence, useScroll, useTransform} from 'framer-motion';
import {MockShopNotice} from '~/components/MockShopNotice';

/* ═══════════════════════════════════════════════════════════════
   META & LOADER
   ═══════════════════════════════════════════════════════════════ */

export const meta = () => [
  {title: 'VALORAERPY | Premium Fashion & Accessories'},
  {name: 'description', content: 'Curated luxury fashion. Free shipping over $75.'},
  {property: 'og:title', content: 'VALORAERPY | Premium Fashion & Accessories'},
  {property: 'og:image', content: 'https://yourdomain.com/og-image.jpg'},
];

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}) {
  return {isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN)};
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

const STORE_CONFIG = {
  address: '123 Fashion Avenue, New York, NY 10001',
  hours: 'Mon–Sat 10am–7pm · Sun 11am–5pm',
  contactPage: '/pages/contact',
};

/* ═══════════════════════════════════════════════════════════════
   ANIMATION WRAPPER COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function FadeIn({children, delay = 0, className = '', y = 30}) {
  return (
    <motion.div
      initial={{opacity: 0, y}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-50px'}}
      transition={{duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98]}}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function Homepage() {
  const data = useLoaderData();

  return (
    <div className="min-h-screen bg-[#fafafa] text-black selection:bg-black selection:text-white">
      {/* Custom Styles for pure CSS animations (Marquee/Hide Scrollbar) */}
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
      `}</style>

      {data.isShopLinked ? null : <MockShopNotice />}
      <AnnouncementBar />
      <Hero />
      <TrustBar />
      <CategorySection products={data.recommendedProducts} />
      <FeatureCardsCarousel />
      <LifestyleSplit />
      <MaterialsBanner />
      <CollectionDuo />
      <TestimonialStrip />
      <NewsletterSignup />
      <VisitUs />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANNOUNCEMENT & HERO
   ═══════════════════════════════════════════════════════════════ */

function AnnouncementBar() {
  return (
    <div className="w-full bg-black py-2.5 text-center z-50 relative">
      <Link
        to="/collections/all"
        className="text-[12px] uppercase tracking-widest font-medium text-white transition-opacity hover:opacity-70"
      >
        Introducing the New Collection. Shop now →
      </Link>
    </div>
  );
}

const HERO_SLIDES = [
  {
    type: 'video',
    src: '/herovid.mp4',
    poster: '/hero3.png',
    eyebrow: 'INTRODUCING',
    title: 'Luxury Fashion: New Collection',
    sub: 'Curated essentials crafted to inspire sophistication every day.',
    cta: 'Shop Now',
    href: '/collections/all',
  },
  {
    type: 'image',
    src: '/womens33.png',
    poster: '/womens33.png',
    eyebrow: 'SIGNATURE STYLES',
    title: 'Designed for Modern Women',
    sub: 'Refined essentials that blend beauty, comfort, and grace.',
    cta: 'Discover More',
    href: '/collections/all',
  },
];

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <section className="px-4 pt-4 sm:px-8 sm:pt-6">
      <div className="relative overflow-hidden rounded-3xl bg-gray-900 aspect-[4/5] sm:aspect-[21/9]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{opacity: 0, scale: 1.05}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0}}
            transition={{duration: 1.2, ease: "easeInOut"}}
            className="absolute inset-0 h-full w-full"
          >
            {slide.type === 'video' ? (
              <video
                autoPlay muted loop playsInline
                poster={slide.poster}
                className="h-full w-full object-cover"
              >
                <source src={slide.src} type="video/mp4" />
              </video>
            ) : (
              <img src={slide.src} alt="" className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-10 left-6 right-6 sm:bottom-20 sm:left-20 sm:max-w-2xl z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${activeSlide}`}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -20}}
              transition={{duration: 0.8, delay: 0.2}}
            >
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-white/80">
                {slide.eyebrow}
              </p>
              <h1 className="mb-6 text-4xl font-light leading-tight text-white sm:text-6xl lg:text-7xl">
                {slide.title}
              </h1>
              <p className="mb-10 max-w-md text-sm text-white/80 sm:text-lg font-light">
                {slide.sub}
              </p>
              <Link
                to={slide.href}
                className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-transform hover:scale-105"
              >
                {slide.cta}
                <motion.span
                  className="group-hover:translate-x-1 transition-transform"
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 right-8 z-20 flex items-center gap-3">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className="relative h-1 rounded-full overflow-hidden transition-all"
              style={{width: index === activeSlide ? '32px' : '12px', background: 'rgba(255,255,255,0.3)'}}
            >
              {index === activeSlide && (
                <motion.div
                  layoutId="active-hero-indicator"
                  className="absolute inset-0 bg-white"
                  transition={{duration: 0.5}}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRUST BAR (MARQUEE)
   ═══════════════════════════════════════════════════════════════ */

const TRUST_ITEMS = ['Free shipping over $75', 'Sustainable materials', 'Crafted to last', '30-day returns', 'Exclusive designs', 'New arrivals weekly'];

function TrustBar() {
  return (
    <div className="overflow-hidden border-y border-gray-200 bg-white py-4 mt-6">
      <div className="flex w-[200%] animate-marquee gap-16">
        {[...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS].map((item, index) => (
          <span key={index} className="flex items-center gap-4 text-[12px] uppercase tracking-widest text-gray-900 font-semibold whitespace-nowrap">
            <span className="text-gray-300">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORY SECTION
   ═══════════════════════════════════════════════════════════════ */

const TABS = ['All', 'Tops', 'Bottoms', 'Accessories'];
const PRODUCT_TYPE_MAP = {
  Tops: ['top', 'tee', 'shirt', 'blouse', 'sweater', 'hoodie', 'jacket'],
  Bottoms: ['bottom', 'pant', 'skirt', 'short', 'legging', 'jean'],
  Accessories: ['bag', 'hat', 'belt', 'jewelry', 'necklace', 'ring', 'watch'],
};

function productMatchesTab(product, tab) {
  const keywords = PRODUCT_TYPE_MAP[tab];
  if (!keywords) return false;
  const searchable = [product.productType, product.title, ...(product.tags || [])].join(' ').toLowerCase();
  return keywords.some((kw) => searchable.includes(kw));
}

function CategoryInner({allProducts, activeTab}) {
  const visibleProducts = useMemo(() =>
    activeTab === 'All' ? allProducts : allProducts.filter((p) => productMatchesTab(p, activeTab)),
  [activeTab, allProducts]);

  return (
    <motion.div layout className="flex hide-scroll snap-x snap-mandatory gap-6 overflow-x-auto pb-8 pt-4">
      <AnimatePresence mode="popLayout">
        {visibleProducts.map((product, i) => (
          <motion.div
            key={product.id}
            layout
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.9}}
            transition={{duration: 0.4, delay: i * 0.05}}
            className="w-[280px] flex-shrink-0 snap-start sm:w-[340px]"
          >
            <AtomsProductCard product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function CategorySection({products}) {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <FadeIn className="px-4 py-20 sm:px-8 sm:py-32">
      <div className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row">
        <h2 className="text-3xl font-light text-black sm:text-5xl tracking-tight">Explore Every Day</h2>
        
        {/* Animated Tabs */}
        <div className="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-sm border border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative rounded-full px-6 py-2.5 text-[13px] font-semibold transition-colors ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-black'}`}
            >
              {activeTab === tab && (
                <motion.div layoutId="active-tab" className="absolute inset-0 rounded-full bg-black" transition={{type: "spring", bounce: 0.2, duration: 0.6}} />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      <Suspense fallback={<div className="h-96 w-full animate-pulse bg-gray-100 rounded-3xl"/>}>
        <Await resolve={products}>
          {(response) => <CategoryInner allProducts={response?.products?.nodes ?? []} activeTab={activeTab} />}
        </Await>
      </Suspense>
    </FadeIn>
  );
}

function AtomsProductCard({product}) {
  const image = product.featuredImage;
  const price = product.priceRange?.minVariantPrice;

  return (
    <Link to={`/products/${product.handle}`} className="group block w-full cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5]">
        {image && (
          <Image
            data={image}
            sizes="(min-width: 768px) 340px, 280px"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
        {/* Quick Add Hover Effect */}
        <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="rounded-full bg-white/90 backdrop-blur-sm py-3 text-center text-sm font-semibold text-black shadow-lg">
            View Product
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-between items-start gap-4 px-1">
        <div>
          <h3 className="text-base font-medium text-black group-hover:underline underline-offset-4">{product.title}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-1">Refined minimal design</p>
        </div>
        {price && <p className="text-base font-medium text-black"><Money data={price} /></p>}
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FEATURE CARDS
   ═══════════════════════════════════════════════════════════════ */

const CATEGORY_CARDS = [
  {label: 'New Clothing', image: '/hero66.png', to: '/collections/clothing', title: 'Elegance in every stitch'},
  {label: 'Luxury Bags', image: '/hero77.png', to: '/collections/bags', title: 'Complete your look'},
  {label: "Women's Watches", image: '/hero99.png', to: '/collections/womens-watches', title: 'Timeless beauty'},
  {label: 'Fine Jewelry', image: '/hero10.png', to: '/collections/womens-jewelry', title: 'Add a touch of sparkle'},
];

function FeatureCardsCarousel() {
  return (
    <section className="px-4 py-20 sm:px-8 bg-white">
      <FadeIn delay={0.1}>
        <div className="mb-12 flex justify-between items-end">
          <h2 className="text-3xl font-light sm:text-5xl">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORY_CARDS.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{delay: index * 0.1, duration: 0.6}}
            >
              <Link to={card.to} className="group relative block overflow-hidden rounded-2xl aspect-[3/4]">
                <img src={card.image} alt={card.label} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <span className="self-start rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 text-[11px] font-semibold text-white tracking-widest uppercase">
                    {card.label}
                  </span>
                  <h3 className="text-2xl font-light text-white sm:text-3xl translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                    {card.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LIFESTYLE SPLIT
   ═══════════════════════════════════════════════════════════════ */

function LifestyleSplit() {
  return (
    <section className="px-4 py-20 sm:px-8 sm:py-32">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
        <FadeIn className="grid grid-cols-2 gap-4">
          <motion.div whileHover={{y: -10}} transition={{type: "spring"}} className="aspect-[3/4] overflow-hidden rounded-3xl mt-12">
            <img src="/hero9.png" alt="Lifestyle 1" className="h-full w-full object-cover" />
          </motion.div>
          <motion.div whileHover={{y: -10}} transition={{type: "spring"}} className="aspect-[3/4] overflow-hidden rounded-3xl">
            <img src="/hero10.png" alt="Lifestyle 2" className="h-full w-full object-cover" />
          </motion.div>
        </FadeIn>
        
        <FadeIn delay={0.2} className="px-2 lg:pr-12">
          <h2 className="mb-6 text-4xl font-light leading-tight text-black sm:text-6xl">
            Work. Fun. <br/>Daily Sprints.
          </h2>
          <p className="mb-10 text-lg leading-relaxed text-gray-500 font-light">
            VALORAERPY pieces are versatile, durable and timeless. They're your perfect picks for busy days, last-minute events, and relaxed weekends. Crafted to evolve with your lifestyle.
          </p>
          <Link to="/collections/all" className="inline-flex items-center gap-3 border-b border-black pb-1 text-sm font-semibold uppercase tracking-widest text-black transition-all hover:gap-5">
            Find Your Style →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MATERIALS BANNER (PARALLAX EFFECT)
   ═══════════════════════════════════════════════════════════════ */

function MaterialsBanner() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section className="px-4 sm:px-8 py-10">
      <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden rounded-[2.5rem]">
        <motion.div style={{y}} className="absolute inset-0 h-[120%] w-full top-[-10%]">
          <img src="/ok.png" alt="Materials" className="h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-black/50" />
        
        <FadeIn className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="mb-6 text-[12px] font-bold uppercase tracking-[0.3em] text-white/70">Crafted with Care</p>
          <h2 className="mb-6 text-5xl font-light text-white sm:text-7xl">Our Materials</h2>
          <p className="mb-10 max-w-lg text-lg font-light leading-relaxed text-white/90">
            Committed to creating the softest, most sustainable luxury essentials — crafted to last a lifetime.
          </p>
          <Link to="/pages/about" className="rounded-full bg-white px-10 py-4 text-sm font-semibold text-black transition-transform hover:scale-105">
            Discover Our Story
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COLLECTION DUO
   ═══════════════════════════════════════════════════════════════ */

const COLLECTIONS = [
  {title: "Women's Collection", sub: 'New Arrivals', handle: 'all', image: '/hero9.png'},
  {title: 'Accessories', sub: 'Shop the Look', handle: 'all', image: '/hero10.png'},
];

function CollectionDuo() {
  return (
    <section className="grid grid-cols-1 gap-4 px-4 py-16 sm:px-8 md:grid-cols-2">
      {COLLECTIONS.map((col, idx) => (
        <FadeIn key={col.title} delay={idx * 0.2}>
          <Link to={`/collections/${col.handle}`} className="group relative block overflow-hidden rounded-3xl aspect-[4/5]">
            <img src={col.image} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-white/80">{col.sub}</p>
              <h3 className="mb-8 text-4xl font-light text-white sm:text-5xl">{col.title}</h3>
              <span className="rounded-full border border-white px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all group-hover:bg-white group-hover:text-black">
                Shop Now
              </span>
            </div>
          </Link>
        </FadeIn>
      ))}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIALS
   ═══════════════════════════════════════════════════════════════ */

const REVIEWS = [
  {quote: 'Absolutely beautiful quality. The fabric feels luxurious and the fit is perfect.', author: 'Sarah M.', loc: 'New York'},
  {quote: 'My go-to for elegant essentials. Every piece I own from VALORAERPY is always perfect.', author: 'Clara D.', loc: 'Los Angeles'},
  {quote: 'Sustainable and stunning. Worth every penny — I get compliments every time I wear it.', author: 'Priya K.', loc: 'Chicago'},
];

function TestimonialStrip() {
  return (
    <section className="bg-[#f0f0f0] px-4 py-24 sm:px-8 mt-12 rounded-t-[3rem]">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="mb-16 text-center">
          <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.3em] text-gray-500">What They Say</p>
          <h2 className="text-4xl font-light text-black sm:text-5xl">Customer Love</h2>
        </FadeIn>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div className="rounded-3xl bg-white p-8 sm:p-10 h-full shadow-sm">
                <div className="flex gap-1 mb-6">
                  {Array.from({length: 5}).map((_, j) => (
                    <span key={j} className="text-black text-lg">★</span>
                  ))}
                </div>
                <p className="mb-8 text-lg font-light leading-relaxed text-gray-800">"{review.quote}"</p>
                <div>
                  <p className="font-semibold text-black">{review.author}</p>
                  <p className="text-sm text-gray-500">{review.loc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NEWSLETTER
   ═══════════════════════════════════════════════════════════════ */

function NewsletterSignup() {
  const [status, setStatus] = useState('idle');

  return (
    <section className="bg-black px-4 py-32 sm:px-8">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h2 className="mb-6 text-4xl font-light text-white sm:text-6xl">Join the Inner Circle</h2>
        <p className="mx-auto mb-12 max-w-md text-lg font-light text-white/70">
          Get first access to new products, founder updates, and $15 off your first order.
        </p>

        {status === 'success' ? (
          <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="rounded-full border border-white/20 bg-white/10 px-8 py-4 text-white">
            Thank you. Welcome to VALORAERPY.
          </motion.div>
        ) : (
          <div className="mx-auto flex flex-col gap-4 sm:flex-row max-w-lg">
            <input
              type="email"
              placeholder="Email Address"
              className="flex-1 rounded-full border border-white/20 bg-white/5 px-6 py-4 text-white outline-none transition-all focus:border-white/60 focus:bg-white/10"
            />
            <button
              onClick={() => setStatus('success')}
              className="rounded-full bg-white px-8 py-4 font-semibold text-black transition-transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        )}
      </FadeIn>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VISIT US
   ═══════════════════════════════════════════════════════════════ */

function VisitUs() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <FadeIn className="flex flex-col justify-center px-8 py-20 sm:px-24 sm:py-32 bg-white">
        <p className="mb-6 text-[12px] font-bold uppercase tracking-[0.3em] text-gray-500">Find Us</p>
        <h2 className="mb-8 text-4xl font-light text-black sm:text-5xl">Visit Our Store</h2>
        <p className="mb-10 max-w-md text-lg font-light leading-relaxed text-gray-600">
          Meet us in store to try on our newest arrivals and shop exclusives in person. Our stylists are ready to help.
        </p>
        <div className="mb-10 space-y-2">
          <p className="text-gray-900 font-medium">{STORE_CONFIG.address}</p>
          <p className="text-gray-500">{STORE_CONFIG.hours}</p>
        </div>
        <Link to={STORE_CONFIG.contactPage} className="inline-flex w-fit items-center gap-3 rounded-full bg-black px-8 py-4 font-semibold text-white transition-transform hover:scale-105">
          Get Directions
        </Link>
      </FadeIn>
      <div className="min-h-[500px] overflow-hidden">
        <img src="/hero5.png" alt="Store Interior" className="h-full w-full object-cover" />
      </div>
    </section>
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
  query RecommendedProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 16, sortKey: UPDATED_AT, reverse: true) {
      nodes { ...RecommendedProduct }
    }
  }
`;