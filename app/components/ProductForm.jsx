import {Link, useNavigate} from 'react-router';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {motion} from 'framer-motion';

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
    <div className={`flex flex-col ${hideOptions ? 'gap-0' : 'gap-8'}`}>
      {!hideOptions &&
        productOptions.map((option, index) => {
          if (option.optionValues.length === 1) return null;

          return (
            <motion.div
              key={option.name}
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1]}}
            >
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                {option.name}
              </p>

              <div className="flex flex-wrap gap-3">
                {option.optionValues.map((value) => (
                  <OptionButton
                    key={option.name + value.name}
                    value={value}
                    navigate={navigate}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}

      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1]}}
        className={hideOptions ? 'mt-0' : 'mt-4'}
      >
        <AddToCartButton
          disabled={!selectedVariant || !isAvailable}
          onClick={() => open('cart')}
          lines={
            selectedVariant
              ? [{merchandiseId: selectedVariant.id, quantity: safeQuantity, selectedVariant}]
              : []
          }
        >
          {isAvailable ? 'Add to Cart' : 'Sold Out'}
        </AddToCartButton>
      </motion.div>
    </div>
  );
}

/**
 * Handles the individual option buttons (Colors vs Text/Sizes)
 */
function OptionButton({value, navigate}) {
  const {name, handle, variantUriQuery, selected, available, exists, isDifferentProduct, swatch} = value;
  const isColor = Boolean(swatch?.color || swatch?.image);

  const handleClick = (e) => {
    if (isDifferentProduct) return; // Let the <Link> handle it
    e.preventDefault();
    if (!selected && exists) {
      navigate(`?${variantUriQuery}`, {replace: true, preventScrollReset: true});
    }
  };

  const Wrapper = isDifferentProduct ? Link : 'button';
  const wrapperProps = isDifferentProduct
    ? {
        to: `/products/${handle}?${variantUriQuery}`,
        prefetch: 'intent',
        replace: true,
        preventScrollReset: true,
      }
    : {
        type: 'button',
        disabled: !exists,
        onClick: handleClick,
        'aria-checked': selected,
      };

  // Color Swatch UI
  if (isColor) {
    const swatchImage = swatch?.image?.previewImage?.url;
    const swatchColor = swatch?.color || 'transparent';
    const lightColor = isLightColor(swatchColor);

    return (
      <Wrapper
        {...wrapperProps}
        title={name}
        className={`relative flex items-center justify-center rounded-full p-[2px] border transition-all duration-300 ${
          selected ? 'border-black scale-110' : 'border-transparent hover:border-gray-300 hover:scale-110'
        } ${!available ? 'opacity-40' : ''}`}
      >
        <span
          className={`block h-8 w-8 rounded-full ${lightColor && !swatchImage ? 'border border-black/10' : ''}`}
          style={{
            background: swatchImage ? `url(${swatchImage}) center/cover` : swatchColor,
          }}
        />
      </Wrapper>
    );
  }

  // Text/Size UI
  return (
    <Wrapper
      {...wrapperProps}
      className={`relative flex h-12 min-w-[3rem] items-center justify-center rounded-full px-5 text-[11px] font-bold tracking-[0.1em] transition-all duration-300 ${
        selected
          ? 'scale-105 bg-black text-white shadow-md'
          : available
            ? 'border border-gray-200 bg-white text-black hover:border-black hover:bg-gray-50'
            : 'cursor-not-allowed border border-gray-100 bg-gray-50 text-gray-400'
      }`}
    >
      {name}
      {!available && (
        <span className="absolute left-1/2 top-1/2 h-px w-[60%] -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] bg-gray-400" />
      )}
    </Wrapper>
  );
}

/**
 * Helper to determine if a hex color is light (needs a border)
 */
function isLightColor(color = '') {
  if (!color.startsWith('#')) return false;
  let hex = color.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map((char) => char + char).join('');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */