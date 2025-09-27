import { forwardRef } from "react";

const TextArea = forwardRef(function TextArea(
  {
    label,
    name,
    value,
    dir = "rtl",
    onChange,
    isRequired = false,
    onKeyDown,
    placeholder,
  },
  ref
) {
  return (
    <div className="textField">
      {label && (
        <label htmlFor={name} className="text-secondary-600 text-sm">
          {label}
          {isRequired && <span className="text-error">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        name={name}
        id={name}
        dir={dir}
        className={`textField__input mt-2 min-h-[150px] leading-8 ${
          dir === "ltr" ? "text-left" : "text-right"
        }`}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      ></textarea>
    </div>
  );
});

export default TextArea;
