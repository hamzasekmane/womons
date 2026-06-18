import {useLoaderData, Link} from 'react-router';
import {useState, useRef, useEffect, useCallback} from 'react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
  Money,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {motion, AnimatePresence} from 'framer-motion';

/**
 * Color map (Kept entirely intact as provided)
 */
const COLOR_MAP = {
  white: '#FFFFFF', 'off-white': '#FAF9F6', 'off white': '#FAF9F6', ivory: '#FFFFF0', cream: '#FFFDD0',
  beige: '#F5F5DC', nude: '#E3BC9A', neutral: '#D8CAB8', sand: '#C2B280', stone: '#D6D0C4', taupe: '#8B8589',
  ecru: '#C2B280', bone: '#E3DAC9', linen: '#FAF0E6', snow: '#FFFAFA', seashell: '#FFF5EE', alabaster: '#F2F0E6',
  pearl: '#EAE0C8', oat: '#DFD3C3', oatmilk: '#F1E3C6', almond: '#EFDECD', biscuit: '#E3C9A6', champagne: '#F7E7CE',
  clear: '#E8F4F8', transparent: '#E8F4F8', crystal: '#E0F7FA', black: '#1B2A3D', jet: '#343434', ebony: '#555D50',
  grey: '#808080', gray: '#808080', 'light grey': '#D3D3D3', 'light gray': '#D3D3D3', 'dark grey': '#4A4A4A',
  'dark gray': '#4A4A4A', charcoal: '#36454F', slate: '#708090', ash: '#B2BEB5', smoke: '#738276', silver: '#C0C0C0',
  platinum: '#E5E4E2', pewter: '#96A8A1', gunmetal: '#2A3439', blue: '#4A90D9', 'light blue': '#ADD8E6',
  'dark blue': '#00008B', 'sky blue': '#87CEEB', 'baby blue': '#89CFF0', 'powder blue': '#B0E0E6', 'ice blue': '#D6F1F8',
  'royal blue': '#4169E1', 'cobalt blue': '#0047AB', cobalt: '#0047AB', navy: '#3B4D6B', 'navy blue': '#000080',
  denim: '#1560BD', 'denim blue': '#1560BD', indigo: '#4B0082', periwinkle: '#CCCCFF', teal: '#008080', turquoise: '#40E0D0',
  aqua: '#00FFFF', aquamarine: '#7FFFD4', cyan: '#00FFFF', 'midnight blue': '#191970', 'steel blue': '#4682B4',
  'cornflower blue': '#6495ED', sapphire: '#0F52BA', 'peacock blue': '#005F73', red: '#C0392B', 'light red': '#F28B82',
  'dark red': '#8B0000', crimson: '#DC143C', scarlet: '#FF2400', ruby: '#E0115F', cherry: '#DE3163', 'cherry red': '#DE3163',
  brick: '#B22222', 'brick red': '#B22222', maroon: '#800000', burgundy: '#800020', wine: '#722F37', 'wine red': '#7F1D1D',
  oxblood: '#4A0000', rust: '#B7410E', terracotta: '#E2725B', merlot: '#73343A', 'rose red': '#B91C1C', pink: '#E8C8D0',
  'light pink': '#FFB6C1', 'baby pink': '#F4C2C2', 'hot pink': '#FF69B4', 'dark pink': '#B23A67', rose: '#E8C8D0',
  'dusty rose': '#C9A9A6', blush: '#DE5D83', fuchsia: '#FF00FF', magenta: '#FF00FF', salmon: '#FA8072', coral: '#FF7F50',
  peach: '#FFE5B4', 'rose gold': '#B76E79', orange: '#E65100', 'light orange': '#FFD8B1', 'dark orange': '#FF8C00',
  'burnt orange': '#CC5500', tangerine: '#F28500', apricot: '#FBCEB1', pumpkin: '#FF7518', persimmon: '#EC5800',
  'fluorescent orange': '#FF5F1F', 'neon orange': '#FF6700', yellow: '#FDD835', 'light yellow': '#FFFFE0', mustard: '#FFDB58',
  'mustard yellow': '#FFDB58', lemon: '#FFF44F', butter: '#FFF1A8', honey: '#FFC30B', gold: '#FFD700', golden: '#FFD700',
  amber: '#FFBF00', 'fluorescent yellow': '#CCFF00', 'neon yellow': '#DFFF00', green: '#558B2F', 'light green': '#90EE90',
  'dark green': '#006400', lime: '#00FF00', 'lime green': '#32CD32', mint: '#98FF98', 'mint green': '#98FF98', sage: '#BCB88A',
  'sage green': '#BCB88A', olive: '#808000', 'olive green': '#808000', emerald: '#50C878', 'emerald green': '#50C878',
  'forest green': '#228B22', 'hunter green': '#355E3B', 'army green': '#4B5320', moss: '#8A9A5B', 'moss green': '#8A9A5B',
  seafoam: '#9FE2BF', 'seafoam green': '#9FE2BF', jade: '#00A86B', pistachio: '#93C572', khaki: '#C3B091', 'khaki green': '#8A865D',
  'fluorescent green': '#7CFC00', 'neon green': '#39FF14', 'highlighter green': '#7FFF00', 'bright green': '#00FF66',
  'lime punch': '#B7FF00', purple: '#6D28D9', 'light purple': '#D8B4F8', 'dark purple': '#5D3A7D', 'pastel purple': '#CBAACB',
  'soft purple': '#D9C2F0', lavender: '#E6E6FA', lilac: '#C8A2C8', violet: '#8F00FF', 'light violet': '#CF9FFF', mauve: '#E0B0FF',
  plum: '#673147', orchid: '#DA70D6', eggplant: '#614051', amethyst: '#9966CC', brown: '#7C2D12', 'light brown': '#A0522D',
  'dark brown': '#5C4033', chocolate: '#7B3F00', coffee: '#6F4E37', espresso: '#4B3621', mocha: '#967969', tan: '#C5B9A8',
  camel: '#C19A6B', caramel: '#AF6E4D', cognac: '#9A463D', chestnut: '#954535', walnut: '#773F1A', mahogany: '#C04000',
  metallic: '#B0B0B0', 'metallic silver': '#C0C0C0', 'metallic gold': '#D4AF37', bronze: '#CD7F32', copper: '#B87333',
  rosegold: '#B76E79', 'fluorescent pink': '#FF1493', 'neon pink': '#FF10F0',
  multi: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFD93D)',
  multicolor: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFD93D)',
  'multi color': 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFD93D)',
  rainbow: 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)',
  print: 'linear-gradient(45deg, #222 25%, #fff 25%, #fff 50%, #222 50%, #222 75%, #fff 75%)',
  floral: 'linear-gradient(45deg, #FFB6C1, #90EE90, #FFD700)',
  'animal print': 'linear-gradient(45deg, #C19A6B, #8B4513, #1B2A3D)',
  leopard: 'linear-gradient(45deg, #C19A6B, #8B4513, #000000)',
  zebra: 'linear-gradient(45deg, #FFFFFF, #000000)',
  striped: 'linear-gradient(45deg, #FFFFFF 25%, #1B2A3D 25%, #1B2A3D 50%, #FFFFFF 50%, #FFFFFF 75%, #1B2A3D 75%)',
  plaid: 'linear-gradient(45deg, #8B0000, #1B2A3D, #FFFFFF)',
};

