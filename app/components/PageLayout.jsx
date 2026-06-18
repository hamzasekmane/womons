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
import {motion} from 'framer-motion';

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

      <main className="bg-[#FAFAFA] min-h-screen selection:bg-black selection:text-white">
        {children}
      </main>

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
 * Cart Aside Wrapper
 */
function CartAside({cart}) {
  return (
    <Aside type="cart" heading="SHOPPING BAG">
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
    <div className="flex h-full flex-col items-center justify-center px-6 py-20 text-center">
      <motion.div
        animate={{opacity: [0.3, 1, 0.3]}}
        transition={{repeat: Infinity, duration: 1.5, ease: "easeInOut"}}
        className="text-[10px] font-bold uppercase tracking-[0.3em] text-black"
      >
        Loading Bag...
      </motion.div>
    </div>
  );
}

function CartError() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-800">
        Your cart could not be loaded.
      </p>
    </div>
  );
}

/**
 * Predictive Search Aside (Luxury Editorial UI)
 */
function SearchAside() {
  const queriesDatalistId = useId();

  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search flex h-full flex-col">
        {/* Search Header Form */}
        <div className="px-6 pt-8 pb-4">
          <SearchFormPredictive>
            {({fetchResults, goToSearch, inputRef}) => (
              <div className="group relative flex items-center border-b border-gray-200 pb-3 transition-colors focus-within:border-black">
                <input
                  name="q"
                  onChange={fetchResults}
                  onFocus={fetchResults}
                  placeholder="WHAT ARE YOU LOOKING FOR?"
                  ref={inputRef}
                  type="search"
                  list={queriesDatalistId}
                  autoComplete="off"
                  className="w-full bg-transparent text-xl font-light text-black placeholder-gray-300 outline-none font-serif sm:text-2xl"
                />
                
                <button
                  type="button"
                  onClick={goToSearch}
                  className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-400 transition-colors hover:text-black"
                  aria-label="Search"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
              </div>
            )}
          </SearchFormPredictive>
        </div>

        {/* Search Results Area */}
        <div className="flex-1 overflow-y-auto px-6 hide-scroll">
          <SearchResultsPredictive>
            {({items, total, term, state, closeSearch}) => {
              const {articles, collections, pages, products, queries} = items;
              const currentTerm = term.current?.trim() || '';

              if (!currentTerm) {
                return (
                  <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="py-20 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      Type to discover products & collections.
                    </p>
                  </motion.div>
                );
              }

              if (state === 'loading') {
                return (
                  <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col items-center justify-center gap-4 py-16">
                    <div className="h-px w-16 overflow-hidden bg-gray-100">
                      <motion.div
                        animate={{x: ['-100%', '100%']}}
                        transition={{repeat: Infinity, duration: 1.2, ease: 'easeInOut'}}
                        className="h-full w-full bg-black"
                      />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400">
                      Searching...
                    </span>
                  </motion.div>
                );
              }

              if (!total) {
                return <SearchResultsPredictive.Empty term={term} />;
              }

              return (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.4}}>
                  <SearchResultsPredictive.Queries queries={queries} queriesDatalistId={queriesDatalistId} />
                  <SearchResultsPredictive.Products products={products} closeSearch={closeSearch} term={term} />
                  <SearchResultsPredictive.Collections collections={collections} closeSearch={closeSearch} term={term} />
                  <SearchResultsPredictive.Pages pages={pages} closeSearch={closeSearch} term={term} />
                  <SearchResultsPredictive.Articles articles={articles} closeSearch={closeSearch} term={term} />

                  <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pb-8 pt-4">
                    <Link
                      onClick={closeSearch}
                      to={`${SEARCH_ENDPOINT}?q=${encodeURIComponent(currentTerm)}`}
                      className="group flex w-full items-center justify-center gap-3 rounded-full bg-black px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-gray-900 hover:gap-5"
                    >
                      View all results
                      <span className="transition-transform">→</span >
                    </Link>
                  </div>
                </motion.div>
              );
            }}
          </SearchResultsPredictive>
        </div>
      </div>
    </Aside>
  );
}

/**
 * Mobile Menu Aside
 */
function MobileMenuAside({header, publicStoreDomain}) {
  if (!header?.menu) return null;
  const primaryDomainUrl = header?.shop?.primaryDomain?.url || publicStoreDomain || '';

  return (
    <Aside type="mobile" heading="MENU">
      <div className="h-full overflow-y-auto px-6 py-8">
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={primaryDomainUrl}
          publicStoreDomain={publicStoreDomain}
        />
      </div>
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