import { useContext } from "react";
import Link from "next/link";
import { useCart } from "react-use-cart";
import { FiTrash2 } from "react-icons/fi";

import { SidebarContext } from "@context/SidebarContext";
import Discount from "@components/common/Discount";
import Price from "@components/common/Price";

const CartItem = ({ item, currency }) => {
  const { removeItem } = useCart();
  const { closeCartDrawer } = useContext(SidebarContext);

  const hasDiscount = item.prices?.discount > 0;
  const categoryName = item.category?.name?.en || "Men";
  const itemPrice = item.price || 0;
  const itemQuantity = item.quantity || 0;
  const itemTotal = itemPrice * itemQuantity;
  const originalPrice = item.originalPrice || 0;
  const originalTotal = originalPrice * itemQuantity;

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="group w-full flex flex-col sm:flex-row items-start p-3 sm:p-4 border-b border-gray-200 hover:border-gray-400 transition-all duration-300 hover:bg-yellow-50">
      <div className="relative flex-shrink-0 mr-0 sm:mr-4 mb-3 sm:mb-0">
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white">
          <Link href={`/product/${item.slug || "#"}`} onClick={closeCartDrawer}>
            <img
              src={item.image || "/placeholder-image.jpg"}
              width={80}
              height={80}
              alt={item.title || "Product image"}
              className="object-cover transition-transform duration-300 group-hover:scale-105 w-20 h-20 sm:w-24 sm:h-24"
            />
          </Link>
        </div>
      </div>

      <div className="flex-1 w-full min-w-0">
        <Link
          href={`/product/${item.slug || "#"}`}
          onClick={closeCartDrawer}
          className="block text-sm sm:text-base font-semibold text-black hover:text-yellow-600 transition-colors line-clamp-2"
        >
          {item.title}
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mt-2 sm:mt-0">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-semibold text-gray-800">
              {currency}
              {itemTotal.toFixed(2)}
            </span>

            {hasDiscount && (
              <del className="text-xs sm:text-sm font-normal text-red-400 strike-through">
                {currency}
                {originalTotal.toFixed(2)}
              </del>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 px-3 py-2">
              <span className="text-xs sm:text-sm font-semibold text-black">
                Qty: {itemQuantity}
              </span>
            </div>

            <button
              onClick={handleRemove}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-full"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mt-3 pt-3 border-t border-gray-200">
          <span className="text-xs sm:text-sm text-gray-500">
            Item: {currency}
            {itemPrice.toFixed(2)}
          </span>

          <span className="text-xs sm:text-sm font-medium text-yellow-600">
            Total: {currency}
            {itemTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
