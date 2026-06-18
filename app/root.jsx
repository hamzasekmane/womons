import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';

import favicon from '~/assets/favicon.svg';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import {PageLayout} from './components/PageLayout';

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 * @type {ShouldRevalidateFunction}
 */
export const shouldRevalidate = ({formMethod, currentUrl, nextUrl}) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return false;
};

export function links() {
  return [
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'preconnect', href: 'https://shop.app'},
    {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous'},
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: appStyles},
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

/**
 * Default SEO meta tags for the store.
 */
export function meta() {
  return [
    {title: 'VALORAERPY | Premium Fashion & Accessories'},
    {
      name: 'description',
      content:
        'Discover VALORAERPY premium fashion, refined essentials, luxury accessories, and timeless pieces designed for everyday elegance.',
    },
    {property: 'og:type', content: 'website'},
    {property: 'og:title', content: 'VALORAERPY | Premium Fashion & Accessories'},
    {
      property: 'og:description',
      content:
        'Discover VALORAERPY premium fashion, refined essentials, luxury accessories, and timeless pieces designed for everyday elegance.',
    },
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: 'VALORAERPY | Premium Fashion & Accessories'},
    {
      name: 'twitter:description',
      content:
        'Discover VALORAERPY premium fashion, refined essentials, luxury accessories, and timeless pieces designed for everyday elegance.',
    },
  ];
}

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN || '',
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold.
 */
async function loadCriticalData({context}) {
  const {storefront} = context;
  const header = await storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {headerMenuHandle: 'main-menu'},
  });
  return {header};
}

/**
 * Load data for rendering content below the fold.
 */
function loadDeferredData({context}) {
  const {storefront, customerAccount, cart} = context;
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {footerMenuHandle: 'footer'},
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

/**
 * Global HTML Wrapper
 * @param {{children?: React.ReactNode}}
 */
export function Layout({children}) {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>

      {/* Applied global off-white background and sleek text selection colors */}
      <body className="bg-[#FAFAFA] text-black selection:bg-black selection:text-white antialiased">
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  /** @type {RootLoader | undefined} */
  const data = useRouteLoaderData('root');

  if (!data) return <Outlet />;

  const hasValidAnalytics = Boolean(data.consent?.checkoutDomain && data.shop);

  if (hasValidAnalytics) {
    return (
      <Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>
        <PageLayout {...data}>
          <Outlet />
        </PageLayout>
      </Analytics.Provider>
    );
  }

  return (
    <PageLayout {...data}>
      <Outlet />
    </PageLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LUXURY ERROR BOUNDARY (404s & Crashes)
   ═══════════════════════════════════════════════════════════════ */
export function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred.';
  let errorStatus = 500;
  let is404 = false;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
    is404 = error.status === 404;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  // Fallback friendly message for 404s
  const displayMessage = is404 
    ? "We couldn't find the page you were looking for. It may have been moved or no longer exists." 
    : errorMessage;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{is404 ? 'Page Not Found | VALORAERPY' : 'Error | VALORAERPY'}</title>
        <Meta />
        <Links />
      </head>

      <body className="bg-[#FAFAFA] text-black selection:bg-black selection:text-white antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
          
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
            Error {errorStatus}
          </p>

          <h1 className="mb-6 text-5xl font-light leading-tight tracking-tight text-black sm:text-7xl font-serif">
            {is404 ? 'Page Not Found' : 'Something went wrong'}
          </h1>

          <p className="mx-auto mb-12 max-w-md text-sm font-light leading-relaxed text-gray-500 font-sans">
            {displayMessage}
          </p>

          <a
            href="/"
            className="group flex items-center justify-center gap-4 rounded-full bg-black px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 hover:bg-gray-900"
          >
            Return to Homepage
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </a>

          {!is404 && (
            <div className="mx-auto mt-16 max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm text-left">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Developer Details</p>
              </div>
              <pre className="overflow-x-auto p-6 text-[11px] leading-relaxed text-gray-600 font-mono">
                {errorMessage}
              </pre>
            </div>
          )}
          
        </main>
        <Scripts />
      </body>
    </html>
  );
}

/** @typedef {Awaited<ReturnType<typeof loader>>} RootLoader */
/** @typedef {import('react-router').ShouldRevalidateFunction} ShouldRevalidateFunction */
/** @typedef {import('./+types/root').Route} Route */