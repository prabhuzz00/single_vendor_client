import dynamic from "next/dynamic";
import React, { useContext } from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { useCart } from "react-use-cart";

import useGetSetting from "@hooks/useGetSetting";
import { SidebarContext } from "@context/SidebarContext";

const StickyCart = () => {
  const { totalItems, cartTotal } = useCart();
  const { toggleCartDrawer } = useContext(SidebarContext);
  const { globalSetting } = useGetSetting();

  const currency = globalSetting?.default_currency || "$";

  const handleCartClick = () => {
    toggleCartDrawer();
  };

  return (
    <button aria-label="Cart" onClick={handleCartClick} className="absolute">
      <div className="right-0 w-35 float-right fixed top-2/4 bottom-2/4 align-middle shadow-xl cursor-pointer z-30 hidden lg:block xl:block">
        <div className="flex flex-col items-center justify-center bg-yellow-50 rounded-tl-lg p-2 text-gray-700">
          <span className="text-2xl mb-1 text-yellow-600">
            <IoBagHandleOutline />
          </span>
          <span className="px-2 text-sm font-serif font-medium">
            {totalItems} Items
          </span>
        </div>
        <div className="flex flex-col items-center justify-center bg-black p-2 text-white text-base font-serif font-medium rounded-bl-lg mx-auto">
          {currency}
          {cartTotal.toFixed(2)}
        </div>
      </div>
    </button>
  );
};

export default dynamic(() => Promise.resolve(StickyCart), { ssr: false });
