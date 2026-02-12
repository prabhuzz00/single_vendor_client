import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { FiChevronRight, FiMinus, FiPlus } from "react-icons/fi";

// Lazy load heavy social sharing components
const FacebookIcon = dynamic(
  () => import("react-share").then((mod) => mod.FacebookIcon),
  { ssr: false },
);
const FacebookShareButton = dynamic(
  () => import("react-share").then((mod) => mod.FacebookShareButton),
  { ssr: false },
);
const LinkedinIcon = dynamic(
  () => import("react-share").then((mod) => mod.LinkedinIcon),
  { ssr: false },
);
const LinkedinShareButton = dynamic(
  () => import("react-share").then((mod) => mod.LinkedinShareButton),
  { ssr: false },
);
const RedditIcon = dynamic(
  () => import("react-share").then((mod) => mod.RedditIcon),
  { ssr: false },
);
const RedditShareButton = dynamic(
  () => import("react-share").then((mod) => mod.RedditShareButton),
  { ssr: false },
);
const TwitterIcon = dynamic(
  () => import("react-share").then((mod) => mod.TwitterIcon),
  { ssr: false },
);
const TwitterShareButton = dynamic(
  () => import("react-share").then((mod) => mod.TwitterShareButton),
  { ssr: false },
);
const WhatsappIcon = dynamic(
  () => import("react-share").then((mod) => mod.WhatsappIcon),
  { ssr: false },
);
const WhatsappShareButton = dynamic(
  () => import("react-share").then((mod) => mod.WhatsappShareButton),
  { ssr: false },
);

import Price from "@components/common/Price";
import Tags from "@components/common/Tags";
import Layout from "@layout/Layout";
import { notifyError } from "@utils/toast";
const Card = dynamic(() => import("@components/slug-card/Card"), {
  ssr: false,
});
import useAddToCart from "@hooks/useAddToCart";
import Loading from "@components/preloader/Loading";
const ProductCard = dynamic(() => import("@components/product/ProductCard"), {
  ssr: true,
});
import VariantList from "@components/variants/VariantList";
import SizeVariantSelector from "@components/variants/SizeVariantSelector";
import { SidebarContext } from "@context/SidebarContext";
import AttributeServices from "@services/AttributeServices";
import ProductServices from "@services/ProductServices";
import CustomProductServices from "@services/CustomProductServices";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Discount from "@components/common/Discount";
import ImageZoom from "@components/image-zoom/ImageZoom";

