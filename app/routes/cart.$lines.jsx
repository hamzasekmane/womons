import {redirect} from 'react-router';

/**
 * Automatically creates a new cart based on the URL and redirects straight to checkout.
 * Expected URL structure: /cart/<variant_id>:<quantity>
 * Multiple variants: /cart/41007289663544:1,41007289696312:2?discount=HYDROBOARD
 */
export async function loader({request, context, params}) {
  const {cart} = context;
  const {lines} = params;

  if (!lines) {
    return redirect('/cart');
  }

  const linesMap = lines
    .split(',')
    .map((line) => {
      const [variantId, rawQuantity] = line.split(':');
      const quantity = parseInt(rawQuantity, 10);

      if (!variantId || Number.isNaN(quantity) || quantity < 1) {
        return null;
      }

      return {
        merchandiseId: `gid://shopify/ProductVariant/${variantId}`,
        quantity,
      };
    })
    .filter(Boolean);

  if (!linesMap.length) {
    return redirect('/cart');
  }

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const discount = searchParams.get('discount');
  const discountArray = discount ? [discount] : [];

  // Create Cart
  const result = await cart.create({
    lines: linesMap,
    discountCodes: discountArray,
  });

  const cartResult = result.cart;

  if (result.errors?.length || !cartResult) {
    throw new Response('Link may be expired. Try checking the URL.', {status: 410});
  }

  // Update cart id in cookie
  const headers = cart.setCartId(cartResult.id);

  // Redirect to checkout
  if (cartResult.checkoutUrl) {
    return redirect(cartResult.checkoutUrl, {headers});
  }

  throw new Error('No checkout URL found');
}

export default function Component() {
  return null; // This route handles redirects only, no UI.
}