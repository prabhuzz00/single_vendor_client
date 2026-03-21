import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "react-use-cart";
import useRazorpay from "react-razorpay";
import { useQuery } from "@tanstack/react-query";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

//internal import
import { getUserSession } from "@lib/auth";
import { UserContext } from "@context/UserContext";
import OrderServices from "@services/OrderServices";
import useUtilsFunction from "./useUtilsFunction";
import CouponServices from "@services/CouponServices";
import { notifyError, notifySuccess } from "@utils/toast";
import CustomerServices from "@services/CustomerServices";
import NotificationServices from "@services/NotificationServices";
import ShippingServices from "@services/ShippingServices";

const useCheckoutSubmit = (storeSetting) => {
  const { dispatch } = useContext(UserContext);

  const [error, setError] = useState("");
  const [total, setTotal] = useState("");
  const [couponInfo, setCouponInfo] = useState({});
  const [minimumAmount, setMinimumAmount] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [isCouponAvailable, setIsCouponAvailable] = useState(false);
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const couponRef = useRef("");
  const [Razorpay] = useRazorpay();
  const { isEmpty, emptyCart, items, cartTotal } = useCart();

  const userInfo = getUserSession();
  const { showDateFormat, currency, globalSetting } = useUtilsFunction();

  const { data, isLoading } = useQuery({
    queryKey: ["shippingAddress", { id: userInfo?.id }],
    queryFn: async () =>
      await CustomerServices.getShippingAddress({
        userId: userInfo?.id,
      }),
    select: (data) => data?.shippingAddress,
  });

  const hasShippingAddress =
    !isLoading && data && Object.keys(data)?.length > 0;

  // console.log("storeSetting", storeSetting);

  // console.log("res", data);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (Cookies.get("couponInfo")) {
      const coupon = JSON.parse(Cookies.get("couponInfo"));
      // console.log('coupon information',coupon)
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountType);
      setMinimumAmount(coupon.minimumAmount);
    }
    setValue("email", userInfo?.email);
  }, [isCouponApplied]);

  //remove coupon if total value less then minimum amount of coupon
  useEffect(() => {
    if (minimumAmount - discountAmount > total || isEmpty) {
      setDiscountPercentage(0);
      Cookies.remove("couponInfo");
    }
  }, [minimumAmount, total]);

  //calculate total and discount value
  //calculate total and discount value
  useEffect(() => {
    const discountProductTotal = items?.reduce(
      (preValue, currentValue) => preValue + currentValue.itemTotal,
      0,
    );

    let totalValue = 0;
    const subTotal = parseFloat(cartTotal + Number(shippingCost)).toFixed(2);
    const discountAmount =
      discountPercentage?.type === "fixed"
        ? discountPercentage?.value
        : discountProductTotal * (discountPercentage?.value / 100);

    const discountAmountTotal = discountAmount ? discountAmount : 0;

    totalValue = Number(subTotal) - discountAmountTotal;

    setDiscountAmount(discountAmountTotal);

    // console.log("total", totalValue);

    setTotal(totalValue);
  }, [cartTotal, shippingCost, discountPercentage]);

  const submitHandler = async (data) => {
    // console.log("data", data);
    // return;
    try {
      // dispatch({ type: "SAVE_SHIPPING_ADDRESS", payload: data });
      // Cookies.set("shippingAddress", JSON.stringify(data));
      setIsCheckoutSubmit(true);
      setError("");

      const userDetails = {
        name: `${data.firstName} ${data.lastName}`,
        contact: data.contact,
        email: data.email,
        address: data.address,
        country: data.country,
        city: data.city,
        state: data.state || "",
        zipCode: data.zipCode,
      };

      let orderInfo = {
        user_info: userDetails,
        shippingOption: data.shippingOption,
        paymentMethod: data.paymentMethod,
        status: "Pending",
        cart: items,
        subTotal: cartTotal,
        shippingCost: shippingCost,
        discount: discountAmount,
        total: total,
      };

      await CustomerServices.addShippingAddress({
        userId: userInfo?.id,
        shippingAddressData: {
          ...userDetails,
        },
      });

      // Handle payment based on method
      switch (data.paymentMethod) {
        case "Card":
          await handlePaymentWithStripe(orderInfo);
          break;
        case "RazorPay":
          await handlePaymentWithRazorpay(orderInfo);
          break;
        case "Cash":
          await handleCashPayment(orderInfo);
          break;
        default:
          throw new Error("Invalid payment method selected");
      }
    } catch (error) {
      notifyError(error?.response?.data?.message || error?.message);
      setIsCheckoutSubmit(false);
    }
  };

  // console.log("globalSetting", globalSetting?.email_to_customer);

  const handleOrderSuccess = async (orderResponse, orderInfo) => {
    try {
      // Create shipment after successful payment
      if (selectedShippingRate && orderResponse?._id) {
        try {
          const shipmentPayload = {
            orderId: orderResponse._id,
            service:
              selectedShippingRate?.service ||
              selectedShippingRate?.serviceType,
            destination: {
              name: orderInfo.user_info.name,
              address1: orderInfo.user_info.address,
              city: orderInfo.user_info.city,
              province: orderInfo.user_info.state || "", // Use state if available, otherwise empty
              postalCode: orderInfo.user_info.zipCode,
              country: orderInfo.user_info.country,
              phone: orderInfo.user_info.contact,
              email: orderInfo.user_info.email,
            },
            parcels: items.map((item) => {
              const parcel = {
                quantity: item.quantity || 1,
              };
              // Only include dimensions if they exist, otherwise let backend apply defaults
              if (item.weight || item.productWeight)
                parcel.weight = item.weight || item.productWeight;
              if (item.length) parcel.length = item.length;
              if (item.width) parcel.width = item.width;
              if (item.height) parcel.height = item.height;
              return parcel;
            }),
            reference: `Order-${orderResponse._id}`,
          };

          await ShippingServices.createShipment(shipmentPayload);
        } catch (shipmentError) {
          // Don't fail the order if shipment creation fails
          // Admin can retry from dashboard
        }
      }

      const notificationInfo = {
        orderId: orderResponse?._id,
        message: `${
          orderResponse?.user_info?.name
        } placed an order of ${parseFloat(orderResponse?.total).toFixed(2)}!`,
        image:
          "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png",
      };

      const updatedData = {
        ...orderResponse,
        date: showDateFormat(orderResponse.createdAt),
        company_info: {
          currency: currency,
          vat_number: globalSetting?.vat_number,
          company: globalSetting?.company_name,
          address: globalSetting?.address,
          phone: globalSetting?.contact,
          email: globalSetting?.email,
          website: globalSetting?.website,
          from_email: globalSetting?.from_email,
        },
      };

      if (globalSetting?.email_to_customer) {
        // Trigger email in the background
        OrderServices.sendEmailInvoiceToCustomer(updatedData).catch(
          (emailErr) => {
            console.error("Failed to send email invoice:", emailErr.message);
          },
        );
      }

      // Add notification
      await NotificationServices.addNotification(notificationInfo);

      // Proceed with order success
      router.push(`/order/${orderResponse?._id}`);
      notifySuccess(
        "Your Order Confirmed! The invoice will be emailed to you shortly.",
      );
      Cookies.remove("couponInfo");
      emptyCart();
      setIsCheckoutSubmit(false);
    } catch (err) {
      console.error("Order success handling error:", err.message);
      throw new Error(err.message);
    }
  };

  //handle cash payment
  const handleCashPayment = async (orderInfo) => {
    try {
      const orderResponse = await OrderServices.addOrder(orderInfo);
      await handleOrderSuccess(orderResponse, orderInfo);
    } catch (err) {
      console.error("Cash payment error:", err.message);
      throw new Error(err.message);
    }
  };

  //handle stripe payment
  const handlePaymentWithStripe = async (orderInfo) => {
    try {
      if (!stripe || !elements) {
        throw new Error("Stripe is not initialized");
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error || !paymentMethod) {
        throw new Error(error?.message || "Stripe payment failed");
      }

      const order = {
        ...orderInfo,
        cardInfo: paymentMethod,
      };

      const stripeInfo = await OrderServices.createPaymentIntent(order);
      // console.log("res", stripeInfo, "order", order);
      stripe.confirmCardPayment(stripeInfo?.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      // console.log("stripeInfo", stripeInfo);

      const orderData = { ...orderInfo, cardInfo: stripeInfo };
      const orderResponse = await OrderServices.addOrder(orderData);
      await handleOrderSuccess(orderResponse, orderInfo);
    } catch (err) {
      // Instead of just throwing the error, rethrow it so that it can be caught by the main submit handler
      throw new Error(err.message); // Ensure the error is propagated properly
    }
  };

  //handle razorpay payment
  const handlePaymentWithRazorpay = async (orderInfo) => {
    try {
      const { amount, id, currency } =
        await OrderServices.createOrderByRazorPay({
          amount: Math.round(orderInfo.total).toString(),
        });

      const options = {
        key: storeSetting?.razorpay_id,
        amount,
        currency,
        name: "stickersrhino Store",
        description: "This is the total cost of your purchase",
        order_id: id,
        handler: async (response) => {
          const razorpayDetails = {
            amount: orderInfo.total,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const orderData = { ...orderInfo, razorpay: razorpayDetails, car };
          const orderResponse = await OrderServices.addRazorpayOrder(orderData);
          await handleOrderSuccess(orderResponse, orderInfo);
        },
        prefill: {
          name: orderInfo?.user_info?.name || "Customer",
          email: orderInfo?.user_info?.email || "customer@example.com",
          contact: orderInfo?.user_info?.contact || "0000000000",
        },
        theme: { color: "#10b981" },
      };

      const rzpay = new Razorpay(options);
      rzpay.open();
    } catch (err) {
      console.error("Razorpay payment error:", err.message);
      throw new Error(err.message);
    }
  };

  const handleShippingCost = (value) => {
    // console.log("handleShippingCost", value);
    setShippingCost(Number(value));
  };

  // Fetch shipping rates when address is complete
  const fetchShippingRates = async (destination) => {
    // If no destination provided, read from form values
    if (!destination) {
      const values = getValues();
      destination = {
        address: values?.address,
        city: values?.city,
        state: values?.state,
        zipCode: values?.zipCode,
        country: values?.country,
      };
    }

    if (
      !destination?.address ||
      !destination?.city ||
      !destination?.zipCode ||
      !destination?.country
    ) {
      notifyError(
        "Please fill in complete shipping address before fetching rates.",
      );
      return;
    }

    setIsLoadingRates(true);
    try {
      // Split large quantities into multiple parcels for Stallion API compatibility
      // Stallion has issues with very large quantities (500+) in single parcel
      const MAX_ITEMS_PER_PARCEL = 500;

      const parcels = [];
      items.forEach((item, idx) => {
        const quantity = item.quantity;

        // Get weight from product - NO DEFAULTS, must be configured
        const itemWeight = item.weight || item.productWeight;
        const itemLength = item.length || item.productLength;
        const itemWidth = item.width || item.productWidth;
        const itemHeight = item.height || item.productHeight;

        console.log(`Item ${idx}:`, {
          title: item.title || item.name,
          quantity: quantity,
          weight: itemWeight,
          dimensions: `${itemLength}x${itemWidth}x${itemHeight}`,
          isCustomProduct: item.customData?.isCustomProduct || false,
        });

        // Validate that item has shipping properties configured
        if (!itemWeight || itemWeight <= 0) {
          throw new Error(
            `Item "${item.title || item.name}" is missing weight configuration. Please contact admin.`,
          );
        }
        if (!itemLength || itemLength <= 0) {
          throw new Error(
            `Item "${item.title || item.name}" is missing length configuration. Please contact admin.`,
          );
        }
        if (!itemWidth || itemWidth <= 0) {
          throw new Error(
            `Item "${item.title || item.name}" is missing width configuration. Please contact admin.`,
          );
        }
        if (!itemHeight || itemHeight <= 0) {
          throw new Error(
            `Item "${item.title || item.name}" is missing height configuration. Please contact admin.`,
          );
        }

        // If quantity exceeds limit, split into multiple parcels
        if (quantity > MAX_ITEMS_PER_PARCEL) {
          const numParcels = Math.ceil(quantity / MAX_ITEMS_PER_PARCEL);
          const baseQuantity = Math.floor(quantity / numParcels);
          const remainder = quantity % numParcels;

          for (let i = 0; i < numParcels; i++) {
            const parcelQuantity =
              i < remainder ? baseQuantity + 1 : baseQuantity;

            // Include all shipping properties (validated above)
            const parcel = {
              quantity: parcelQuantity,
              weight: itemWeight,
              length: itemLength,
              width: itemWidth,
              height: itemHeight,
            };

            parcels.push(parcel);
          }
          console.log(
            `Split item into ${numParcels} parcels of max ${MAX_ITEMS_PER_PARCEL} items each`,
          );
        } else {
          // Include all shipping properties (validated above)
          const parcel = {
            quantity: quantity,
            weight: itemWeight,
            length: itemLength,
            width: itemWidth,
            height: itemHeight,
          };

          parcels.push(parcel);
        }
      });

      const ratePayload = {
        destination: {
          name: destination.name || "Customer",
          address1: destination.address,
          city: destination.city,
          province: destination.state || "",
          state: destination.state || "",
          postalCode: destination.zipCode,
          country: destination.country,
        },
        parcels: parcels,
        items: items.map((item) => {
          const quantity = Number(item.quantity) || 1;
          const unitPrice = Number(item.price) || 0;
          const totalPrice = +(unitPrice * quantity).toFixed(2);

          console.log("[useCheckoutSubmit] Mapping item:", {
            title: item.title || item.name,
            quantity,
            unitPrice,
            totalPrice,
            rawPrice: item.price,
          });

          return {
            description: item.title || item.name || "Product",
            name: item.title || item.name,
            sku: item.sku || item.id,
            quantity: quantity,
            price: unitPrice,
            // Send total item price in `value` (client-side requirement). Backend will convert to unit price for Stallion.
            value: totalPrice,
            country_of_origin: "CA",
          };
        }),
      };

      console.log(
        "[useCheckoutSubmit] Rate payload:",
        JSON.stringify(ratePayload, null, 2),
      );

      const response = await ShippingServices.getRates(ratePayload);

      if (response.success && response.rates) {
        // Extract rates array from nested structure
        const ratesArray = response.rates.rates || response.rates;

        setShippingRates(ratesArray);

        // Auto-select cheapest rate
        if (ratesArray && ratesArray.length > 0) {
          const cheapest = ratesArray.reduce((prev, curr) =>
            (prev.total || prev.rate || prev.cost) <
            (curr.total || curr.rate || curr.cost)
              ? prev
              : curr,
          );
          console.log("Selected cheapest rate:", cheapest);
          setSelectedShippingRate(cheapest);
          setShippingCost(
            Number(cheapest.total || cheapest.rate || cheapest.cost || 0),
          );
        } else {
          console.warn(
            "Rates array is empty. Possible reasons:",
            "1. Stallion API has no carriers for this route",
            "2. Invalid shipping address",
            "3. Warehouse address not configured",
          );
          setShippingRates([]);
          notifyError(
            "No shipping rates available for this address. Please check your destination.",
          );
        }
      } else {
        console.error("Response success false or rates missing:", {
          success: response.success,
          hasRates: !!response.rates,
          message: response.message,
          error: response.error,
        });
        setShippingRates([]);
        notifyError(
          response.error || response.message || "No shipping rates available",
        );
      }
    } catch (error) {
      console.error("Failed to fetch shipping rates:", error);

      // Show specific validation errors or generic error
      const errorMessage =
        error.message || "Failed to load shipping rates. Please try again.";
      notifyError(errorMessage);

      setShippingRates([]);
    } finally {
      setIsLoadingRates(false);
    }
  };

  // Handle shipping rate selection
  const handleShippingRateSelection = (rate) => {
    setSelectedShippingRate(rate);
    setShippingCost(Number(rate.total || rate.rate || rate.cost || 0));
  };

  //handle default shipping address
  const handleDefaultShippingAddress = (value) => {
    // console.log("handle default shipping", value);
    setUseExistingAddress(value);
    if (value) {
      const address = data;
      const nameParts = address?.name?.split(" "); // Split the name into parts
      const firstName = nameParts[0]; // First name is the first element
      const lastName =
        nameParts?.length > 1 ? nameParts[nameParts?.length - 1] : ""; // Last name is the last element, if it exists
      // console.log("address", address.name.split(" "), "value", value);

      setValue("firstName", firstName);
      setValue("lastName", lastName);

      setValue("address", address.address);
      setValue("contact", address.contact);
      // setValue("email", address.email);
      setValue("city", address.city);
      setValue("country", address.country);
      setValue("zipCode", address.zipCode);
    } else {
      setValue("firstName");
      setValue("lastName");
      setValue("address");
      setValue("contact");
      // setValue("email");
      setValue("city");
      setValue("country");
      setValue("zipCode");
    }
  };
  const handleCouponCode = async (e) => {
    e.preventDefault();

    if (!couponRef.current.value) {
      notifyError("Please Input a Coupon Code!");
      return;
    }
    setIsCouponAvailable(true);

    try {
      const coupons = await CouponServices.getShowingCoupons();
      const enteredCode = couponRef.current.value
        .replace(/\s+/g, "")
        .toUpperCase();
      const result = coupons.filter(
        (coupon) =>
          coupon.couponCode.replace(/\s+/g, "").toUpperCase() === enteredCode,
      );
      setIsCouponAvailable(false);

      if (result.length < 1) {
        notifyError("Please Input a Valid Coupon!");
        return;
      }

      if (dayjs().isAfter(dayjs(result[0]?.endTime))) {
        notifyError("This coupon is not valid!");
        return;
      }

      if (total < result[0]?.minimumAmount) {
        notifyError(
          `Minimum ${result[0].minimumAmount} USD required for Apply this coupon!`,
        );
        return;
      } else {
        notifySuccess(
          `Your Coupon ${result[0].couponCode} is Applied on ${result[0].productType}!`,
        );
        setIsCouponApplied(true);
        setMinimumAmount(result[0]?.minimumAmount);
        setDiscountPercentage(result[0].discountType);
        dispatch({ type: "SAVE_COUPON", payload: result[0] });
        Cookies.set("couponInfo", JSON.stringify(result[0]));
      }
    } catch (error) {
      return notifyError(error.message);
    }
  };

  return {
    register,
    errors,
    showCard,
    setShowCard,
    error,
    stripe,
    couponInfo,
    couponRef,
    total,
    isEmpty,
    items,
    cartTotal,
    handleSubmit,
    submitHandler,
    handleShippingCost,
    handleCouponCode,
    discountPercentage,
    discountAmount,
    shippingCost,
    isCheckoutSubmit,
    isCouponApplied,
    useExistingAddress,
    hasShippingAddress,
    isCouponAvailable,
    handleDefaultShippingAddress,
    shippingRates,
    selectedShippingRate,
    isLoadingRates,
    fetchShippingRates,
    handleShippingRateSelection,
  };
};

export default useCheckoutSubmit;
