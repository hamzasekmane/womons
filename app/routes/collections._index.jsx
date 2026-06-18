import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {motion} from 'framer-motion';

const FEATURED_HANDLES = ['new-arrivals', 'clothing', 'sale'];

function isFeatured(handle) {
  return FEATURED_HANDLES.includes(handle);
}

/* ═══════════════════════════════════════════════════════════════
   META & LOADER
   ═══════════════════════════════════════════════════════════════ */

export const meta = () => {
  return [{title: 'VALORAERPY | Collections'}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}) {
  const paginationVariables = getPaginationVariables(request, {pageBy: 24});
  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });
  return {collections};
}

function loadDeferredData() {
  return {};
}

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function Collections() {
  const {collections} = useLoaderData();

  // Filter out hidden collections
  const visibleCollections = collections.nodes.filter(
    (c) => c.handle !== 'frontpage' && c.handle !== 'hidden',
  );

  // Sort: Featured first, then the rest
  const sortedCollections = [...visibleCollections].sort((a, b) => {
    const aF = isFeatured(a.handle);
    const bF = isFeatured(b.handle);
    if (aF && !bF) return -1;
    if (!aF && bF) return 1;
    return 0;
  });

  const featuredCollections = sortedCollections.filter((c) => isFeatured(c.handle));
  const regularCollections = sortedCollections.filter((c) => !isFeatured(c.handle));

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
            <span className="text-black">Collections</span>
          </div>

          <h1 className="mb-6 text-5xl font-light tracking-tight text-black sm:text-7xl font-serif">
            Collections
          </h1>

          <p className="max-w-2xl text-base font-light leading-relaxed text-gray-500 sm:text-lg font-sans">
            Explore curated edits of premium fashion, timeless essentials, and accessories designed for everyday luxury.
          </p>
        </div>
      </motion.section>

      {/* Featured Collections */}
      {featuredCollections.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-6 pt-16 sm:px-12 sm:pt-24">
          <div className="mb-10 flex items-center gap-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 font-sans">
              Featured Edits
            </p>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
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
      )}

      {/* All Collections */}
      <section className="mx-auto max-w-[1600px] px-6 py-16 sm:px-12 sm:py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-gray-200 pb-6">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 font-sans">
              Explore
            </p>
            <h2 className="text-3xl font-light text-black sm:text-4xl font-serif">
              Shop by Collection
            </h2>
            <p className="mt-3 text-xs font-medium text-gray-500 font-sans uppercase tracking-widest">
              {regularCollections.length} Collections
            </p>
          </div>

          <Link
            to="/collections/all"
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 transition-colors hover:text-black"
          >
            View All Products →
          </Link>
        </div>

        {regularCollections.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm font-light text-gray-500">No collections available yet.</p>
          </div>
        ) : (
          <PaginatedResourceSection
            connection={collections}
            resourcesClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
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

/* ═══════════════════════════════════════════════════════════════
   COLLECTION CARD (ANIMATED & LUXURY UI)
   ═══════════════════════════════════════════════════════════════ */

function CollectionItem({collection, index, large = false}) {
  const image = collection.image;
  const subtitle = getCollectionSubtitle(collection.handle, collection.title);
  const featured = isFeatured(collection.handle);
  const productCount = collection.products?.nodes?.length || 0;

  return (
    <motion.div
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-50px"}}
      transition={{duration: 0.6, delay: (index % 10) * 0.05, ease: [0.21, 0.47, 0.32, 0.98]}}
      className={`group relative block overflow-hidden rounded-[24px] bg-gray-100 ${large ? 'aspect-[4/5] sm:aspect-[16/9]' : 'aspect-[4/5]'}`}
    >
      <Link to={`/collections/${collection.handle}`} prefetch="intent" className="block h-full w-full">
        {image ? (
          <Image
            alt={image.altText || collection.title}
            data={image}
            loading={index < 3 ? 'eager' : 'lazy'}
            sizes={large ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
            className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-xs uppercase tracking-widest text-gray-400">No Image</span>
          </div>
        )}

        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700 group-hover:opacity-90" />

        {/* Top Badges */}
        <div className="absolute left-6 top-6 flex flex-col items-start gap-3">
          {featured ? (
            <span className="rounded-full bg-[#C4956A] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-md">
              ★ Featured
            </span>
          ) : (
            <span className="rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Collection
            </span>
          )}

          {productCount > 0 && (
            <span className="rounded-full bg-black/40 backdrop-blur-sm px-3 py-1.5 text-[9px] font-semibold tracking-[0.1em] text-white/90">
              {productCount}+ Items
            </span>
          )}
        </div>

        {/* Hover Spinning Action Button */}
        <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-2xl font-light text-black shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90">
          +
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center sm:p-10">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">
            {subtitle || 'Shop Now'}
          </p>

          <h3 className="mb-4 text-4xl font-light leading-tight text-white sm:text-5xl font-serif">
            {collection.title}
          </h3>

          {collection.description && (
            <p className="mx-auto mb-8 line-clamp-2 max-w-sm text-sm font-light leading-relaxed text-white/80 font-sans">
              {collection.description}
            </p>
          )}

          {/* Magnetic Hover Button */}
          <span className="inline-block rounded-full bg-white px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-black transition-all duration-400 group-hover:bg-black group-hover:text-white group-hover:tracking-[0.25em]">
            View Collection
          </span>
        </div>
      </Link>
    </motion.div>
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
  if (h.includes('jewel') || t.includes('jewel')) return 'Fine Jewelry';
  if (h.includes('beauty') || t.includes('beauty')) return 'Beauty & Care';
  if (h.includes('accessor') || t.includes('accessor')) return 'Accessories';
  if (h.includes('top') || t.includes('top')) return 'Tops';
  if (h.includes('bottom') || t.includes('bottom')) return 'Bottoms';
  if (h.includes('dress') || t.includes('dress')) return 'Dresses';

  return null;
}

/* ═══════════════════════════════════════════════════════════════
   GRAPHQL
   ═══════════════════════════════════════════════════════════════ */

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