import { notifyError, notifySuccess } from "@utils/toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

//internal import
import { getUserSession } from "@lib/auth";
import { countries } from "@utils/countries";
import CustomerServices from "@services/CustomerServices";

const useShippingAddressSubmit = (id) => {
  const router = useRouter();
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedValue, setSelectedValue] = useState({
    country: "",
    city: "",
    area: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 'idle' | 'loading' | 'found' | 'partial' | 'not-found' | 'error'
  const [zipLookupStatus, setZipLookupStatus] = useState("idle");

  const userInfo = getUserSession();
  // if `id` is provided in the URL (e.g. /user/add-shipping-address?id=...),
  // use it as the target user id, otherwise default to the logged-in user
  const targetUserId = id || userInfo?.id;

  // const { handlerTextTranslateHandler } = useTranslationValue();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    // clearErrors,
    // reset,
    formState: { errors },
  } = useForm();

  // ── Zip code auto-fill ──────────────────────────────────────────────────────
  const watchedZip = watch("zipCode");

  useEffect(() => {
    const zip = (watchedZip || "").trim();
    if (zip.length < 3) {
      setZipLookupStatus("idle");
      return;
    }

    setZipLookupStatus("loading");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(zip)}&format=json&addressdetails=1&limit=3`,
          {
            headers: {
              "Accept-Language": "en",
              "User-Agent": "StickersRhino/1.0",
            },
          },
        );
        const data = await res.json();

        if (!data || data.length === 0) {
          setZipLookupStatus("not-found");
          return;
        }

        const addr = data[0].address;
        const countryName = addr?.country || "";
        const cityName =
          addr?.city ||
          addr?.town ||
          addr?.municipality ||
          addr?.county ||
          addr?.state_district ||
          "";
        const areaName =
          addr?.suburb || addr?.neighbourhood || addr?.hamlet || "";

        // Match country in local data (case-insensitive)
        const matchedCountry = countries.find(
          (c) => c.name.toLowerCase() === countryName.toLowerCase(),
        );

        if (!matchedCountry) {
          setZipLookupStatus("not-found");
          return;
        }

        // Auto-select country → populate city list (use ISO code)
        setSelectedValue((prev) => ({
          ...prev,
          country: matchedCountry.code,
          city: "",
          area: "",
        }));
        setCities(matchedCountry.cities);
        setAreas([]);

        // Match city
        const matchedCity = matchedCountry.cities.find(
          (c) => c.name.toLowerCase() === cityName.toLowerCase(),
        );

        if (!matchedCity) {
          setZipLookupStatus("partial"); // country matched only
          return;
        }

        setSelectedValue((prev) => ({
          ...prev,
          city: matchedCity.name,
          area: "",
        }));
        setAreas(matchedCity.areas);

        // Match area
        const matchedArea = matchedCity.areas.find(
          (a) => a.toLowerCase() === areaName.toLowerCase(),
        );

        if (matchedArea) {
          setSelectedValue((prev) => ({ ...prev, area: matchedArea }));
          setZipLookupStatus("found");
        } else {
          setZipLookupStatus("partial"); // country + city matched
        }
      } catch {
        setZipLookupStatus("error");
      }
    }, 700);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedZip]);
  // ─────────────────────────────────────────────────────────────────────────────

  const onSubmit = async (data) => {
    if (
      !selectedValue?.country ||
      !selectedValue?.city ||
      !selectedValue?.area
    ) {
      return notifyError("Country, city and area is required!");
    }
    setIsSubmitting(true);
    try {
      const res = await CustomerServices.addShippingAddress({
        userId: targetUserId,
        shippingAddressData: {
          ...data,
          country: selectedValue.country,
          city: selectedValue.city,
          area: selectedValue.area,
        },
      });

      notifySuccess(res.message);
      setIsSubmitting(false);
      router.push("/user/my-account");

      // console.log("onSubmit", data);
    } catch (err) {
      setIsSubmitting(false);
      notifyError(err ? err?.response?.data?.message : err?.message);
    }
  };

  const handleInputChange = (name, value) => {
    // console.log("handleInputChange", name, "value", value);
    setSelectedValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "country") {
      // value is country code now
      const matched = countries?.find((country) => country?.code === value);
      const result = matched ? matched.cities : [];
      setCities(result);
      setAreas([]);
    }
    if (name === "city") {
      const result = cities?.find((city) => city?.name === value).areas;
      setAreas(result);
    }
  };

  const { data, isFetched } = useQuery({
    queryKey: ["shippingAddress", { id: targetUserId }],
    queryFn: async () =>
      await CustomerServices.getShippingAddress({
        userId: targetUserId,
      }),
    select: (data) => data?.shippingAddress,
  });

  useEffect(() => {
    if (isFetched && data) {
      setValue("name", data.name);
      setValue("address", data.address);
      setValue("contact", data.contact);
      setValue("email", data.email || userInfo?.email);
      // Determine whether stored country is a code or full name
      const storedCountry = data.country || "";
      let matchedCountry = countries.find((c) => c.code === storedCountry);
      if (!matchedCountry) {
        matchedCountry = countries.find(
          (c) => c.name.toLowerCase() === (storedCountry || "").toLowerCase(),
        );
      }

      const countryValue = matchedCountry ? matchedCountry.code : storedCountry;
      setValue("country", countryValue);
      setValue("city", data.city);
      setValue("area", data.area);
      setValue("zipCode", data.zipCode);
      setSelectedValue({
        country: countryValue,
        city: data.city,
        area: data.area,
      });
      setCities(matchedCountry ? matchedCountry.cities : [{ name: data.city }]);
      setAreas([data.area]);
    } else {
      setValue("email", userInfo?.email);
    }
  }, [data]);

  return {
    register,
    onSubmit,
    errors,
    cities,
    areas,
    setValue,
    handleSubmit,
    selectedValue,
    isSubmitting,
    handleInputChange,
    zipLookupStatus,
  };
};

export default useShippingAddressSubmit;
