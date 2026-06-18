import {Money} from '@shopify/hydrogen';
import {motion, AnimatePresence} from 'framer-motion';

/**
 * @param {{
 *   price?: MoneyV2;
 *   compareAtPrice?: MoneyV2 | null;
 * }}
 */
export function ProductPrice({price, compareAtPrice}) {
  const priceAmount = parseFloat(price?.amount || '0');
  const compareAmount = parseFloat(compareAtPrice?.amount || '0');
  const isOnSale = compareAtPrice && compareAmount > priceAmount;

  return (
    <div aria-label="Price" role="group" className="relative flex items-center">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={price?.amount || 'empty'}
          initial={{opacity: 0, y: 4}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -4}}
          transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
          className="flex flex-wrap items-baseline gap-2.5"
        >
          {isOnSale ? (
            <>
              <span className="font-sans font-medium tracking-wide text-red-800">
                {price ? <Money data={price} /> : null}
              </span>
              <s className="font-sans text-[0.85em] font-light tracking-wide text-gray-400 decoration-gray-300">
                <Money data={compareAtPrice} />
              </s>
            </>
          ) : price ? (
            <span className="font-sans font-medium tracking-wide text-black">
              <Money data={price} />
            </span>
          ) : (
            <span className="font-sans text-sm font-light tracking-widest text-gray-400 uppercase">
              Unavailable
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */