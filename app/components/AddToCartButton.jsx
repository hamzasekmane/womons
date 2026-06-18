import {CartForm} from '@shopify/hydrogen';

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: Array<OptimisticCartLineInput>;
 *   onClick?: () => void;
 * }}
 */
export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => {
        const isAdding = fetcher.state !== 'idle';
        const isDisabled = disabled ?? isAdding;

        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={onClick}
              disabled={isDisabled}
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-black px-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 hover:bg-gray-900 hover:shadow-2xl disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <span className="flex items-center justify-center tracking-[0.3em] animate-pulse">
                  Adding...
                </span>
              ) : (
                <span className="flex items-center justify-center transition-all duration-500 group-hover:tracking-[0.25em]">
                  {children}
                </span>
              )}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}

/** @typedef {import('react-router').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */