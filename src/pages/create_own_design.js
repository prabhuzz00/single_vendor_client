import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { useCart } from "react-use-cart";
import Image from "next/image";
import { FiUpload, FiShoppingCart } from "react-icons/fi";
import Layout from "@layout/Layout";
import useAsync from "@hooks/useAsync";
import CustomProductServices from "@services/CustomProductServices";
import { notifySuccess, notifyError } from "@utils/toast";
import useUtilsFunction from "@hooks/useUtilsFunction";

const CreateOwnDesign = () => {
  const router = useRouter();
  const { addItem } = useCart();
  const { currency } = useUtilsFunction();

  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedShape, setSelectedShape] = useState("Square");
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch custom product settings
  const { data: settings, loading } = useAsync(
    CustomProductServices.getCustomProductSettings
  );

  useEffect(() => {
    if (settings && settings.sizeRanges && settings.sizeRanges.length > 0) {
      setSelectedSize(settings.sizeRanges[1]); // Default to Medium (index 1)
    }
  }, [settings]);

  // Check if feature is enabled
  if (!loading && settings && !settings.featureEnabled) {
    router.push("/");
    return null;
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        notifyError("Please upload only JPG, PNG, or PDF files");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        notifyError("File size should be less than 10MB");
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
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (file && allowedTypes.includes(file.type)) {
      const fakeEvent = { target: { files: [file] } };
      handleImageUpload(fakeEvent);
    } else if (file) {
      notifyError("Please upload only JPG, PNG, or PDF files");
    }
  };

  const getShapeClass = (shape) => {
    switch (shape.toLowerCase()) {
      case "circle":
        return "rounded-full";
      case "square":
        return "rounded-lg";
      case "rectangle":
        return "rounded-lg aspect-[3/2]";
      case "oval":
        return "rounded-[50%]";
      case "die-cut":
        return "rounded-[30%]";
      default:
        return "rounded-lg";
    }
  };

  const handleAddToCart = () => {
    if (!uploadedImage) {
      notifyError("Please upload an image");
      return;
    }

    if (!selectedSize) {
      notifyError("Please select a size");
      return;
    }

    const customProduct = {
      id: `custom-sticker-${Date.now()}`,
      name: `Custom ${selectedShape} Sticker - ${selectedSize.label}`,
      price: selectedSize.basePrice,
      image: imagePreview,
      quantity: quantity,
      customData: {
        shape: selectedShape,
        size: selectedSize.dimensions,
        uploadedImage: imagePreview,
        isCustomProduct: true,
        fileType: uploadedImage?.type,
        fileName: uploadedImage?.name,
      },
    };

    addItem(customProduct, quantity);
    notifySuccess("Custom sticker added to cart!");

    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  const calculateTotal = () => {
    if (!selectedSize) return 0;
    return (selectedSize.basePrice * quantity).toFixed(2);
  };

  if (loading) {
    return (
      <Layout
        title="Create Your Own Sticker"
        description="Design custom stickers"
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  const enabledShapes = settings?.shapes?.filter((s) => s.enabled) || [];

  return (
    <Layout
      title="Create Your Own Sticker"
      description="Design and customize your own stickers"
    >
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Left Column - Design Tools */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Design Your Sticker
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
                        {uploadedImage?.type === "application/pdf" ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 rounded-lg border-2 border-red-200">
                            <svg
                              className="w-16 h-16 text-red-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                            </svg>
                            <p className="text-xs text-red-600 mt-1 font-medium">
                              PDF
                            </p>
                          </div>
                        ) : (
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-contain"
                          />
                        )}
                      </div>
                    ) : (
                      <div>
                        <FiUpload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 font-medium mb-2">
                          Drag & drop zone
                        </p>
                        <p className="text-sm text-gray-500">
                          Supported formats: JPG, PNG, PDF
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button className="mt-4 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all font-semibold">
                      Choose File
                    </button>
                    <p className="mt-3 text-xs text-gray-500">
                      Max file size: 10MB
                    </p>
                  </div>
                </div>

                {/* Shape Selection */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    2. Select Shape
                  </h2>
                  <div className="grid grid-cols-5 gap-4">
                    {enabledShapes.map((shape) => (
                      <button
                        key={shape._id}
                        onClick={() => setSelectedShape(shape.name)}
                        className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                          selectedShape === shape.name
                            ? "border-yellow-400 bg-yellow-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-16 h-16 bg-gray-200 ${getShapeClass(
                            shape.name
                          )} mb-2`}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">
                          {shape.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size & Price Selection */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    3. Select Size & Price
                  </h2>
                  <div className="space-y-3">
                    {settings?.sizeRanges?.map((size) => (
                      <label
                        key={size._id}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedSize?._id === size._id
                            ? "border-yellow-400 bg-yellow-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            name="size"
                            checked={selectedSize?._id === size._id}
                            onChange={() => setSelectedSize(size)}
                            className="w-5 h-5 text-yellow-400 focus:ring-yellow-400"
                          />
                          <span className="font-medium text-gray-900">
                            {size.label}
                          </span>
                        </div>
                        <span className="text-yellow-600 font-bold">
                          {currency}
                          {size.basePrice.toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Quantity
                  </h2>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-yellow-400 transition-all font-bold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-20 h-10 text-center border-2 border-gray-300 rounded-lg font-semibold"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-yellow-400 transition-all font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Live Preview */}
              <div className="lg:sticky lg:top-8 lg:self-start">
                <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Live Preview
                  </h2>

                  <div className="bg-white rounded-xl p-8 mb-6 flex items-center justify-center min-h-[300px]">
                    {imagePreview ? (
                      <div
                        className={`relative w-64 h-64 shadow-2xl ${getShapeClass(
                          selectedShape
                        )} overflow-hidden`}
                        style={{
                          transform: "perspective(1000px) rotateY(-5deg)",
                        }}
                      >
                        {uploadedImage?.type === "application/pdf" ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 border-4 border-red-200">
                            <svg
                              className="w-24 h-24 text-red-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                            </svg>
                            <p className="text-sm text-red-600 mt-2 font-bold">
                              PDF File
                            </p>
                          </div>
                        ) : (
                          <Image
                            src={imagePreview}
                            alt="Sticker Preview"
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute bottom-2 right-2 w-8 h-8 bg-white/80 rounded-full shadow-lg"></div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <div className="w-48 h-48 mx-auto bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                          <span className="text-6xl">🖼️</span>
                        </div>
                        <p className="font-medium">
                          Upload an image to preview
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Price Summary */}
                  <div className="bg-white rounded-xl p-6 space-y-4 mb-6">
                    <h3 className="text-lg font-bold text-gray-900">
                      Price Summary
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex justify-between">
                        <span>
                          Base Price ({selectedSize?.label || "N/A"}):
                        </span>
                        <span className="font-semibold">
                          {currency}
                          {selectedSize?.basePrice.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span className="font-semibold">{quantity}</span>
                      </div>
                      <div className="border-t-2 border-gray-200 pt-2 flex justify-between text-xl font-bold text-gray-900">
                        <span>Total:</span>
                        <span className="text-yellow-600">
                          {currency}
                          {calculateTotal()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!uploadedImage || isLoading}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 rounded-full transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 shadow-lg"
                  >
                    <FiShoppingCart className="w-6 h-6" />
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

export default dynamic(() => Promise.resolve(CreateOwnDesign), { ssr: false });

// This is create your own design page for custom stickers where users can upload an image, select shape and size, and add the custom sticker to their cart.
