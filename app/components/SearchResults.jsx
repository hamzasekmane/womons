import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams} from '~/lib/search';

/**
 * @param {Omit<SearchResultsProps, 'error' | 'type'>}
 */
export function SearchResults({term, result, children}) {
  if (!result?.total) return null;
  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

/**
 * @param {PartialSearchResult<'articles'>}
 */
function SearchResultsArticles({term, articles}) {
  if (!articles?.nodes?.length) return null;

  return (
    <section className="mb-12">
      <div className="mb-5">
        <p
          className="mb-2 text-[11px] uppercase tracking-[0.22em] text-[#1B2A3D]/40"
          style={{fontFamily: 'sans-serif'}}
        >
          Editorial
        </p>
        <h2
          className="text-2xl font-light text-[#1B2A3D]"
          style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
        >
          Articles
        </h2>
      </div>

      <div className="space-y-3">
        {articles.nodes.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <Link
              key={article.id}
              prefetch="intent"
              to={articleUrl}
              className="block rounded-2xl border border-[#1B2A3D]/10 bg-white px-5 py-4 transition-all hover:border-[#1B2A3D]/25 hover:bg-[#F7F4F0]"
            >
              <span
                className="text-sm text-[#1B2A3D]"
                style={{fontFamily: 'sans-serif'}}
              >
                {article.title}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/**
 * @param {PartialSearchResult<'pages'>}
 */
function SearchResultsPages({term, pages}) {
  if (!pages?.nodes?.length) return null;

  return (
    <section className="mb-12">
      <div className="mb-5">
        <p
          className="mb-2 text-[11px] uppercase tracking-[0.22em] text-[#1B2A3D]/40"
          style={{fontFamily: 'sans-serif'}}
        >
          Discover
        </p>
        <h2
          className="text-2xl font-light text-[#1B2A3D]"
          style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
        >
          Pages
        </h2>
      </div>

      <div className="space-y-3">
        {pages.nodes.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <Link
              key={page.id}
              prefetch="intent"
              to={pageUrl}
              className="block rounded-2xl border border-[#1B2A3D]/10 bg-white px-5 py-4 transition-all hover:border-[#1B2A3D]/25 hover:bg-[#F7F4F0]"
            >
              <span
                className="text-sm text-[#1B2A3D]"
                style={{fontFamily: 'sans-serif'}}
              >
                {page.title}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/**
 * @param {PartialSearchResult<'products'>}
 */
function SearchResultsProducts({term, products}) {
  if (!products?.nodes?.length) return null;

  return (
    <section className="mb-12">
      <div className="mb-6">
        <p
          className="mb-2 text-[11px] uppercase tracking-[0.22em] text-[#1B2A3D]/40"
          style={{fontFamily: 'sans-serif'}}
        >
          Shop
        </p>
        <h2
          className="text-2xl font-light text-[#1B2A3D]"
          style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
        >
          Products
        </h2>
      </div>

      <Pagination connection={products}>
        {({
          nodes,
          isLoading,
          NextLink,
          PreviousLink,
          hasPreviousPage,
          hasNextPage,
        }) => {
          const itemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <Link
                key={product.id}
                prefetch="intent"
                to={productUrl}
                className="group block overflow-hidden rounded-[20px] border border-[#1B2A3D]/10 bg-white transition-all hover:border-[#1B2A3D]/20"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#F5F1ED]">
                  {image ? (
                    <Image
                      data={image}
                      alt={product.title}
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#F5F1ED] to-[#E8DDD0]" />
                  )}
                </div>

                <div className="p-4">
                  <h3
                    className="truncate text-base text-[#1B2A3D]"
                    style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
                  >
                    {product.title}
                  </h3>

                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className="text-[11px] uppercase tracking-[0.16em] text-[#1B2A3D]/40"
                      style={{fontFamily: 'sans-serif'}}
                    >
                      Premium Selection
                    </span>

                    {price ? (
                      <span
                        className="text-sm font-semibold text-[#1B2A3D]"
                        style={{fontFamily: 'sans-serif'}}
                      >
                        <Money data={price} />
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          });

          return (
            <div className="flex flex-col gap-8">
              {hasPreviousPage ? (
                <div className="flex justify-center">
                  <PreviousLink className="inline-flex items-center gap-2 border border-[#1B2A3D]/25 px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#1B2A3D] transition-all hover:border-[#1B2A3D] hover:bg-[#1B2A3D] hover:text-white">
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#1B2A3D]/25 border-t-[#1B2A3D]" />
                        Loading
                      </span>
                    ) : (
                      <>
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                        Load Previous
                      </>
                    )}
                  </PreviousLink>
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {itemsMarkup}
              </div>

              {hasNextPage ? (
                <div className="flex justify-center">
                  <NextLink className="inline-flex items-center gap-2 bg-[#1B2A3D] px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-[#2A3A4F]">
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Loading
                      </span>
                    ) : (
                      <>
                        Load More
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                      </>
                    )}
                  </NextLink>
                </div>
              ) : null}
            </div>
          );
        }}
      </Pagination>
    </section>
  );
}

function SearchResultsEmpty() {
  return (
    <div className="rounded-2xl border border-[#1B2A3D]/10 bg-[#F7F4F0] px-6 py-10 text-center">
      <p
        className="text-sm text-[#1B2A3D]/55"
        style={{fontFamily: 'sans-serif'}}
      >
        No results found. Try a different keyword.
      </p>
    </div>
  );
}

/** @typedef {RegularSearchReturn['result']['items']} SearchItems */
/**
 * @typedef {Pick<
 *   SearchItems,
 *   ItemType
 * > &
 *   Pick<RegularSearchReturn, 'term'>} PartialSearchResult
 * @template {keyof SearchItems} ItemType
 */
/**
 * @typedef {RegularSearchReturn & {
 *   children: (args: SearchItems & {term: string}) => React.ReactNode;
 * }} SearchResultsProps
 */

/** @typedef {import('~/lib/search').RegularSearchReturn} RegularSearchReturn */