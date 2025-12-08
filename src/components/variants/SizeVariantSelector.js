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
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Size Selection Section */}
      <div className="mb-6">
        <h4 className="text-base font-bold text-gray-900 mb-4">
          Select a size
        </h4>
        <div className="space-y-3">
          {sizeVariants.map((variant, index) => {
            const raw = variant.combination || "";
            // Remove parenthesis content (units) first
            const cleaned = raw.replace(/\(.*?\)/g, "").trim();
            // Extract numeric parts (e.g. 2, 3, 2.5) and format as 2"x2"
            const nums = cleaned.match(/\d+(?:\.\d+)?/g);
            let displaySize = cleaned;
            if (nums && nums.length >= 2) {
              displaySize = `${nums[0]}\"x${nums[1]}\"`;
            } else {
              // Fallback: remove common unit words and whitespace
              displaySize = cleaned
                .replace(/cm|mm|inch|inches|in/gi, "")
                .replace(/\s+/g, "");
            }

            return (
              <label
                key={variant.id || index}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="size"
                  checked={selectedSize?.id === variant.id}
                  onChange={() => onSizeChange(variant)}
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <span className="ml-3 text-base text-gray-800 group-hover:text-gray-900 font-medium">
                  {displaySize || raw}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Quantity Selection Section */}
      {selectedSize && selectedSize.pricingTiers && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-base font-bold text-gray-900 mb-4">
            Select a quantity
          </h4>
          <div className="space-y-3">
            {selectedSize.pricingTiers.map((tier, index) => {
              const totalPrice = (tier.finalPrice * tier.quantity).toFixed(2);
              const hasDiscount = tier.discount > 0;
              const pricePerSticker = tier.finalPrice.toFixed(2);

              return (
                <label
                  key={index}
                  className={`flex items-center justify-between cursor-pointer group p-4 rounded-lg border transition-all duration-200 ${
                    selectedTier?.quantity === tier.quantity
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <input
                      type="radio"
                      name="quantity"
                      checked={selectedTier?.quantity === tier.quantity}
                      onChange={() => onTierChange(tier)}
                      className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-gray-900">
                          {tier.quantity}
                        </span>
                        {hasDiscount && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">
                            Save {tier.discount}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-gray-900">
                      {currency}
                      {totalPrice}
                    </div>
                    <div className="text-xs text-gray-500">
                      {currency}
                      {pricePerSticker} / sticker
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Summary at Bottom */}
      {selectedSize && selectedTier && (
        <div className="border-t border-gray-200 mt-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">
              {currency}
              {(selectedTier.finalPrice * selectedTier.quantity).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">
              {currency}
              {selectedTier.finalPrice.toFixed(2)} / sticker
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeVariantSelector;