function normalizeColorName(value) {
  return String(value || '').toLowerCase().trim().replace(/\+/g, ' ').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
}

function colorToHex(colorValue) {
  if (!colorValue) return '#E0DDD5';
  const raw = String(colorValue).trim();
  if (raw.startsWith('#') || raw.startsWith('rgb') || raw.startsWith('hsl') || raw.startsWith('linear-gradient')) return raw;
  const normalized = normalizeColorName(raw);
  if (COLOR_MAP[normalized]) return COLOR_MAP[normalized];
  const splitColors = normalized.split(/\/|,|&|\band\b/).map((c) => c.trim());
  const matched = splitColors.find((c) => COLOR_MAP[c]);
  if (matched) return COLOR_MAP[matched];
  const tokens = normalized.split(' ');
  const tokenMatch = tokens.find((token) => COLOR_MAP[token]);
  if (tokenMatch) return COLOR_MAP[tokenMatch];
  const partialMatch = Object.keys(COLOR_MAP).find((key) => normalized.includes(key) || key.includes(normalized));
  if (partialMatch) return COLOR_MAP[partialMatch];
  return '#E0DDD5';
}

function isValidCssColor(value) {
  if (!value) return false;
  const str = String(value).trim();
  return str.startsWith('#') || str.startsWith('rgb') || str.startsWith('hsl') || str.startsWith('linear-gradient') || /^[a-zA-Z]+$/.test(str);
}

function resolveSwatchColor(swatchColor, fallbackName) {
  if (swatchColor) {
    const normalizedSwatch = normalizeColorName(swatchColor);
    if (COLOR_MAP[normalizedSwatch]) return COLOR_MAP[normalizedSwatch];
    if (isValidCssColor(swatchColor)) return swatchColor;
  }
  return colorToHex(fallbackName);
}

/* ═══════════════════════════════════════════════════════════════
   META & LOADER
   ═══════════════════════════════════════════════════════════════ */
export const meta = ({data}) => {
  return [
    {title: `VALORAERPY | ${data?.product?.title ?? ''}`},
    {rel: 'canonical', href: `/products/${data?.product?.handle ?? ''}`},
    {name: 'description', content: data?.product?.seo?.description || data?.product?.description?.slice(0, 155) || ''},
  ];
};

export async function loader(args) {
  const deferredData = loadDeferredData();
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  if (!handle) throw new Error('Expected product handle to be defined');

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) throw new Response(null, {status: 404});

  redirectIfHandleIsLocalized(request, {handle, data: product});
  return {product};
}

function loadDeferredData() { return {}; }

/* ═══════════════════════════════════════════════════════════════
   PRODUCT PAGE (ANIMATED LUXURY UI)
   ═══════════════════════════════════════════════════════════════ */
export default function Product() {
  const {product} = useLoaderData();
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant?.selectedOptions || []);
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, description} = product;
  const reviewCount = 127;
  const reviewRating = 4.8;
  const shortDescription = description && description.length > 160 ? `${description.slice(0, 160)}...` : description;

  const priceAmount = Number(selectedVariant?.price?.amount || 0);
  const compareAmount = Number(selectedVariant?.compareAtPrice?.amount || 0);
  const isOnSale = compareAmount > priceAmount;

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-black">
      {/* Breadcrumb */}
      <motion.div 
        initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}}
        className="mx-auto max-w-[1600px] px-6 sm:px-12 py-8"
      >
        <nav className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
          <Link to="/" className="transition-colors hover:text-black">Home</Link>
          <span className="mx-3">/</span>
          <Link to="/collections" className="transition-colors hover:text-black">Collections</Link>
          <span className="mx-3">/</span>
          <span className="text-black">{title}</span>
        </nav>
      </motion.div>

      <div className="mx-auto max-w-[1600px] px-6 pb-24 sm:px-12 lg:pb-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
          
          {/* Left Gallery (Animated) */}
          <motion.div 
            initial={{opacity: 0, x: -30}} animate={{opacity: 1, x: 0}} 
            transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
          >
            <ProductImageGallery product={product} selectedVariant={selectedVariant} />
          </motion.div>

          {/* Right Info (Staggered Fade In) */}
          <motion.div 
            initial={{opacity: 0, x: 30}} animate={{opacity: 1, x: 0}} 
            transition={{duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1]}}
            className="lg:sticky lg:top-32 lg:self-start flex flex-col gap-8"
          >
            {/* Badges */}
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-black px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                New Arrival
              </span>
              {isOnSale && (
                <span className="rounded-full bg-[#C4956A] px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                  Sale
                </span>
              )}
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="mb-4 text-4xl font-light leading-tight tracking-tight sm:text-5xl font-serif">
                {title}
              </h1>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-light">
                  <ProductPrice price={selectedVariant?.price} compareAtPrice={selectedVariant?.compareAtPrice} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-black text-sm">★★★★★</div>
                  <span className="text-xs font-light text-gray-500">({reviewCount})</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {shortDescription && (
              <p className="text-sm font-light leading-relaxed text-gray-500">
                {shortDescription}
              </p>
            )}

            <div className="h-px w-full bg-gray-200" />

            {/* Options */}
            <div className="flex flex-col gap-8">
              <ColorSwatches productOptions={productOptions} />
              <SizeSelector productOptions={productOptions} />
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            </div>

            {/* Add To Cart */}
            <div className="mt-4">
              <ProductForm productOptions={productOptions} selectedVariant={selectedVariant} quantity={quantity} hideOptions />
            </div>

            {/* Micro Actions */}
            <div className="flex items-center gap-8 pt-2">
              <button className="group flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 transition-colors hover:text-black">
                <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                Wishlist
              </button>
              <button className="group flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 transition-colors hover:text-black">
                <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                Share
              </button>
            </div>

            <TrustBadges />

            {/* Accordions */}
            <div className="border-t border-gray-200">
              <Accordion title="Details & Description" defaultOpen>
                <div className="prose prose-sm max-w-none text-sm font-light leading-relaxed text-gray-600" dangerouslySetInnerHTML={{__html: descriptionHtml}} />
              </Accordion>
              <Accordion title="Fabric & Care">
                <ul className="space-y-3 text-sm font-light text-gray-600">
                  <li className="flex items-center gap-3"><span className="h-1 w-1 rounded-full bg-black" /> Premium comfortable fabric for everyday elegance.</li>
                  <li className="flex items-center gap-3"><span className="h-1 w-1 rounded-full bg-black" /> Machine wash cold with like colors.</li>
                  <li className="flex items-center gap-3"><span className="h-1 w-1 rounded-full bg-black" /> Tumble dry low or hang to dry.</li>
                </ul>
              </Accordion>
              <Accordion title="Shipping & Returns">
                <div className="space-y-4 text-sm font-light text-gray-600">
                  <div>
                    <p className="font-semibold text-black mb-1 uppercase tracking-widest text-[10px]">Shipping</p>
                    <p>Free standard shipping on eligible orders. Express shipping available at checkout.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-black mb-1 uppercase tracking-widest text-[10px]">Returns</p>
                    <p>30-day hassle-free returns. Items must be unworn with tags attached.</p>
                  </div>
                </div>
              </Accordion>
            </div>
          </motion.div>
        </div>
      </div>

      {product?.collections?.nodes?.[0] && (
        <YouMayAlsoLike collection={product.collections.nodes[0]} currentProductId={product.id} />
      )}

      <Analytics.ProductView
        data={{
          products: [{id: product.id, title: product.title, price: selectedVariant?.price?.amount || '0', vendor: product.vendor, variantId: selectedVariant?.id || '', variantTitle: selectedVariant?.title || '', quantity}],
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   IMAGE GALLERY (Premium Smooth Transitions)
   ═══════════════════════════════════════════════════════════════ */
function ProductImageGallery({product, selectedVariant}) {
  const displayImages = (() => {
    const allImages = product.images?.nodes || [];
    const variantImage = selectedVariant?.image;
    if (!variantImage) return allImages;
    const filtered = allImages.filter((img) => img.id !== variantImage.id && img.url !== variantImage.url);
    return [variantImage, ...filtered];
  })();

  const imageCount = displayImages.length;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => { setActiveIndex(0); }, [selectedVariant?.id]);

  if (!imageCount) return <div className="flex aspect-[3/4] items-center justify-center rounded-[24px] bg-gray-100 text-sm text-gray-400">No image available</div>;

  return (
    <div className="flex flex-col-reverse gap-6 lg:flex-row h-full">
      {/* Thumbnails */}
      {imageCount > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide lg:flex-col lg:overflow-y-auto lg:pb-0">
          {displayImages.map((image, i) => (
            <button
              key={image.id || i}
              onClick={() => setActiveIndex(i)}
              className={`relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-400 lg:h-[120px] lg:w-[96px] ${
                activeIndex === i ? 'ring-1 ring-black ring-offset-2' : 'opacity-60 hover:opacity-100 hover:scale-105'
              }`}
            >
              <Image data={image} sizes="96px" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Container */}
      <div className="group relative flex-1 overflow-hidden rounded-[24px] bg-gray-100 aspect-[4/5] lg:aspect-auto lg:h-[85vh]">
        <motion.div 
          key={activeIndex}
          initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.5}}
          className="h-full w-full"
        >
          <Image
            data={displayImages[activeIndex]}
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 cursor-zoom-in"
            loading="eager"
          />
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COLOR SWATCHES (Nested Ring Luxury Style)
   ═══════════════════════════════════════════════════════════════ */
function ColorSwatches({productOptions}) {
  const colorOption = findProductOption(productOptions, ['color', 'colour', 'colors', 'colours', 'اللون']);
  if (!colorOption?.optionValues?.length) return null;
  const selectedColor = colorOption.optionValues.find((v) => v.selected)?.name || colorOption.optionValues[0]?.name;

  return (
    <div>
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
        Color <span className="mx-2 text-gray-300">|</span> <span className="text-gray-500 font-medium">{selectedColor}</span>
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {colorOption.optionValues.map((value) => {
          const {name, selected, available, exists, swatch} = value;
          const swatchImage = swatch?.image?.previewImage?.url;
          const swatchColor = resolveSwatchColor(swatch?.color, name);
          if (exists === false) return null;

          return (
            <Link key={name} to={buildOptionLink(value)} replace preventScrollReset prefetch="intent" aria-label={name} title={name}
              className={`relative flex items-center justify-center rounded-full p-[2px] border transition-all duration-300 ${
                selected ? 'border-black scale-110' : 'border-transparent hover:border-gray-300 hover:scale-110'
              } ${available === false ? 'opacity-40' : ''}`}
            >
              <span className={`block h-8 w-8 rounded-full ${isLightColor(swatchColor) ? 'border border-black/10' : ''}`} style={{background: swatchImage ? `url(${swatchImage}) center/cover` : swatchColor}} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIZE SELECTOR (Pill Shaped & Magnetic)
   ═══════════════════════════════════════════════════════════════ */
function SizeSelector({productOptions}) {
  const sizeOption = findProductOption(productOptions, ['size', 'sizes', 'المقاس', 'مقاس']);
  if (!sizeOption?.optionValues?.length) return null;
  const selectedSize = sizeOption.optionValues.find((v) => v.selected)?.name || '';

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">
          Size <span className="mx-2 text-gray-300">|</span> <span className="text-gray-500 font-medium">{selectedSize}</span>
        </p>
        <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 underline underline-offset-4 transition-colors hover:text-black">
          Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {sizeOption.optionValues.map((value) => {
          const {name, selected, available, exists} = value;
          if (exists === false) return null;

          return (
            <Link key={name} to={buildOptionLink(value)} replace preventScrollReset prefetch="intent"
              className={`relative flex h-12 min-w-[3rem] px-5 items-center justify-center rounded-full text-[11px] font-bold tracking-[0.1em] transition-all duration-300 ${
                selected ? 'bg-black text-white shadow-md scale-105' 
                : available !== false ? 'border border-gray-200 bg-white text-black hover:border-black hover:bg-gray-50'
                : 'border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              {name}
              {available === false && <span className="absolute left-1/2 top-1/2 h-px w-[60%] -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] bg-gray-400" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   QUANTITY SELECTOR
   ═══════════════════════════════════════════════════════════════ */
function QuantitySelector({quantity, setQuantity}) {
  return (
    <div>
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-black">Quantity</p>
      <div className="inline-flex h-12 items-center rounded-full border border-gray-200 bg-white px-2">
        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-black">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M5 12h14" /></svg>
        </button>
        <span className="flex w-10 items-center justify-center text-[13px] font-semibold text-black">{quantity}</span>
        <button type="button" onClick={() => setQuantity(Math.min(99, quantity + 1))} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-black">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ACCORDION (Framer Motion Animated)
   ═══════════════════════════════════════════════════════════════ */
function Accordion({title, children, defaultOpen = false}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button type="button" onClick={() => setOpen(!open)} className="group flex w-full items-center justify-between py-6 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-black">
        {title}
        <motion.svg animate={{rotate: open ? 180 : 0}} className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{height: 0, opacity: 0}} animate={{height: 'auto', opacity: 1}} exit={{height: 0, opacity: 0}} transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}} className="overflow-hidden">
            <div className="pb-8">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRUST BADGES
   ═══════════════════════════════════════════════════════════════ */
function TrustBadges() {
  const badges = [
    {label: 'Free Shipping', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h7.5m-10.5 0H3.375A1.125 1.125 0 012.25 17.625V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V15.75c0-.621-.504-1.125-1.125-1.125H18.75M3 14.25h15.75m0 0V6.75A2.25 2.25 0 0016.5 4.5H5.25A2.25 2.25 0 003 6.75v7.5z" />},
    {label: 'Easy Returns', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />},
    {label: 'Secure Checkout', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />},
  ];
  return (
    <div className="flex justify-between border-y border-gray-200 py-6">
      {badges.map((badge, i) => (
        <div key={i} className="flex flex-col items-center gap-3">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>{badge.icon}</svg>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black">{badge.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   YOU MAY ALSO LIKE (Staggered Grid)
   ═══════════════════════════════════════════════════════════════ */
function YouMayAlsoLike({collection, currentProductId}) {
  const products = collection?.products?.nodes?.filter((p) => p.id !== currentProductId).slice(0, 4) || [];
  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-[1600px] border-t border-gray-200 px-6 py-24 sm:px-12">
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-light text-black sm:text-5xl font-serif">You May Also Like</h2>
      </div>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-10">
        {products.map((p, index) => {
          const firstVariant = p.variants?.nodes?.[0];
          const image = p.images?.nodes?.[0];

          return (
            <motion.div key={p.id} initial={{opacity: 0, y: 30}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.6, delay: index * 0.1}}>
              <Link to={`/products/${p.handle}`} className="group block">
                <div className="mb-4 aspect-[3/4] overflow-hidden rounded-[20px] bg-gray-100">
                  {image && <Image data={image} sizes="(min-width: 1024px) 25vw, 50vw" className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />}
                </div>
                <h3 className="text-base font-medium text-black group-hover:underline underline-offset-4 decoration-gray-400 font-serif">{p.title}</h3>
                {firstVariant?.price && <p className="mt-1 text-sm font-semibold text-gray-500 font-sans"><Money data={firstVariant.price} /></p>}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS & GRAPHQL (Kept exactly intact)
   ═══════════════════════════════════════════════════════════════ */
function findProductOption(productOptions, names) { return productOptions?.find((opt) => names.includes(opt.name.toLowerCase().trim())); }
function buildOptionLink(value) { const query = value.variantUriQuery ? `?${value.variantUriQuery}` : ''; return value.isDifferentProduct && value.handle ? `/products/${value.handle}${query}` : query || '.'; }
function isLightColor(color = '') {
  if (!color.startsWith('#')) return false;
  let hex = color.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map((char) => char + char).join('');
  const r = parseInt(hex.substring(0, 2), 16), g = parseInt(hex.substring(2, 4), 16), b = parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale compareAtPrice { amount currencyCode } id
    image { __typename id url altText width height }
    price { amount currencyCode } product { title handle }
    selectedOptions { name value } sku title unitPrice { amount currencyCode }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id title vendor handle descriptionHtml description encodedVariantExistence encodedVariantAvailability
    images(first: 10) { nodes { id url altText width height } }
    options { name optionValues { name firstSelectableVariant { ...ProductVariant } swatch { color image { previewImage { url } } } } }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions ignoreUnknownOptions: true caseInsensitiveMatch: true) { ...ProductVariant }
    adjacentVariants(selectedOptions: $selectedOptions) { ...ProductVariant }
    seo { description title }
    collections(first: 1) { nodes { handle title products(first: 8) { nodes { id title handle images(first: 1) { nodes { id url altText width height } } variants(first: 1) { nodes { price { amount currencyCode } } } } } } }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product($country: CountryCode, $handle: String!, $language: LanguageCode, $selectedOptions: [SelectedOptionInput!]!) @inContext(country: $country, language: $language) {
    product(handle: $handle) { ...Product }
  }
  ${PRODUCT_FRAGMENT}
`;