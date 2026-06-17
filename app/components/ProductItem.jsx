import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

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
  'dark pink': '#E75480',
  rose: '#E8C8D0',
  'dusty rose': '#C9A9A6',
  blush: '#DE5D83',
  fuchsia: '#FF00FF',
  magenta: '#FF00FF',
  salmon: '#FA8072',
  coral: '#FF7F50',
  peach: '#FFE5B4',
  'rose gold': '#B76E79',
  'fluorescent pink': '#FF1493',
  'neon pink': '#FF10F0',

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
  purple: '#7B1FA2',
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
  brown: '#8B4513',
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
    '#ADD8E6',
    '#89CFF0',
    '#E6E6FA',
    '#D8B4F8',
    '#CF9FFF',
    '#CBAACB',
    '#D9C2F0',
    '#FFB6C1',
    '#F4C2C2',
    '#FFE5B4',
    '#FBCEB1',
    '#90EE90',
    '#98FF98',
    '#9FE2BF',
  ].includes(String(color).toUpperCase());
}

function hasOption(product, optionName) {
  return product.options?.some((opt) => {
    const name = opt.name.toLowerCase().trim();
    if (optionName.toLowerCase() === 'color') {
      return ['color', 'colors', 'colour', 'colours'].includes(name);
    }
    if (optionName.toLowerCase() === 'size') {
      return ['size', 'sizes'].includes(name);
    }
    return name === optionName.toLowerCase();
  });
}

function getOptionValues(product, optionName) {
  const option = product.options?.find((opt) => {
    const name = opt.name.toLowerCase().trim();
    if (optionName.toLowerCase() === 'color') {
      return ['color', 'colors', 'colour', 'colours'].includes(name);
    }
    if (optionName.toLowerCase() === 'size') {
      return ['size', 'sizes'].includes(name);
    }
    return name === optionName.toLowerCase();
  });

  return option?.values || [];
}

function getProductColors(product) {
  const colorValues = getOptionValues(product, 'color');
  if (colorValues.length === 0) return [];

  return colorValues.map((val) => {
    const name = typeof val === 'string' ? val : val.name || String(val);

    return {
      name,
      hex: colorToHex(name),
    };
  });
}

/**
 * @param {{
 *   product: ProductItemFragment | CollectionItemFragment | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);

  const primaryImage = product.featuredImage || product.images?.nodes?.[0];
  const hoverImage = product.images?.nodes?.find(
    (image) => image.id !== primaryImage?.id,
  );

  const minVariantPrice = product.priceRange?.minVariantPrice;
  const hasValidPrice = Boolean(
    minVariantPrice?.amount && minVariantPrice?.currencyCode,
  );

  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const hasSale =
    compareAtPrice &&
    Number(compareAtPrice.amount) > Number(minVariantPrice?.amount);

  const discountPercent = hasSale
    ? Math.round(
        ((Number(compareAtPrice.amount) - Number(minVariantPrice.amount)) /
          Number(compareAtPrice.amount)) *
          100,
      )
    : 0;

  const normalizedTags =
    product.tags?.map((tag) => tag.toLowerCase().trim()) || [];

  const isBestSeller =
    normalizedTags.includes('best-seller') ||
    normalizedTags.includes('best seller') ||
    normalizedTags.includes('bestseller');

  const isNewArrival =
    normalizedTags.includes('new-arrival') ||
    normalizedTags.includes('new arrival') ||
    normalizedTags.includes('new');

  const hasColors = hasOption(product, 'color');
  const hasSizes = hasOption(product, 'size');

  const productColors = hasColors ? getProductColors(product) : [];
  const sizeValues = hasSizes ? getOptionValues(product, 'size') : [];

  const MAX_VISIBLE_COLORS = 5;
  const visibleColors = productColors.slice(0, MAX_VISIBLE_COLORS);
  const remainingColors = productColors.length - MAX_VISIBLE_COLORS;

  return (
    <div className="product-item group relative">
      <Link to={variantUrl} prefetch="intent" className="block">
        <div
          className="relative mb-3 overflow-hidden bg-[#F5F1ED]"
          style={{aspectRatio: '3/4'}}
        >
          {primaryImage ? (
            <Image
              data={primaryImage}
              alt={primaryImage.altText || product.title}
              loading={loading}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#F5F1ED] to-[#E8DDD0]" />
          )}

          {hoverImage && (
            <Image
              data={hoverImage}
              alt={hoverImage.altText || product.title}
              loading="lazy"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/5" />

          <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
            {hasSale ? (
              <span className="bg-[#1B2A3D] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                -{discountPercent}%
              </span>
            ) : (
              <span className="bg-[#1B2A3D] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                Popular
              </span>
            )}

            {isNewArrival && (
              <span className="bg-rose-400 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                New
              </span>
            )}
          </div>

          {isBestSeller && (
            <span className="absolute right-3 top-12 z-10 bg-amber-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
              Best Seller
            </span>
          )}

          {hasSizes && sizeValues.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              <div
                className="mx-3 mb-3 flex items-center justify-center gap-3 py-2.5 text-[11px] font-semibold text-[#1B2A3D]"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(8px)',
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.08em',
                }}
              >
                {sizeValues.map((size) => (
                  <span key={size}>{size}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>

      <button
        type="button"
        className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1B2A3D] shadow-sm backdrop-blur-sm transition-all hover:bg-white"
        aria-label={`Add ${product.title} to wishlist`}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      </button>

      <Link to={variantUrl} prefetch="intent" className="block">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4
              className="truncate text-sm font-medium text-[#1B2A3D] transition-colors group-hover:text-[#1B2A3D]/65"
              style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
            >
              {product.title}
            </h4>

            {visibleColors.length > 0 && (
              <div className="mt-1.5 flex items-center gap-1.5">
                {visibleColors.map((color, index) => (
                  <span
                    key={`${color.name}-${index}`}
                    title={color.name}
                    aria-label={`Color: ${color.name}`}
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
                      cursor: 'pointer',
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

          <span
            className="whitespace-nowrap text-sm font-semibold text-[#1B2A3D]"
            style={{fontFamily: 'sans-serif'}}
          >
            {hasValidPrice ? (
              <Money data={minVariantPrice} />
            ) : (
              <span className="text-xs text-slate-400">Unavailable</span>
            )}
          </span>
        </div>

        {hasSale && (
          <div className="mt-1 text-right text-xs text-slate-400 line-through">
            <Money data={compareAtPrice} />
          </div>
        )}
      </Link>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
