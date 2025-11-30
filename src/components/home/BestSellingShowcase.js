import React from "react";
import Link from "next/link";
import Image from "next/image";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";

const BestSellingShowcase = ({
  bestSellingProducts = [],
  trendingProducts = [],
}) => {
  const { storeCustomizationSetting, currency } = useGetSetting();
  const { showingTranslateValue, showingImage } = useUtilsFunction();

  // Get showcase settings from store customization
  const showcaseSettings = storeCustomizationSetting?.home?.home_showcase || {};
  const isEnabled = showcaseSettings?.enabled !== false;

  // Debug: Log the settings to console
  console.log("BestSellingShowcase - showcaseSettings:", showcaseSettings);
  console.log(
    "BestSellingShowcase - storeCustomizationSetting:",
    storeCustomizationSetting
  );

  if (!isEnabled) return null;

  // Get first 4 best selling products for left column
  const displayBestSelling = bestSellingProducts.slice(0, 4);
  // Get 2 products for center column - fallback to bestSellingProducts if trendingProducts is empty
  const displayCenter =
    trendingProducts.length > 0
      ? trendingProducts.slice(0, 2)
      : bestSellingProducts.slice(4, 6);

  console.log("BestSellingShowcase - displayCenter:", displayCenter);
  console.log("BestSellingShowcase - trendingProducts:", trendingProducts);
  console.log(
    "BestSellingShowcase - bestSellingProducts:",
    bestSellingProducts
  );

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Best Selling Products - 2x2 Grid */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 p-6 pb-4 uppercase tracking-tight">
              {showingTranslateValue(showcaseSettings?.left_title) ||
                "Best Selling Stickers"}
            </h2>
            <div className="grid grid-cols-2 gap-0">
              {displayBestSelling.map((product, index) => (
                <Link
                  key={product._id || index}
                  href={`/product/${product.slug}`}
                  className={`group relative bg-white hover:bg-gray-50 transition-all duration-300 p-6 flex flex-col items-center justify-center ${
                    index === 0
                      ? "border-yellow-400 border-4"
                      : "border-gray-200 border"
                  }`}
                >
                  {/* Product Image */}
                  <div className="relative w-full h-32 mb-3 flex items-center justify-center">
                    <Image
                      src={showingImage(product.image?.[0])}
                      alt={showingTranslateValue(product.title)}
                      width={100}
                      height={100}
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Title */}
                  <h3 className="text-sm font-medium text-gray-900 text-center mb-2 line-clamp-2 min-h-[2.5rem]">
                    {showingTranslateValue(product.title)}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    {product.discount > 0 ? (
                      <>
                        <span className="text-gray-500 line-through text-sm">
                          {currency}
                          {product.originalPrice?.toFixed(2) ||
                            product.prices?.originalPrice?.toFixed(2)}
                        </span>
                        <span className="text-green-600 font-bold text-lg">
                          {currency}
                          {product.prices?.price?.toFixed(2) ||
                            product.price?.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-900 font-bold text-lg">
                        {currency}
                        {product.prices?.price?.toFixed(2) ||
                          product.price?.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <div className="text-green-600 font-semibold text-xs mb-3">
                      {product.discount}% Off
                    </div>
                  )}

                  {/* Shop Now Button */}
                  <button className="w-full bg-gray-800 text-white font-semibold text-sm py-2.5 px-4 rounded-md hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300 uppercase tracking-wide">
                    Shop Now
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* Center Column: Featured Products - Stacked Layout */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 p-6 pb-4 uppercase tracking-tight text-center">
              {showingTranslateValue(showcaseSettings?.center_title) ||
                "Home Decor & Furnishing"}
            </h2>

            <div className="flex-1 flex flex-col gap-0">
              {displayCenter && displayCenter.length > 0 ? (
                displayCenter.map((product, index) => (
                  <Link
                    key={product._id || index}
                    href={`/product/${product.slug}`}
                    className="group relative flex-1 bg-white hover:bg-gray-50 transition-all duration-300 p-6 flex items-center border-b border-gray-200 last:border-b-0"
                  >
                    {/* Product Image */}
                    <div className="relative w-32 h-32 flex-shrink-0 mr-6">
                      <Image
                        src={showingImage(product.image?.[0])}
                        alt={showingTranslateValue(product.title)}
                        width={128}
                        height={128}
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1">
                      {/* Product Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {showingTranslateValue(product.title)}
                      </h3>

                      {/* Category/Tag */}
                      {product.category && (
                        <p className="text-sm text-gray-600 mb-3 capitalize">
                          {showingTranslateValue(product.category)}
                        </p>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-3 mb-3">
                        {product.discount > 0 ? (
                          <>
                            <span className="text-gray-500 line-through text-base">
                              {currency}
                              {product.originalPrice?.toFixed(2) ||
                                product.prices?.originalPrice?.toFixed(2)}
                            </span>
                            <span className="text-green-600 font-bold text-xl">
                              {currency}
                              {product.prices?.price?.toFixed(2) ||
                                product.price?.toFixed(2)}
                            </span>
                            <span className="text-green-600 font-semibold text-sm">
                              {product.discount}% Off
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-900 font-bold text-xl">
                            {currency}
                            {product.prices?.price?.toFixed(2) ||
                              product.price?.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Status Badge */}
                      {product.tag && (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded uppercase">
                          {product.tag}
                        </span>
                      )}
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex-shrink-0 ml-4">
                      <svg
                        className="w-6 h-6 text-blue-600 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex items-center justify-center p-12">
                  <p className="text-gray-500 text-center">
                    No products available for this section
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Shop Your Needs with Uploadable Image */}
          <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg shadow-md overflow-hidden relative">
            {/* Background Image (Admin Uploadable) */}
            {showcaseSettings?.right_image && (
              <div className="absolute inset-0 opacity-20">
                <Image
                  src={showingImage(showcaseSettings.right_image)}
                  alt="Background"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                {showingTranslateValue(showcaseSettings?.right_title) ||
                  "Shop your"}
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-6 leading-tight">
                {showingTranslateValue(showcaseSettings?.right_subtitle) ||
                  "fashion Needs"}
              </h2>

              <p className="text-gray-300 text-base mb-8 max-w-sm">
                with Latest & Trendy Choices
              </p>

              <Link
                href="/search"
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-base px-8 py-3.5 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide"
              >
                {showingTranslateValue(showcaseSettings?.right_button_text) ||
                  "Shop Now"}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellingShowcase;
