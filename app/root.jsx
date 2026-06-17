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
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },

    /**
     * CSS order is important:
     * 1. reset.css
     * 2. app.css because it contains Tailwind
     */
    {
      rel: 'stylesheet',
      href: resetStyles,
    },
    {
      rel: 'stylesheet',
      href: appStyles,
    },

    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: favicon,
    },
  ];
}

/**
 * Default SEO meta tags for the store.
 * Individual routes can override these with their own meta export.
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
    {
      property: 'og:title',
      content: 'VALORAERPY | Premium Fashion & Accessories',
    },
    {
      property: 'og:description',
      content:
        'Discover VALORAERPY premium fashion, refined essentials, luxury accessories, and timeless pieces designed for everyday elegance.',
    },
    {name: 'twitter:card', content: 'summary_large_image'},
    {
      name: 'twitter:title',
      content: 'VALORAERPY | Premium Fashion & Accessories',
    },
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
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  const {storefront} = context;

  const header = await storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu',
    },
  });

  return {header};
}

/**
 * Load data for rendering content below the fold.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const {storefront, customerAccount, cart} = context;

  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer',
      },
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

      <body>
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

  if (!data) {
    return <Outlet />;
  }

  const hasValidAnalytics = Boolean(data.consent?.checkoutDomain && data.shop);

  if (hasValidAnalytics) {
    return (
      <Analytics.Provider
        cart={data.cart}
        shop={data.shop}
        consent={data.consent}
      >
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

export function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body>
        <main className="min-h-screen bg-[#F7F4F0] px-6 py-16 text-[#1B2A3D]">
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
            <p
              className="mb-3 text-[11px] uppercase tracking-[0.25em] text-[#1B2A3D]/40"
              style={{fontFamily: 'sans-serif'}}
            >
              Route Error
            </p>

            <h1
              className="mb-2 text-4xl font-light text-[#1B2A3D]"
              style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
            >
              Oops
            </h1>

            <h2 className="mb-6 text-sm font-semibold text-[#1B2A3D]/60">
              Error {errorStatus}
            </h2>

            {errorMessage ? (
              <pre className="overflow-auto rounded-xl bg-[#F7F4F0] p-4 text-sm text-[#1B2A3D]/70">
                {errorMessage}
              </pre>
            ) : null}
          </div>
        </main>

        <Scripts />
      </body>
    </html>
  );
}

/** @typedef {Awaited<ReturnType<typeof loader>>} RootLoader */

/** @typedef {import('react-router').ShouldRevalidateFunction} ShouldRevalidateFunction */
/** @typedef {import('./+types/root').Route} Route */