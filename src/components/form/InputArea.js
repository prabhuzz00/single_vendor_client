import React from "react";
import Label from "@components/form/Label";

const InputArea = ({
  name,
  label,
  type,
  Icon,
  register,
  readOnly,
  defaultValue,
  autocomplete,
  placeholder,
  required = true,
  pattern, // Added pattern as a prop
  patternMessage = "Invalid input", // Optional: Custom error message for pattern validation
}) => {
  // Derive a plain-text label for validation messages when `label` is JSX
  const extractText = (node) => {
    if (node == null) return "";
    if (typeof node === "string" || typeof node === "number")
      return String(node);
    if (Array.isArray(node))
      return node.map(extractText).filter(Boolean).join(" ");
    if (node.props && node.props.children)
      return extractText(node.props.children);
    return "";
  };

  const labelText =
    typeof label === "string" || typeof label === "number"
      ? String(label)
      : extractText(label);

  return (
    <>
      <Label label={label} />
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-600 focus-within:text-black sm:text-base">
              <Icon />
            </span>
          </div>
        )}
        <input
          {...register(`${name}`, {
            required: required ? `${labelText} is required!` : false,
            pattern: pattern
              ? {
                  value: pattern,
                  message: patternMessage, // Show a custom error message for pattern mismatch
                }
              : undefined,
          })}
          type={type}
          name={name}
          readOnly={readOnly}
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete={autocomplete}
          className={`${
            Icon ? "py-2 pl-10" : "py-2 px-4 md:px-5"
          } w-full appearance-none border text-sm opacity-75 text-input rounded-lg placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-yellow-600 h-11 md:h-12 ${
            readOnly ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
          }`}
        />
      </div>
    </>
  );
};

export default InputArea;
