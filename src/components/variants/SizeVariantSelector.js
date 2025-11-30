import { useState } from "react";
import useUtilsFunction from "@hooks/useUtilsFunction";

const SizeVariantSelector = ({
  sizeVariants,
  selectedSize,
  selectedTier,
  onSizeChange,
  onTierChange,
}) => {
  const { showingTranslateValue, currency } = useUtilsFunction();

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div>
        <h4 className="text-sm font-semibold text-black mb-3">
          Select Size:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sizeVariants.map((variant, index) => (
            <button
              key={variant.id || index}
              onClick={() => onSizeChange(variant)}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedSize?.id === variant.id
                  ? "border-yellow-500 bg-yellow-50 shadow-md"
                  : "border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">
                  {variant.combination}
                </span>
                <span className="text-xs text-gray-600 mt-1">
                  {variant.unit}
                </span>
              </div>
              {selectedSize?.id === variant.id && (
                <div className="absolute top-2 right-2">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Tiers Selection */}
      {selectedSize && selectedSize.pricingTiers && (
        <div>
          <h4 className="text-sm font-semibold text-black mb-3">
            Select Quantity:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedSize.pricingTiers.map((tier, index) => {
              const totalPrice = (tier.finalPrice * tier.quantity).toFixed(2);
              const hasDiscount = tier.discount > 0;

              return (
                <button
                  key={index}
                  onClick={() => onTierChange(tier)}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedTier?.quantity === tier.quantity
                      ? "border-yellow-500 bg-yellow-50 shadow-md"
                      : "border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm"
                  }`}
                >
                  <div className="flex flex-col space-y-2">
                    {/* Quantity */}
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-800">
                        {tier.quantity} pieces
                      </span>
                      {selectedTier?.quantity === tier.quantity && (
                        <svg
                          className="w-5 h-5 text-yellow-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Discount Badge */}
                    {hasDiscount && (
                      <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold w-fit">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {tier.discount}% OFF
                      </div>
                    )}

                    {/* Price per piece */}
                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        {currency} {tier.finalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-600">each</span>
                    </div>

                    {/* Show original price if discounted */}
                    {hasDiscount && (
                      <div className="text-xs text-gray-500">
                        <span className="line-through">
                          {currency} {tier.basePrice.toFixed(2)}
                        </span>
                        <span className="ml-1">each</span>
                      </div>
                    )}

                    {/* Total Price */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 font-medium">
                          Total:
                        </span>
                        <span className="text-base font-bold text-yellow-600">
                          {currency} {totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeVariantSelector;
