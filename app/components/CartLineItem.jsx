import {CartForm, Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import {motion} from 'framer-motion';

export function CartLineItem({layout, line, childrenMap}) {
  const {id, merchandise, isOptimistic} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];

  return (
    <motion.li
      layout
      initial={{opacity: 0, scale: 0.98}}
      animate={{opacity: isOptimistic ? 0.5 : 1, scale: 1}}
      exit={{opacity: 0, scale: 0.95, height: 0, overflow: 'hidden'}}
      transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
      className="flex flex-col gap-4 border-b border-gray-100 pb-6 last:border-none last:pb-0"
    >
      <div className="flex gap-6">
        {image ? (
          <Link to={lineItemUrl} onClick={layout === 'aside' ? close : undefined} className="group relative shrink-0">
            <div className="overflow-hidden rounded-2xl bg-gray-100">
              <Image
                alt={title}
                aspectRatio="3/4"
                data={image}
                width={layout === 'aside' ? 96 : 140}
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
            </div>
          </Link>
        ) : (
          <div className={`shrink-0 rounded-2xl bg-gray-100 ${layout === 'aside' ? 'w-24' : 'w-[140px]'} aspect-[3/4]`} />
        )}

        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
            <div>
              <Link to={lineItemUrl} onClick={layout === 'aside' ? close : undefined} className="group inline-block">
                <h3 className="text-base font-medium text-black group-hover:underline underline-offset-4 font-serif">
                  {product.title}
                </h3>
              </Link>
              
              <ul className="mt-1 flex flex-col gap-0.5">
                {selectedOptions.map((option) => (
                  <li key={option.name} className="text-[11px] uppercase tracking-wider text-gray-500">
                    <span className="font-semibold text-black">{option.name}:</span> {option.value}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-right text-sm font-semibold text-black">
              <ProductPrice price={line?.cost?.totalAmount} />
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <CartLineQuantity line={line} />
            <CartLineRemoveButton lineIds={[id]} disabled={!!isOptimistic} />
          </div>
        </div>
      </div>

      {lineItemChildren && (
        <ul className="ml-24 mt-2 flex flex-col gap-2 rounded-xl bg-gray-50 p-4">
          {lineItemChildren.map((childLine) => (
            <CartLineItem
              childrenMap={childrenMap}
              key={childLine.id}
              line={childLine}
              layout={layout}
            />
          ))}
        </ul>
      )}
    </motion.li>
  );
}

function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-4">
      <div className="inline-flex h-9 items-center rounded-full border border-gray-200 bg-white">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-black disabled:opacity-30"
          >
            <span className="text-lg leading-none mt-[-2px]">&minus;</span>
          </button>
        </CartLineUpdateButton>

        <span className="flex w-6 items-center justify-center text-[12px] font-semibold text-black">
          {quantity}
        </span>

        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            aria-label="Increase quantity"
            disabled={!!isOptimistic}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-black disabled:opacity-30"
          >
            <span className="text-lg leading-none mt-[-2px]">&#43;</span>
          </button>
        </CartLineUpdateButton>
      </div>
    </div>
  );
}

function CartLineRemoveButton({lineIds, disabled}) {
  return (
    <CartForm fetcherKey={getUpdateKey(lineIds)} route="/cart" action={CartForm.ACTIONS.LinesRemove} inputs={{lineIds}}>
      <button disabled={disabled} type="submit" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 transition-colors hover:text-red-800 disabled:opacity-50 underline underline-offset-4">
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({children, lines}) {
  const lineIds = lines.map((line) => line.id);
  return (
    <CartForm fetcherKey={getUpdateKey(lineIds)} route="/cart" action={CartForm.ACTIONS.LinesUpdate} inputs={{lines}}>
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}