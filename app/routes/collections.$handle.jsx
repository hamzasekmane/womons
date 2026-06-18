import {Link, redirect, useLoaderData} from 'react-router';
import {useState} from 'react';
import {
  getPaginationVariables,
  Analytics,
  Image,
  Money,
} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {motion} from 'framer-motion';

/**
 * Color map (Expanded)
 */
const COLOR_MAP = {
  // Whites / Neutrals
  white: '#FFFFFF', 'off-white': '#FAF9F6', 'off white': '#FAF9F6', ivory: '#FFFFF0', cream: '#FFFDD0',
  beige: '#F5F5DC', nude: '#E3BC9A', neutral: '#D8CAB8', sand: '#C2B280', stone: '#D6D0C4',
  taupe: '#8B8589', ecru: '#C2B280', bone: '#E3DAC9', linen: '#FAF0E6', snow: '#FFFAFA',
  seashell: '#FFF5EE', alabaster: '#F2F0E6', pearl: '#EAE0C8', oat: '#DFD3C3', oatmilk: '#F1E3C6',
  almond: '#EFDECD', biscuit: '#E3C9A6', champagne: '#F7E7CE', clear: '#E8F4F8', transparent: '#E8F4F8',

  // Black / Grey
  black: '#1B2A3D', jet: '#343434', ebony: '#555D50', grey: '#808080', gray: '#808080',
  'light grey': '#D3D3D3', 'light gray': '#D3D3D3', 'dark grey': '#4A4A4A', 'dark gray': '#4A4A4A',
  charcoal: '#36454F', slate: '#708090', ash: '#B2BEB5', smoke: '#738276', silver: '#C0C0C0',
  platinum: '#E5E4E2', pewter: '#96A8A1', gunmetal: '#2A3439',

  // Blues
  blue: '#4A90D9', 'light blue': '#ADD8E6', 'dark blue': '#00008B', 'sky blue': '#87CEEB',
  'baby blue': '#89CFF0', 'powder blue': '#B0E0E6', 'ice blue': '#D6F1F8', 'royal blue': '#4169E1',
  'cobalt blue': '#0047AB', cobalt: '#0047AB', navy: '#3B4D6B', 'navy blue': '#000080',
  denim: '#1560BD', 'denim blue': '#1560BD', indigo: '#4B0082', periwinkle: '#CCCCFF',
  teal: '#008080', turquoise: '#40E0D0', aqua: '#00FFFF', aquamarine: '#7FFFD4', cyan: '#00FFFF',
  'midnight blue': '#191970', 'steel blue': '#4682B4', 'cornflower blue': '#6495ED', sapphire: '#0F52BA',

  // Reds
  red: '#C0392B', 'light red': '#F28B82', 'dark red': '#8B0000', crimson: '#DC143C',
  scarlet: '#FF2400', ruby: '#E0115F', cherry: '#DE3163', 'cherry red': '#DE3163',
  brick: '#B22222', 'brick red': '#B22222', maroon: '#800000', burgundy: '#800020',
  wine: '#722F37', oxblood: '#4A0000', rust: '#B7410E', terracotta: '#E2725B', merlot: '#73343A',

  // Pinks
  pink: '#E8C8D0', 'light pink': '#FFB6C1', 'baby pink': '#F4C2C2', 'hot pink': '#FF69B4',
  'dark pink': '#E75480', rose: '#E8C8D0', 'dusty rose': '#C9A9A6', blush: '#DE5D83',
  fuchsia: '#FF00FF', magenta: '#FF00FF', salmon: '#FA8072', coral: '#FF7F50',
  peach: '#FFE5B4', 'rose gold': '#B76E79',

  // Oranges
  orange: '#E65100', 'light orange': '#FFD8B1', 'dark orange': '#FF8C00', 'burnt orange': '#CC5500',
  tangerine: '#F28500', apricot: '#FBCEB1', pumpkin: '#FF7518', persimmon: '#EC5800',

  // Yellows / Golds
  yellow: '#FDD835', 'light yellow': '#FFFFE0', mustard: '#FFDB58', 'mustard yellow': '#FFDB58',
  lemon: '#FFF44F', butter: '#FFF1A8', honey: '#FFC30B', gold: '#FFD700', golden: '#FFD700', amber: '#FFBF00',

  // Greens
  green: '#558B2F', 'light green': '#90EE90', 'dark green': '#006400', lime: '#00FF00',
  'lime green': '#32CD32', mint: '#98FF98', 'mint green': '#98FF98', sage: '#BCB88A',
  'sage green': '#BCB88A', olive: '#808000', 'olive green': '#808000', emerald: '#50C878',
  'emerald green': '#50C878', 'forest green': '#228B22', 'hunter green': '#355E3B',
  'army green': '#4B5320', moss: '#8A9A5B', 'moss green': '#8A9A5B', seafoam: '#9FE2BF',
  'seafoam green': '#9FE2BF', jade: '#00A86B', pistachio: '#93C572', khaki: '#C3B091', 'khaki green': '#8A865D',

  // Purples
  purple: '#7B1FA2', 'light purple': '#D8B4F8', 'dark purple': '#5D3A7D', 'pastel purple': '#CBAACB',
  'soft purple': '#D9C2F0', lavender: '#E6E6FA', lilac: '#C8A2C8', violet: '#8F00FF',
  'light violet': '#CF9FFF', mauve: '#E0B0FF', plum: '#673147', orchid: '#DA70D6',
  eggplant: '#614051', amethyst: '#9966CC',

  // Browns
  brown: '#8B4513', 'light brown': '#A0522D', 'dark brown': '#5C4033', chocolate: '#7B3F00',
  coffee: '#6F4E37', espresso: '#4B3621', mocha: '#967969', tan: '#C5B9A8', camel: '#C19A6B',
  caramel: '#AF6E4D', cognac: '#9A463D', chestnut: '#954535', walnut: '#773F1A', mahogany: '#C04000',

  // Metallics
  metallic: '#B0B0B0', 'metallic silver': '#C0C0C0', 'metallic gold': '#D4AF37',
  bronze: '#CD7F32', copper: '#B87333', rosegold: '#B76E79',

  // Special / translucent
  crystal: '#E0F7FA',

  // Multi / patterns
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
  return value?.toLowerCase().trim().replace(/\+/g, ' ').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
}

