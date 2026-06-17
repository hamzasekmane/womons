import {Suspense, useState, useEffect, useRef} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

/* ═══════════════════════════════════════════════════
   HEADER CONFIG — edit copy here, not in components
═══════════════════════════════════════════════════ */

const HEADER_CONFIG = {
  announcement: 'Free shipping on orders over $75 · New arrivals every week',
  logoSubtitle: 'Est. 2024',
  brandName: 'VALORAERPY',
};

/* ═══════════════════════════════════════════════════
   FALLBACK MENU — shown when no Shopify menu is linked
═══════════════════════════════════════════════════ */

export const FALLBACK_MENU = {
  id: 'main-menu',
  items: [
    {
      id: 'home',
      title: 'Home',
      url: '/',
      items: [],
    },
    {
      id: 'new-arrivals',
      title: 'New Arrivals',
      url: '/collections/new-arrivals',
      items: [],
    },
    {
      id: 'clothing',
      title: 'Clothing',
      url: '/collections/clothing',
      items: [],
    },
    {
      id: 'bags',
      title: 'Bags',
      url: '/collections/bags',
      items: [],
    },
    {
      id: 'women-watches',
      title: "Women's Watches",
      url: '/collections/womens-watches',
      items: [],
    },
    {
      id: 'women-jewelry',
      title: "Women's Jewelry",
      url: '/collections/womens-jewelry',
      items: [],
    },
    {
      id: 'beauty',
      title: 'Beauty',
      url: '/collections/beauty',
      items: [],
    },
    {
      id: 'sale',
      title: 'Sale',
      url: '/collections/sale',
      items: [],
    },
    {
      id: 'contact',
      title: 'Contact',
      url: '/pages/contact',
      items: [],
    },
  ],
};

/* ═══════════════════════════════════════════════════
   HEADER
═══════════════════════════════════════════════════ */

export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  const [scrolled, setScrolled] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Use the Shopify menu if it has real content, otherwise fall back
  const activeMenu = isRealMenu(menu) ? menu : FALLBACK_MENU;

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'white',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 1px 20px rgba(27,42,61,0.08)' : 'none',
      }}
    >
      {/* ── Announcement Bar ── */}
      {announcementVisible && (
        <div
          role="banner"
          className="relative flex items-center justify-center px-10 py-2.5"
          style={{background: '#1B2A3D'}}
        >
          <p
            className="text-[11px] uppercase tracking-[0.25em] text-white/60"
            style={{fontFamily: 'sans-serif'}}
          >
            {HEADER_CONFIG.announcement}
          </p>
          <button
            type="button"
            onClick={() => setAnnouncementVisible(false)}
            className="absolute right-4 flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-60"
            style={{color: 'rgba(255,255,255,0.5)'}}
            aria-label="Dismiss announcement"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Main Header Row ── */}
      <div className="relative mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-6 md:px-10">
        {/* LEFT */}
        <div className="flex w-[120px] items-center">
          <div className="md:hidden">
            <HeaderMenuMobileToggle />
          </div>
          <div className="hidden md:block">
            <SearchToggle />
          </div>
        </div>

        {/* CENTER — Logo */}
        <NavLink
          prefetch="intent"
          to="/"
          end
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
          style={{textDecoration: 'none'}}
          aria-label={`${shop?.name || HEADER_CONFIG.brandName} — Home`}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: '#1B2A3D',
              fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
              fontWeight: '700',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            {shop?.name || HEADER_CONFIG.brandName}
          </span>
          <span
            style={{
              fontSize: '8px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(27,42,61,0.35)',
              marginTop: '3px',
              fontFamily: 'sans-serif',
            }}
          >
            {HEADER_CONFIG.logoSubtitle}
          </span>
        </NavLink>

        {/* RIGHT */}
        <div className="flex w-[120px] items-center justify-end gap-1">
          <div className="md:hidden">
            <SearchToggle />
          </div>
          <NavLink
            to="/account"
            className="hidden h-10 w-10 items-center justify-center transition-colors md:flex"
            style={{color: 'rgba(27,42,61,0.5)', textDecoration: 'none'}}
            aria-label={isLoggedIn ? 'My account' : 'Log in'}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#1B2A3D')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(27,42,61,0.5)')}
          >
            <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </NavLink>
          <CartToggle cart={cart} />
        </div>
      </div>

      {/* ── Desktop Nav ── */}
      <nav
        className="hidden md:flex h-10 items-center justify-center"
        aria-label="Main navigation"
        style={{borderTop: '1px solid rgba(27,42,61,0.06)'}}
      >
        <HeaderMenu
          menu={activeMenu}
          viewport="desktop"
          primaryDomainUrl={header?.shop?.primaryDomain?.url}
          publicStoreDomain={publicStoreDomain}
        />
      </nav>

      <div style={{height: '1px', background: 'rgba(27,42,61,0.07)'}} />
    </header>
  );
}

