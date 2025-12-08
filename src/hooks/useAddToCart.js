import { useState } from "react";
import { useCart } from "react-use-cart";

import { notifyError, notifySuccess } from "@utils/toast";

const useAddToCart = () => {
  const [item, setItem] = useState(1);
  const { addItem, items, updateItemQuantity } = useCart();
  // console.log('products',products)
  // console.log("items", items);

  const handleAddItem = (product) => {
    const result = items.find((i) => i.id === product.id);
    const { variants, categories, description, ...updatedProduct } = product;

    // Simply add the item without stock validation
    addItem(updatedProduct, item);
    notifySuccess(`${item} ${product.title} added to cart!`);
  };

  const handleIncreaseQuantity = (product) => {
    const result = items?.find((p) => p.id === product.id);

    if (result) {
      // Simply increase quantity without stock validation
      updateItemQuantity(product.id, product.quantity + 1);
    }
  };

  return {
    setItem,
    item,
    handleAddItem,
    handleIncreaseQuantity,
  };
};

export default useAddToCart;
