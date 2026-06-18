import {Suspense, useState, useEffect, useRef, useCallback} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {motion, AnimatePresence} from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   HEADER CONFIG
   ═══════════════════════════════════════════════════════════════ */

const HEADER_CONFIG = {
  announcement: 'Free shipping on orders over $75 · New arrivals every week',
  logoSubtitle: 'Est. 2024',
  brandName: 'VALORAERPY',
};

export const FALLBACK_MENU = {
  id: 'main-menu',
  items: [
    {id: 'home', title: 'Home', url: '/', items: []},
    {id: 'new-arrivals', title: 'New Arrivals', url: '/collections/new-arrivals', items: []},
    {id: 'clothing', title: 'Clothing', url: '/collections/clothing', items: []},
    {id: 'bags', title: 'Bags', url: '/collections/bags', items: []},
    {id: 'women-watches', title: "Women's Watches", url: '/collections/womens-watches', items: []},
    {id: 'women-jewelry', title: "Women's Jewelry", url: '/collections/womens-jewelry', items: []},
    {id: 'beauty', title: 'Beauty', url: '/collections/beauty', items: []},
    {id: 'sale', title: 'Sale', url: '/collections/sale', items: []},
    {id: 'contact', title: 'Contact', url: '/pages/contact', items: []},
  ],
};

/* ═══════════════════════════════════════════════════════════════
   HEADER ROOT
   ═══════════════════════════════════════════════════════════════ */

