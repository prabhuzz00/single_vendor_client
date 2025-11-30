import useUtilsFunction from "@hooks/useUtilsFunction";

// Color mapping for common color names
const colorMap = {
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  yellow: "#FFFF00",
  black: "#000000",
  white: "#FFFFFF",
  purple: "#800080",
  pink: "#FFC0CB",
  orange: "#FFA500",
  brown: "#A52A2A",
  gray: "#808080",
  grey: "#808080",
  navy: "#000080",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  lime: "#00FF00",
  maroon: "#800000",
  olive: "#808000",
  teal: "#008080",
  silver: "#C0C0C0",
  gold: "#FFD700",
  beige: "#F5F5DC",
  ivory: "#FFFFF0",
  khaki: "#F0E68C",
  lavender: "#E6E6FA",
  coral: "#FF7F50",
  salmon: "#FA8072",
  peach: "#FFDAB9",
  mint: "#98FF98",
  turquoise: "#40E0D0",
  indigo: "#4B0082",
  violet: "#EE82EE",
  crimson: "#DC143C",
  scarlet: "#FF2400",
  "deep ash": "#B2BEB5",
  "turkish blue": "#4E8397",
};

const VariantList = ({
  att,
  option,
  variants,
  setValue,
  varTitle,
  selectVariant,
  setSelectVariant,
  setSelectVa,
}) => {
  const { showingTranslateValue } = useUtilsFunction();

  const handleChangeVariant = (v) => {
    setValue(v);
    setSelectVariant({
      ...selectVariant,
      [att]: v,
    });
    setSelectVa({ [att]: v });
  };

  // Check if this is a color attribute
  const isColorAttribute = () => {
    const attributeTitle = varTitle.find((vr) => vr?._id === att);
    const titleText = showingTranslateValue(
      attributeTitle?.name || ""
    ).toLowerCase();
    return titleText.includes("color") || titleText.includes("colour");
  };

  // Check if this is a size attribute
  const isSizeAttribute = () => {
    const attributeTitle = varTitle.find((vr) => vr?._id === att);
    const titleText = showingTranslateValue(
      attributeTitle?.name || ""
    ).toLowerCase();
    return titleText.includes("size");
  };

  // Get color hex from name
  const getColorHex = (colorName) => {
    const name = colorName.toLowerCase().trim();
    return colorMap[name] || null;
  };

  const ColorOptions = () => {
    const uniqueVariants = [
      ...new Map(variants?.map((v) => [v[att], v].filter(Boolean))).values(),
    ].filter(Boolean);

    return uniqueVariants.map((vl, i) =>
      varTitle.map((vr) =>
        vr?.variants?.map(
          (el) =>
            vr?._id === att &&
            el?._id === vl[att] && (
              <button
                onClick={() => handleChangeVariant(vl[att])}
                key={`${i}-${el._id}`}
                className={`relative group transition-all duration-200 ${
                  Object?.values(selectVariant).includes(vl[att])
                    ? "ring-2 ring-yellow-400 ring-offset-2 scale-110"
                    : "hover:scale-105"
                }`}
                title={showingTranslateValue(el.name)}
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    Object?.values(selectVariant).includes(vl[att])
                      ? "border-yellow-400 shadow-md"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{
                    backgroundColor:
                      getColorHex(showingTranslateValue(el.name)) || "#CCCCCC",
                  }}
                >
                  {Object?.values(selectVariant).includes(vl[att]) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white drop-shadow-md"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {showingTranslateValue(el.name)}
                </span>
              </button>
            )
        )
      )
    );
  };

  const SizeOptions = () => {
    const uniqueVariants = [
      ...new Map(variants?.map((v) => [v[att], v].filter(Boolean))).values(),
    ].filter(Boolean);

    return uniqueVariants.map((vl, i) =>
      varTitle.map((vr) =>
        vr?.variants?.map(
          (el) =>
            vr?._id === att &&
            el?._id === vl[att] && (
              <button
                onClick={() => handleChangeVariant(vl[att])}
                key={`${i}-${el._id}`}
                className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 min-w-[80px] ${
                  Object?.values(selectVariant).includes(vl[att])
                    ? "bg-yellow-400 border-yellow-500 text-black shadow-md scale-105"
                    : "bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm"
                }`}
              >
                {showingTranslateValue(el.name)}
              </button>
            )
        )
      )
    );
  };

  const ButtonOptions = () => {
    const uniqueVariants = [
      ...new Map(variants?.map((v) => [v[att], v].filter(Boolean))).values(),
    ].filter(Boolean);

    return uniqueVariants.map((vl, i) =>
      varTitle.map((vr) =>
        vr?.variants?.map(
          (el) =>
            vr?._id === att &&
            el?._id === vl[att] && (
              <button
                onClick={() => handleChangeVariant(vl[att])}
                key={`${i}-${el._id}`}
                className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                  Object?.values(selectVariant).includes(vl[att])
                    ? "bg-yellow-400 border-yellow-500 text-black shadow-md"
                    : "bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {showingTranslateValue(el.name)}
              </button>
            )
        )
      )
    );
  };

  const DropdownOptions = () => {
    const uniqueVariants = [
      ...new Map(variants.map((v) => [v[att], v].filter(Boolean))).values(),
    ].filter(Boolean);

    return uniqueVariants.map((vl) =>
      varTitle.map((vr) =>
        vr?.variants?.map(
          (el) =>
            vr?._id === att &&
            el?._id === vl[att] && (
              <option key={el._id} value={vl[att]}>
                {showingTranslateValue(el.name)}
              </option>
            )
        )
      )
    );
  };

  // Render based on attribute type
  if (option === "Dropdown") {
    return (
      <select
        onChange={(e) => handleChangeVariant(e.target.value)}
        className="w-full px-3 py-2 form-select outline-none h-12 text-base focus:outline-none rounded-lg bg-white border-2 border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
        name="parent"
        value={selectVariant[att] || ""}
      >
        <DropdownOptions />
      </select>
    );
  }

  // Color attribute - show color swatches
  if (isColorAttribute()) {
    return (
      <div className="flex flex-wrap gap-3 items-center">
        <ColorOptions />
      </div>
    );
  }

  // Size attribute - show size buttons
  if (isSizeAttribute()) {
    return (
      <div className="flex flex-wrap gap-2">
        <SizeOptions />
      </div>
    );
  }

  // Default - show regular buttons
  return (
    <div className="flex flex-wrap gap-2">
      <ButtonOptions />
    </div>
  );
};

export default VariantList;
