"use client";

import { Controller } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toPersianDigits } from "@/utils/numberFormatter";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

const CustomInput = ({ value, onClick, error, placeholder, id }) => (
  <div className="rhf-datepicker-input-container">
    <div className="relative">
      <input
        type="text"
        id={id}
        value={value ? toPersianDigits(value) : ""}
        onClick={onClick}
        readOnly 
        placeholder={placeholder || "تاریخ را انتخاب کنید"}
        className={`rhf-datepicker-input w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
          error ? "border-red-500" : "border-secondary-200"
        }`}
        aria-describedby={error ? `${id}-error` : undefined}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
      />
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
        <CalendarDaysIcon
          className={`w-4 h-4 sm:w-5 sm:h-5 ${
            error ? "text-red-500" : "text-secondary-400"
          }`}
        />
      </div>
    </div>
    {error && (
      <p
        id={`${id}-error`}
        className="text-red-600 text-xs mt-2 flex items-center gap-1"
        role="alert"
      >
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
        {error.message}
      </p>
    )}
  </div>
);

function RHFDatePicker({
  control,
  name,
  label,
  errors,
  isRequired = false,
  placeholder,
  minDate,
  maxDate,
  disabled = false,
  ...props
}) {
  const error = errors && errors[name];
  const inputId = `datepicker-${name}`;

  return (
    <div className="rhf-datepicker-container">
      {label && (
        <label htmlFor={inputId} className="rhf-datepicker-label">
          {label}
          {isRequired && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <DatePicker
            {...field}
            id={inputId}
            value={value || ""}
            onChange={(date) => {
              if (date) {
                onChange(date.toDate());
              } else {
                onChange(null);
              }
            }}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
            render={(value, openCalendar) => (
              <CustomInput
                value={value}
                onClick={openCalendar}
                error={error}
                placeholder={placeholder}
                id={inputId}
              />
            )}
            {...props}
          />
        )}
      />
    </div>
  );
}

export default RHFDatePicker;
