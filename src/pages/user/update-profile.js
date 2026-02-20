import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import React, { useEffect, useState, useCallback } from "react";
import { FiUser, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";

//internal import
import Error from "@components/form/Error";
import Dashboard from "@pages/user/dashboard";
import InputArea from "@components/form/InputArea";
import useGetSetting from "@hooks/useGetSetting";
import CustomerServices from "@services/CustomerServices";
import { notifySuccess, notifyError } from "@utils/toast";
import useUtilsFunction from "@hooks/useUtilsFunction";

const UpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPhoneAuth = searchParams?.get("fromPhoneAuth") === "true";

  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
    },
  });

  const initializeForm = useCallback(() => {
    if (session?.user) {
      setValue("name", session.user.name || "", { shouldValidate: true });
      setValue("email", session.user.email || "", { shouldValidate: true });
      setValue("address", session.user.address || "", {
        shouldValidate: false,
      });
      setValue("phone", session.user.phone || "", { shouldValidate: false });
    }
  }, [session?.user, setValue]);

  useEffect(() => {
    initializeForm();
  }, [initializeForm]);

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    const userData = {
      name: data.name?.trim(),
      email: data.email?.trim(),
      address: data.address?.trim(),
      phone: data.phone?.trim(),
    };

    try {
      const res = await CustomerServices.updateCustomer(
        session?.user?.id,
        userData,
      );

      // Update session with new data including the new token
      await update({
        ...session,
        user: {
          ...session.user,
          ...res,
        },
      });

      notifySuccess("Profile Updated Successfully!");

      // If redirected from phone auth, navigate to dashboard after successful update
      if (fromPhoneAuth) {
        setTimeout(() => {
          router.push("/user/dashboard");
        }, 1000);
      }
    } catch (error) {
      notifyError(
        error?.response?.data?.message || error?.message || "Update failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const validationRules = {
    name: {
      required: "Name is required",
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters",
      },
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
    address: {
      required: fromPhoneAuth ? "Address is required" : false,
      minLength: fromPhoneAuth
        ? {
            value: 5,
            message: "Address must be at least 5 characters",
          }
        : undefined,
    },
    phone: {
      required: fromPhoneAuth ? "Phone number is required" : false,
      pattern: {
        value: /^[+]?[\d\s-()]+$/,
        message: "Invalid phone number",
      },
    },
  };

  const isFormDisabled = loading || !isDirty || !isValid;

  return (
    <Dashboard
      title={showingTranslateValue(
        storeCustomizationSetting?.dashboard?.update_profile,
      )}
      description="Update your personal information"
    >
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="py-4 flex flex-col lg:flex-row w-full">
          <div className="w-full">
            <div className="mx-auto text-left w-full max-w-4xl px-4 py-8 sm:p-10 overflow-hidden transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="overflow-hidden mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold font-serif text-black">
                    Update Profile
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 mt-2">
                    {fromPhoneAuth
                      ? "Please complete your profile to continue"
                      : "Manage your personal information"}
                  </p>
                  {fromPhoneAuth && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-gray-700">
                        <strong>Required:</strong> Please fill in all mandatory
                        fields (*) to complete your profile setup.
                      </p>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col justify-center"
                >
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="form-group">
                        <InputArea
                          register={register}
                          label={
                            <>
                              Full Name <span className="text-red-500">*</span>
                            </>
                          }
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          Icon={FiUser}
                          validation={validationRules.name}
                          disabled={loading}
                        />
                        <Error errorName={errors.name} />
                      </div>

                      {/* Email */}
                      <div className="form-group">
                        <InputArea
                          register={register}
                          name="email"
                          type="email"
                          label="Email Address"
                          placeholder="Your email address"
                          Icon={FiMail}
                          validation={validationRules.email}
                          disabled={loading}
                        />
                        <Error errorName={errors.email} />
                      </div>

                      {/* Phone */}
                      <div className="form-group">
                        <InputArea
                          register={register}
                          label={
                            <>
                              Phone Number{" "}
                              {fromPhoneAuth && (
                                <span className="text-red-500">*</span>
                              )}
                            </>
                          }
                          name="phone"
                          type="tel"
                          placeholder="Your phone number"
                          Icon={FiPhone}
                          validation={validationRules.phone}
                          disabled={loading}
                        />
                        <Error errorName={errors.phone} />
                      </div>

                      {/* Address */}
                      <div className="form-group md:col-span-2">
                        <InputArea
                          register={register}
                          label={
                            <>
                              Address{" "}
                              {fromPhoneAuth && (
                                <span className="text-red-500">*</span>
                              )}
                            </>
                          }
                          name="address"
                          type="text"
                          placeholder="Your complete address"
                          Icon={FiMapPin}
                          validation={validationRules.address}
                          disabled={loading}
                        />
                        <Error errorName={errors.address} />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          initializeForm();
                        }}
                        disabled={loading || !isDirty}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        Reset Changes
                      </button>

                      {loading ? (
                        <button
                          disabled={loading}
                          type="submit"
                          className="md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-lg placeholder-white focus-visible:outline-none focus:outline-none bg-black text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:bg-black-600 h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto"
                        >
                          <img
                            src="/loader/spinner.gif"
                            alt="Loading"
                            width={20}
                            height={10}
                          />
                          <span className="font-serif ml-2 font-light">
                            Processing
                          </span>
                        </button>
                      ) : (
                        <button
                          disabled={isFormDisabled}
                          type="submit"
                          className="w-full sm:w-auto text-center py-3 px-8 rounded-lg bg-black text-white hover:bg-black-600 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 h-12 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Update Profile
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default UpdateProfile;