/* ═══════════════════════════════════════════════════
   HEADER MENU ROUTER
═══════════════════════════════════════════════════ */

export function HeaderMenu({menu, primaryDomainUrl, viewport, publicStoreDomain}) {
  if (viewport === 'desktop') {
    return (
      <div className="flex h-full items-center">
        {menu.items.map((item) => (
          <DesktopMenuItem
            key={item.id}
            item={item}
            primaryDomainUrl={primaryDomainUrl}
            publicStoreDomain={publicStoreDomain}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <div
        className="mb-2 px-5 py-4"
        style={{borderBottom: '1px solid rgba(27,42,61,0.07)'}}
      >
        <p
          style={{
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(27,42,61,0.35)',
            fontFamily: 'sans-serif',
          }}
        >
          Navigation
        </p>
      </div>
      {menu.items.map((item) => (
        <MobileMenuItem
          key={item.id}
          item={item}
          primaryDomainUrl={primaryDomainUrl}
          publicStoreDomain={publicStoreDomain}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DESKTOP MENU ITEM — mega dropdown
═══════════════════════════════════════════════════ */

function DesktopMenuItem({item, primaryDomainUrl, publicStoreDomain}) {
  if (!item?.url) return null;

  const children = item.items || [];
  const hasChildren = children.length > 0;
  const url = safeParseUrl(item.url, publicStoreDomain, primaryDomainUrl);
  const isSale = item.title?.toLowerCase() === 'sale';
  const dropdownId = `dropdown-${item.id}`;
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div
      ref={ref}
      className="relative h-full flex items-center"
      onMouseEnter={() => hasChildren && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <NavLink
        end
        prefetch="intent"
        to={url}
        aria-haspopup={hasChildren ? 'true' : undefined}
        aria-expanded={hasChildren ? open : undefined}
        aria-controls={hasChildren ? dropdownId : undefined}
        className="relative flex h-full items-center gap-1 px-3.5"
        style={({isActive}) => ({
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: 'sans-serif',
          color: isSale
            ? '#C0392B'
            : isActive
            ? '#1B2A3D'
            : 'rgba(27,42,61,0.52)',
          textDecoration: 'none',
          transition: 'color 0.2s',
        })}
      >
        {item.title}

        {hasChildren && (
          <svg
            width="9"
            height="9"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
            style={{
              opacity: 0.45,
              marginTop: '1px',
              transform: open ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s',
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}

        {/* Active underline */}
        <span
          className="absolute bottom-0 left-3.5 right-3.5 h-[2px] transition-opacity duration-200"
          style={{
            background: '#1B2A3D',
            opacity: open ? 1 : 0,
          }}
        />
      </NavLink>

      {/* Mega Dropdown */}
      {hasChildren && (
        <div
          id={dropdownId}
          role="region"
          aria-label={`${item.title} submenu`}
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '780px',
            background: 'white',
            boxShadow: '0 24px 80px rgba(27,42,61,0.13)',
            border: '1px solid rgba(27,42,61,0.06)',
            borderRadius: '0 0 24px 24px',
            padding: '36px',
            zIndex: 100,
            pointerEvents: open ? 'auto' : 'none',
            opacity: open ? 1 : 0,
            visibility: open ? 'visible' : 'hidden',
            transition: 'opacity 0.2s ease, visibility 0.2s ease',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 280px',
              gap: '40px',
            }}
          >
            {/* Column 1 */}
            <div>
              <p
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(27,42,61,0.35)',
                  fontWeight: '600',
                  marginBottom: '16px',
                  fontFamily: 'sans-serif',
                }}
              >
                Shop {item.title}
              </p>
              <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                {children
                  .slice(0, Math.ceil(children.length / 2))
                  .map((child) => (
                    <DropdownLink
                      key={child.id}
                      to={safeParseUrl(child.url, publicStoreDomain, primaryDomainUrl)}
                    >
                      {child.title}
                    </DropdownLink>
                  ))}
              </div>
            </div>

            {/* Column 2 */}
            <div style={{paddingTop: '29px'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                {children
                  .slice(Math.ceil(children.length / 2))
                  .map((child) => (
                    <DropdownLink
                      key={child.id}
                      to={safeParseUrl(child.url, publicStoreDomain, primaryDomainUrl)}
                    >
                      {child.title}
                    </DropdownLink>
                  ))}
              </div>
            </div>

            {/* Column 3 — Promo Card */}
            <PromoCard url={url} title={item.title} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Dropdown Link ── */
function DropdownLink({to, children}) {
  return (
    <NavLink
      to={to}
      prefetch="intent"
      className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-150"
      style={{textDecoration: 'none', background: 'transparent'}}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(27,42,61,0.04)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <span
        aria-hidden="true"
        style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'rgba(27,42,61,0.2)',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '15px',
          color: 'rgba(27,42,61,0.65)',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#1B2A3D')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(27,42,61,0.65)')}
      >
        {children}
      </span>
    </NavLink>
  );
}

/* ── Promo Card (flat, no gradient) ── */
function PromoCard({url, title}) {
  return (
    <div
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#1B2A3D',
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '220px',
      }}
    >
      <div>
        <p
          style={{
            fontSize: '9px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: '600',
            marginBottom: '10px',
            fontFamily: 'sans-serif',
          }}
        >
          Featured
        </p>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '22px',
            fontWeight: '400',
            color: 'white',
            lineHeight: '1.35',
          }}
        >
          New Season
          <br />
          <em>{title}</em>
        </h3>
      </div>

      <div>
        <p
          style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.45)',
            marginBottom: '14px',
            fontFamily: 'sans-serif',
          }}
        >
          Discover the latest arrivals
        </p>
        <NavLink
          to={url}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'white',
            color: '#1B2A3D',
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '10px 18px',
            borderRadius: '999px',
            textDecoration: 'none',
            fontFamily: 'sans-serif',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Shop Now
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </NavLink>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MOBILE MENU ITEM
═══════════════════════════════════════════════════ */

function MobileMenuItem({item, primaryDomainUrl, publicStoreDomain}) {
  const {close} = useAside();
  const [open, setOpen] = useState(false);

  if (!item?.url) return null;

  const children = item.items || [];
  const hasChildren = children.length > 0;
  const url = safeParseUrl(item.url, publicStoreDomain, primaryDomainUrl);
  const isSale = item.title?.toLowerCase() === 'sale';
  const subId = `mobile-sub-${item.id}`;

  return (
    <div style={{borderBottom: '1px solid rgba(27,42,61,0.06)'}}>
      <div className="flex items-center justify-between">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          to={url}
          className="flex flex-1 items-center gap-3 px-5 py-4"
          style={({isActive}) => ({
            textDecoration: 'none',
            color: isSale ? '#C0392B' : isActive ? '#1B2A3D' : 'rgba(27,42,61,0.72)',
          })}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '17px',
              fontWeight: '500',
            }}
          >
            {item.title}
          </span>
        </NavLink>

        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? `Collapse ${item.title}` : `Expand ${item.title}`}
            aria-expanded={open}
            aria-controls={subId}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '52px',
              height: '52px',
              color: 'rgba(27,42,61,0.4)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              padding: 0,
            }}
          >
            <svg
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
              style={{
                transform: open ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.25s ease',
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {hasChildren && open && (
        <div
          id={subId}
          role="region"
          style={{
            background: 'rgba(27,42,61,0.02)',
            borderTop: '1px solid rgba(27,42,61,0.04)',
            paddingTop: '4px',
            paddingBottom: '8px',
          }}
        >
          {children.map((child) => {
            const childUrl = safeParseUrl(child.url, publicStoreDomain, primaryDomainUrl);
            return (
              <NavLink
                key={child.id}
                to={childUrl}
                prefetch="intent"
                onClick={close}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 20px 10px 28px',
                  textDecoration: 'none',
                  color: 'rgba(27,42,61,0.6)',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '15px',
                  minHeight: '44px', // accessibility: minimum touch target
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'rgba(27,42,61,0.2)',
                    flexShrink: 0,
                  }}
                />
                {child.title}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SEARCH TOGGLE
═══════════════════════════════════════════════════ */

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      type="button"
      onClick={() => open('search')}
      aria-label="Search"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        color: 'rgba(27,42,61,0.5)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '50%',
        transition: 'color 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#1B2A3D')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(27,42,61,0.5)')}
    >
      <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   MOBILE MENU TOGGLE
═══════════════════════════════════════════════════ */

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      type="button"
      onClick={() => open('mobile')}
      aria-label="Open navigation menu"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        color: '#1B2A3D',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
        <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h10" />
      </svg>
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   CART
═══════════════════════════════════════════════════ */

function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="relative flex h-10 w-10 items-center justify-center transition-colors"
      style={{color: 'rgba(27,42,61,0.5)', textDecoration: 'none'}}
      aria-label={`Open cart, ${count} item${count !== 1 ? 's' : ''}`}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#1B2A3D')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(27,42,61,0.5)')}
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
      </svg>

      {count > 0 && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            minWidth: '15px',
            height: '15px',
            padding: '0 3px',
            background: '#1B2A3D',
            color: 'white',
            fontSize: '8.5px',
            fontWeight: '700',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'sans-serif',
            lineHeight: 1,
            boxShadow: '0 0 0 2px white',
          }}
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </a>
  );
}

function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */

/**
 * Returns true if the Shopify menu has real custom items —
 * i.e. it isn't the default 3-item stub (Home / Catalog / Contact).
 */
function isRealMenu(menu) {
  const items = menu?.items || [];
  if (items.length === 0) return false;
  if (items.length > 3) return true;

  const titles = new Set(items.map((i) => i.title?.toLowerCase().trim()));
  const defaultStub = new Set(['home', 'catalog', 'contact']);
  const isStub = [...defaultStub].every((t) => titles.has(t));
  return !isStub;
}

/**
 * Converts any Shopify storefront URL to a relative path,
 * leaving external URLs untouched.
 */
function safeParseUrl(url, publicStoreDomain, primaryDomainUrl) {
  if (!url) return '/';
  if (url.startsWith('/')) return url;

  try {
    const {hostname, pathname, search} = new URL(url);
    const isShopify =
      hostname.endsWith('myshopify.com') ||
      (publicStoreDomain && hostname.includes(publicStoreDomain)) ||
      (primaryDomainUrl && url.startsWith(primaryDomainUrl));

    return isShopify ? `${pathname}${search}` : url;
  } catch {
    return `/${url}`.replace(/^\/\//, '/');
  }
}

/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */