import {Link, useLoaderData} from 'react-router';
import {useState} from 'react';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

/**
 * Color map
 */
const COLOR_MAP = {
  black: '#1B2A3D',
  white: '#FFFFFF',
  'off-white': '#FAF9F6',
  'off white': '#FAF9F6',
  cream: '#FFFDD0',
  ivory: '#FFFFF0',
  beige: '#F5F5DC',
  nude: '#E3BC9A',
  neutral: '#D8CAB8',
  clear: '#E8F4F8',
  transparent: '#E8F4F8',

  grey: '#808080',
  gray: '#808080',
  'light grey': '#D3D3D3',
  'light gray': '#D3D3D3',
  'dark grey': '#4A4A4A',
  'dark gray': '#4A4A4A',
  charcoal: '#36454F',
  slate: '#708090',
  silver: '#C0C0C0',
  platinum: '#E5E4E2',
  ash: '#B2BEB5',
  smoke: '#738276',

  blue: '#4A90D9',
  navy: '#3B4D6B',
  'navy blue': '#000080',
  'light blue': '#ADD8E6',
  'sky blue': '#87CEEB',
  'baby blue': '#89CFF0',
  'powder blue': '#B0E0E6',
  'royal blue': '#4169E1',
  cobalt: '#0047AB',
  'cobalt blue': '#0047AB',
  denim: '#1560BD',
  'denim blue': '#1560BD',
  teal: '#008080',
  turquoise: '#40E0D0',
  aqua: '#00FFFF',
  aquamarine: '#7FFFD4',
  cyan: '#00FFFF',
  'midnight blue': '#191970',
  'steel blue': '#4682B4',
  'cornflower blue': '#6495ED',
  periwinkle: '#CCCCFF',
  indigo: '#4B0082',

  red: '#C0392B',
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
  oxblood: '#4A0000',
  rust: '#B7410E',
  terracotta: '#E2725B',

  pink: '#E8C8D0',
  rose: '#E8C8D0',
  'light pink': '#FFB6C1',
  'baby pink': '#F4C2C2',
  'hot pink': '#FF69B4',
  fuchsia: '#FF00FF',
  magenta: '#FF00FF',
  blush: '#DE5D83',
  'dusty rose': '#C9A9A6',
  'rose gold': '#B76E79',
  salmon: '#FA8072',
  coral: '#FF7F50',
  peach: '#FFE5B4',

  orange: '#E65100',
  'burnt orange': '#CC5500',
  tangerine: '#F28500',
  apricot: '#FBCEB1',
  copper: '#B87333',
  bronze: '#CD7F32',
  pumpkin: '#FF7518',

  yellow: '#FDD835',
  'light yellow': '#FFFFE0',
  mustard: '#FFDB58',
  'mustard yellow': '#FFDB58',
  gold: '#FFD700',
  golden: '#FFD700',
  champagne: '#F7E7CE',
  lemon: '#FFF44F',
  butter: '#FFF1A8',
  honey: '#FFC30B',

  green: '#558B2F',
  'light green': '#90EE90',
  'dark green': '#006400',
  'forest green': '#228B22',
  olive: '#808000',
  'olive green': '#808000',
  sage: '#BCB88A',
  'sage green': '#BCB88A',
  mint: '#98FF98',
  'mint green': '#98FF98',
  emerald: '#50C878',
  'emerald green': '#50C878',
  lime: '#00FF00',
  'lime green': '#32CD32',
  'khaki green': '#8A865D',
  'army green': '#4B5320',
  'hunter green': '#355E3B',
  moss: '#8A9A5B',
  'moss green': '#8A9A5B',
  seafoam: '#9FE2BF',
  'seafoam green': '#9FE2BF',

  purple: '#7B1FA2',
  lavender: '#E6E6FA',
  lilac: '#C8A2C8',
  violet: '#8F00FF',
  plum: '#673147',
  mauve: '#E0B0FF',
  orchid: '#DA70D6',
  eggplant: '#614051',
  amethyst: '#9966CC',

  brown: '#8B4513',
  'dark brown': '#5C4033',
  'light brown': '#A0522D',
  chocolate: '#7B3F00',
  coffee: '#6F4E37',
  espresso: '#4B3621',
  mocha: '#967969',
  taupe: '#483C32',
  tan: '#C5B9A8',
  camel: '#C19A6B',
  caramel: '#AF6E4D',
  sand: '#C2B280',
  khaki: '#C3B091',
  stone: '#D6D0C4',
  cognac: '#9A463D',
  walnut: '#773F1A',
  chestnut: '#954535',

  metallic: '#B0B0B0',
  'metallic silver': '#C0C0C0',
  'metallic gold': '#D4AF37',
  gunmetal: '#2A3439',

  snow: '#FFFAFA',
  linen: '#FAF0E6',
  seashell: '#FFF5EE',
  alabaster: '#F2F0E6',
  pearl: '#EAE0C8',

  almond: '#EFDECD',
  biscuit: '#E3C9A6',
  oat: '#DFD3C3',
  ecru: '#C2B280',
  bone: '#E3DAC9',
  oatmilk: '#F1E3C6',

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
  return value
    ?.toLowerCase()
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');
}

