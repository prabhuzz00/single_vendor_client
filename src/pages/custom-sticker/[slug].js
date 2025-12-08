import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { useCart } from "react-use-cart";
import Image from "next/image";
import { FiUpload, FiShoppingCart } from "react-icons/fi";
import Layout from "@layout/Layout";
import { notifySuccess, notifyError } from "@utils/toast";
import useUtilsFunction from "@hooks/useUtilsFunction";

const CustomStickerDesign = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { addItem } = useCart();
  const { currency } = useUtilsFunction();

  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Get product data from URL query params
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    if (router.query.productData) {
      try {
        const data = JSON.parse(decodeURIComponent(router.query.productData));
        setProductData(data);
        setQuantity(data.quantity || 1);
      } catch (error) {
        console.error("Error parsing product data:", error);
        notifyError("Invalid product data");
        router.push("/");
      }
    }
  }, [router.query]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        notifyError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setUploadedImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const fakeEvent = { target: { files: [file] } };
      handleImageUpload(fakeEvent);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!uploadedImage) {
      notifyError("Please upload an image");
      return;
    }

    if (!productData) {
      notifyError("Product data not found");
      return;
    }

    const customProduct = {
      id: `custom-${productData.id}-${Date.now()}`,
      title: productData.title,
      name: productData.title,
      price: productData.price,
      image: imagePreview,
      quantity: quantity,
      customData: {
        productId: productData.id,
        selectedSize: productData.selectedSize,
        selectedTier: productData.selectedTier,
        uploadedImage: imagePreview,
      },
    };

    addItem(customProduct, quantity);
    notifySuccess("Custom sticker added to cart!");

    setTimeout(() => {
      router.push("/checkout");
    }, 1500);
  };

  const calculateTotal = () => {
    if (!productData) return 0;
    return (productData.price * quantity).toFixed(2);
  };

  if (!productData) {
    return (
      <Layout title="Loading..." description="Loading custom sticker design">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={productData.title}
      description={`Design your custom ${productData.title}`}
    >
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Left Column - Design Tools */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {productData.title}
                  </h1>
                  <p className="text-gray-600">
                    Upload your image and customize your perfect sticker
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    1. Upload Your Image
                  </h2>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-3 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-yellow-400 transition-all bg-gray-50 hover:bg-gray-100"
                  >
                    {imagePreview ? (
                      <div className="relative w-32 h-32 mx-auto">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div>
                        <FiUpload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 font-medium mb-2">
                          Drag & drop zone
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button className="mt-4 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all font-semibold">
                      Choose File
                    </button>
                  </div>
                </div>

                {/* Quantity Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Quantity
                  </h2>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= 1) setQuantity(val);
                      }}
                      className="w-20 text-center border-2 border-gray-300 rounded-lg px-4 py-2 font-semibold"
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-yellow-400 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Live Preview */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Live Preview
                  </h2>
                  <div className="bg-gray-100 rounded-xl p-8 aspect-square flex items-center justify-center">
                    {imagePreview ? (
                      <div className="relative w-64 h-64">
                        <Image
                          src={imagePreview}
                          alt="Sticker Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-4xl">🖼️</span>
                        </div>
                        <p className="text-gray-500">
                          Upload an image to preview
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Price Summary
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>
                        Base Price ({productData.sizeLabel || "Selected Size"}):
                      </span>
                      <span className="font-semibold">
                        {currency}
                        {productData.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-700">
                      <span>Quantity:</span>
                      <span className="font-semibold">{quantity}</span>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between text-gray-900">
                        <span className="text-lg font-bold">Total:</span>
                        <span className="text-2xl font-bold text-yellow-600">
                          {currency}
                          {calculateTotal()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!uploadedImage || isLoading}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 rounded-full transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    <span>ADD TO CART</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomStickerDesign;