export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  const [scrolled, setScrolled] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeMenu = isRealMenu(menu) ? menu : FALLBACK_MENU;

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
      {/* Announcement Bar */}
      <AnimatePresence>
        {announcementVisible && (
          <motion.div
            initial={{height: 'auto', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            className="relative flex items-center justify-center overflow-hidden bg-black px-10 py-2.5"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
              {HEADER_CONFIG.announcement}
            </p>
            <button
              type="button"
              onClick={() => setAnnouncementVisible(false)}
              className="absolute right-4 flex h-6 w-6 items-center justify-center text-white/50 transition-colors hover:text-white"
              aria-label="Dismiss announcement"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header Row */}
      <div className="relative mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-6 sm:px-12">
        {/* LEFT */}
        <div className="flex w-[120px] items-center">
          <div className="md:hidden"><HeaderMenuMobileToggle /></div>
          <div className="hidden md:block"><SearchToggle /></div>
        </div>

        {/* CENTER — Logo */}
        <NavLink
          prefetch="intent"
          to="/"
          end
          className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center group"
          aria-label={`${shop?.name || HEADER_CONFIG.brandName} — Return to homepage`}
        >
          <span className="text-2xl font-bold uppercase tracking-[0.25em] text-black font-serif sm:text-3xl transition-transform duration-500 group-hover:scale-105">
            {shop?.name || HEADER_CONFIG.brandName}
          </span>
          <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.4em] text-gray-400 font-sans transition-colors duration-500 group-hover:text-black">
            {HEADER_CONFIG.logoSubtitle}
          </span>
        </NavLink>

        {/* RIGHT */}
        <div className="flex w-[120px] items-center justify-end gap-3">
          <div className="md:hidden"><SearchToggle /></div>
          <NavLink
            to="/account"
            prefetch="intent"
            className="hidden h-10 w-10 items-center justify-center text-gray-500 transition-colors hover:text-black md:flex"
            aria-label={isLoggedIn ? 'My account' : 'Log in to your account'}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </NavLink>
          <CartToggle cart={cart} />
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden h-12 items-center justify-center border-t border-gray-100 md:flex" aria-label="Main navigation">
        <HeaderMenu
          menu={activeMenu}
          viewport="desktop"
          primaryDomainUrl={header?.shop?.primaryDomain?.url}
          publicStoreDomain={publicStoreDomain}
        />
      </nav>
      
      <div className="h-px w-full bg-gray-100" />
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HEADER MENU ROUTER
   ═══════════════════════════════════════════════════════════════ */

export function HeaderMenu({menu, primaryDomainUrl, viewport, publicStoreDomain}) {
  if (viewport === 'desktop') {
    return (
      <div className="flex h-full items-center gap-2">
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
    <div className="flex w-full flex-col pb-12">
      <div className="mb-4 border-b border-gray-200 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Navigation</p>
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

/* ═══════════════════════════════════════════════════════════════
   DESKTOP MENU ITEM — Animated Mega Dropdown
   ═══════════════════════════════════════════════════════════════ */

function DesktopMenuItem({item, primaryDomainUrl, publicStoreDomain}) {
  if (!item?.url) return null;

  const children = item.items || [];
  const hasChildren = children.length > 0;
  const url = safeParseUrl(item.url, publicStoreDomain, primaryDomainUrl);
  const isSale = item.title?.toLowerCase() === 'sale';
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Intent-based hover logic
  let timeout;
  const handleMouseEnter = () => { clearTimeout(timeout); setOpen(true); };
  const handleMouseLeave = () => { timeout = setTimeout(() => setOpen(false), 150); };

  return (
    <div ref={ref} className="relative flex h-full items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <NavLink
        end
        prefetch="intent"
        to={url}
        className={({isActive}) => `
          group relative flex h-full items-center gap-1.5 px-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors
          ${isSale ? 'text-red-800' : isActive ? 'text-black' : 'text-gray-500 hover:text-black'}
        `}
      >
        {item.title}
        {hasChildren && (
          <motion.svg animate={{rotate: open ? 180 : 0}} className="h-3 w-3 text-gray-400 transition-colors group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </motion.svg>
        )}
        <span className={`absolute bottom-0 left-4 right-4 h-[2px] bg-black transition-transform duration-300 ease-out ${open ? 'scale-x-100' : 'scale-x-0'}`} />
      </NavLink>

      {/* Mega Dropdown */}
      <AnimatePresence>
        {hasChildren && open && (
          <motion.div
            initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 10}}
            transition={{duration: 0.3, ease: [0.16, 1, 0.3, 1]}}
            className="absolute left-1/2 top-full z-[100] w-[850px] -translate-x-1/2 overflow-hidden rounded-b-[24px] border border-gray-100 bg-white p-10 shadow-2xl"
          >
            <div className="grid grid-cols-[1fr_1fr_300px] gap-12">
              <div>
                <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Shop {item.title}</p>
                <div className="flex flex-col gap-2">
                  {children.slice(0, Math.ceil(children.length / 2)).map((child) => (
                    <DropdownLink key={child.id} to={safeParseUrl(child.url, publicStoreDomain, primaryDomainUrl)}>
                      {child.title}
                    </DropdownLink>
                  ))}
                </div>
              </div>

              <div className="pt-[42px]">
                <div className="flex flex-col gap-2">
                  {children.slice(Math.ceil(children.length / 2)).map((child) => (
                    <DropdownLink key={child.id} to={safeParseUrl(child.url, publicStoreDomain, primaryDomainUrl)}>
                      {child.title}
                    </DropdownLink>
                  ))}
                </div>
              </div>

              <PromoCard url={url} title={item.title} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownLink({to, children}) {
  return (
    <NavLink
      to={to}
      prefetch="intent"
      className="group flex items-center gap-3 rounded-lg px-4 py-2.5 transition-colors hover:bg-gray-50"
    >
      <span className="h-1 w-1 shrink-0 rounded-full bg-gray-300 transition-colors group-hover:bg-black" />
      <span className="text-[15px] font-medium text-gray-600 transition-colors group-hover:text-black font-serif">
        {children}
      </span>
    </NavLink>
  );
}

function PromoCard({url, title}) {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-[20px] bg-black p-8 text-white">
      <div>
        <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.3em] text-white/50">Featured Edit</p>
        <h3 className="text-3xl font-light leading-tight font-serif">
          New Season<br /><em className="italic">{title}</em>
        </h3>
      </div>
      <div>
        <p className="mb-6 text-xs font-light text-white/70">Discover the latest arrivals and premium essentials.</p>
        <NavLink
          to={url}
          prefetch="intent"
          className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-transform hover:scale-105"
        >
          Shop Now
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </NavLink>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE MENU ITEM (Framer Motion Accordion)
   ═══════════════════════════════════════════════════════════════ */

function MobileMenuItem({item, primaryDomainUrl, publicStoreDomain}) {
  const {close} = useAside();
  const [open, setOpen] = useState(false);

  if (!item?.url) return null;

  const children = item.items || [];
  const hasChildren = children.length > 0;
  const url = safeParseUrl(item.url, publicStoreDomain, primaryDomainUrl);
  const isSale = item.title?.toLowerCase() === 'sale';

  return (
    <div className="border-b border-gray-100">
      <div className="flex items-center justify-between">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          to={url}
          className={({isActive}) => `flex flex-1 items-center py-5 text-xl font-medium font-serif transition-colors ${isSale ? 'text-red-800' : isActive ? 'text-black' : 'text-gray-600'}`}
        >
          {item.title}
        </NavLink>

        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-12 w-12 items-center justify-end text-gray-400"
            aria-label="Toggle submenu"
          >
            <motion.svg animate={{rotate: open ? 180 : 0}} className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && open && (
          <motion.div initial={{height: 0, opacity: 0}} animate={{height: 'auto', opacity: 1}} exit={{height: 0, opacity: 0}} className="overflow-hidden">
            <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4 mb-4">
              {children.map((child) => (
                <NavLink
                  key={child.id}
                  to={safeParseUrl(child.url, publicStoreDomain, primaryDomainUrl)}
                  prefetch="intent"
                  onClick={close}
                  className="flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-gray-600 transition-colors hover:text-black font-serif"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  {child.title}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ICONS & TOGGLES
   ═══════════════════════════════════════════════════════════════ */

function SearchToggle() {
  const {open} = useAside();
  return (
    <button onClick={() => open('search')} className="flex h-10 w-10 items-center justify-center text-gray-500 transition-colors hover:text-black">
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    </button>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button onClick={() => open('mobile')} className="flex h-10 w-10 items-center text-black">
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h10" />
      </svg>
    </button>
  );
}

function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  const handleClick = useCallback((e) => {
    e.preventDefault();
    open('cart');
    publish('cart_viewed', {cart, prevCart, shop, url: window.location.href || ''});
  }, [open, publish, cart, prevCart, shop]);

  return (
    <a href="/cart" onClick={handleClick} className="relative flex h-10 w-10 items-center justify-center text-gray-500 transition-colors hover:text-black">
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
      </svg>
      {count > 0 && (
        <span className="absolute right-0 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white ring-2 ring-white">
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

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

function isRealMenu(menu) {
  const items = menu?.items || [];
  if (items.length === 0) return false;
  if (items.length > 3) return true;
  const titles = new Set(items.map((i) => i.title?.toLowerCase().trim()));
  const defaultStub = new Set(['home', 'catalog', 'contact']);
  return ![...defaultStub].every((t) => titles.has(t));
}

function safeParseUrl(url, publicStoreDomain, primaryDomainUrl) {
  if (!url) return '/';
  if (url.startsWith('/')) return url;
  try {
    const {hostname, pathname, search} = new URL(url);
    const isShopify = hostname.endsWith('myshopify.com') || (publicStoreDomain && hostname.includes(publicStoreDomain)) || (primaryDomainUrl && url.startsWith(primaryDomainUrl));
    return isShopify ? `${pathname}${search}` : url;
  } catch {
    return `/${url}`.replace(/^\/\//, '/');
  }
}