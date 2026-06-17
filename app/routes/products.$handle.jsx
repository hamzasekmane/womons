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

/**
 * Color helpers
 */
const COLOR_MAP = {
  // Whites / Neutrals
  white: '#FFFFFF',
  'off-white': '#FAF9F6',
  'off white': '#FAF9F6',
  ivory: '#FFFFF0',
  cream: '#FFFDD0',
  beige: '#F5F5DC',
  nude: '#E3BC9A',
  neutral: '#D8CAB8',
  sand: '#C2B280',
  stone: '#D6D0C4',
  taupe: '#8B8589',
  ecru: '#C2B280',
  bone: '#E3DAC9',
  linen: '#FAF0E6',
  snow: '#FFFAFA',
  seashell: '#FFF5EE',
  alabaster: '#F2F0E6',
  pearl: '#EAE0C8',
  oat: '#DFD3C3',
  oatmilk: '#F1E3C6',
  almond: '#EFDECD',
  biscuit: '#E3C9A6',
  champagne: '#F7E7CE',
  clear: '#E8F4F8',
  transparent: '#E8F4F8',
  crystal: '#E0F7FA',

  // Black / Grey
  black: '#1B2A3D',
  jet: '#343434',
  ebony: '#555D50',
  grey: '#808080',
  gray: '#808080',
  'light grey': '#D3D3D3',
  'light gray': '#D3D3D3',
  'dark grey': '#4A4A4A',
  'dark gray': '#4A4A4A',
  charcoal: '#36454F',
  slate: '#708090',
  ash: '#B2BEB5',
  smoke: '#738276',
  silver: '#C0C0C0',
  platinum: '#E5E4E2',
  pewter: '#96A8A1',
  gunmetal: '#2A3439',

  // Blues
  blue: '#4A90D9',
  'light blue': '#ADD8E6',
  'dark blue': '#00008B',
  'sky blue': '#87CEEB',
  'baby blue': '#89CFF0',
  'powder blue': '#B0E0E6',
  'ice blue': '#D6F1F8',
  'royal blue': '#4169E1',
  'cobalt blue': '#0047AB',
  cobalt: '#0047AB',
  navy: '#3B4D6B',
  'navy blue': '#000080',
  denim: '#1560BD',
  'denim blue': '#1560BD',
  indigo: '#4B0082',
  periwinkle: '#CCCCFF',
  teal: '#008080',
  turquoise: '#40E0D0',
  aqua: '#00FFFF',
  aquamarine: '#7FFFD4',
  cyan: '#00FFFF',
  'midnight blue': '#191970',
  'steel blue': '#4682B4',
  'cornflower blue': '#6495ED',
  sapphire: '#0F52BA',
  'peacock blue': '#005F73',

  // Reds
  red: '#C0392B',
  'light red': '#F28B82',
  'dark red': '#8B0000',
  crimson: '#DC143C',
  scarlet: '#FF2400',
  ruby: '#E0115F',
  cherry: '#DE3163',
  'cherry red': '#DE3163',
  brick: '#B22222',
  'brick red': '#B22222',
  maroon: '#800000',
  burgundy: '#800020',
  wine: '#722F37',
  'wine red': '#7F1D1D',
  oxblood: '#4A0000',
  rust: '#B7410E',
  terracotta: '#E2725B',
  merlot: '#73343A',
  'rose red': '#B91C1C',

  // Pinks
  pink: '#E8C8D0',
  'light pink': '#FFB6C1',
  'baby pink': '#F4C2C2',
  'hot pink': '#FF69B4',
  'dark pink': '#B23A67',
  rose: '#E8C8D0',
  'dusty rose': '#C9A9A6',
  blush: '#DE5D83',
  fuchsia: '#FF00FF',
  magenta: '#FF00FF',
  salmon: '#FA8072',
  coral: '#FF7F50',
  peach: '#FFE5B4',
  'rose gold': '#B76E79',

  // Oranges
  orange: '#E65100',
  'light orange': '#FFD8B1',
  'dark orange': '#FF8C00',
  'burnt orange': '#CC5500',
  tangerine: '#F28500',
  apricot: '#FBCEB1',
  pumpkin: '#FF7518',
  persimmon: '#EC5800',
  'fluorescent orange': '#FF5F1F',
  'neon orange': '#FF6700',

  // Yellows / Golds
  yellow: '#FDD835',
  'light yellow': '#FFFFE0',
  mustard: '#FFDB58',
  'mustard yellow': '#FFDB58',
  lemon: '#FFF44F',
  butter: '#FFF1A8',
  honey: '#FFC30B',
  gold: '#FFD700',
  golden: '#FFD700',
  amber: '#FFBF00',
  'fluorescent yellow': '#CCFF00',
  'neon yellow': '#DFFF00',

  // Greens
  green: '#558B2F',
  'light green': '#90EE90',
  'dark green': '#006400',
  lime: '#00FF00',
  'lime green': '#32CD32',
  mint: '#98FF98',
  'mint green': '#98FF98',
  sage: '#BCB88A',
  'sage green': '#BCB88A',
  olive: '#808000',
  'olive green': '#808000',
  emerald: '#50C878',
  'emerald green': '#50C878',
  'forest green': '#228B22',
  'hunter green': '#355E3B',
  'army green': '#4B5320',
  moss: '#8A9A5B',
  'moss green': '#8A9A5B',
  seafoam: '#9FE2BF',
  'seafoam green': '#9FE2BF',
  jade: '#00A86B',
  pistachio: '#93C572',
  khaki: '#C3B091',
  'khaki green': '#8A865D',
  'fluorescent green': '#7CFC00',
  'neon green': '#39FF14',
  'highlighter green': '#7FFF00',
  'bright green': '#00FF66',
  'lime punch': '#B7FF00',

  // Purples
  purple: '#6D28D9',
  'light purple': '#D8B4F8',
  'dark purple': '#5D3A7D',
  'pastel purple': '#CBAACB',
  'soft purple': '#D9C2F0',
  lavender: '#E6E6FA',
  lilac: '#C8A2C8',
  violet: '#8F00FF',
  'light violet': '#CF9FFF',
  mauve: '#E0B0FF',
  plum: '#673147',
  orchid: '#DA70D6',
  eggplant: '#614051',
  amethyst: '#9966CC',

  // Browns
  brown: '#7C2D12',
  'light brown': '#A0522D',
  'dark brown': '#5C4033',
  chocolate: '#7B3F00',
  coffee: '#6F4E37',
  espresso: '#4B3621',
  mocha: '#967969',
  tan: '#C5B9A8',
  camel: '#C19A6B',
  caramel: '#AF6E4D',
  cognac: '#9A463D',
  chestnut: '#954535',
  walnut: '#773F1A',
  mahogany: '#C04000',

  // Metallics
  metallic: '#B0B0B0',
  'metallic silver': '#C0C0C0',
  'metallic gold': '#D4AF37',
  bronze: '#CD7F32',
  copper: '#B87333',
  rosegold: '#B76E79',

  // Neon / fluorescent pinks
  'fluorescent pink': '#FF1493',
  'neon pink': '#FF10F0',

  // Multi / patterns
  multi: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFD93D)',
  multicolor: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFD93D)',
  'multi color': 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFD93D)',
  rainbow:
    'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)',
  print:
    'linear-gradient(45deg, #222 25%, #fff 25%, #fff 50%, #222 50%, #222 75%, #fff 75%)',
  floral: 'linear-gradient(45deg, #FFB6C1, #90EE90, #FFD700)',
  'animal print': 'linear-gradient(45deg, #C19A6B, #8B4513, #1B2A3D)',
  leopard: 'linear-gradient(45deg, #C19A6B, #8B4513, #000000)',
  zebra: 'linear-gradient(45deg, #FFFFFF, #000000)',
  striped:
    'linear-gradient(45deg, #FFFFFF 25%, #1B2A3D 25%, #1B2A3D 50%, #FFFFFF 50%, #FFFFFF 75%, #1B2A3D 75%)',
  plaid: 'linear-gradient(45deg, #8B0000, #1B2A3D, #FFFFFF)',
};

function normalizeColorName(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\+/g, ' ')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');
}

function colorToHex(colorValue) {
  if (!colorValue) return '#E0DDD5';

  const raw = String(colorValue).trim();

  if (raw.startsWith('#')) return raw;
  if (raw.startsWith('rgb')) return raw;
  if (raw.startsWith('hsl')) return raw;
  if (raw.startsWith('linear-gradient')) return raw;

  const normalized = normalizeColorName(raw);

  if (COLOR_MAP[normalized]) return COLOR_MAP[normalized];

  const splitColors = normalized.split(/\/|,|&|\band\b/).map((c) => c.trim());
  const matched = splitColors.find((c) => COLOR_MAP[c]);
  if (matched) return COLOR_MAP[matched];

  const tokens = normalized.split(' ');
  const tokenMatch = tokens.find((token) => COLOR_MAP[token]);
  if (tokenMatch) return COLOR_MAP[tokenMatch];

  const partialMatch = Object.keys(COLOR_MAP).find(
    (key) => normalized.includes(key) || key.includes(normalized),
  );
  if (partialMatch) return COLOR_MAP[partialMatch];

  return '#E0DDD5';
}

function isValidCssColor(value) {
  if (!value) return false;

  const str = String(value).trim();

  return (
    str.startsWith('#') ||
    str.startsWith('rgb') ||
    str.startsWith('hsl') ||
    str.startsWith('linear-gradient') ||
    /^[a-zA-Z]+$/.test(str)
  );
}

