import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {motion, AnimatePresence} from 'framer-motion';

function getLineItemChildrenMap(lines) {
  const children = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const childrenMap = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(childrenMap)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}

export function CartMain({layout, cart: originalCart}) {
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  const isPage = layout === 'page';

  return (
    <section aria-label={isPage ? 'Cart page' : 'Cart drawer'} className="flex h-full flex-col">
      {!cartHasItems ? (
        <CartEmpty hidden={linesCount} layout={layout} />
      ) : (
        <div className={`cart-details flex-1 ${isPage ? 'grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12' : 'flex flex-col'}`}>
          <div className={`${isPage ? '' : 'flex-1 overflow-y-auto hide-scroll pb-6'}`}>
            <p id="cart-lines" className="sr-only">Line items</p>
            <motion.ul aria-labelledby="cart-lines" className="flex flex-col gap-6">
              <AnimatePresence initial={false}>
                {(cart?.lines?.nodes ?? []).map((line) => {
                  if ('parentRelationship' in line && line.parentRelationship?.parent) return null;
                  return (
                    <CartLineItem
                      key={line.id}
                      line={line}
                      layout={layout}
                      childrenMap={childrenMap}
                    />
                  );
                })}
              </AnimatePresence>
            </motion.ul>
          </div>
          
          <div className={`${isPage ? '' : 'shrink-0 pt-4'}`}>
             <CartSummary cart={cart} layout={layout} />
          </div>
        </div>
      )}
    </section>
  );
}

function CartEmpty({hidden = false, layout}) {
  const {close} = useAside();
  return (
    <motion.div 
      hidden={hidden} 
      initial={{opacity: 0}} animate={{opacity: 1}}
      className={`flex h-full flex-col items-center justify-center text-center ${layout === 'aside' ? 'py-32' : 'py-20'}`}
    >
      <p className="mb-8 max-w-sm text-sm font-light leading-relaxed text-gray-500 font-sans">
        Your shopping bag is empty. Discover our latest collection.
      </p>
      <Link 
        to="/collections/all" 
        onClick={close} 
        prefetch="intent"
        className="group flex items-center gap-3 rounded-full border border-black px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-black hover:text-white"
      >
        Continue Shopping
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </motion.div>
  );
}