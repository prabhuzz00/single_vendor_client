import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { CardElement, Elements } from "@stripe/react-stripe-js";
import Link from "next/link";
import {
  IoReturnUpBackOutline,
  IoArrowForward,
  IoBagHandle,
  IoWalletSharp,
} from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { ImCreditCard } from "react-icons/im";
import useTranslation from "next-translate/useTranslation";

//internal import

import Layout from "@layout/Layout";
import Label from "@components/form/Label";
import Error from "@components/form/Error";
import CartItem from "@components/cart/CartItem";
import InputArea from "@components/form/InputArea";
import useGetSetting from "@hooks/useGetSetting";
import InputShipping from "@components/form/InputShipping";
import InputPayment from "@components/form/InputPayment";
import useCheckoutSubmit from "@hooks/useCheckoutSubmit";
import useUtilsFunction from "@hooks/useUtilsFunction";
import SettingServices from "@services/SettingServices";
import SwitchToggle from "@components/form/SwitchToggle";
import getStripe from "@lib/stripe";

const stripePromise = getStripe();

const Checkout = () => {
  const { t } = useTranslation();
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  const { data: storeSetting } = useQuery({
    queryKey: ["storeSetting"],
    queryFn: async () => await SettingServices.getStoreSetting(),
    staleTime: 4 * 60 * 1000, // Api request after 4 minutes
  });

  const {
    error,
    stripe,
    couponInfo,
    couponRef,
    total,
    isEmpty,
    items,
    cartTotal,
    currency,
    register,
    errors,
    showCard,
    setShowCard,
    handleSubmit,
    submitHandler,
    handleShippingCost,
    handleCouponCode,
    discountAmount,
    shippingCost,
    isCheckoutSubmit,
    useExistingAddress,
    hasShippingAddress,
    isCouponAvailable,
    handleDefaultShippingAddress,
    shippingRates,
    selectedShippingRate,
    isLoadingRates,
    fetchShippingRates,
    handleShippingRateSelection,
  } = useCheckoutSubmit(storeSetting);

  return (
    <>
      <Head>
        {/* Only preconnect to Stripe when on the checkout page to avoid unused preconnects */}
        <link
          rel="preconnect"
          href="https://js.stripe.com"
          crossOrigin="true"
        />
        <link
          rel="preconnect"
          href="https://m.stripe.network"
          crossOrigin="true"
        />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
      </Head>
      <Layout title="Checkout" description="this is checkout page">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
          <div className="py-10 lg:py-12 px-0 2xl:max-w-screen-2xl w-full xl:max-w-screen-xl flex flex-col md:flex-row lg:flex-row">
            <div className="md:w-full lg:w-3/5 flex h-full flex-col order-2 sm:order-1 lg:order-1">
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={handleSubmit(submitHandler)}>
                  {hasShippingAddress && (
                    <div className="flex justify-end my-2">
                      <SwitchToggle
                        id="shipping-address"
                        title="Use Default Shipping Address"
                        processOption={useExistingAddress}
                        handleProcess={handleDefaultShippingAddress}
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <h2 className="font-semibold font-serif text-base text-black pb-3">
                      01.{" "}
                      {showingTranslateValue(
                        storeCustomizationSetting?.checkout?.personal_details,
                      )}
                    </h2>

                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={
                            <>
                              {showingTranslateValue(
                                storeCustomizationSetting?.checkout?.first_name,
                              )}
                              <span className="text-red-500 ml-1">*</span>
                            </>
                          }
                          name="firstName"
                          type="text"
                          placeholder="John"
                        />
                        <Error errorName={errors.firstName} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={showingTranslateValue(
                            storeCustomizationSetting?.checkout?.last_name,
                          )}
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          required={false}
                        />
                        <Error errorName={errors.lastName} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={
                            <>
                              {showingTranslateValue(
                                storeCustomizationSetting?.checkout
                                  ?.email_address,
                              )}
                              <span className="text-red-500 ml-1">*</span>
                            </>
                          }
                          name="email"
                          type="email"
                          readOnly={false}
                          placeholder="youremail@gmail.com"
                        />
                        <Error errorName={errors.email} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={
                            <>
                              {showingTranslateValue(
                                storeCustomizationSetting?.checkout
                                  ?.checkout_phone,
                              )}
                              <span className="text-red-500 ml-1">*</span>
                            </>
                          }
                          name="contact"
                          type="tel"
                          placeholder="+062-6532956"
                        />

                        <Error errorName={errors.contact} />
                      </div>
                    </div>
                  </div>

                  <div className="form-group mt-12">
                    <h2 className="font-semibold font-serif text-base text-black pb-3">
                      02.{" "}
                      {showingTranslateValue(
                        storeCustomizationSetting?.checkout?.shipping_details,
                      )}
                    </h2>

                    <div className="grid grid-cols-6 gap-6 mb-8">
                      <div className="col-span-6">
                        <InputArea
                          register={register}
                          label={
                            <>
                              {showingTranslateValue(
                                storeCustomizationSetting?.checkout
                                  ?.street_address,
                              )}
                              <span className="text-red-500 ml-1">*</span>
                            </>
                          }
                          name="address"
                          type="text"
                          placeholder="123 Boulevard Rd, Beverley Hills"
                        />
                        <Error errorName={errors.address} />
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <InputArea
                          register={register}
                          label={
                            <>
                              {showingTranslateValue(
                                storeCustomizationSetting?.checkout?.city,
                              )}
                              <span className="text-red-500 ml-1">*</span>
                            </>
                          }
                          name="city"
                          type="text"
                          placeholder="Los Angeles"
                        />
                        <Error errorName={errors.city} />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <InputArea
                          register={register}
                          label={
                            <>
                              {showingTranslateValue(
                                storeCustomizationSetting?.checkout?.country,
                              )}
                              <span className="text-red-500 ml-1">*</span>
                            </>
                          }
                          name="country"
                          type="text"
                          placeholder="United States"
                        />
                        <Error errorName={errors.country} />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <InputArea
                          register={register}
                          label={
                            <>
                              {showingTranslateValue(
                                storeCustomizationSetting?.checkout?.zip_code,
                              )}
                              <span className="text-red-500 ml-1">*</span>
                            </>
                          }
                          name="zipCode"
                          type="text"
                          placeholder="2345"
                        />
                        <Error errorName={errors.zipCode} />
                      </div>
                    </div>

                    <Label
                      label={showingTranslateValue(
                        storeCustomizationSetting?.checkout?.shipping_cost,
                      )}
                    />

                    {/* Stallion Express Shipping Integration */}
                    <div className="mb-6">
                      <button
                        type="button"
                        onClick={() => fetchShippingRates()}
                        disabled={isLoadingRates}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isLoadingRates
                          ? "Loading Rates..."
                          : "Get Shipping Rates"}
                      </button>
                    </div>

                    {shippingRates.length > 0 && (
                      <div className="space-y-3 mb-6">
                        {shippingRates.map((rate, index) => (
                          <label
                            key={index}
                            className="flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                            style={{
                              borderColor:
                                selectedShippingRate === rate
                                  ? "#fbbf24"
                                  : "#d1d5db",
                              backgroundColor:
                                selectedShippingRate === rate
                                  ? "#fffbeb"
                                  : "#ffffff",
                            }}
                          >
                            <input
                              type="radio"
                              name="shipping-rate"
                              value={index}
                              checked={selectedShippingRate === rate}
                              onChange={() => handleShippingRateSelection(rate)}
                              className="mt-1 mr-3 h-4 w-4 cursor-pointer accent-yellow-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm">
                                  {rate.postage_type ||
                                    rate.serviceName ||
                                    rate.service ||
                                    "Standard Shipping"}
                                </h4>
                                <span className="font-bold text-sm ml-2 flex-shrink-0">
                                  {rate.currency || currency}
                                  {(
                                    rate.total ||
                                    rate.rate ||
                                    rate.cost ||
                                    0
                                  ).toFixed(2)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                {rate.package_type ||
                                  rate.description ||
                                  "Reliable shipping service"}
                              </p>
                              {(rate.delivery_days ||
                                rate.estimatedDelivery) && (
                                <p className="text-xs text-gray-500">
                                  Est. Delivery:{" "}
                                  {rate.delivery_days || rate.estimatedDelivery}{" "}
                                  days
                                </p>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Fallback to manual shipping cost if rates not loaded */}
                    {shippingRates.length === 0 && (
                      <div className="text-gray-500 text-sm py-4">
                        Click "Get Shipping Rates" to see available shipping
                        options
                      </div>
                    )}
                  </div>
                  <div className="form-group mt-12">
                    <h2 className="font-semibold text-base text-black pb-3">
                      03.{" "}
                      {showingTranslateValue(
                        storeCustomizationSetting?.checkout?.payment_method,
                      )}
                    </h2>
                    {showCard && (
                      <div className="mb-3">
                        <CardElement
                          options={{
                            hidePostalCode: true,
                          }}
                        />{" "}
                        <p className="text-red-400 text-sm mt-1">{error}</p>
                      </div>
                    )}
                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
                      {storeSetting?.cod_status && (
                        <div className="">
                          <InputPayment
                            setShowCard={setShowCard}
                            register={register}
                            name={t("common:cashOnDelivery")}
                            value="Cash"
                            Icon={IoWalletSharp}
                          />
                          <Error errorMessage={errors.paymentMethod} />
                        </div>
                      )}

                      {storeSetting?.stripe_status && (
                        <div className="">
                          <InputPayment
                            setShowCard={setShowCard}
                            register={register}
                            name={t("common:creditCard")}
                            value="Card"
                            Icon={ImCreditCard}
                          />
                          <Error errorMessage={errors.paymentMethod} />
                        </div>
                      )}

                      {/* {storeSetting?.razorpay_status && ( */}
                      <div className="">
                        <InputPayment
                          setShowCard={setShowCard}
                          register={register}
                          name="RazorPay"
                          value="RazorPay"
                          Icon={ImCreditCard}
                        />
                        <Error errorMessage={errors.paymentMethod} />
                      </div>
                      {/* )} */}
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-4 lg:gap-6 mt-10">
                    <div className="col-span-6 sm:col-span-3">
                      <Link
                        href="/"
                        className="bg-yellow-50 border border-gray-300 rounded-lg py-3 text-center text-sm font-medium text-gray-600 hover:text-black hover:border-yellow-600 transition-all flex justify-center font-serif w-full"
                      >
                        <span className="text-xl mr-2">
                          <IoReturnUpBackOutline />
                        </span>
                        {showingTranslateValue(
                          storeCustomizationSetting?.checkout?.continue_button,
                        )}
                      </Link>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <button
                        type="submit"
                        disabled={isEmpty || !stripe || isCheckoutSubmit}
                        className="border border-yellow-600 text-yellow-600 hover:bg-black hover:text-white transition-all rounded-lg py-3 text-center text-sm font-serif font-medium flex justify-center w-full"
                      >
                        {isCheckoutSubmit ? (
                          <span className="flex justify-center text-center">
                            {" "}
                            <img
                              src="/loader/spinner.gif"
                              alt="Loading"
                              width={20}
                              height={10}
                            />{" "}
                            <span className="ml-2">
                              {t("common:processing")}
                            </span>
                          </span>
                        ) : (
                          <span className="flex justify-center text-center">
                            {showingTranslateValue(
                              storeCustomizationSetting?.checkout
                                ?.confirm_button,
                            )}
                            <span className="text-xl ml-2">
                              {" "}
                              <IoArrowForward />
                            </span>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="md:w-full lg:w-2/5 lg:ml-10 xl:ml-14 md:ml-6 flex flex-col h-full md:sticky lg:sticky top-28 md:order-2 lg:order-2">
              <div className="border border-gray-300 p-5 lg:px-8 lg:py-8 rounded-lg bg-white order-1 sm:order-2">
                <h2 className="font-semibold font-serif text-lg pb-4 text-black">
                  {showingTranslateValue(
                    storeCustomizationSetting?.checkout?.order_summary,
                  )}
                </h2>

                <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-64 bg-yellow-50 block">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} currency={currency} />
                  ))}

                  {isEmpty && (
                    <div className="text-center py-10">
                      <span className="flex justify-center my-auto text-gray-600 font-semibold text-4xl">
                        <IoBagHandle />
                      </span>
                      <h2 className="font-medium font-serif text-sm pt-2 text-gray-600">
                        No Item Added Yet!
                      </h2>
                    </div>
                  )}
                </div>

                <div className="flex items-center mt-4 py-4 lg:py-4 text-sm w-full font-semibold text-heading last:border-b-0 last:text-base last:pb-0">
                  <form className="w-full">
                    {couponInfo.couponCode ? (
                      <span className="bg-yellow-50 px-4 py-3 leading-tight w-full rounded-lg flex justify-between">
                        {" "}
                        <p className="text-yellow-600">Coupon Applied </p>{" "}
                        <span className="text-red-500 text-right">
                          {couponInfo.couponCode}
                        </span>
                      </span>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-start justify-end">
                        <input
                          ref={couponRef}
                          type="text"
                          placeholder={t("common:couponCode")}
                          className="form-input py-2 px-3 md:px-4 w-full appearance-none transition ease-in-out border text-input text-sm rounded-lg h-12 duration-200 bg-white border-gray-300 focus:ring-0 focus:outline-none focus:border-yellow-600 placeholder-gray-500 placeholder-opacity-75"
                        />
                        {isCouponAvailable ? (
                          <button
                            disabled={isCouponAvailable}
                            type="submit"
                            className="md:text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border border-gray-300 rounded-lg placeholder-white focus-visible:outline-none focus:outline-none px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-3 mt-3 sm:mt-0 sm:ml-3 md:mt-0 md:ml-3 lg:mt-0 lg:ml-3 hover:text-white hover:bg-black h-12 text-sm lg:text-base w-full sm:w-auto"
                          >
                            <img
                              src="/loader/spinner.gif"
                              alt="Loading"
                              width={20}
                              height={10}
                            />
                            <span className=" ml-2 font-light">Processing</span>
                          </button>
                        ) : (
                          <button
                            disabled={isCouponAvailable}
                            onClick={handleCouponCode}
                            className="md:text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border border-gray-300 rounded-lg placeholder-white focus-visible:outline-none focus:outline-none px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-3 mt-3 sm:mt-0 sm:ml-3 md:mt-0 md:ml-3 lg:mt-0 lg:ml-3 hover:text-white hover:bg-black h-12 text-sm lg:text-base w-full sm:w-auto"
                          >
                            {showingTranslateValue(
                              storeCustomizationSetting?.checkout?.apply_button,
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </form>
                </div>
                <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-600 last:border-b-0 last:text-base last:pb-0">
                  {showingTranslateValue(
                    storeCustomizationSetting?.checkout?.sub_total,
                  )}
                  <span className="ml-auto flex-shrink-0 text-black font-bold">
                    {currency}
                    {cartTotal?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-600 last:border-b-0 last:text-base last:pb-0">
                  {showingTranslateValue(
                    storeCustomizationSetting?.checkout?.shipping_cost,
                  )}
                  <span className="ml-auto flex-shrink-0 text-black font-bold">
                    {currency}
                    {shippingCost?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center py-2 text-sm w-full font-semibold text-gray-600 last:border-b-0 last:text-base last:pb-0">
                  {showingTranslateValue(
                    storeCustomizationSetting?.checkout?.discount,
                  )}
                  <span className="ml-auto flex-shrink-0 font-bold text-orange-400">
                    {currency}
                    {discountAmount.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-300 mt-4">
                  <div className="flex items-center font-bold font-serif justify-between pt-5 text-sm uppercase">
                    {showingTranslateValue(
                      storeCustomizationSetting?.checkout?.total_cost,
                    )}
                    <span className="font-serif font-extrabold text-lg">
                      {currency}
                      {parseFloat(total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

// Wrap checkout with Stripe Elements only on this page
const CheckoutWithStripe = () => (
  <Elements stripe={stripePromise}>
    <Checkout />
  </Elements>
);

export default dynamic(() => Promise.resolve(CheckoutWithStripe), {
  ssr: false,
});
