import {NavLink} from 'react-router';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerMenu, header, publicStoreDomain}) {
  const shopName = header?.shop?.name || 'VALORAERPY';

  return (
    <footer className="bg-[#2A221B] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3
              className="text-2xl text-white/90 tracking-[0.15em] mb-3"
              style={{fontFamily: "'Cormorant Garamond', serif"}}
            >
              {shopName}
            </h3>
            <p className="text-sm text-white/30 leading-relaxed max-w-xs mx-auto md:mx-0">
              Premium fashion & accessories crafted with care.
              Quality you can see, value you can feel.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#A89279] mb-5">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2" role="navigation">
              {[
                {title: 'Shop All', url: '/collections/all'},
                {title: 'New Arrivals', url: '/collections/new-arrivals'},
                {title: 'About Us', url: '/pages/about'},
                {title: 'Contact', url: '/pages/contact'},
              ].map((link) => (
                <NavLink
                  key={link.url}
                  to={link.url}
                  prefetch="intent"
                  className="text-sm text-white/40 hover:text-white transition-colors duration-200"
                >
                  {link.title}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Policies */}
          <div className="text-center md:text-right">
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#A89279] mb-5">
              Help & Info
            </h4>
            <FooterMenu
              menu={footerMenu}
              primaryDomainUrl={header?.shop?.primaryDomain?.url || ''}
              publicStoreDomain={publicStoreDomain || ''}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} {shopName}. All rights reserved.
          </p>

          {/* Payment icons placeholder */}
          <div className="flex items-center gap-3">
            {['Visa', 'MC', 'Amex', 'PayPal'].map((card) => (
              <span
                key={card}
                className="text-[10px] text-white/20 px-2 py-1 border border-white/[0.06] rounded"
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

function FooterMenu({menu, primaryDomainUrl, publicStoreDomain}) {
  const menuItems = menu?.items || FALLBACK_FOOTER_MENU.items || [];

  return (
    <nav className="flex flex-col gap-2" role="navigation">
      {menuItems.map((item) => {
        if (!item.url) return null;

        const url = getRelativeUrl(
          item.url,
          publicStoreDomain,
          primaryDomainUrl,
        );

        const isExternal = !url.startsWith('/');

        return isExternal ? (
          <a
            href={url}
            key={item.id}
            rel="noopener noreferrer"
            target="_blank"
            className="text-sm text-white/40 hover:text-white transition-colors duration-200"
          >
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            to={url}
            className="text-sm text-white/40 hover:text-white transition-colors duration-200"
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function getRelativeUrl(url, publicStoreDomain, primaryDomainUrl) {
  if (!url) return '/';
  if (url.startsWith('/')) return url;

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    if (
      (publicStoreDomain &&
        hostname.includes(
          publicStoreDomain.replace(/^https?:\/\//, ''),
        )) ||
      (primaryDomainUrl &&
        hostname.includes(
          primaryDomainUrl.replace(/^https?:\/\//, ''),
        )) ||
      hostname.includes('myshopify.com')
    ) {
      return parsedUrl.pathname;
    }

    return url;
  } catch (e) {
    return `/${url}`.replace(/^\/\//, '/');
  }
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'footer-privacy',
      title: 'Privacy Policy',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'footer-refund',
      title: 'Refund Policy',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'footer-shipping',
      title: 'Shipping Policy',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'footer-terms',
      title: 'Terms of Service',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

/** @typedef {Object} FooterProps */
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */