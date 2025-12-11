import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { useCart } from "react-use-cart";
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
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
  const [cloudinaryPreviewUrl, setCloudinaryPreviewUrl] = useState(null);
  const [cloudinaryConfig, setCloudinaryConfig] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Get product data from URL query params
  const [productData, setProductData] = useState(null);

  // Fetch Cloudinary configuration on mount
  useEffect(() => {
    const fetchCloudinaryConfig = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/setting/cloudinary/config`
        );
        if (response.ok) {
          const config = await response.json();
          setCloudinaryConfig(config);
        } else {
          console.error("Cloudinary config not available");
          notifyError(
            "Cloudinary configuration not enabled. Please contact admin."
          );
        }
      } catch (error) {
        console.error("Error fetching Cloudinary config:", error);
        notifyError("Failed to load upload configuration");
      }
    };
    fetchCloudinaryConfig();
  }, []);

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

  const handleImageUpload = async (e) => {
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

      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setUploadedImage(file);

      // Upload to Cloudinary
      setIsUploading(true);
      try {
        if (!cloudinaryConfig || !cloudinaryConfig.enabled) {
          notifyError("Cloudinary is not configured. Please contact admin.");
          setIsUploading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", cloudinaryConfig.uploadPreset);

        // Determine resource type: raw for PDFs, image for JPG/PNG
        const isPDF = file.type === "application/pdf";
        const resourceType = isPDF ? "raw" : "image";

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${resourceType}/upload`;
        const response = await fetch(cloudinaryUrl, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          // For PDFs uploaded as raw, we cannot create preview transformations
          // Store original URL for download
          let previewUrl = data.secure_url;

          setCloudinaryUrl(data.secure_url); // Original URL for download
          setCloudinaryPreviewUrl(previewUrl); // Preview URL (same as original for PDFs)
          notifySuccess("File uploaded successfully!");
        } else {
          notifyError("Failed to upload file");
        }
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        notifyError("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
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

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!uploadedImage || !cloudinaryUrl) {
      notifyError("Please wait for image upload to complete");
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
      image: cloudinaryUrl, // Use Cloudinary URL instead of base64
      quantity: quantity,
      customData: {
        productId: productData.id,
        selectedSize: productData.selectedSize,
        selectedTier: productData.selectedTier,
        uploadedImage: cloudinaryUrl, // Store original Cloudinary URL for download
        uploadedImagePreview: cloudinaryPreviewUrl || cloudinaryUrl, // Preview URL (converted for PDFs)
        isCustomProduct: true,
        fileType: uploadedImage.type, // Store file type
        fileName: uploadedImage.name, // Store file name
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
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                        )}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent"></div>
                          </div>
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
                        {uploadedImage?.type === "application/pdf" ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 rounded-lg border-4 border-red-200">
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
                          <img
                            src={imagePreview}
                            alt="Sticker Preview"
                            className="w-full h-full object-contain"
                          />
                        )}
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
                    disabled={
                      !uploadedImage ||
                      !cloudinaryUrl ||
                      isLoading ||
                      isUploading
                    }
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 rounded-full transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    <span>{isUploading ? "Uploading..." : "ADD TO CART"}</span>
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
