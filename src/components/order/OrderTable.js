import useUtilsFunction from "@hooks/useUtilsFunction";
import React from "react";
import { FiDownload } from "react-icons/fi";

const OrderTable = ({ data, currency }) => {
  const { getNumberTwo } = useUtilsFunction();

  const handleDownloadImage = (imageUrl, productTitle, fileType, fileName) => {
    // Determine file extension based on file type
    let extension = "jpg";
    if (fileType === "application/pdf") {
      extension = "pdf";
    } else if (fileType === "image/png") {
      extension = "png";
    } else if (fileType === "image/jpeg" || fileType === "image/jpg") {
      extension = "jpg";
    }

    // Use original filename if available, otherwise create one
    const downloadName =
      fileName ||
      `${productTitle.replace(/\s+/g, "_")}_custom_sticker.${extension}`;

    try {
      // Create download link with attachment disposition
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = downloadName;

      // Set attributes for cross-origin download
      link.setAttribute("download", downloadName);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      // Fallback: Open in new tab
      window.open(imageUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <tbody className="bg-white divide-y divide-gray-100 text-serif text-sm">
      {data?.cart?.map((item, i) => (
        <tr key={i}>
          <th className="px-6 py-1 whitespace-nowrap font-normal text-gray-500 text-left">
            {i + 1}{" "}
          </th>
          <td className="px-6 py-1 font-normal text-gray-500">
            <div className="flex flex-col space-y-2">
              <span className="text-gray-700 font-medium">{item.title}</span>
              {item.customData?.isCustomProduct &&
                item.customData?.uploadedImage && (
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="relative w-16 h-16 border border-gray-200 rounded overflow-hidden shadow-sm">
                      {item.customData.fileType === "application/pdf" ? (
                        <div className="relative w-full h-full">
                          <img
                            src={item.customData.uploadedImagePreview}
                            alt="PDF Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to PDF icon if preview fails
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div
                            className="absolute inset-0 flex flex-col items-center justify-center bg-red-50"
                            style={{ display: "none" }}
                          >
                            <svg
                              className="w-8 h-8 text-red-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                            </svg>
                            <p className="text-[8px] text-red-600 font-bold mt-0.5">
                              PDF
                            </p>
                          </div>
                          <div className="absolute bottom-0 right-0 bg-red-600 text-white text-[8px] px-1 rounded-tl font-bold">
                            PDF
                          </div>
                        </div>
                      ) : (
                        <img
                          src={
                            item.customData.uploadedImagePreview ||
                            item.customData.uploadedImage
                          }
                          alt="Custom Sticker"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <button
                      onClick={() =>
                        handleDownloadImage(
                          item.customData.uploadedImage,
                          item.title,
                          item.customData.fileType,
                          item.customData.fileName
                        )
                      }
                      className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-sm"
                      title="Download custom file"
                    >
                      <FiDownload className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                )}
            </div>
          </td>
          <td className="px-6 py-1 whitespace-nowrap font-bold text-center">
            {item.quantity}{" "}
          </td>
          <td className="px-6 py-1 whitespace-nowrap font-bold text-center font-DejaVu">
            {currency}
            {getNumberTwo(item.price)}
          </td>

          <td className="px-6 py-1 whitespace-nowrap text-right font-bold font-DejaVu k-grid text-red-500">
            {currency}
            {getNumberTwo(item.itemTotal)}
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default OrderTable;
