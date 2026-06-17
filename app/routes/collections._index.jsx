import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

const FEATURED_HANDLES = ['new-arrivals', 'clothing', 'sale'];

function isFeatured(handle) {
  return FEATURED_HANDLES.includes(handle);
}

export const meta = () => {
  return [{title: 'VALORA | Collections'}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 24,
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  return {collections};
}

function loadDeferredData() {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData();

  // فلترة المجموعات المخفية
  const visibleCollections = collections.nodes.filter(
    (c) => c.handle !== 'frontpage' && c.handle !== 'hidden',
  );

  // ترتيب: featured أولاً ثم الباقي
  const sortedCollections = [...visibleCollections].sort((a, b) => {
    const aF = isFeatured(a.handle);
    const bF = isFeatured(b.handle);
    if (aF && !bF) return -1;
    if (!aF && bF) return 1;
    return 0;
  });

  // المجموعات المميزة
  const featuredCollections = sortedCollections.filter((c) => isFeatured(c.handle));
  const regularCollections = sortedCollections.filter((c) => !isFeatured(c.handle));

  return (
    <div className="min-h-screen bg-white text-[#1B2A3D]">
      {/* Header */}
      <section className="border-b border-[#1B2A3D]/10 bg-[#F7F4F0]">
        <div className="mx-auto max-w-[1440px] px-6 py-14 sm:px-10 sm:py-20">
          <div
            className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#1B2A3D]/40"
            style={{fontFamily: 'sans-serif'}}
          >
            <Link to="/" className="transition-colors hover:text-[#1B2A3D]">
              Home
            </Link>
            <span>/</span>
            <span>Collections</span>
          </div>

          <h1
            className="mb-4 text-4xl font-light tracking-tight text-[#1B2A3D] sm:text-6xl"
            style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
          >
            Collections
          </h1>

          <p
            className="max-w-xl text-sm leading-relaxed text-[#1B2A3D]/55"
            style={{fontFamily: 'sans-serif'}}
          >
            Explore curated edits of premium fashion, timeless essentials, and
            accessories designed for everyday luxury.
          </p>
        </div>
      </section>

      {/* Featured Collections */}
      {featuredCollections.length > 0 ? (
        <section className="mx-auto max-w-[1440px] px-6 pt-12 sm:px-10 sm:pt-16">
          <div className="mb-6 flex items-center gap-3">
            <p
              className="text-[11px] uppercase tracking-[0.25em] text-[#1B2A3D]/40"
              style={{fontFamily: 'sans-serif'}}
            >
              Featured
            </p>
            <div className="h-px flex-1 bg-[#1B2A3D]/10" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {featuredCollections.map((collection, index) => (
              <CollectionItem
                key={collection.id}
                collection={collection}
                index={index}
                large
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* All Collections */}
      <section className="mx-auto max-w-[1440px] px-6 py-12 sm:px-10 sm:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p
              className="mb-2 text-[11px] uppercase tracking-[0.25em] text-[#1B2A3D]/40"
              style={{fontFamily: 'sans-serif'}}
            >
              Explore
            </p>

            <h2
              className="text-3xl font-light text-[#1B2A3D] sm:text-4xl"
              style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
            >
              Shop by Collection
            </h2>

            <p
              className="mt-2 text-xs text-[#1B2A3D]/45"
              style={{fontFamily: 'sans-serif'}}
            >
              {regularCollections.length} collections
            </p>
          </div>

          <Link
            to="/collections/all"
            className="text-xs font-semibold uppercase tracking-[0.15em] text-[#1B2A3D]/45 transition-colors hover:text-[#1B2A3D]"
            style={{fontFamily: 'sans-serif'}}
          >
            View All Products →
          </Link>
        </div>

        {regularCollections.length === 0 ? (
          <div className="py-20 text-center">
            <p
              className="text-sm text-[#1B2A3D]/45"
              style={{fontFamily: 'sans-serif'}}
            >
              No collections available yet.
            </p>
          </div>
        ) : (
          <PaginatedResourceSection
            connection={collections}
            resourcesClassName="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {({node: collection, index}) =>
              !isFeatured(collection.handle) ? (
                <CollectionItem
                  key={collection.id}
                  collection={collection}
                  index={index}
                />
              ) : null
            }
          </PaginatedResourceSection>
        )}
      </section>
    </div>
  );
}

function CollectionItem({collection, index, large = false}) {
  const image = collection.image;
  const subtitle = getCollectionSubtitle(collection.handle, collection.title);
  const featured = isFeatured(collection.handle);
  const productCount = collection.products?.nodes?.length || 0;

  return (
    <Link
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="group relative block overflow-hidden bg-[#F5F1ED]"
      style={{
        aspectRatio: large ? '16/9' : '4/5',
        borderRadius: '16px',
      }}
    >
      {image ? (
        <Image
          alt={image.altText || collection.title}
          data={image}
          loading={index < 3 ? 'eager' : 'lazy'}
          sizes={
            large
              ? '(min-width: 1024px) 50vw, 100vw'
              : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
          }
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F5F1ED] to-[#E8DDD0]">
          <span
            className="text-xs uppercase tracking-[0.18em] text-[#1B2A3D]/35"
            style={{fontFamily: 'sans-serif'}}
          >
            No Image
          </span>
        </div>
      )}

      <div
        className="absolute inset-0 transition-all duration-300 group-hover:bg-black/30"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.06) 100%)',
        }}
      />

      <div className="absolute left-5 top-5 flex flex-col gap-2">
        {featured ? (
          <span
            className="inline-flex items-center rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
            style={{
              background: 'rgba(180,140,80,0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              fontFamily: 'sans-serif',
            }}
          >
            ★ Featured
          </span>
        ) : (
          <span
            className="inline-flex items-center rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
            style={{
              background: 'rgba(30,20,16,0.45)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.14)',
              fontFamily: 'sans-serif',
            }}
          >
            Collection
          </span>
        )}

        {productCount > 0 ? (
          <span
            className="inline-flex w-fit items-center rounded-full px-3 py-1 text-[10px] font-semibold tracking-wider text-white/85"
            style={{
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(8px)',
              fontFamily: 'sans-serif',
            }}
          >
            {productCount}+ items
          </span>
        ) : null}
      </div>

      <div
        className="absolute right-5 top-5 flex h-[44px] w-[44px] items-center justify-center rounded-full text-2xl font-light text-[#1B2A3D] transition-all duration-300 group-hover:rotate-90"
        style={{
          background: 'rgba(248,242,237,0.92)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          lineHeight: 1,
        }}
      >
        +
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 text-center">
        {subtitle ? (
          <p
            className="mb-2 text-[10px] uppercase tracking-[0.28em] text-white/55"
            style={{fontFamily: 'sans-serif'}}
          >
            {subtitle}
          </p>
        ) : (
          <p
            className="mb-2 text-[10px] uppercase tracking-[0.28em] text-white/55"
            style={{fontFamily: 'sans-serif'}}
          >
            Shop Now
          </p>
        )}

        <h3
          className="mb-5 text-3xl font-light italic leading-tight text-white sm:text-4xl"
          style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
        >
          {collection.title}
        </h3>

        {collection.description ? (
          <p
            className="mx-auto mb-6 line-clamp-2 max-w-sm text-sm leading-relaxed text-white/65"
            style={{fontFamily: 'sans-serif'}}
          >
            {collection.description}
          </p>
        ) : null}

        <span
          className="inline-flex items-center justify-center px-8 py-3 text-xs font-semibold uppercase tracking-widest text-[#1B2A3D] transition-all group-hover:bg-[#1B2A3D] group-hover:text-white"
          style={{
            background: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          View Collection
        </span>
      </div>
    </Link>
  );
}

function getCollectionSubtitle(handle, title) {
  const h = (handle || '').toLowerCase();
  const t = (title || '').toLowerCase();

  if (h.includes('new') || t.includes('new')) return 'New Arrivals';
  if (h.includes('sale') || t.includes('sale')) return 'On Sale';
  if (h.includes('clothing') || h.includes('clothes') || t.includes('clothing')) return 'Wardrobe Edit';
  if (h.includes('bag') || t.includes('bag')) return 'Carry Essentials';
  if (h.includes('watch') || t.includes('watch')) return 'Timepieces';
  if (h.includes('jewel') || t.includes('jewel')) return 'Jewelry';
  if (h.includes('beauty') || t.includes('beauty')) return 'Beauty';
  if (h.includes('accessor') || t.includes('accessor')) return 'Accessories';
  if (h.includes('top') || t.includes('top')) return 'Tops';
  if (h.includes('bottom') || t.includes('bottom')) return 'Bottoms';
  if (h.includes('dress') || t.includes('dress')) return 'Dresses';

  return null;
}

// ⭐ fragment بدون featured
const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    description
    image {
      id
      url
      altText
      width
      height
    }
    products(first: 1) {
      nodes {
        id
      }
    }
  }

  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: UPDATED_AT
      reverse: true
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;