function resolveSwatchColor(swatchColor, fallbackName) {
  if (swatchColor) {
    const normalizedSwatch = normalizeColorName(swatchColor);

    if (COLOR_MAP[normalizedSwatch]) {
      return COLOR_MAP[normalizedSwatch];
    }

    if (isValidCssColor(swatchColor)) {
      return swatchColor;
    }
  }

  return colorToHex(fallbackName);
}

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [
    {title: `VALORAERPY | ${data?.product?.title ?? ''}`},
    {rel: 'canonical', href: `/products/${data?.product?.handle ?? ''}`},
    {
      name: 'description',
      content:
        data?.product?.seo?.description ||
        data?.product?.description?.slice(0, 155) ||
        '',
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData();
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions: getSelectedProductOptions(request),
      },
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

function loadDeferredData() {
  return {};
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT PAGE
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

  const shortDescription =
    description && description.length > 160
      ? `${description.slice(0, 160)}...`
      : description;

  const priceAmount = Number(selectedVariant?.price?.amount || 0);
  const compareAmount = Number(selectedVariant?.compareAtPrice?.amount || 0);
  const isOnSale = compareAmount > priceAmount;

  return (
    <>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <nav
          className="py-4 text-[11px] uppercase tracking-wider"
          style={{color: 'rgba(27,42,61,0.35)'}}
        >
          <Link to="/" className="transition-colors hover:text-[#1B2A3D]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            to="/collections"
            className="transition-colors hover:text-[#1B2A3D]"
          >
            Collections
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#1B2A3D]/60">{title}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          {/* Left Gallery */}
          <ProductImageGallery
            product={product}
            selectedVariant={selectedVariant}
          />

          {/* Right Info */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start lg:space-y-7">
            {/* Badges */}
            <div className="flex items-center gap-3">
              <span className="inline-block bg-[#1B2A3D] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
                New Arrival
              </span>

              {isOnSale && (
                <span className="inline-block bg-[#C4956A] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
                  Sale
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-3xl font-light leading-tight tracking-tight lg:text-[2.5rem]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: '#1B2A3D',
              }}
            >
              {title}
            </h1>

            {/* Rating + Price */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill={
                        i < Math.floor(reviewRating) ? '#C4956A' : '#E5DDD5'
                      }
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <span
                  className="text-[11px] tracking-wide"
                  style={{color: 'rgba(27,42,61,0.4)'}}
                >
                  {reviewRating} ({reviewCount} reviews)
                </span>
              </div>

              <div className="text-xl lg:text-2xl">
                <ProductPrice
                  price={selectedVariant?.price}
                  compareAtPrice={selectedVariant?.compareAtPrice}
                />
              </div>
            </div>

            {/* Description */}
            {shortDescription && (
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: 'rgba(27,42,61,0.55)',
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                {shortDescription}
              </p>
            )}

            <div className="h-px w-full bg-[#1B2A3D]/10" />

            {/* Custom Options */}
            <ColorSwatches productOptions={productOptions} />
            <SizeSelector productOptions={productOptions} />

            {/* Quantity + Add To Cart */}
            <div className="space-y-3">
              <QuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
              />

              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
                quantity={quantity}
                hideOptions
              />
            </div>

            {/* Wishlist + Share */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                className="flex items-center gap-2 text-xs tracking-wide transition-colors hover:text-[#C4956A]"
                style={{color: 'rgba(27,42,61,0.4)'}}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                Add to Wishlist
              </button>

              <button
                type="button"
                className="flex items-center gap-2 text-xs tracking-wide transition-colors hover:text-[#C4956A]"
                style={{color: 'rgba(27,42,61,0.4)'}}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  />
                </svg>
                Share
              </button>
            </div>

            {/* Installments */}
            {priceAmount > 0 && (
              <div className="rounded-sm bg-[#F9F7F4] px-4 py-3">
                <p
                  className="text-center text-xs"
                  style={{color: 'rgba(27,42,61,0.5)'}}
                >
                  or 4 interest-free installments of{' '}
                  <span className="font-semibold text-[#1B2A3D]">
                    ${(priceAmount / 4).toFixed(2)}
                  </span>{' '}
                  with <span className="font-semibold underline">Shop Pay</span>
                </p>
              </div>
            )}

            <TrustBadges />

            {/* Accordions */}
            <div className="border-t border-[#1B2A3D]/10 pt-1">
              <Accordion title="Description" defaultOpen>
                <div
                  className="prose prose-sm max-w-none text-sm leading-[1.8]"
                  style={{
                    color: 'rgba(27,42,61,0.6)',
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                  dangerouslySetInnerHTML={{__html: descriptionHtml}}
                />
              </Accordion>

              <Accordion title="Fabric & Care">
                <ul
                  className="space-y-2 text-sm"
                  style={{
                    color: 'rgba(27,42,61,0.6)',
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[#C4956A]" />
                    Premium comfortable fabric for everyday elegance.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[#C4956A]" />
                    Machine wash cold with like colors.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[#C4956A]" />
                    Tumble dry low or hang to dry.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[#C4956A]" />
                    Do not bleach. Iron low if needed.
                  </li>
                </ul>
              </Accordion>

              <Accordion title="Shipping & Returns">
                <div
                  className="space-y-3 text-sm"
                  style={{
                    color: 'rgba(27,42,61,0.6)',
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  <div>
                    <p className="mb-1 font-medium text-[#1B2A3D]">
                      Shipping
                    </p>
                    <p>
                      Free standard shipping on eligible orders. Express
                      shipping available at checkout.
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-[#1B2A3D]">Returns</p>
                    <p>
                      30-day hassle-free returns. Items must be unworn with tags
                      attached.
                    </p>
                  </div>
                </div>
              </Accordion>

              <Accordion title="Size & Fit">
                <div
                  className="space-y-3 text-sm"
                  style={{
                    color: 'rgba(27,42,61,0.6)',
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  <p>• Relaxed fit — true to size.</p>
                  <p>• Lightweight and breathable.</p>
                  <p>• For a more fitted look, consider sizing down.</p>
                </div>
              </Accordion>
            </div>

            {/* Urgency */}
            <div className="flex items-center gap-3 rounded-sm border border-[#C4956A]/20 bg-[#FDF8F3] px-4 py-3">
              <svg
                className="h-5 w-5 flex-shrink-0 text-[#C4956A]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <p
                className="text-xs leading-relaxed"
                style={{color: 'rgba(27,42,61,0.6)'}}
              >
                <span className="font-semibold text-[#1B2A3D]">
                  Selling fast!
                </span>{' '}
                Complete your purchase now to ensure availability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {product?.collections?.nodes?.[0] && (
        <YouMayAlsoLike
          collection={product.collections.nodes[0]}
          currentProductId={product.id}
        />
      )}

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price?.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity,
            },
          ],
        }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   IMAGE GALLERY
   ═══════════════════════════════════════════════════════════════ */
function ProductImageGallery({product, selectedVariant}) {
  const displayImages = (() => {
    const allImages = product.images?.nodes || [];
    const variantImage = selectedVariant?.image;

    if (!variantImage) return allImages;

    const filtered = allImages.filter((img) => {
      if (variantImage.id && img.id === variantImage.id) return false;
      if (variantImage.url && img.url === variantImage.url) return false;
      return true;
    });

    return [variantImage, ...filtered];
  })();

  const imageCount = displayImages.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({x: 50, y: 50});
  const [isMobile, setIsMobile] = useState(false);

  const mainRef = useRef(null);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  const goNext = useCallback(() => {
    if (imageCount <= 1) return;
    setActiveIndex((prev) => (prev + 1) % imageCount);
  }, [imageCount]);

  const goPrev = useCallback(() => {
    if (imageCount <= 1) return;
    setActiveIndex((prev) => (prev - 1 + imageCount) % imageCount);
  }, [imageCount]);

  const goNextLightbox = useCallback(() => {
    if (imageCount <= 1) return;
    setLightboxIndex((prev) => (prev + 1) % imageCount);
  }, [imageCount]);

  const goPrevLightbox = useCallback(() => {
    if (imageCount <= 1) return;
    setLightboxIndex((prev) => (prev - 1 + imageCount) % imageCount);
  }, [imageCount]);

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedVariant?.id]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();

    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goPrevLightbox();
      if (e.key === 'ArrowRight') goNextLightbox();
      if (e.key === 'Escape') setLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, goPrevLightbox, goNextLightbox]);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
    touchEndRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartRef.current - touchEndRef.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }

    touchStartRef.current = 0;
    touchEndRef.current = 0;
  };

  const handleMouseMove = (e) => {
    if (!isZoomed || !mainRef.current) return;

    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPos({x, y});
  };

  if (!imageCount) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded-sm bg-[#F5F1ED] text-sm text-[#1B2A3D]/20">
        No image available
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col-reverse gap-3 lg:flex-row">
        {/* Thumbnails */}
        {imageCount > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 lg:max-h-[700px] lg:flex-col lg:overflow-y-auto lg:pb-0 lg:pr-1">
            {displayImages.map((image, i) => (
              <button
                key={image.id || image.url || i}
                type="button"
                onClick={() => {
                  setActiveIndex(i);
                  setIsZoomed(false);
                }}
                className={`h-20 w-16 flex-shrink-0 overflow-hidden transition-all duration-300 lg:h-[90px] lg:w-[72px] ${
                  activeIndex === i
                    ? 'border-2 border-[#1B2A3D] opacity-100'
                    : 'border border-[#1B2A3D]/10 opacity-60 hover:border-[#1B2A3D]/30 hover:opacity-90'
                }`}
              >
                <Image
                  data={image}
                  alt={image.altText || `${product.title} ${i + 1}`}
                  sizes="72px"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Image */}
        <div className="group relative flex-1">
          <div
            ref={mainRef}
            className={`relative overflow-hidden bg-[#F5F1ED] ${
              isMobile
                ? ''
                : isZoomed
                  ? 'cursor-zoom-out'
                  : 'cursor-zoom-in'
            }`}
            style={{aspectRatio: '3 / 4'}}
            onClick={() => {
              if (isMobile) return;
              setIsZoomed((prev) => !prev);
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="h-full w-full transition-transform duration-500 ease-out"
              style={{
                transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              }}
            >
              <Image
                data={displayImages[activeIndex]}
                alt={displayImages[activeIndex]?.altText || product.title}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="h-full w-full object-cover"
                loading={activeIndex === 0 ? 'eager' : 'lazy'}
              />
            </div>

            {/* Arrows */}
            {imageCount > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                    setIsZoomed(false);
                  }}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <svg
                    className="h-4 w-4 text-[#1B2A3D]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                    setIsZoomed(false);
                  }}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <svg
                    className="h-4 w-4 text-[#1B2A3D]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Expand */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(activeIndex);
                setLightboxOpen(true);
                setIsZoomed(false);
              }}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-white group-hover:opacity-100"
              aria-label="Expand image"
            >
              <svg
                className="h-4 w-4 text-[#1B2A3D]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
            </button>

            {/* Mobile Counter */}
            {imageCount > 1 && (
              <div className="absolute bottom-4 left-1/2 rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-medium tracking-wider text-white backdrop-blur-sm lg:hidden">
                {activeIndex + 1} / {imageCount}
              </div>
            )}
          </div>

          {/* Mobile Dots */}
          {imageCount > 1 && (
            <div className="mt-3 flex items-center justify-center gap-1.5 lg:hidden">
              {displayImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
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

      {lightboxOpen && (
        <LightboxModal
          images={displayImages}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNext={goNextLightbox}
          onPrev={goPrevLightbox}
          onSelect={setLightboxIndex}
          productTitle={product.title}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════════════════════════ */
function LightboxModal({
  images,
  activeIndex,
  onClose,
  onNext,
  onPrev,
  onSelect,
  productTitle,
}) {
  const touchStartRef = useRef(0);

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartRef.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) onNext();
      else onPrev();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Close lightbox"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="absolute left-1/2 top-6 -translate-x-1/2 text-sm font-light tracking-wider text-white/60">
        {activeIndex + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white md:left-8"
          aria-label="Previous"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      )}

      <div
        className="max-h-[85vh] w-full max-w-4xl px-16 md:px-20"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex h-full w-full items-center justify-center">
          <Image
            data={images[activeIndex]}
            alt={images[activeIndex]?.altText || productTitle}
            sizes="80vw"
            className="max-h-[85vh] max-w-full object-contain"
          />
        </div>
      </div>

      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white md:right-8"
          aria-label="Next"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((img, i) => (
            <button
              key={img.id || img.url || i}
              type="button"
              className={`h-14 w-12 overflow-hidden rounded-sm transition-all ${
                i === activeIndex
                  ? 'opacity-100 ring-2 ring-white'
                  : 'opacity-40 hover:opacity-70'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(i);
              }}
            >
              <Image
                data={img}
                alt=""
                sizes="48px"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COLOR SWATCHES
   ═══════════════════════════════════════════════════════════════ */
function ColorSwatches({productOptions}) {
  const colorOption = findProductOption(productOptions, [
    'color',
    'colour',
    'colors',
    'colours',
    'اللون',
  ]);

  if (!colorOption?.optionValues?.length) return null;

  const selectedColor =
    colorOption.optionValues.find((value) => value.selected)?.name ||
    colorOption.optionValues[0]?.name;

  return (
    <div>
      <p
        className="mb-3.5 text-xs"
        style={{
          color: '#1B2A3D',
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        <span className="font-semibold tracking-wide">Color</span>
        <span className="mx-2 text-[#1B2A3D]/20">—</span>
        <span
          style={{color: 'rgba(27,42,61,0.45)'}}
          className="font-light"
        >
          {selectedColor}
        </span>
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {colorOption.optionValues.map((value) => {
          const {name, selected, available, exists, swatch} = value;

          const swatchImage = swatch?.image?.previewImage?.url;
          const swatchColor = resolveSwatchColor(swatch?.color, name);

          const canSelect = exists !== false;
          const isAvailable = available !== false;
          const to = buildOptionLink(value);

          const content = (
            <>
              <span
                className={`block h-9 w-9 overflow-hidden rounded-full border transition-all duration-300 ${
                  selected
                    ? 'ring-2 ring-[#1B2A3D] ring-offset-2'
                    : 'ring-1 ring-[#1B2A3D]/10 group-hover:ring-2 group-hover:ring-[#1B2A3D]/20 group-hover:ring-offset-1'
                }`}
                style={{
                  background: swatchImage ? 'transparent' : swatchColor,
                  borderColor: isLightColor(swatchColor)
                    ? 'rgba(27,42,61,0.22)'
                    : 'transparent',
                }}
              >
                {swatchImage ? (
                  <img
                    src={swatchImage}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </span>

              {selected && (
                <svg
                  className="pointer-events-none absolute h-3.5 w-3.5 drop-shadow"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke={
                    swatchImage
                      ? '#ffffff'
                      : isLightColor(swatchColor)
                        ? '#1B2A3D'
                        : '#ffffff'
                  }
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              )}
            </>
          );

          if (!canSelect) {
            return (
              <span
                key={name}
                aria-disabled="true"
                title={name}
                className="relative flex h-10 w-10 items-center justify-center opacity-30"
              >
                {content}
              </span>
            );
          }

          return (
            <Link
              key={name}
              to={to}
              replace
              preventScrollReset
              prefetch="intent"
              aria-label={name}
              title={name}
              className={`group relative flex h-10 w-10 items-center justify-center transition-all duration-300 ${
                selected ? 'scale-105' : 'hover:scale-105'
              } ${!isAvailable ? 'opacity-45' : ''}`}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIZE SELECTOR
   ═══════════════════════════════════════════════════════════════ */
function SizeSelector({productOptions}) {
  const sizeOption = findProductOption(productOptions, [
    'size',
    'sizes',
    'المقاس',
    'مقاس',
  ]);

  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!sizeOption?.optionValues?.length) return null;

  const selectedSize =
    sizeOption.optionValues.find((value) => value.selected)?.name || '';

  return (
    <>
      <div>
        <div className="mb-3.5 flex items-center justify-between">
          <p
            className="text-xs"
            style={{
              color: '#1B2A3D',
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            <span className="font-semibold tracking-wide">Size</span>
            <span className="mx-2 text-[#1B2A3D]/20">—</span>
            <span
              style={{color: 'rgba(27,42,61,0.45)'}}
              className="font-light"
            >
              {selectedSize}
            </span>
          </p>

          <button
            type="button"
            onClick={() => setShowSizeGuide(true)}
            className="text-[11px] tracking-wide underline underline-offset-4 transition-colors hover:text-[#C4956A]"
            style={{color: 'rgba(27,42,61,0.4)'}}
          >
            Size Guide
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {sizeOption.optionValues.map((value) => {
            const {name, selected, available, exists} = value;

            const canSelect = exists !== false;
            const isAvailable = available !== false;
            const to = buildOptionLink(value);

            const className = `relative min-w-[56px] px-4 py-3 text-center text-xs font-medium tracking-wider transition-all duration-300 ${
              selected
                ? 'bg-[#1B2A3D] text-white shadow-lg shadow-[#1B2A3D]/20'
                : isAvailable
                  ? 'border border-[#1B2A3D]/10 bg-white text-[#1B2A3D] hover:border-[#1B2A3D]/50 hover:shadow-sm'
                  : 'border border-[#1B2A3D]/10 bg-[#F9F7F4] text-[#1B2A3D]/25'
            }`;

            const content = (
              <>
                {name}
                {!isAvailable && (
                  <span className="absolute left-1/2 top-1/2 h-px w-[80%] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] bg-[#1B2A3D]/20" />
                )}
              </>
            );

            if (!canSelect) {
              return (
                <span
                  key={name}
                  aria-disabled="true"
                  className={`${className} cursor-not-allowed opacity-30`}
                  style={{fontFamily: "'Montserrat', sans-serif"}}
                >
                  {content}
                </span>
              );
            }

            return (
              <Link
                key={name}
                to={to}
                replace
                preventScrollReset
                prefetch="intent"
                className={className}
                style={{fontFamily: "'Montserrat', sans-serif"}}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      {showSizeGuide && (
        <SizeGuideModal onClose={() => setShowSizeGuide(false)} />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
function findProductOption(productOptions, names) {
  return productOptions?.find((option) =>
    names.includes(option.name.toLowerCase().trim()),
  );
}

function buildOptionLink(value) {
  const query = value.variantUriQuery ? `?${value.variantUriQuery}` : '';

  if (value.isDifferentProduct && value.handle) {
    return `/products/${value.handle}${query}`;
  }

  return query || '.';
}

function isLightColor(color = '') {
  if (!color.startsWith('#')) return false;

  let hex = color.replace('#', '');

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 155;
}

/* ═══════════════════════════════════════════════════════════════
   SIZE GUIDE MODAL
   ═══════════════════════════════════════════════════════════════ */
function SizeGuideModal({onClose}) {
  const sizes = [
    {size: 'XS', bust: '31-32"', waist: '24-25"', hip: '34-35"'},
    {size: 'S', bust: '33-34"', waist: '26-27"', hip: '36-37"'},
    {size: 'M', bust: '35-36"', waist: '28-29"', hip: '38-39"'},
    {size: 'L', bust: '37-39"', waist: '30-32"', hip: '40-42"'},
    {size: 'XL', bust: '40-42"', waist: '33-35"', hip: '43-45"'},
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-sm bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#1B2A3D]/40 transition-colors hover:text-[#1B2A3D]"
          aria-label="Close size guide"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h3
          className="mb-6 text-2xl font-light"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: '#1B2A3D',
          }}
        >
          Size Guide
        </h3>

        <table
          className="w-full text-sm"
          style={{fontFamily: "'Montserrat', sans-serif"}}
        >
          <thead>
            <tr className="border-b border-[#1B2A3D]/10">
              <th className="py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#1B2A3D]/50">
                Size
              </th>
              <th className="py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#1B2A3D]/50">
                Bust
              </th>
              <th className="py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#1B2A3D]/50">
                Waist
              </th>
              <th className="py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#1B2A3D]/50">
                Hip
              </th>
            </tr>
          </thead>

          <tbody>
            {sizes.map((row) => (
              <tr
                key={row.size}
                className="border-b border-[#1B2A3D]/10 transition-colors hover:bg-[#F9F7F4]"
              >
                <td className="py-3 font-medium text-[#1B2A3D]">
                  {row.size}
                </td>
                <td className="py-3 text-[#1B2A3D]/60">{row.bust}</td>
                <td className="py-3 text-[#1B2A3D]/60">{row.waist}</td>
                <td className="py-3 text-[#1B2A3D]/60">{row.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p
          className="mt-6 text-xs leading-relaxed text-[#1B2A3D]/40"
          style={{fontFamily: "'Montserrat', sans-serif"}}
        >
          Measurements are in inches. If you are between sizes, we recommend
          sizing up for a relaxed fit.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   QUANTITY
   ═══════════════════════════════════════════════════════════════ */
function QuantitySelector({quantity, setQuantity}) {
  return (
    <div>
      <p
        className="mb-3.5 text-xs font-semibold tracking-wide"
        style={{
          color: '#1B2A3D',
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        Quantity
      </p>

      <div className="inline-flex items-center border border-[#1B2A3D]/10">
        <button
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="flex h-11 w-11 items-center justify-center text-[#1B2A3D]/40 transition-all hover:bg-[#F9F7F4] hover:text-[#1B2A3D]"
          aria-label="Decrease quantity"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" d="M5 12h14" />
          </svg>
        </button>

        <span
          className="flex h-11 w-12 items-center justify-center border-x border-[#1B2A3D]/10 text-sm font-medium"
          style={{
            color: '#1B2A3D',
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => setQuantity(Math.min(99, quantity + 1))}
          className="flex h-11 w-11 items-center justify-center text-[#1B2A3D]/40 transition-all hover:bg-[#F9F7F4] hover:text-[#1B2A3D]"
          aria-label="Increase quantity"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRUST BADGES
   ═══════════════════════════════════════════════════════════════ */
function TrustBadges() {
  const badges = [
    {
      label: 'Free Shipping',
      sublabel: 'On eligible orders',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h7.5m-10.5 0H3.375A1.125 1.125 0 012.25 17.625V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V15.75c0-.621-.504-1.125-1.125-1.125H18.75M3 14.25h15.75m0 0V6.75A2.25 2.25 0 0016.5 4.5H5.25A2.25 2.25 0 003 6.75v7.5z"
          />
        </svg>
      ),
    },
    {
      label: 'Easy Returns',
      sublabel: '30-day policy',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
          />
        </svg>
      ),
    },
    {
      label: 'Secure Checkout',
      sublabel: 'SSL encrypted',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 border-y border-[#1B2A3D]/10 py-5">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="flex flex-col items-center gap-2 text-center"
        >
          <div className="text-[#C4956A]">{badge.icon}</div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1B2A3D]">
              {badge.label}
            </p>
            <p className="mt-0.5 text-[9px] tracking-wide text-[#1B2A3D]/40">
              {badge.sublabel}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ACCORDION
   ═══════════════════════════════════════════════════════════════ */
function Accordion({title, children, defaultOpen = false}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#1B2A3D]/10">
      <button
        type="button"
        className="group flex w-full items-center justify-between py-5 text-left text-sm font-medium tracking-wide"
        style={{
          color: '#1B2A3D',
          fontFamily: "'Montserrat', sans-serif",
        }}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="transition-colors duration-300 group-hover:text-[#C4956A]">
          {title}
        </span>

        <svg
          className={`h-3.5 w-3.5 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
          style={{color: 'rgba(27,42,61,0.35)'}}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   YOU MAY ALSO LIKE
   ═══════════════════════════════════════════════════════════════ */
function YouMayAlsoLike({collection, currentProductId}) {
  const products =
    collection?.products?.nodes
      ?.filter((p) => p.id !== currentProductId)
      .slice(0, 4) || [];

  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-[1440px] border-t border-[#1B2A3D]/10 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mb-12 text-center">
        <h2
          className="text-3xl font-light tracking-tight lg:text-4xl"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: '#1B2A3D',
          }}
        >
          You May Also Like
        </h2>
        <div className="mx-auto mt-4 h-px w-12 bg-[#C4956A]" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {products.map((p) => {
          const firstVariant = p.variants?.nodes?.[0];
          const image = p.images?.nodes?.[0];

          return (
            <Link key={p.id} to={`/products/${p.handle}`} className="group">
              <div className="mb-3 aspect-[3/4] overflow-hidden bg-[#F5F1ED]">
                {image ? (
                  <Image
                    data={image}
                    alt={p.title}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-[#1B2A3D]/10">
                    No image
                  </div>
                )}
              </div>

              <h3
                className="mb-1 text-sm font-light tracking-wide transition-colors group-hover:text-[#C4956A]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: '#1B2A3D',
                }}
              >
                {p.title}
              </h3>

              {firstVariant?.price && (
                <p
                  className="text-xs font-medium"
                  style={{
                    color: 'rgba(27,42,61,0.5)',
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  <Money data={firstVariant.price} />
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GRAPHQL
   ═══════════════════════════════════════════════════════════════ */
const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: $selectedOptions
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      ...ProductVariant
    }
    adjacentVariants(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
    collections(first: 1) {
      nodes {
        handle
        title
        products(first: 8) {
          nodes {
            id
            title
            handle
            images(first: 1) {
              nodes {
                id
                url
                altText
                width
                height
              }
            }
            variants(first: 1) {
              nodes {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */