"use client";
import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpTrayIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function FileInput({
  label,
  name,
  onChange,
  isRequired,
  errors,
  showPreview = true,
  setShowPreview,
  coverImageUrl,
  className = "",
  ...rest
}) {
  const [localPreview, setLocalPreview] = useState(null);
  const hasError = !!errors?.[name];
  const previewUrl = coverImageUrl || localPreview;
  const inputId = `${name}-input`;

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    onChange(file);
    setLocalPreview(URL.createObjectURL(file));
    if (setShowPreview) setShowPreview(true);
  };

  const removeImage = () => {
    setLocalPreview(null);
    onChange(null);
    if (setShowPreview) setShowPreview(false);
  };

  const togglePreview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (setShowPreview) setShowPreview(!showPreview);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label with proper association */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId} // Associate label with input
          className={`block font-medium ${
            hasError ? "text-error-600" : "text-secondary-700"
          }`}
        >
          {label}
          {isRequired && <span className="text-red-500 mr-1 text-lg">*</span>}
        </label>

        {previewUrl && setShowPreview && (
          <button
            type="button"
            onClick={togglePreview}
            className={`p-1 rounded-full ${
              hasError
                ? "text-error-500 hover:bg-error-50"
                : "text-secondary-500 hover:bg-secondary-100"
            }`}
            aria-label={showPreview ? "Hide preview" : "Show preview"}
          >
            {showPreview ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* File Input Area - now properly associated with label */}
      <div
        className={`relative bg-secondary-50 border-2 rounded-lg p-3 transition-colors ${
          hasError
            ? "border-error-300"
            : "border-secondary-200 hover:border-primary-400"
        }`}
      >
        <div className="flex items-center gap-3">
          <ArrowUpTrayIcon
            className={`h-5 w-5 ${
              hasError ? "text-error-500" : "text-secondary-500"
            }`}
          />
          <span
            className={`text-sm ${
              hasError ? "text-error-600" : "text-secondary-600"
            }`}
          >
            {previewUrl ? "تصویر انتخاب شده" : "فایلی انتخاب نشده"}
          </span>
        </div>

        <input
          id={inputId} // Matching ID for label
          name={name}
          type="file"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*"
          {...rest}
        />
      </div>

      {/* Image Preview */}
      {previewUrl && showPreview && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-secondary-200 mt-2">
          <Image
            fill
            src={previewUrl}
            alt="Preview"
            className="object-contain bg-secondary-50 p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            onError={(e) => {
              e.target.src = "/images/default-image.png";
              e.target.className = "object-cover";
            }}
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-error-500 text-red-600 p-1 "
            aria-label="حذف تصویر"
          >
            <XMarkIcon className="h-6 w-6  hover:scale-110 transition-all duration-300 ease-in-out" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {hasError && (
        <p className="text-xs text-red-600 flex items-start gap-1 mt-1">
          <XMarkIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{errors[name].message}</span>
        </p>
      )}
    </div>
  );
}

export default FileInput;
