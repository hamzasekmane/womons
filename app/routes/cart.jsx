import {useLoaderData, data, Link} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';
import {motion} from 'framer-motion';

export const meta = () => {
  return [{title: 'VALORAERPY | Shopping Bag'}];
};

export const headers = ({actionHeaders}) => actionHeaders;

export async function action({request, context}) {
  const {cart} = context;
  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) throw new Error('No action provided');

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
      result = await cart.updateBuyerIdentity({...inputs.buyerIdentity});
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

  return data({cart: cartResult, errors, warnings, analytics: {cartId}}, {status, headers});
}

export async function loader({context}) {
  const {cart} = context;
  return await cart.get();
}

export default function Cart() {
  const cart = useLoaderData();
  const hasItems = Boolean(cart?.totalQuantity && cart.totalQuantity > 0);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black">
      {/* Animated Header */}
      <motion.section 
        initial={{opacity: 0, y: -20}} 
        animate={{opacity: 1, y: 0}} 
        transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
        className="border-b border-gray-200 bg-white"
      >
        <div className="mx-auto max-w-[1200px] px-6 py-16 sm:px-12 sm:py-24">
          <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
            <Link to="/" className="transition-colors hover:text-black">Home</Link>
            <span>/</span>
            <span className="text-black">Bag</span>
          </div>

          <h1 className="text-4xl font-light tracking-tight text-black sm:text-6xl font-serif">
            Shopping Bag
          </h1>

          {hasItems && (
            <p className="mt-4 text-sm font-light text-gray-500 font-sans tracking-wide uppercase">
              {cart.totalQuantity} {cart.totalQuantity === 1 ? 'Item' : 'Items'} Selected
            </p>
          )}
        </div>
      </motion.section>

      {/* Cart Content */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 sm:px-12 sm:py-24">
        <motion.div 
          initial={{opacity: 0, y: 20}} 
          animate={{opacity: 1, y: 0}} 
          transition={{duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1]}}
        >
          <CartMain layout="page" cart={cart} />

          {!hasItems && (
            <div className="mx-auto max-w-md py-20 text-center">
              <p className="mb-8 text-lg font-light text-gray-500 font-sans">
                Your shopping bag is currently empty.
              </p>

              <Link
                to="/collections/all"
                className="group inline-flex items-center gap-4 rounded-full bg-black px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-400 hover:bg-gray-900 hover:tracking-[0.25em]"
              >
                Continue Shopping
                <motion.span className="transition-transform duration-300 group-hover:translate-x-1">→</motion.span>
              </Link>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}