function colorToHex(colorValue) {
  if (!colorValue) return '#E0DDD5';
  const raw = String(colorValue).trim();
  if (raw.startsWith('#') || raw.startsWith('rgb') || raw.startsWith('hsl')) return raw;

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

function isLightColor(color) {
  return [
    '#FFFFFF', '#FAF9F6', '#FFFDD0', '#FFFFF0', '#FFFAFA', '#FAF0E6', '#FFF5EE', '#F2F0E6',
    '#EAE0C8', '#FFFFE0', '#ADD8E6', '#89CFF0', '#E6E6FA', '#D8B4F8', '#CF9FFF', '#CBAACB',
    '#D9C2F0', '#FFB6C1', '#F4C2C2', '#FFE5B4', '#FBCEB1', '#90EE90', '#98FF98', '#9FE2BF',
  ].includes(String(color).toUpperCase());
}

/* ═══════════════════════════════════════════════════════════════
   META & LOADER
   ═══════════════════════════════════════════════════════════════ */

export const meta = ({data}) => {
  return [{title: `VALORAERPY | ${data?.collection?.title ?? 'Collection'}`}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {pageBy: 12});

  if (!handle) throw redirect('/collections');

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {collection};
}

function loadDeferredData() {
  return {};
}

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function Collection() {
  const {collection} = useLoaderData();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black selection:bg-black selection:text-white">
      {/* Animated Header Section */}
      <motion.section 
        initial={{opacity: 0, y: -20}} 
        animate={{opacity: 1, y: 0}} 
        transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
        className="border-b border-gray-200 bg-white"
      >
        <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-12 sm:py-24">
          <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
            <Link to="/" className="transition-colors hover:text-black">Home</Link>
            <span>/</span>
            <Link to="/collections" className="transition-colors hover:text-black">Collections</Link>
            <span>/</span>
            <span className="text-black">{collection.title}</span>
          </div>

          <h1 className="mb-6 text-5xl font-light tracking-tight text-black sm:text-7xl font-serif">
            {collection.title}
          </h1>

          <p className="max-w-2xl text-base font-light leading-relaxed text-gray-500 sm:text-lg font-sans">
            {collection.description || 'Explore our curated edit of refined essentials, premium pieces, and timeless accessories.'}
          </p>
        </div>
      </motion.section>

      {/* Grid Section */}
      <section className="mx-auto max-w-[1600px] px-6 py-16 sm:px-12 sm:py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-gray-200 pb-6">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 font-sans">Shop Collection</p>
            <h2 className="text-3xl font-light text-black sm:text-4xl font-serif">{collection.title}</h2>
          </div>

          <Link
            to="/collections/all"
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 transition-colors hover:text-black"
          >
            View All Products →
          </Link>
        </div>

        <PaginatedResourceSection
          connection={collection.products}
          resourcesClassName="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 sm:gap-x-6 sm:gap-y-16"
        >
          {({node: product, index}) => (
            <ProductCard
              key={product.id}
              product={product}
              featured={index === 0}
              index={index}
              loading={index < 4 ? 'eager' : 'lazy'}
            />
          )}
        </PaginatedResourceSection>
      </section>

      <Analytics.CollectionView data={{collection: {id: collection.id, handle: collection.handle}}} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT CARD (ANIMATED & LUXURY UI)
   ═══════════════════════════════════════════════════════════════ */

function ProductCard({product, featured = false, index, loading = 'lazy'}) {
  const [wished, setWished] = useState(false);

  const image = product.featuredImage;
  const price = product.priceRange?.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;

  const hasValidPrice = Boolean(price?.amount && price?.currencyCode);
  const hasSale = hasValidPrice && Boolean(compareAtPrice?.amount) && Number(compareAtPrice.amount) > Number(price.amount);
  const discountPercent = hasSale ? Math.round(((Number(compareAtPrice.amount) - Number(price.amount)) / Number(compareAtPrice.amount)) * 100) : 0;

  const normalizedTags = product.tags?.map((tag) => tag.toLowerCase().trim()) ?? [];
  const isNew = normalizedTags.some(t => ['new', 'new-arrival', 'new arrival'].includes(t));
  const isBestSeller = normalizedTags.some(t => ['best-seller', 'best seller', 'bestseller'].includes(t));

  const colorOption = product.options?.find((opt) => ['color', 'colors', 'colour', 'colours'].includes(opt.name.toLowerCase().trim()));
  const sizeOption = product.options?.find((opt) => ['size', 'sizes'].includes(opt.name.toLowerCase().trim()));

  const hasColors = Boolean(colorOption && colorOption.values.length > 0);
  const hasSizes = Boolean(sizeOption && sizeOption.values.length > 0);

  const productColors = hasColors ? colorOption.values.map((colorName) => ({name: colorName, hex: colorToHex(colorName)})) : [];
  const MAX_VISIBLE_COLORS = 5;
  const visibleColors = productColors.slice(0, MAX_VISIBLE_COLORS);
  const remainingColors = productColors.length - MAX_VISIBLE_COLORS;

  return (
    <motion.div 
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-50px"}}
      transition={{duration: 0.6, delay: (index % 12) * 0.05, ease: [0.21, 0.47, 0.32, 0.98]}}
      className={`group flex flex-col gap-4 ${featured ? 'col-span-2 sm:col-span-1' : ''}`}
    >
      <div className="relative overflow-hidden rounded-[20px] bg-gray-100 aspect-[3/4]">
        <Link to={`/products/${product.handle}`} className="block h-full w-full">
          {image ? (
            <Image
              data={image}
              alt={image.altText || product.title}
              loading={loading}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-xs text-gray-400 uppercase tracking-widest">No image</span>
            </div>
          )}

          {/* Cinematic Dark Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

          {/* Glassmorphic Size Peek Hover */}
          {hasSizes && (
            <div className="absolute inset-x-3 bottom-3 translate-y-[120%] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
              <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl bg-white/80 p-3 backdrop-blur-md border border-white/40 shadow-lg">
                <span className="w-full text-center text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-0.5">Available Sizes</span>
                {sizeOption.values.map((size) => (
                  <span 
                    key={size} 
                    onClick={(e) => e.preventDefault()} 
                    className="text-[11px] font-semibold text-black hover:scale-110 transition-transform cursor-default"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Premium Pill Badges */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {hasSale && (
              <span className="rounded-full bg-red-800 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                -{discountPercent}%
              </span>
            )}
            {isNew && (
              <span className="rounded-full bg-black px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                New
              </span>
            )}
            {!hasSale && !isNew && (
              <span className="rounded-full bg-black px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                Popular
              </span>
            )}
          </div>

          {isBestSeller && (
            <span className="absolute right-4 top-16 rounded-full bg-[#C4956A] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
              Best
            </span>
          )}
        </Link>

        {/* Micro-animated Wishlist Button */}
        <motion.button
          type="button"
          whileHover={{scale: 1.1}}
          whileTap={{scale: 0.9}}
          onClick={() => setWished(!wished)}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" stroke="black" strokeWidth="1.8" fill={wished ? 'black' : 'none'} className="transition-colors duration-300">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </motion.button>
      </div>

      {/* Product Details Area */}
      <div className="flex flex-col gap-1 px-1">
        <Link to={`/products/${product.handle}`} className="group-hover:underline underline-offset-4 decoration-1 decoration-gray-400">
          <h4 className="text-base font-medium text-black truncate font-serif">{product.title}</h4>
        </Link>
        
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-baseline gap-2">
            {hasValidPrice ? (
              <>
                <span className="text-sm font-semibold text-black font-sans"><Money data={price} /></span>
                {hasSale && <span className="text-xs text-gray-400 line-through font-sans"><Money data={compareAtPrice} /></span>}
              </>
            ) : (
              <span className="text-xs text-gray-400">Unavailable</span>
            )}
          </div>

          {/* Premium Swatch Indicators */}
          {hasColors && (
            <div className="flex items-center gap-1">
              {visibleColors.map((color, idx) => (
                <div key={`${color.name}-${idx}`} title={color.name} className="rounded-full p-[1px] border border-gray-200">
                  <span
                    style={{background: color.hex}}
                    className={`block h-2.5 w-2.5 rounded-full flex-shrink-0 ${isLightColor(color.hex) ? 'border border-black/10' : ''}`}
                  />
                </div>
              ))}
              {remainingColors > 0 && (
                <span className="text-[10px] text-gray-400 ml-1 font-sans">+{remainingColors}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GRAPHQL
   ═══════════════════════════════════════════════════════════════ */

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }

  fragment ProductItem on Product {
    id
    handle
    title
    productType
    tags
    options {
      name
      values
    }
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}

  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        sortKey: COLLECTION_DEFAULT
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;