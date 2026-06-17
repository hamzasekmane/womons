import {useLoaderData, data, Link} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'VALORA | Cart'}];
};

/**
 * @type {HeadersFunction}
 */
export const headers = ({actionHeaders}) => actionHeaders;

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      const discountCodes = formDiscountCode ? [formDiscountCode] : [];
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesAdd: {
      const formGiftCardCode = inputs.giftCardCode;

      const giftCardCodes = formGiftCardCode ? [formGiftCardCode] : [];

      result = await cart.addGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes;
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {cart} = context;
  return await cart.get();
}

export default function Cart() {
  /** @type {LoaderReturnData} */
  const cart = useLoaderData();

  const hasItems = Boolean(cart?.totalQuantity && cart.totalQuantity > 0);

  return (
    <div className="min-h-screen bg-white text-[#1B2A3D]">
      {/* Header */}
      <section className="border-b border-[#1B2A3D]/10 bg-[#F7F4F0]">
        <div className="mx-auto max-w-[1200px] px-6 py-12 sm:px-10 sm:py-16">
          <div
            className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#1B2A3D]/40"
            style={{fontFamily: 'sans-serif'}}
          >
            <Link to="/" className="transition-colors hover:text-[#1B2A3D]">
              Home
            </Link>
            <span>/</span>
            <span>Cart</span>
          </div>

          <h1
            className="text-4xl font-light tracking-tight text-[#1B2A3D] sm:text-5xl"
            style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}
          >
            Shopping Bag
          </h1>

          {hasItems ? (
            <p
              className="mt-2 text-sm text-[#1B2A3D]/55"
              style={{fontFamily: 'sans-serif'}}
            >
              {cart.totalQuantity}{' '}
              {cart.totalQuantity === 1 ? 'item' : 'items'} in your bag
            </p>
          ) : null}
        </div>
      </section>

      {/* Cart Content */}
      <section className="mx-auto max-w-[1200px] px-6 py-10 sm:px-10 sm:py-14">
        <CartMain layout="page" cart={cart} />

        {!hasItems ? (
          <div className="mx-auto max-w-md py-16 text-center">
            <p
              className="mb-6 text-base text-[#1B2A3D]/55"
              style={{fontFamily: 'sans-serif'}}
            >
              Your shopping bag is empty.
            </p>

            <Link
              to="/collections/all"
              className="inline-flex items-center gap-3 bg-[#1B2A3D] px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-[#26384f]"
            >
              Continue Shopping
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : null}
      </section>
    </div>
  );
}

/** @typedef {import('react-router').HeadersFunction} HeadersFunction */
/** @typedef {import('./+types/cart').Route} Route */
/** @typedef {import('@shopify/hydrogen').CartQueryDataReturn} CartQueryDataReturn */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */