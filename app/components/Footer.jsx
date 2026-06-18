import {NavLink} from 'react-router';

/* ═══════════════════════════════════════════════════════════════
   FALLBACK FOOTER MENU
   ═══════════════════════════════════════════════════════════════ */

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {id: 'footer-privacy', title: 'Privacy Policy', url: '/policies/privacy-policy', items: []},
    {id: 'footer-refund', title: 'Refund Policy', url: '/policies/refund-policy', items: []},
    {id: 'footer-shipping', title: 'Shipping Policy', url: '/policies/shipping-policy', items: []},
    {id: 'footer-terms', title: 'Terms of Service', url: '/policies/terms-of-service', items: []},
  ],
};

const QUICK_LINKS = [
  {title: 'Shop All', url: '/collections/all'},
  {title: 'New Arrivals', url: '/collections/new-arrivals'},
  {title: 'About Us', url: '/pages/about'},
  {title: 'Contact', url: '/pages/contact'},
];

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Amex', 'PayPal'];

/* ═══════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════ */

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerMenu, header, publicStoreDomain}) {
  const shopName = header?.shop?.name || 'VALORAERPY';

  return (
    <footer
      className="bg-[#2A221B] mt-auto"
      aria-labelledby="footer-heading"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div
            className="text-center md:text-left"
            itemScope
            itemType="https://schema.org/Organization"
          >
            <h3
              className="text-2xl text-white/90 tracking-[0.15em] mb-3"
              style={{fontFamily: "'Cormorant Garamond', serif"}}
              itemProp="name"
            >
              {shopName}
            </h3>
            <p className="text-sm text-white/30 leading-relaxed max-w-xs mx-auto md:mx-0" itemProp="description">
              Premium fashion & accessories crafted with care.
              Quality you can see, value you can feel.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#A89279] mb-5">
              Quick Links
            </h3>
            <nav aria-label="Quick links">
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                {QUICK_LINKS.map((link) => (
                  <li key={link.url}>
                    <NavLink
                      to={link.url}
                      prefetch="intent"
                      className="text-sm text-white/40 hover:text-white transition-colors duration-200"
                      style={{textDecoration: 'none'}}
                    >
                      {link.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Policies */}
          <div className="text-center md:text-right">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#A89279] mb-5">
              Help & Info
            </h3>
            <FooterMenu
              menu={footerMenu}
              primaryDomainUrl={header?.shop?.primaryDomain?.url || ''}
              publicStoreDomain={publicStoreDomain || ''}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" aria-hidden="true" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-white/20">
            <small>© {new Date().getFullYear()} {shopName}. All rights reserved.</small>
          </p>

          {/* Payment icons */}
          <div className="flex items-center gap-3" aria-label="Accepted payment methods">
            {PAYMENT_METHODS.map((card) => (
              <span
                key={card}
                className="text-[10px] text-white/20 px-2 py-1 border border-white/[0.06] rounded"
                aria-label={card}
              >
                {card}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER MENU
   ═══════════════════════════════════════════════════════════════ */

function FooterMenu({menu, primaryDomainUrl, publicStoreDomain}) {
  const menuItems = menu?.items?.length ? menu.items : FALLBACK_FOOTER_MENU.items;

  return (
    <nav aria-label="Help and policies">
      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        {menuItems.map((item) => {
          if (!item.url) return null;

          const url = getRelativeUrl(item.url, publicStoreDomain, primaryDomainUrl);
          const isExternal = !url.startsWith('/');

          return (
            <li key={item.id}>
              {isExternal ? (
                <a
                  href={url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-sm text-white/40 hover:text-white transition-colors duration-200"
                  style={{textDecoration: 'none'}}
                >
                  {item.title}
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              ) : (
                <NavLink
                  end
                  prefetch="intent"
                  to={url}
                  className="text-sm text-white/40 hover:text-white transition-colors duration-200"
                  style={{textDecoration: 'none'}}
                >
                  {item.title}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HELPER
   ═══════════════════════════════════════════════════════════════ */

function getRelativeUrl(url, publicStoreDomain, primaryDomainUrl) {
  if (!url) return '/';
  if (url.startsWith('/')) return url;

  try {
    const {hostname, pathname} = new URL(url);

    const cleanPublic = publicStoreDomain?.replace(/^https?:\/\//, '') || '';
    const cleanPrimary = primaryDomainUrl?.replace(/^https?:\/\//, '') || '';

    const isShopify =
      hostname.endsWith('myshopify.com') ||
      (cleanPublic && hostname.includes(cleanPublic)) ||
      (cleanPrimary && hostname.includes(cleanPrimary));

    return isShopify ? pathname : url;
  } catch {
    return `/${url}`.replace(/^\/\//, '/');
  }
}

/** @typedef {Object} FooterProps
 * @property {import('storefrontapi.generated').FooterQuery | null} footer
 * @property {import('storefrontapi.generated').HeaderQuery} header
 * @property {string} publicStoreDomain
 */