function colorToHex(colorValue) {
  if (!colorValue) return '#E0DDD5';

  const raw = colorValue.trim();

  if (raw.startsWith('#')) return raw;
  if (raw.startsWith('rgb')) return raw;
  if (raw.startsWith('hsl')) return raw;

  const normalized = normalizeColorName(raw);

  if (COLOR_MAP[normalized]) return COLOR_MAP[normalized];

  const splitColors = normalized.split(/\/|,|&|\band\b/).map((c) => c.trim());
  const matched = splitColors.find((c) => COLOR_MAP[c]);
  if (matched) return COLOR_MAP[matched];

  const partialMatch = Object.keys(COLOR_MAP).find(
    (key) => normalized.includes(key) || key.includes(normalized),
  );
  if (partialMatch) return COLOR_MAP[partialMatch];

  return '#E0DDD5';
}

function isLightColor(color) {
  return [
    '#FFFFFF',
    '#FAF9F6',
    '#FFFDD0',
    '#FFFFF0',
    '#FFFAFA',
    '#FAF0E6',
    '#FFF5EE',
    '#F2F0E6',
    '#EAE0C8',
    '#FFFFE0',
  ].includes(String(color).toUpperCase());
}

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: `VALORAERPY | Products`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}) {
  const {storefront} = context;

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const {products} = await storefront.query(CATALOG_QUERY, {
    variables: {...paginationVariables},
  });

  return {products};
}

function loadDeferredData() {
  return {};
}

export default function Collection() {
  const {products} = useLoaderData();

  return (
    <div className="min-h-screen bg-white text-[#1B2A3D]">
      <section className="border-b border-[#1B2A3D]/10 bg-[#F7F4F0]">
        <div className="mx-auto max-w-[1440px] px-6 py-14 sm:px-10 sm:py-20">
          <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#1B2A3D]/40">
            <Link to="/" className="hover:text-[#1B2A3D]">
              Home
            </Link>
            <span>/</span>
            <span>Products</span>
          </div>

          <h1
            className="mb-4 text-4xl font-light tracking-tight text-[#1B2A3D] sm:text-6xl"
            style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
          >
            All Products
          </h1>

          <p
            className="max-w-xl text-sm leading-relaxed text-[#1B2A3D]/55"
            style={{fontFamily: 'sans-serif'}}
          >
            Discover refined essentials, timeless fashion pieces, and premium
            accessories designed for everyday luxury.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-10 sm:px-10 sm:py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p
              className="mb-2 text-[11px] uppercase tracking-[0.25em] text-[#1B2A3D]/40"
              style={{fontFamily: 'sans-serif'}}
            >
              Shop
            </p>

            <h2
              className="text-3xl font-light text-[#1B2A3D] sm:text-4xl"
              style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
            >
              Newest Arrivals
            </h2>
          </div>

          <Link
            to="/collections/all"
            className="text-xs font-semibold uppercase tracking-[0.15em] text-[#1B2A3D]/45 transition-colors hover:text-[#1B2A3D]"
            style={{fontFamily: 'sans-serif'}}
          >
            View All
          </Link>
        </div>

        <PaginatedResourceSection
          connection={products}
          resourcesClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {({node: product, index}) => (
            <ProductCard
              key={product.id}
              product={product}
              featured={index === 0}
              loading={index < 4 ? 'eager' : 'lazy'}
            />
          )}
        </PaginatedResourceSection>
      </section>
    </div>
  );
}

