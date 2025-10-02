"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { XMarkIcon, PhotoIcon, PlusIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const MultipleImageInput = ({
  value = [],
  onChange,
  errors,
  name,
  label = "تصاویر محصول",
  maxFiles = 10,
  maxFileSize = 2 * 1024 * 1024 // 2MB
}) => {
  // State for image previews
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);

  // Generate preview objects from input value
  const generatePreviews = useCallback((files) => {
    return files.map((item) => {
      // Case 1: Already processed preview object
      if (item.previewId) return item;
      
      // Case 2: File object (new upload)
      if (item instanceof File) {
        return {
          previewId: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: URL.createObjectURL(item),
          file: item,
          isNew: true
        };
      }
      
      // Case 3: Backend thumbnail object
      if (typeof item === 'object' && (item.path || item.url)) {
        return {
          previewId: item._id || `existing-${Math.random().toString(36).substr(2, 9)}`,
          url: item.url || `${process.env.NEXT_PUBLIC_SERVER_URL}/${item.path}`,
          path: item.path,
          _id: item._id,
          isExisting: true
        };
      }
      
      // Case 4: String URL
      return {
        previewId: `url-${Math.random().toString(36).substr(2, 9)}`,
        url: item,
        isExisting: true
      };
    });
  }, []);

  // Initialize previews when value changes
  useEffect(() => {
    const newPreviews = generatePreviews(value);
    setPreviews(newPreviews);
    
    // Cleanup function to revoke object URLs
    return () => {
      newPreviews.forEach(preview => {
        if (preview.isNew) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [value, generatePreviews]);

  // Handle file selection
  const handleFileChange = (event) => {
    setError(null);
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    // Check maximum files limit
    if (previews.length + files.length > maxFiles) {
      setError(`حداکثر ${maxFiles} تصویر قابل آپلود است`);
      return;
    }
    
    // Validate file sizes and types
    const invalidFiles = files.filter(file => {
      return file.size > maxFileSize || !file.type.startsWith('image/');
    });
    
    if (invalidFiles.length > 0) {
      setError('فقط تصاویر با حجم کمتر از 2MB و فرمت JPG/PNG/WEBP قابل قبول هستند');
      return;
    }
    
    // Generate previews for new files
    const newPreviews = generatePreviews(files);
    const updatedPreviews = [...previews, ...newPreviews];
    
    setPreviews(updatedPreviews);
    
    // Emit the combined array of existing items and new files
    const filesToEmit = updatedPreviews.map(p => p.file || { 
      _id: p._id, 
      path: p.path,
      url: p.url 
    });
    
    onChange(filesToEmit);
    event.target.value = null;
  };

  // Remove an image
  const removeImage = (previewId) => {
    const previewToRemove = previews.find(p => p.previewId === previewId);
    if (!previewToRemove) return;
    
    // Filter out the removed preview
    const updatedPreviews = previews.filter(p => p.previewId !== previewId);
    setPreviews(updatedPreviews);
    
    // Revoke object URL if it was a new file
    if (previewToRemove.isNew) {
      URL.revokeObjectURL(previewToRemove.url);
    }
    
    // Emit the remaining items
    const filesToEmit = updatedPreviews.map(p => p.file || { 
      _id: p._id, 
      path: p.path,
      url: p.url 
    });
    
    onChange(filesToEmit);
  };

  const hasError = error || (errors && errors[name]);

  return (
    <div className="space-y-4">
      {/* Label with counter */}
      <div className="flex items-center justify-between">
        <label htmlFor={`${name}-upload`} className="block text-secondary-700 font-medium">
          {label}
          <span className="text-secondary-500 font-normal mr-2">(اختیاری)</span>
        </label>
        {previews.length > 0 && (
          <span className="text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
            {previews.length}/{maxFiles} تصاویر
          </span>
        )}
      </div>

      {/* Enhanced Upload Area with Integrated Button */}
      <div className="relative">
        <input
          id={`${name}-upload`}
          type="file"
          multiple
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
          disabled={previews.length >= maxFiles}
        />
        
        <div className={`
          group relative overflow-hidden
          border-2 border-dashed rounded-xl
          transition-all duration-300 ease-in-out
          ${previews.length >= maxFiles ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:border-primary-400 hover:bg-primary-50/30'}
          ${hasError 
            ? "border-red-300 bg-red-50/50" 
            : "border-secondary-200 bg-secondary-50"
          }
        `}>
          <label 
            htmlFor={`${name}-upload`}
            className="flex flex-col lg:flex-row items-center justify-between p-6 lg:p-8 cursor-pointer"
          >
            {/* Left side - Icon and text */}
            <div className="flex items-center gap-4 mb-4 lg:mb-0">
              <div className={`
                w-14 h-14 flex items-center justify-center rounded-xl
                ${hasError 
                  ? "bg-red-100 text-red-500" 
                  : "bg-primary-100 text-primary-600"
                }
              `}>
                <PhotoIcon className="w-8 h-8" />
              </div>
              
              <div className="text-right">
                <h4 className={`
                  text-lg font-semibold mb-1
                  ${hasError ? "text-red-600" : "text-secondary-700"}
                `}>
                  {previews.length > 0 ? 'افزودن تصاویر بیشتر' : 'تصاویر محصول را آپلود کنید'}
                </h4>
                
                <p className={`
                  text-sm
                  ${hasError ? "text-red-500" : "text-secondary-500"}
                `}>
                  {previews.length >= maxFiles 
                    ? 'حداکثر تعداد تصاویر رسیده است' 
                    : 'فرمت‌های پشتیبانی شده: JPG, PNG, WEBP (حداکثر ۲MB)'
                  }
                </p>
              </div>
            </div>

            {/* Right side - Upload Button */}
            <div className={`
              flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-medium text-base
              transition-all duration-200 cursor-pointer
              ${previews.length >= maxFiles 
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-pointer' 
                : hasError
                  ? "bg-white text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400" 
                  : "bg-primary-900 text-white  hover:bg-primary-800 "
              }
            `}>
              <ArrowUpTrayIcon className="w-5 h-5" />
              <span>آپلود تصاویر</span>
            </div>
          </label>
        </div>
      </div>

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="space-y-3 !mt-10" >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {previews.map((preview) => (
              <div 
                key={preview.previewId}
                className="group relative aspect-square rounded-lg overflow-hidden border border-secondary-100 hover:border-primary-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Image
                  fill
                  alt={`product-thumbnail-${preview.previewId}`}
                  src={preview.url}
                  className="object-contain"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    type="button"
                    onClick={() => removeImage(preview.previewId)}
                    className="absolute top-2 left-2 bg-white/90 text-red-500 p-1 rounded-full hover:bg-white transition-colors duration-200"
                    aria-label="حذف تصویر"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                  
                  <span className="absolute bottom-2 left-2 right-2 text-white text-xs bg-black/50 rounded-full px-2 py-1 text-center truncate">
                    {preview.isNew ? 'تصویر جدید' : 'تصویر موجود'}
                  </span>
                </div>
              </div>
            ))}
            
            {previews.length < maxFiles && (
              <label 
                htmlFor={`${name}-upload`}
                className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors duration-200"
              >
                <PlusIcon className="w-8 h-8 text-primary-500 mb-2" />
                <span className="text-sm text-primary-700">افزودن تصویر</span>
              </label>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {hasError && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <XMarkIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error || errors[name]?.message}</span>
        </div>
      )}
    </div>
  );
};

export default MultipleImageInput;