const ProductScreen = ({ product, attributes, relatedProducts }) => {
  const router = useRouter();
  const { lang, showingTranslateValue, getNumber, currency } =
    useUtilsFunction();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { handleAddItem, item, setItem } = useAddToCart();
  const { t } = useTranslation();

  const [selectedValue, setSelectedValue] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState({});
  const [isReadMore, setIsReadMore] = useState(true);
  const [selectedVariantAttributes, setSelectedVariantAttributes] = useState(
    {},
  );
  const [variantAttributes, setVariantAttributes] = useState([]);

  // Determine initial size-variant selection synchronously from product prop
  const initialSizeVariants = (product?.variants || []).filter(
    (v) => v.variantType === "size",
  );
  const initialSelectedSize = initialSizeVariants.length
    ? initialSizeVariants[0]
    : null;
  const initialSelectedTier =
    initialSelectedSize &&
    initialSelectedSize.pricingTiers &&
    initialSelectedSize.pricingTiers.length
      ? initialSelectedSize.pricingTiers[0]
      : null;

  const [sizeVariants, setSizeVariants] = useState(initialSizeVariants);
  const [selectedSize, setSelectedSize] = useState(initialSelectedSize);
  const [selectedTier, setSelectedTier] = useState(initialSelectedTier);
  const [hasSizeVariants, setHasSizeVariants] = useState(
    initialSizeVariants.length > 0,
  );
  const [customStickerEnabled, setCustomStickerEnabled] = useState(false);

  // Pricing defaults
  const initialPrice = initialSelectedTier
    ? getNumber(initialSelectedTier.finalPrice)
    : getNumber(product?.price);
  const initialOriginalPrice = initialSelectedTier
    ? getNumber(initialSelectedTier.basePrice)
    : getNumber(product?.originalPrice);
  const initialDiscount = initialSelectedTier
    ? initialSelectedTier.discount || 0
    : 0;

  const [price, setPrice] = useState(initialPrice || 0);
  const [originalPrice, setOriginalPrice] = useState(initialOriginalPrice || 0);
  const [discount, setDiscount] = useState(initialDiscount || 0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalOriginalPrice, setTotalOriginalPrice] = useState(0);

  const productImages = product?.image || [];

  // Reset selected image when navigating to a different product client-side
  useEffect(() => {
    // Initialize selectedImage to the first product image when product changes
    setSelectedImage(productImages[0] || "");
  }, [product?._id, productImages]);

  // Check if custom sticker feature is enabled
  useEffect(() => {
    const fetchCustomProductSettings = async () => {
      try {
        const settings = await CustomProductServices.getCustomProductSettings();
        setCustomStickerEnabled(settings?.featureEnabled || false);
      } catch (error) {
        console.error("Error fetching custom product settings:", error);
      }
    };
    fetchCustomProductSettings();
  }, []);

  const calculateProductPricing = (productData) => {
    const priceValue = getNumber(productData?.price);
    const originalPriceValue = getNumber(productData?.originalPrice);
    const discountPercentage =
      originalPriceValue > 0
        ? getNumber(
            ((originalPriceValue - priceValue) / originalPriceValue) * 100,
          )
        : 0;

    setPrice(priceValue);
    setOriginalPrice(originalPriceValue);
    setDiscount(discountPercentage);
  };

  const handleImageChange = (newImage) => {
    if (!newImage) return;
    setSelectedImage(newImage);
  };

  const handleReadMoreToggle = () => {
    setIsReadMore(!isReadMore);
  };

  const handleQuantityDecrease = () => {
    if (item > 1) setItem(item - 1);
  };

  const handleQuantityIncrease = () => {
    setItem(item + 1);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;

    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue === "") {
      setItem(1);
      return;
    }

    const parsedValue = parseInt(numericValue, 10);

    if (!isNaN(parsedValue)) {
      if (parsedValue >= 1) {
        setItem(parsedValue);
      } else if (parsedValue < 1) {
        setItem(1);
      }
    }
  };

  const handleInputBlur = (event) => {
    const value = event.target.value;

    if (value === "" || isNaN(parseInt(value, 10)) || parseInt(value, 10) < 1) {
      setItem(1);
    }
  };

  const handleCategoryClick = () => {
    setIsLoading(!isLoading);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);

    // Auto-select the first tier of the new size
    if (size?.pricingTiers && size.pricingTiers.length > 0) {
      const firstTier = size.pricingTiers[0];
      setSelectedTier(firstTier);
      setItem(firstTier.quantity);
      setPrice(firstTier.finalPrice);
      setOriginalPrice(firstTier.basePrice);
      setDiscount(firstTier.discount || 0);
    } else {
      setSelectedTier(null);
      setItem(1);
    }
  };

  const handleTierChange = (tier) => {
    setSelectedTier(tier);
    setItem(tier.quantity); // Set quantity to tier quantity
    setPrice(tier.finalPrice);
    setOriginalPrice(tier.basePrice);
    const discountPercent = tier.discount || 0;
    setDiscount(discountPercent);
  };

  const handleAddToCart = () => {
    if (!product) {
      notifyError("Product not found");
      return;
    }

    // Handle size variants
    if (hasSizeVariants) {
      if (!selectedSize || !selectedTier) {
        notifyError("Please select size and quantity tier");
        return;
      }

      const { variants, categories, description, ...updatedProduct } = product;

      const newItem = {
        ...updatedProduct,
        id: `${product._id}-size-${
          selectedSize.id || selectedSize.combination
        }-${selectedTier.quantity}`,
        title: `${showingTranslateValue(product.title)} - ${
          selectedSize.combination
        }`,
        image: selectedImage,
        variant: {
          variantType: "size",
          size: selectedSize.combination,
          tier: selectedTier,
        },
        price: getNumber(selectedTier.finalPrice),
        originalPrice: getNumber(selectedTier.basePrice),
        // Shipping data: weight should be in GRAMS (will be converted to kg in checkout)
        // Default to 2 grams per sticker if not specified
        weight: product.weight || 2,
        length: product.length || 10,
        width: product.width || 10,
        height: product.height || 5,
        quantity: selectedTier.quantity,
      };

      handleAddItem(newItem);
      return;
    }

    // Handle traditional variants
    const isVariantSelected = product?.variants?.some(
      (variant) =>
        Object.entries(variant).sort().toString() ===
        Object.entries(selectedVariant).sort().toString(),
    );

    if (
      isVariantSelected ||
      !product?.variants ||
      product.variants.length === 0
    ) {
      const { variants, categories, description, ...updatedProduct } = product;

      const variantIdentifier = variantAttributes
        ?.map((att) => selectedVariant[att._id])
        .join("-");

      const variantNameParts = variantAttributes
        ?.map((att) =>
          att.variants?.find((v) => v._id === selectedVariant[att._id]),
        )
        .map((el) => showingTranslateValue(el?.name));

      const newItem = {
        ...updatedProduct,
        id:
          product?.variants?.length <= 0
            ? product._id
            : `${product._id}-${variantIdentifier}`,
        title:
          product?.variants?.length <= 0
            ? showingTranslateValue(product.title)
            : `${showingTranslateValue(product.title)}-${variantNameParts.join(
                "-",
              )}`,
        image: selectedImage,
        variant: selectedVariant || {},
        price:
          product.variants?.length === 0
            ? getNumber(product.prices?.price)
            : getNumber(price),
        originalPrice:
          product.variants?.length === 0
            ? getNumber(product.prices?.originalPrice)
            : getNumber(originalPrice),
      };

      handleAddItem(newItem);
    } else {
      notifyError("Please select all variant first!");
    }
  };

  const variantFilter = (variant) => {
    return Object.keys(selectedVariantAttributes).every(
      (key) => selectedVariantAttributes[key] === variant[key],
    );
  };

  const attributeFilter = (attribute) => {
    const variantKeys = Object.keys(Object.assign({}, ...product?.variants));
    return attribute?._id && variantKeys.includes(attribute._id);
  };

  useEffect(() => {
    if (productImages.length > 0 && !selectedImage) {
      setSelectedImage(productImages[0]);
    }
  }, [productImages, selectedImage]);

  // Detect and initialize size variants
  useEffect(() => {
    if (!product?.variants) return;

    const detectedSizeVariants = product.variants.filter(
      (variant) => variant.variantType === "size",
    );

    if (detectedSizeVariants.length > 0) {
      setHasSizeVariants(true);
      setSizeVariants(detectedSizeVariants);

      // Auto-select first size variant
      const firstSize = detectedSizeVariants[0];
      setSelectedSize(firstSize);

      // Auto-select first tier of first size
      if (firstSize.pricingTiers && firstSize.pricingTiers.length > 0) {
        const firstTier = firstSize.pricingTiers[0];
        setSelectedTier(firstTier);
        setItem(firstTier.quantity);
        setPrice(firstTier.finalPrice);
        setOriginalPrice(firstTier.basePrice);
        setDiscount(firstTier.discount || 0);
      }
    } else {
      setHasSizeVariants(false);
      setSizeVariants([]);
    }
  }, [product]);

  useEffect(() => {
    if (!product?.variants || hasSizeVariants) return;

    if (selectedValue) {
      const result = product.variants.filter(variantFilter);

      const filterKey = Object.keys(
        Object.assign(
          {},
          ...result.map((variant) => {
            const {
              originalPrice,
              price,
              discount,
              quantity,
              barcode,
              sku,
              productId,
              image,
              ...rest
            } = variant;
            return rest;
          }),
        ),
      );

      const selectVar = filterKey.reduce(
        (obj, key) => ({ ...obj, [key]: selectedVariant[key] }),
        {},
      );

      const newObj = Object.entries(selectVar).reduce(
        (acc, [key, val]) => (val ? { ...acc, [key]: val } : acc),
        {},
      );

      const matchedVariant = result.find((variant) =>
        Object.keys(newObj).every((key) => newObj[key] === variant[key]),
      );

      if (result.length <= 0 || !matchedVariant) {
        return;
      }

      setSelectedVariant(matchedVariant);
      setSelectedVariantAttributes(matchedVariant);
      setSelectedImage(matchedVariant?.image || productImages[0]);
      calculateProductPricing(matchedVariant);
    } else if (product.variants.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedVariant(firstVariant);
      setSelectedVariantAttributes(firstVariant);
      setSelectedImage(firstVariant?.image || productImages[0]);
      calculateProductPricing(firstVariant);
    } else {
      setSelectedImage(productImages[0] || "");
      calculateProductPricing(product?.prices || {});
    }
  }, [
    product,
    selectedValue,
    selectedVariantAttributes,
    selectedVariant,
    hasSizeVariants,
  ]);

  useEffect(() => {
    if (!product?.variants || hasSizeVariants) return;

    const matchedAttributes = attributes?.filter(attributeFilter);
    setVariantAttributes(matchedAttributes?.sort() || []);
  }, [attributes, product, hasSizeVariants]);

  useEffect(() => {
    setIsLoading(false);
  }, [product, setIsLoading]);

  useEffect(() => {
    const currentItem = Number(item) || 1;
    const calculatedTotal = currentItem * Number(price);
    const calculatedTotalOriginal = currentItem * Number(originalPrice);
    setTotalPrice(calculatedTotal);
    setTotalOriginalPrice(calculatedTotalOriginal);
  }, [item, price, originalPrice]);

  const category_name = showingTranslateValue(product?.category?.name)
    ?.toLowerCase()
    ?.replace(/[^A-Z0-9]+/gi, "-");

  const mainImage = selectedImage || productImages[0];
  const productDescription = showingTranslateValue(product?.description) || "";
  const shouldShowReadMore = productDescription.length > 230;

  const socialShareButtons = [
    { Component: FacebookShareButton, Icon: FacebookIcon },
    { Component: TwitterShareButton, Icon: TwitterIcon },
    { Component: RedditShareButton, Icon: RedditIcon },
    { Component: WhatsappShareButton, Icon: WhatsappIcon },
    { Component: LinkedinShareButton, Icon: LinkedinIcon },
  ];

  // Pre-computed JSX elements
  const thumbnailImages = productImages.map((image, index) => (
    <button
      key={index}
      onClick={() => handleImageChange(image)}
      className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
        selectedImage === image
          ? "border-yellow-600 shadow-lg"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <Image
        src={image}
        alt={`Product thumbnail ${index + 1}`}
        width={64}
        height={64}
        className="w-full h-full object-cover"
      />
    </button>
  ));

  const socialShareIcons = socialShareButtons.map((socialButton, index) => {
    const ButtonComp = socialButton.Component;
    const IconComp = socialButton.Icon;
    return (
      <li key={index}>
        <ButtonComp
          url={`https://yourdomain.com/product/${router.query.slug}`}
          className="hover:opacity-80 transition-opacity"
        >
          <IconComp size={36} round />
        </ButtonComp>
      </li>
    );
  });

  const variantAttributeSections = variantAttributes.map((attribute) => (
    <div key={attribute._id} className="mb-4">
      <h4 className="text-sm font-semibold text-black py-1">
        {showingTranslateValue(attribute?.name)}:
      </h4>
      <div className="flex flex-row">
        <VariantList
          att={attribute._id}
          lang={lang}
          option={attribute.option}
          setValue={setSelectedValue}
          varTitle={variantAttributes}
          setSelectVa={setSelectedVariantAttributes}
          variants={product.variants || []}
          selectVariant={selectedVariant}
          setSelectVariant={setSelectedVariant}
        />
      </div>
    </div>
  ));

  const relatedProductCards = relatedProducts
    .slice(1, 11)
    .map((relatedProduct) => (
      <ProductCard
        key={relatedProduct._id}
        product={relatedProduct}
        attributes={attributes}
      />
    ));

  const QuantityCounter = () => (
    <div className="group flex items-center justify-between rounded-lg overflow-hidden flex-shrink-0 border h-12 border-gray-300 bg-white">
      <button
        onClick={handleQuantityDecrease}
        disabled={item === 1 || hasSizeVariants}
        className="flex items-center justify-center h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-12 text-gray-700 border-e border-gray-300 hover:text-black hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiMinus className="w-4 h-4" />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={item}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        disabled={hasSizeVariants}
        className="font-semibold text-center transition-colors duration-250 ease-in-out cursor-text flex-shrink-0 text-base text-black w-10 md:w-20 xl:w-24 bg-transparent border-0 focus:outline-none focus:ring-0 disabled:opacity-50"
      />

      <button
        onClick={handleQuantityIncrease}
        disabled={hasSizeVariants}
        className="flex items-center justify-center h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-10 md:w-12 text-gray-700 border-s border-gray-300 hover:text-black hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiPlus className="w-4 h-4" />
      </button>
    </div>
  );

  const AddToCartButton = () => (
    <button
      onClick={handleAddToCart}
      className="bg-black hover:bg-gray-900 text-white text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border-0 border-transparent rounded-lg focus-visible:outline-none focus:outline-none px-4 ml-4 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 w-full h-12 shadow-lg hover:shadow-xl"
    >
      {t("common:addToCart")}
    </button>
  );

  const CreateYourOwnStickerButton = () => {
    const handleContinue = () => {
      // Prepare product data to pass to custom sticker page
      const productDataToPass = {
        id: product._id,
        title: showingTranslateValue(product.title),
        slug: product.slug,
        price: price,
        originalPrice: originalPrice,
        quantity: item,
        selectedSize: selectedSize ? selectedSize.combination : null,
        sizeLabel: selectedSize ? selectedSize.combination : null,
        selectedTier: selectedTier,
        image: selectedImage || product.image?.[0],
      };

      // Encode product data and navigate
      const encodedData = encodeURIComponent(JSON.stringify(productDataToPass));
      router.push(`/custom-sticker/${product.slug}?productData=${encodedData}`);
    };

    return (
      <div>
        <button
          onClick={handleContinue}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-bold text-center justify-center border-0 border-transparent rounded-lg focus-visible:outline-none focus:outline-none px-4 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 w-full h-12 shadow-lg hover:shadow-xl"
        >
          CONTINUE
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Next step → Upload Your Artwork
        </p>
      </div>
    );
  };

  const CategoryLink = () => (
    <Link
      href={`/search?category=${category_name}&_id=${product?.category?._id}`}
    >
      <button
        type="button"
        className="text-yellow-600 font-serif font-medium underline ml-2 hover:text-yellow-700"
        onClick={handleCategoryClick}
      >
        {category_name}
      </button>
    </Link>
  );

  const ReadMoreButton = () => (
    <button
      onClick={handleReadMoreToggle}
      className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
    >
      {isReadMore ? t("common:moreInfo") : t("common:showLess")}
    </button>
  );

  if (!product) {
    return (
      <Layout title="Product Not Found">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Product Not Found
            </h1>
            <Link href="/">
              <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return isLoading ? (
    <Loading loading={isLoading} />
  ) : (
    <>
      <Head>
        {product?.image && product.image[0] && (
          <link rel="preload" as="image" href={product.image[0]} />
        )}
      </Head>
      <Layout
        title={showingTranslateValue(product?.title) || "Product"}
        description={productDescription}
      >
        <div className="px-0 py-10 lg:py-12 bg-white">
          <div className="mx-auto px-4 lg:px-8 max-w-screen-2xl">
            <div className="flex items-center pb-6">
              <ol className="flex items-center space-x-2 text-sm text-gray-600">
                <li>
                  <Link
                    href="/"
                    className="hover:text-yellow-600 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <FiChevronRight className="w-4 h-4" />
                </li>
                <li>
                  <Link
                    href={`/search?category=${category_name}&_id=${product?.category?._id}`}
                    className="hover:text-yellow-600 transition-colors"
                  >
                    {category_name}
                  </Link>
                </li>
                <li>
                  <FiChevronRight className="w-4 h-4" />
                </li>
                <li className="text-black font-medium truncate max-w-xs">
                  {showingTranslateValue(product?.title)}
                </li>
              </ol>
            </div>

            <div className="w-full rounded-2xl p-6 lg:p-8 bg-white border border-gray-200 shadow-lg">
              <div className="flex flex-col xl:flex-row gap-8 lg:gap-12">
                <div
                  className="flex-shrink-0 xl:pr-10 w-full mx-auto md:w-6/12 lg:w-5/12 xl:w-4/12"
                  style={{ position: "relative" }}
                >
                  {mainImage ? (
                    <ImageZoom src={mainImage} alt="Product Image" />
                  ) : (
                    <div className="w-full h-96 bg-gray-50 flex items-center justify-center rounded-2xl border border-gray-200">
                      <span className="text-gray-400">No Image Available</span>
                    </div>
                  )}

                  {productImages.length > 1 && (
                    <div className="mt-6">
                      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                        {thumbnailImages}
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row">
                    <div className="xl:pr-6 md:pr-6 md:w-2/3 w-full">
                      <div className="mb-6">
                        <h1 className="text-2xl lg:text-3xl font-bold font-serif text-black mb-2">
                          {showingTranslateValue(product?.title)}
                        </h1>

                        {/* Star Rating */}
                        {product?.rating > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => {
                                const starValue = i + 1;
                                const isFull = product.rating >= starValue;
                                const isHalf =
                                  !isFull &&
                                  product.rating > i &&
                                  product.rating < starValue;

                                return (
                                  <svg
                                    key={i}
                                    className="w-5 h-5"
                                    fill={
                                      isFull || isHalf ? "#F59E0B" : "#E5E7EB"
                                    }
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    {isHalf ? (
                                      <defs>
                                        <linearGradient id={`half-detail-${i}`}>
                                          <stop
                                            offset="50%"
                                            stopColor="#F59E0B"
                                          />
                                          <stop
                                            offset="50%"
                                            stopColor="#E5E7EB"
                                          />
                                        </linearGradient>
                                      </defs>
                                    ) : null}
                                    <path
                                      fill={
                                        isHalf
                                          ? `url(#half-detail-${i})`
                                          : undefined
                                      }
                                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                    />
                                  </svg>
                                );
                              })}
                            </div>
                            <span className="text-sm text-gray-700 font-semibold">
                              {product.rating.toFixed(1)}
                            </span>
                            {product?.reviewCount > 0 && (
                              <span className="text-sm text-gray-500">
                                (
                                {product.reviewCount >= 1000
                                  ? `${(product.reviewCount / 1000).toFixed(1)}K`
                                  : product.reviewCount}{" "}
                                Reviews)
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex flex-row items-center gap-2">
                          <Discount
                            slug
                            product={product}
                            discount={discount}
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <Price
                          product={product}
                          price={totalPrice}
                          currency={currency}
                          showPropOriginalPrice={true}
                          showPropPrice={true}
                          originalPrice={
                            originalPrice > price
                              ? totalOriginalPrice
                              : totalPrice
                          }
                          primaryTextClasses="text-2xl text-yellow-600"
                          secondaryTextClasses="text-lg text-gray-500 ml-2"
                        />

                        <div className="mt-2 flex flex-row items-center">
                          <Price
                            product={product}
                            price={price}
                            currency={currency}
                            originalPrice={originalPrice}
                            primaryTextClasses="text-sm text-gray-700"
                            secondaryTextClasses="text-xs text-gray-500 ml-1"
                          />
                          <span className="text-xs text-gray-600 ml-1">
                            /per item
                          </span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="text-sm leading-4 text-gray-700 ">
                          {isReadMore && shouldShowReadMore
                            ? `${productDescription.slice(0, 230)}...`
                            : productDescription}

                          {shouldShowReadMore && <ReadMoreButton />}
                        </div>
                      </div>

                      <div className="mb-6">
                        {hasSizeVariants ? (
                          <SizeVariantSelector
                            sizeVariants={sizeVariants}
                            selectedSize={selectedSize}
                            selectedTier={selectedTier}
                            onSizeChange={handleSizeChange}
                            onTierChange={handleTierChange}
                            onContinue={handleAddToCart}
                          />
                        ) : (
                          variantAttributeSections
                        )}
                      </div>

                      <div>
                        <div className="text-sm leading-4 text-gray-700 "></div>

                        {customStickerEnabled && (
                          <div className="mt-6">
                            <CreateYourOwnStickerButton />
                          </div>
                        )}

                        <div className="flex flex-col mt-6">
                          <span className="font-serif font-semibold py-1 text-sm d-block">
                            <span className="text-black">
                              {t("common:category")}:
                            </span>{" "}
                            <CategoryLink />
                          </span>
                          <Tags product={product} />
                        </div>

                        <div className="mt-6">
                          <h3 className="text-base font-semibold mb-2 font-serif text-black">
                            {t("common:shareYourSocial")}
                          </h3>
                          <p className="font-sans text-sm text-gray-700 mb-3">
                            {t("common:shareYourSocialText")}
                          </p>
                          <ul className="flex space-x-2">{socialShareIcons}</ul>
                        </div>
                      </div>
                    </div>

                    <div className="w-full xl:w-5/12 lg:w-6/12 md:w-5/12"></div>
                  </div>
                </div>
              </div>
            </div>

            {relatedProducts?.length >= 2 && (
              <div className="pt-10 lg:pt-16">
                <h3 className="text-xl lg:text-2xl font-bold font-serif text-black mb-6">
                  {t("common:relatedProducts")}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {relatedProductCards}
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { slug } = context.params;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  try {
    const [productsData, attributesData] = await Promise.all([
      ProductServices.getShowingStoreProducts({
        category: "",
        slug: slug,
      }),
      AttributeServices.getShowingAttributes({}),
    ]);

    const foundProduct =
      productsData?.products?.find(
        (productItem) => productItem?.slug === slug,
      ) || null;

    if (!foundProduct) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        product: foundProduct,
        attributes: attributesData || [],
        relatedProducts: productsData?.relatedProducts || [],
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        product: null,
        attributes: [],
        relatedProducts: [],
      },
    };
  }
};

export default ProductScreen;
