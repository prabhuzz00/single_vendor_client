import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  IoAdd,
  IoCart,
  IoRemove,
  IoEyeOutline,
  IoHeartOutline,
  IoHeart,
} from "react-icons/io5";
import { useCart } from "react-use-cart";
import dynamic from "next/dynamic";
import Price from "@components/common/Price";
import { notifyError } from "@utils/toast";
import useAddToCart from "@hooks/useAddToCart";
import useGetSetting from "@hooks/useGetSetting";
import Discount from "@components/common/Discount";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ProductModal from "@components/modal/ProductModal";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import { handleLogEvent } from "src/lib/analytics";

const ProductCard = ({ product, attributes }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { items, addItem, updateItemQuantity, inCart } = useCart();
  const { handleIncreaseQuantity } = useAddToCart();
  const { globalSetting } = useGetSetting();
  const { showingTranslateValue, getNumber, showingImage } = useUtilsFunction();

  const currency = globalSetting?.default_currency || "$";
  const isInCart = inCart(product?._id);
  const cartItem = useMemo(() => {
    return items?.find((item) => item?.id === product?._id);
  }, [items, product?._id]);

  const productTitle = showingTranslateValue(product?.title);
  const productDescription = showingTranslateValue(product?.description);
  const categoryName = showingTranslateValue(product?.category?.name);
  const productImages = product?.image || [];
  const isOutOfStock = product?.stock < 1;

  // Derive price for product card:
  // - If product has size-type variants with pricing tiers, use first tier of first size variant
  // - Else if product is combination, use first variant prices
  // - Else fallback to product.prices
  const initialSizeVariants = (product?.variants || []).filter(
    (v) => v.variantType === "size",
  );

  let derivedPrice = 0;
  let derivedOriginalPrice = 0;

  if (initialSizeVariants.length > 0) {
    const firstSize = initialSizeVariants[0];
    const firstTier =
      firstSize?.pricingTiers && firstSize.pricingTiers.length
        ? firstSize.pricingTiers[0]
        : null;

    if (firstTier) {
      derivedPrice = getNumber(firstTier.finalPrice);
      derivedOriginalPrice = getNumber(firstTier.basePrice);
    } else {
      // fallback to product prices
      derivedPrice = getNumber(product?.prices?.price);
      derivedOriginalPrice = getNumber(product?.prices?.originalPrice);
    }
  } else if (product?.isCombination && product?.variants?.length > 0) {
    derivedPrice = getNumber(product?.variants?.[0]?.price);
    derivedOriginalPrice = getNumber(product?.variants?.[0]?.originalPrice);
  } else {
    derivedPrice = getNumber(product?.prices?.price);
    derivedOriginalPrice = getNumber(product?.prices?.originalPrice);
  }

  const productPrice = {
    price: derivedPrice,
    originalPrice: derivedOriginalPrice,
  };

  productPrice.hasDiscount =
    productPrice.originalPrice > productPrice.price &&
    productPrice.originalPrice > 0;

  const handleAddProductToCart = (productData) => {
    if (!productData) {
      notifyError("Product not found");
      return;
    }

    if (isOutOfStock) {
      notifyError("This product is out of stock!");
      return;
    }

    if (productData?.variants?.length > 0) {
      setModalOpen(true);
      return;
    }

    const { slug, variants, categories, description, ...updatedProduct } =
      productData;

    addItem({
      ...updatedProduct,
      title: productTitle,
      id: productData._id,
      variant: productData.prices,
      price: productData.prices?.price,
      originalPrice: productData.prices?.originalPrice,
    });
  };

  const handleOpenQuickView = () => {
    setModalOpen(true);
    if (productTitle) {
      handleLogEvent("product", `opened ${productTitle}`);
    }
  };

  const handleDecreaseProductQuantity = () => {
    if (cartItem && cartItem.quantity > 0) {
      updateItemQuantity(cartItem.id, cartItem.quantity - 1);
    }
  };

  const handleIncreaseProductQuantity = () => {
    if (!cartItem) return;

    if (cartItem?.variants?.length > 0) {
      handleAddProductToCart(cartItem);
    } else {
      handleIncreaseQuantity(cartItem);
    }
  };

  const handleAddCurrentProductToCart = () => {
    handleAddProductToCart(product);
  };

  const handleProductCardMouseEnter = () => {
    setIsHovered(true);
  };

  const handleProductCardMouseLeave = () => {
    setIsHovered(false);
  };

  const handleSwitchToNextImage = () => {
    if (productImages.length > 0) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % productImages.length,
      );
    }
  };

  const handleQuickViewClick = (event) => {
    event.preventDefault();
    handleOpenQuickView();
  };

  const handleToggleWishlist = (event) => {
    event.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const RenderImageIndicators = useCallback(() => {
    return productImages.map((_, index) => (
      <div
        key={index}
        className={`h-1.5 rounded-full transition-all duration-300 ${
          index === currentImageIndex
            ? "bg-white w-6"
            : "bg-white bg-opacity-50 w-1.5"
        }`}
      />
    ));
  }, [productImages, currentImageIndex]);

  const RenderLoadingSkeleton = () => {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
        <div className="h-52 bg-gradient-to-br from-gray-50 to-gray-100"></div>
        <div className="p-4">
          <div className="h-3 bg-gray-200 rounded mb-2 w-20"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="flex gap-2 mb-3">
            <div className="h-5 bg-gray-200 rounded w-20"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (productImages.length <= 1 || isHovered) return;

    const imageInterval = setInterval(handleSwitchToNextImage, 3000);
    return () => clearInterval(imageInterval);
  }, [productImages.length, isHovered]);

  if (!product) {
    return <RenderLoadingSkeleton />;
  }

  const currentImage = productImages[currentImageIndex] || productImages[0];

  const imgSrc =
    showingImage(currentImage) ||
    "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";

  return (
    <>
      <ProductModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        product={product}
        currency={currency}
        attributes={attributes}
      />

      <div
        className="bg-white rounded-xl overflow-hidden border border-gray-300 hover:border-black hover:shadow-xl transition-all duration-300 flex flex-col h-full group relative"
        onMouseEnter={handleProductCardMouseEnter}
        onMouseLeave={handleProductCardMouseLeave}
      >
        {/* Wishlist Heart Icon */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-20 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:border-yellow-400 transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Add to wishlist"
        >
          {isWishlisted ? (
            <IoHeart className="text-yellow-500 text-lg" />
          ) : (
            <IoHeartOutline className="text-gray-600 text-lg" />
          )}
        </button>

        {/* Quick View Eye Icon */}
        <button
          onClick={handleQuickViewClick}
          className="absolute top-3 left-3 z-20 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:border-yellow-400 hover:bg-yellow-400 transition-all duration-200 hover:scale-110 active:scale-95 group"
          aria-label="Quick view"
        >
          <IoEyeOutline className="text-gray-600 group-hover:text-black text-lg transition-colors" />
        </button>

        {/* Product Image */}
        <Link href={`/product/${product?.slug || "#"}`} className="block">
          <div
            className="relative w-full bg-gray-100 overflow-hidden"
            style={{ paddingTop: "100%" }}
          >
            <img
              src={imgSrc}
              alt={productTitle || "Product"}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                padding: "16px",
              }}
              loading="eager"
            />

            {/* image */}

            {isOutOfStock && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
                <span className="bg-red-500 text-white px-4 py-1.5 rounded-md font-semibold text-sm">
                  OUT OF STOCK
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-3 flex flex-col flex-grow">
          <Link
            href={`/product/${product?.slug || "#"}`}
            className="flex-grow-0 mb-1"
          >
            <h2 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 hover:text-gray-700 transition-colors min-h-[2rem]">
              {productTitle || "Untitled Product"}
            </h2>
          </Link>

          {/* Star Rating */}
          {product?.rating > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => {
                  const starValue = i + 1;
                  const isFull = product.rating >= starValue;
                  const isHalf =
                    !isFull && product.rating > i && product.rating < starValue;

                  return (
                    <svg
                      key={i}
                      className="w-3.5 h-3.5"
                      fill={isFull || isHalf ? "#F59E0B" : "#E5E7EB"}
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {isHalf ? (
                        <defs>
                          <linearGradient id={`half-${i}`}>
                            <stop offset="50%" stopColor="#F59E0B" />
                            <stop offset="50%" stopColor="#E5E7EB" />
                          </linearGradient>
                        </defs>
                      ) : null}
                      <path
                        fill={isHalf ? `url(#half-${i})` : undefined}
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  );
                })}
              </div>
              <span className="text-xs text-gray-600 font-medium">
                {product.rating.toFixed(1)}
              </span>
              {product?.reviewCount > 0 && (
                <span className="text-xs text-gray-400">
                  ({product.reviewCount.toLocaleString()})
                </span>
              )}
            </div>
          )}

          {productDescription && (
            <p className="text-xs text-gray-600 line-clamp-1 mb-3 leading-4">
              {productDescription}
            </p>
          )}

          {/* Price */}
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {currency}
              {productPrice.price?.toFixed(2)}
            </span>
            {productPrice.hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {currency}
                {productPrice.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          {/* Shop Now Button */}
          <Link
            href={`/product/${product?.slug}`}
            className="w-full bg-yellow-400 border-2 border-yellow-500 text-black py-2 px-3 rounded-full font-semibold text-xs hover:bg-yellow-500 transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(ProductCard), { ssr: false });
