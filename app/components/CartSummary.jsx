import {CartForm, Money} from '@shopify/hydrogen';
import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher} from 'react-router';
import {motion} from 'framer-motion';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const isPage = layout === 'page';
  const summaryId = useId();
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();
  const giftCardHeadingId = useId();
  const giftCardInputId = useId();

  return (
    <div
      aria-labelledby={summaryId}
      className={`flex flex-col gap-6 ${
        isPage ? 'rounded-[24px] bg-gray-50 p-8 lg:sticky lg:top-32' : 'border-t border-gray-200 bg-white pt-6'
      }`}
    >
      <h4 id={summaryId} className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
        Order Summary
      </h4>

      <dl role="group" className="flex items-center justify-between text-xl font-light font-serif sm:text-2xl">
        <dt>Subtotal</dt>
        <dd className="font-medium">
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>

      <div className="h-px w-full bg-gray-200" />

      <div className="flex flex-col gap-4">
        <CartDiscounts
          discountCodes={cart?.discountCodes}
          discountsHeadingId={discountsHeadingId}
          discountCodeInputId={discountCodeInputId}
        />
        <CartGiftCard
          giftCardCodes={cart?.appliedGiftCards}
          giftCardHeadingId={giftCardHeadingId}
          giftCardInputId={giftCardInputId}
        />
      </div>

      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-4">
      <a href={checkoutUrl} target="_self" className="block w-full">
        <motion.div
          whileHover={{scale: 1.02}}
          whileTap={{scale: 0.98}}
          className="group flex w-full items-center justify-center gap-4 rounded-full bg-black px-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-gray-900"
        >
          Proceed to Checkout
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </motion.div>
      </a>
    </div>
  );
}

function CartDiscounts({discountCodes, discountsHeadingId, discountCodeInputId}) {
  const codes = discountCodes?.filter((d) => d.applicable)?.map(({code}) => code) || [];

  return (
    <section aria-label="Discounts">
      <dl hidden={!codes.length}>
        <div className="mb-4">
          <dt id={discountsHeadingId} className="sr-only">Discounts</dt>
          <UpdateDiscountForm>
            <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3" role="group" aria-labelledby={discountsHeadingId}>
              <code className="text-xs font-semibold text-green-800">{codes?.join(', ')}</code>
              <button type="submit" className="text-[10px] font-bold uppercase tracking-wider text-green-700 hover:underline">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex items-center border-b border-gray-300 pb-2 transition-colors focus-within:border-black">
          <label htmlFor={discountCodeInputId} className="sr-only">Discount code</label>
          <input
            id={discountCodeInputId}
            type="text"
            name="discountCode"
            placeholder="Promo code"
            className="w-full bg-transparent text-xs font-medium tracking-wide outline-none placeholder:text-gray-400 uppercase"
          />
          <button type="submit" className="text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-60">
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </section>
  );
}

function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm route="/cart" action={CartForm.ACTIONS.DiscountCodesUpdate} inputs={{discountCodes: discountCodes || []}}>
      {children}
    </CartForm>
  );
}

function CartGiftCard({giftCardCodes, giftCardHeadingId, giftCardInputId}) {
  const giftCardCodeInput = useRef(null);
  const removeButtonRefs = useRef(new Map());
  const previousCardIdsRef = useRef([]);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const [removedCardIndex, setRemovedCardIndex] = useState(null);

  useEffect(() => {
    if (giftCardAddFetcher.data && giftCardCodeInput.current !== null) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  const handleRemoveClick = (cardId) => {
    const index = previousCardIdsRef.current.indexOf(cardId);
    if (index !== -1) setRemovedCardIndex(index);
  };

  return (
    <section aria-label="Gift cards">
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl className="mb-4 space-y-2">
          <dt id={giftCardHeadingId} className="sr-only">Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <dd key={giftCard.id} className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3">
              <RemoveGiftCardForm
                giftCardId={giftCard.id}
                lastCharacters={giftCard.lastCharacters}
                onRemoveClick={() => handleRemoveClick(giftCard.id)}
                buttonRef={(el) => { el ? removeButtonRefs.current.set(giftCard.id, el) : removeButtonRefs.current.delete(giftCard.id); }}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <span>***{giftCard.lastCharacters}</span>
                  <span className="text-gray-400">|</span>
                  <Money data={giftCard.amountUsed} />
                </div>
              </RemoveGiftCardForm>
            </dd>
          ))}
        </dl>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div className="flex items-center border-b border-gray-300 pb-2 transition-colors focus-within:border-black">
          <label htmlFor={giftCardInputId} className="sr-only">Gift card code</label>
          <input
            id={giftCardInputId}
            type="text"
            name="giftCardCode"
            placeholder="Gift card"
            ref={giftCardCodeInput}
            className="w-full bg-transparent text-xs font-medium tracking-wide outline-none placeholder:text-gray-400 uppercase"
          />
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-60 disabled:opacity-30"
          >
            Apply
          </button>
        </div>
      </AddGiftCardForm>
    </section>
  );
}

function AddGiftCardForm({fetcherKey, children}) {
  return <CartForm fetcherKey={fetcherKey} route="/cart" action={CartForm.ACTIONS.GiftCardCodesAdd}>{children}</CartForm>;
}

function RemoveGiftCardForm({giftCardId, lastCharacters, children, onRemoveClick, buttonRef}) {
  return (
    <CartForm route="/cart" action={CartForm.ACTIONS.GiftCardCodesRemove} inputs={{giftCardCodes: [giftCardId]}}>
      <div className="flex w-full items-center justify-between">
        {children}
        <button type="submit" onClick={onRemoveClick} ref={buttonRef} className="text-[10px] font-bold uppercase tracking-wider text-red-800 hover:underline">
          Remove
        </button>
      </div>
    </CartForm>
  );
}