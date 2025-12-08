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
import RenderStars from "@components/common/RatingStars";

const ProductCard = ({ product, attributes }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { items, addItem, updateItemQuantity, inCart } = useCart();
  const { handleIncreaseQuantity } = useAddToCart();
  const { globalSetting } = useGetSetting();
  const { showingTranslateValue, getNumber } = useUtilsFunction();

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
    (v) => v.variantType === "size"
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
        (prevIndex) => (prevIndex + 1) % productImages.length
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
            {currentImage ? (
              <ImageWithFallback
                src={currentImage}
                alt={productTitle || "Product"}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out absolute top-0 left-0"
              />
            ) : (
              <Image
                src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                fill
                className="object-contain p-4 absolute top-0 left-0"
                alt="product placeholder"
              />
            )}

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

          {productDescription && (
            <p className="text-xs text-gray-600 line-clamp-1 mb-1.5 leading-4">
              {productDescription}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <RenderStars rating={5} />
            <span className="text-xs text-gray-500 ml-0.5">(121)</span>
          </div>

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

          {/* Add to Cart Button */}
          {isInCart && cartItem ? (
            <div className="w-full bg-black text-white flex items-center justify-between h-9 px-3 rounded-full border-2 border-black hover:border-yellow-500 transition-all shadow-sm">
              <button
                onClick={handleDecreaseProductQuantity}
                disabled={isOutOfStock}
                className="hover:bg-yellow-500 hover:text-black rounded-full p-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                aria-label="Decrease quantity"
              >
                <IoRemove size={16} />
              </button>
              <span className="text-sm font-semibold min-w-[1.5rem] text-center">
                {cartItem?.quantity || 0}
              </span>
              <button
                onClick={handleIncreaseProductQuantity}
                disabled={isOutOfStock}
                className="hover:bg-yellow-500 hover:text-black rounded-full p-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                aria-label="Increase quantity"
              >
                <IoAdd size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddCurrentProductToCart}
              disabled={isOutOfStock}
              className="w-full bg-yellow-400 border-2 border-yellow-500 text-black py-2 px-3 rounded-full font-semibold text-xs hover:bg-yellow-500 transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-400 active:scale-[0.98] shadow-sm hover:shadow-md"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(ProductCard), { ssr: false });
