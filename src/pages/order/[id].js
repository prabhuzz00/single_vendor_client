import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { IoPrintOutline } from "react-icons/io5";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ReactToPrint = dynamic(() => import("react-to-print"), { ssr: false });

//internal import

import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import Invoice from "@components/invoice/Invoice";
import Loading from "@components/preloader/Loading";
import OrderServices from "@services/OrderServices";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Order = ({ params }) => {
  const printRef = useRef();
  const orderId = params.id;
  const queryClient = useQueryClient();

  // Cancel flow state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundDetails, setRefundDetails] = useState({
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
  });
  const [refundFormError, setRefundFormError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState(null);
  const [cancelError, setCancelError] = useState(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ["order"],
    queryFn: async () => await OrderServices.getOrderById(orderId),
  });

  const { showingTranslateValue, currency } = useUtilsFunction();
  const { storeCustomizationSetting, globalSetting } = useGetSetting();

  // Step 1: open confirmation modal
  const handleCancelOrder = () => {
    setShowConfirmModal(true);
  };

  // Step 2: user confirmed → move to refund form
  const handleConfirmYes = () => {
    setShowConfirmModal(false);
    setShowRefundForm(true);
  };

  // Step 2 dismiss
  const handleConfirmNo = () => {
    setShowConfirmModal(false);
  };

  // Step 3: submit refund form
  const handleSubmitRefund = async (e) => {
    e.preventDefault();
    setRefundFormError(null);

    if (!refundDetails.accountNumber.trim()) {
      setRefundFormError("Account number is required.");
      return;
    }
    if (refundDetails.accountNumber !== refundDetails.confirmAccountNumber) {
      setRefundFormError("Account numbers do not match.");
      return;
    }
    if (!refundDetails.ifscCode.trim()) {
      setRefundFormError("IFSC code is required.");
      return;
    }

    try {
      setCancelLoading(true);
      setCancelError(null);
      setCancelMessage(null);
      const res = await OrderServices.requestCancelOrder(orderId, {
        accountNumber: refundDetails.accountNumber,
        ifscCode: refundDetails.ifscCode,
        refundAmount: data?.total,
      });
      setCancelMessage(res?.message || "Cancellation requested successfully!");
      setShowRefundForm(false);
      queryClient.invalidateQueries(["order"]);
    } catch (err) {
      setCancelError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to request cancellation.",
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const isPending = data?.status === "Pending";
  const isCancelled = data?.status === "Cancel";
  const isCancellationRequested = data?.cancellationRequested;

  return (
    <Layout title="Invoice" description="order confirmation page">
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : error ? (
        <h2 className="text-xl text-center my-10 mx-auto w-11/12 text-red-400">
          {error}
        </h2>
      ) : (
        <div className="max-w-screen-2xl mx-auto py-10 px-3 sm:px-6">
          <div className="bg-yellow-50 rounded-lg mb-5 px-4 py-3">
            <label>
              {showingTranslateValue(
                storeCustomizationSetting?.dashboard?.invoice_message_first,
              )}{" "}
              <span className="font-bold text-yellow-600">
                {data?.user_info?.name},
              </span>{" "}
              {showingTranslateValue(
                storeCustomizationSetting?.dashboard?.invoice_message_last,
              )}
            </label>
          </div>
          <div className="bg-white rounded-lg shadow-xl">
            <Invoice
              data={data}
              printRef={printRef}
              currency={currency}
              globalSetting={globalSetting}
            />
            <div className="bg-white p-8 rounded-b-xl">
              <div className="flex lg:flex-row md:flex-row sm:flex-row flex-col justify-between invoice-btn">
                <ReactToPrint
                  trigger={() => (
                    <button className="mb-3 sm:mb-0 md:mb-0 lg:mb-0 flex items-center justify-center bg-black text-white transition-all font-serif text-sm font-semibold h-10 py-2 px-5 rounded-lg hover:bg-gray-900">
                      {showingTranslateValue(
                        storeCustomizationSetting?.dashboard?.print_button,
                      )}{" "}
                      <span className="ml-2">
                        <IoPrintOutline />
                      </span>
                    </button>
                  )}
                  content={() => printRef.current}
                  documentTitle="Invoice"
                />

                {/* Cancel Order Section */}
                <div className="flex flex-col items-start sm:items-end gap-2">
                  {cancelMessage && (
                    <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                      {cancelMessage}
                    </div>
                  )}
                  {cancelError && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                      {cancelError}
                    </div>
                  )}
                  {isPending ? (
                    isCancellationRequested ? (
                      <div className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 font-medium">
                        Cancellation requested. Awaiting admin review.
                      </div>
                    ) : (
                      <button
                        onClick={handleCancelOrder}
                        disabled={cancelLoading}
                        className="flex items-center justify-center bg-red-600 text-white transition-all font-serif text-sm font-semibold h-10 py-2 px-5 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancelLoading ? "Requesting..." : "Cancel Order"}
                      </button>
                    )
                  ) : isCancelled ? (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 font-medium">
                      Order cancelled.{" "}
                      <a
                        href="/terms-and-conditions"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        View Cancellation Policy
                      </a>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                      Order is already processed, can&apos;t cancel.{" "}
                      <a
                        href="/terms-and-conditions"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        View Cancellation Policy
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 1: Confirmation Modal ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
              Cancel Order
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to cancel this order?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmNo}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                No, Keep It
              </button>
              <button
                onClick={handleConfirmYes}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Refund Details Form ── */}
      {showRefundForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Refund Details
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Please provide your bank account details for the refund.
            </p>

            <form onSubmit={handleSubmitRefund} className="space-y-4">
              {/* Refund Amount (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Amount
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${currency}${data?.total ?? "0"}`}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 font-semibold cursor-not-allowed"
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter account number"
                  value={refundDetails.accountNumber}
                  onChange={(e) =>
                    setRefundDetails((prev) => ({
                      ...prev,
                      accountNumber: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>

              {/* Confirm Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Re-enter account number"
                  value={refundDetails.confirmAccountNumber}
                  onChange={(e) =>
                    setRefundDetails((prev) => ({
                      ...prev,
                      confirmAccountNumber: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>

              {/* IFSC Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="E.g. SBIN0001234"
                  value={refundDetails.ifscCode}
                  onChange={(e) =>
                    setRefundDetails((prev) => ({
                      ...prev,
                      ifscCode: e.target.value.toUpperCase(),
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>

              {/* Inline error */}
              {refundFormError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {refundFormError}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowRefundForm(false)}
                  disabled={cancelLoading}
                  className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={cancelLoading}
                  className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelLoading ? "Submitting..." : "Submit Cancellation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps = ({ params }) => {
  return {
    props: { params },
  };
};

export default dynamic(() => Promise.resolve(Order), { ssr: false });