function ProductCard({product, featured = false, loading = 'lazy'}) {
  const [wished, setWished] = useState(false);

  const image = product.featuredImage;
  const price = product.priceRange?.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;

  const hasValidPrice = Boolean(price?.amount && price?.currencyCode);

  const hasSale =
    hasValidPrice &&
    Boolean(compareAtPrice?.amount && compareAtPrice?.currencyCode) &&
    Number(compareAtPrice.amount) > Number(price.amount);

  const discountPercent = hasSale
    ? Math.round(
        ((Number(compareAtPrice.amount) - Number(price.amount)) /
          Number(compareAtPrice.amount)) *
          100,
      )
    : 0;

  const normalizedTags =
    product.tags?.map((tag) => tag.toLowerCase().trim()) ?? [];

  const isNew =
    normalizedTags.includes('new') ||
    normalizedTags.includes('new-arrival') ||
    normalizedTags.includes('new arrival');

  const isBestSeller =
    normalizedTags.includes('best-seller') ||
    normalizedTags.includes('best seller') ||
    normalizedTags.includes('bestseller');

  const colorOption = product.options?.find((opt) => {
    const name = opt.name.toLowerCase().trim();
    return ['color', 'colors', 'colour', 'colours'].includes(name);
  });

  const sizeOption = product.options?.find((opt) => {
    const name = opt.name.toLowerCase().trim();
    return ['size', 'sizes'].includes(name);
  });

  const hasColors = Boolean(colorOption && colorOption.values.length > 0);
  const hasSizes = Boolean(sizeOption && sizeOption.values.length > 0);

  const productColors = hasColors
    ? colorOption.values.map((colorName) => ({
        name: colorName,
        hex: colorToHex(colorName),
      }))
    : [];

  const MAX_VISIBLE_COLORS = 5;
  const visibleColors = productColors.slice(0, MAX_VISIBLE_COLORS);
  const remainingColors = productColors.length - MAX_VISIBLE_COLORS;

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
              loading={loading}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F5F1ED] to-[#E8DDD0]">
              <span className="text-xs text-[#1B2A3D]/35">No image</span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/[0.08]" />

          {hasSizes && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              <div
                className="mx-3 mb-3 flex items-center justify-center gap-3 py-2.5 text-[11px] font-semibold text-[#1B2A3D]"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(8px)',
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.08em',
                }}
              >
                {sizeOption.values.map((size) => (
                  <span
                    key={size}
                    className="cursor-pointer transition-all hover:font-black"
                    onClick={(event) => event.preventDefault()}
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {hasSale ? (
              <span
                className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white"
                style={{
                  background: '#1B2A3D',
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.12em',
                }}
              >
                -{discountPercent}%
              </span>
            ) : null}

            {isNew ? (
              <span
                className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white"
                style={{
                  background: '#C9877A',
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.12em',
                }}
              >
                New
              </span>
            ) : null}

            {!hasSale && !isNew ? (
              <span
                className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white"
                style={{
                  background: '#1B2A3D',
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.12em',
                }}
              >
                Popular
              </span>
            ) : null}
          </div>

          {isBestSeller ? (
            <span
              className="absolute right-3 top-12 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white"
              style={{
                background: '#B9894B',
                fontFamily: 'sans-serif',
                letterSpacing: '0.12em',
              }}
            >
              Best
            </span>
          ) : null}
        </Link>

        <button
          type="button"
          onClick={() => setWished((value) => !value)}
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

          {hasColors && (
            <div className="mt-1.5 flex items-center gap-1.5">
              {visibleColors.map((color, index) => (
                <span
                  key={`${color.name}-${index}`}
                  title={color.name}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: color.hex,
                    border: isLightColor(color.hex)
                      ? '1.5px solid rgba(27,42,61,0.28)'
                      : '1.5px solid rgba(27,42,61,0.15)',
                    display: 'block',
                    flexShrink: 0,
                  }}
                />
              ))}
              {remainingColors > 0 && (
                <span
                  className="text-[10px] text-[#1B2A3D]/35"
                  style={{fontFamily: 'sans-serif'}}
                >
                  +{remainingColors}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="text-right">
          {hasValidPrice ? (
            <>
              <span
                className="block whitespace-nowrap text-sm font-semibold text-[#1B2A3D]"
                style={{fontFamily: 'sans-serif'}}
              >
                <Money data={price} />
              </span>

              {hasSale ? (
                <span className="block text-xs text-[#1B2A3D]/35 line-through">
                  <Money data={compareAtPrice} />
                </span>
              ) : null}
            </>
          ) : (
            <span className="text-xs text-[#1B2A3D]/35">Unavailable</span>
          )}
        </div>
      </Link>
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }

  fragment CollectionItem on Product {
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
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
`;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: UPDATED_AT
      reverse: true
    ) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }

  ${COLLECTION_ITEM_FRAGMENT}
`;

/** @typedef {import('./+types/collections.all').Route} Route */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */