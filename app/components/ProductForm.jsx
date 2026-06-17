import {Link, useNavigate} from 'react-router';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';

/**
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 *   quantity?: number;
 *   hideOptions?: boolean;
 * }}
 */
export function ProductForm({
  productOptions = [],
  selectedVariant,
  quantity = 1,
  hideOptions = false,
}) {
  const navigate = useNavigate();
  const {open} = useAside();

  const isAvailable = Boolean(selectedVariant?.availableForSale);
  const safeQuantity = Math.max(1, Number(quantity) || 1);

  return (
    <div className={`product-form flex flex-col ${hideOptions ? 'gap-3' : 'gap-6'}`}>
      {!hideOptions &&
        productOptions.map((option) => {
          if (option.optionValues.length === 1) return null;

          return (
            <div className="product-options" key={option.name}>
              <h5
                className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1B2A3D]/55"
                style={{fontFamily: 'sans-serif'}}
              >
                {option.name}
              </h5>

              <div className="product-options-grid flex flex-wrap gap-2.5">
                {option.optionValues.map((value) => {
                  const {
                    name,
                    handle,
                    variantUriQuery,
                    selected,
                    available,
                    exists,
                    isDifferentProduct,
                    swatch,
                  } = value;

                  const baseClasses =
                    'product-options-item inline-flex items-center justify-center transition-all';

                  if (isDifferentProduct) {
                    return (
                      <Link
                        className={baseClasses}
                        key={option.name + name}
                        prefetch="intent"
                        preventScrollReset
                        replace
                        to={`/products/${handle}?${variantUriQuery}`}
                        data-selected={selected ? 'true' : 'false'}
                        style={{
                          opacity: available ? 1 : 0.35,
                        }}
                      >
                        <ProductOptionSwatch swatch={swatch} name={name} />
                      </Link>
                    );
                  }

                  return (
                    <button
                      type="button"
                      className={baseClasses}
                      key={option.name + name}
                      aria-checked={selected ? 'true' : 'false'}
                      data-selected={selected ? 'true' : 'false'}
                      disabled={!exists}
                      style={{
                        opacity: available ? 1 : 0.35,
                      }}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

      <div className={hideOptions ? 'mt-0' : 'mt-2'}>
        <AddToCartButton
          disabled={!selectedVariant || !isAvailable}
          onClick={() => {
            open('cart');
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: safeQuantity,
                    selectedVariant,
                  },
                ]
              : []
          }
        >
          {isAvailable ? 'Add to Cart' : 'Sold Out'}
        </AddToCartButton>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   swatch?: Maybe<ProductOptionValueSwatch> | undefined;
 *   name: string;
 * }}
 */
function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) {
    return <span>{name}</span>;
  }

  return (
    <span
      aria-label={name}
      title={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {image ? <img src={image} alt={name} /> : null}
    </span>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Maybe} Maybe */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductOptionValueSwatch} ProductOptionValueSwatch */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */