import {Await, Link} from 'react-router';
import {Suspense, useId} from 'react';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

/**
 * @param {PageLayoutProps}
 */
export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside
        header={header}
        publicStoreDomain={publicStoreDomain}
      />

      {header ? (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      ) : null}

      <main>{children}</main>

      <Suspense
        fallback={
          <FooterFallback
            header={header}
            publicStoreDomain={publicStoreDomain}
          />
        }
      >
        <Await
          resolve={footer}
          errorElement={
            <FooterFallback
              header={header}
              publicStoreDomain={publicStoreDomain}
            />
          }
        >
          {(resolvedFooter) => (
            <Footer
              footer={resolvedFooter?.menu || resolvedFooter || null}
              header={header}
              publicStoreDomain={publicStoreDomain}
            />
          )}
        </Await>
      </Suspense>
    </Aside.Provider>
  );
}

/**
 * Footer fallback while loading/error
 *
 * @param {{
 *   header: PageLayoutProps['header'];
 *   publicStoreDomain: PageLayoutProps['publicStoreDomain'];
 * }}
 */
function FooterFallback({header, publicStoreDomain}) {
  return (
    <Footer
      footer={null}
      header={header}
      publicStoreDomain={publicStoreDomain}
    />
  );
}

/**
 * @param {{cart: PageLayoutProps['cart']}}
 */
function CartAside({cart}) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<CartLoading />}>
        <Await resolve={cart} errorElement={<CartError />}>
          {(resolvedCart) => (
            <CartMain cart={resolvedCart} layout="aside" />
          )}
        </Await>
      </Suspense>
    </Aside>
  );
}

function CartLoading() {
  return (
    <div className="px-4 py-6">
      <p className="text-sm text-slate-500">Loading cart...</p>
    </div>
  );
}

function CartError() {
  return (
    <div className="px-4 py-6">
      <p className="text-sm text-slate-500">
        Your cart could not be loaded.
      </p>
    </div>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();

  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search">
        <div className="pt-4">
          <SearchFormPredictive>
            {({fetchResults, goToSearch, inputRef}) => (
              <div className="flex items-center gap-2 px-4">
                <div className="flex flex-1 items-center gap-0 rounded-xl border border-slate-200 bg-slate-50 transition-all focus-within:border-[#1B2A3D] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1B2A3D]/10">
                  <div className="flex items-center pl-3 text-slate-400">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </div>

                  <input
                    name="q"
                    onChange={fetchResults}
                    onFocus={fetchResults}
                    placeholder="Search products..."
                    ref={inputRef}
                    type="search"
                    list={queriesDatalistId}
                    autoComplete="off"
                    className="flex-1 border-none bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={goToSearch}
                  className="rounded-lg bg-[#1B2A3D] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#26384f]"
                >
                  Search
                </button>
              </div>
            )}
          </SearchFormPredictive>
        </div>

        <div className="mt-4 max-h-[calc(100vh-160px)] overflow-y-auto px-4">
          <SearchResultsPredictive>
            {({items, total, term, state, closeSearch}) => {
              const {
                articles,
                collections,
                pages,
                products,
                queries,
              } = items;

              const currentTerm = term.current?.trim() || '';

              if (!currentTerm) {
                return (
                  <div className="py-10 text-center">
                    <p className="text-sm text-slate-400">
                      Start typing to search products, pages, and collections.
                    </p>
                  </div>
                );
              }

              if (state === 'loading') {
                return (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
                    Searching...
                  </div>
                );
              }

              if (!total) {
                return <SearchResultsPredictive.Empty term={term} />;
              }

              return (
                <>
                  <SearchResultsPredictive.Queries
                    queries={queries}
                    queriesDatalistId={queriesDatalistId}
                  />

                  <SearchResultsPredictive.Products
                    products={products}
                    closeSearch={closeSearch}
                    term={term}
                  />

                  <SearchResultsPredictive.Collections
                    collections={collections}
                    closeSearch={closeSearch}
                    term={term}
                  />

                  <SearchResultsPredictive.Pages
                    pages={pages}
                    closeSearch={closeSearch}
                    term={term}
                  />

                  <SearchResultsPredictive.Articles
                    articles={articles}
                    closeSearch={closeSearch}
                    term={term}
                  />

                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${encodeURIComponent(
                      currentTerm,
                    )}`}
                    className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    View all results for &ldquo;{currentTerm}&rdquo; →
                  </Link>
                </>
              );
            }}
          </SearchResultsPredictive>
        </div>
      </div>
    </Aside>
  );
}

/**
 * @param {{
 *   header: PageLayoutProps['header'];
 *   publicStoreDomain: PageLayoutProps['publicStoreDomain'];
 * }}
 */
function MobileMenuAside({header, publicStoreDomain}) {
  if (!header?.menu) {
    return null;
  }

  const primaryDomainUrl =
    header?.shop?.primaryDomain?.url || publicStoreDomain || '';

  return (
    <Aside type="mobile" heading="MENU">
      <HeaderMenu
        menu={header.menu}
        viewport="mobile"
        primaryDomainUrl={primaryDomainUrl}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside>
  );
}

/**
 * @typedef {Object} PageLayoutProps
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {React.ReactNode} [children]
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */