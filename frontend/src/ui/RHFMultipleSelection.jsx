"use client";

import React, { useId, useState, useEffect } from "react";
import Select from "react-select";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused 
      ? '2px solid #3b82f6' 
      : state.hasValue 
        ? '2px solid #e2e8f0' 
        : '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '4px 8px',
    minHeight: '48px',
    boxShadow: state.isFocused ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    '@media (max-width: 768px)': {
      minHeight: '44px',
      padding: '2px 6px',
      fontSize: '14px',
    },
    '&:hover': {
      borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1',
      boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.1)',
    }
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: '500',
    '@media (max-width: 768px)': {
      fontSize: '13px',
    }
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#1e293b',
    fontSize: '14px',
    fontWeight: '600',
    '@media (max-width: 768px)': {
      fontSize: '13px',
    }
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#dbeafe',
    borderRadius: '8px',
    padding: '2px 4px',
    margin: '1px',
    fontSize: '13px',
    '@media (max-width: 768px)': {
      fontSize: '12px',
      borderRadius: '6px',
      padding: '1px 3px',
    }
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#1e40af',
    fontSize: '13px',
    fontWeight: '600',
    padding: '2px 6px',
    '@media (max-width: 768px)': {
      fontSize: '12px',
      padding: '2px 4px',
    }
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#1e40af',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#bfdbfe',
      color: '#1d4ed8',
      transform: 'scale(1.1)',
    }
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? '#3b82f6' 
      : state.isFocused 
        ? '#f1f5f9' 
        : 'white',
    color: state.isSelected ? 'white' : '#1e293b',
    cursor: 'pointer',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: state.isSelected ? '600' : '500',
    transition: 'all 0.2s ease',
    '@media (max-width: 768px)': {
      padding: '10px 14px',
      fontSize: '13px',
    },
    '&:active': {
      backgroundColor: state.isSelected ? '#3b82f6' : '#e2e8f0',
    }
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    marginTop: '4px',
    zIndex: 9999,
    '@media (max-width: 768px)': {
      borderRadius: '10px',
      marginTop: '2px',
    }
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '200px',
    padding: '6px',
    '@media (max-width: 768px)': {
      maxHeight: '180px',
      padding: '4px',
    }
  }),
  loadingMessage: (provided) => ({
    ...provided,
    color: '#64748b',
    fontSize: '14px',
    padding: '12px 16px',
    fontWeight: '500',
    '@media (max-width: 768px)': {
      fontSize: '13px',
      padding: '10px 14px',
    }
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: '#64748b',
    fontSize: '14px',
    padding: '12px 16px',
    fontWeight: '500',
    '@media (max-width: 768px)': {
      fontSize: '13px',
      padding: '10px 14px',
    }
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? '#3b82f6' : '#94a3b8',
    transition: 'all 0.3s ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    padding: '4px',
    '&:hover': {
      color: '#3b82f6',
    }
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: '4px',
    '&:hover': {
      color: '#ef4444',
      transform: 'scale(1.1)',
    }
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 4px',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
      padding: '0 2px',
    }
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    '@media (max-width: 768px)': {
      padding: '0 2px',
    }
  })
};

// Custom components for better Persian support and accessibility
const DropdownIndicator = (props) => {
  return (
    <div {...props.innerProps} className="px-1 sm:px-2">
      <ChevronDownIcon className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300" />
    </div>
  );
};

const ClearIndicator = (props) => {
  return (
    <div 
      {...props.innerProps} 
      className="px-1 sm:px-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-all duration-200"
    >
      <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200" />
    </div>
  );
};

const MultiValueRemove = (props) => {
  return (
    <div {...props.innerProps} className="hover:bg-blue-200 rounded-md p-0.5 sm:p-1 cursor-pointer transition-all duration-200">
      <XMarkIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
    </div>
  );
};

function RHFMultipleSelection({
  label,
  name,
  register,
  isRequired = false,
  errors,
  options = [],
  isMulti = false,
  isLoading = false,
  placeholder,
  disabled = false,
  isClearable = true,
  className = "",
  value,
  defaultValue,
  ...props
}) {
  const fieldId = useId();
  const selectId = `select-${name}-${fieldId}`;
  const [isMounted, setIsMounted] = useState(false);
  
  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Transform options to react-select format
  const selectOptions = options.map(option => ({
    value: option._id || option.id || option.value,
    label: option.title || option.name || option.label,
  }));

  // Get error for this field
  const error = errors && errors[name];

  // Handle change
  const handleChange = (selectedOption) => {
    let newValue;
    if (isMulti) {
      newValue = selectedOption ? selectedOption.map(option => option.value) : [];
    } else {
      newValue = selectedOption ? selectedOption.value : '';
    }
    
    // Update form value through register if available
    if (register && register(name)?.onChange) {
      const event = {
        target: {
          name,
          value: newValue,
        }
      };
      register(name).onChange(event);
    }
  };

  // Get current value
  const getCurrentValue = () => {
    const formValue = value || defaultValue || (isMulti ? [] : '');
    
    if (isMulti) {
      return selectOptions.filter(option => 
        Array.isArray(formValue) && formValue.includes(option.value)
      );
    } else {
      return selectOptions.find(option => option.value === formValue) || null;
    }
  };

  // Don't render Select on server to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className={`w-full space-y-2 sm:space-y-3 ${className}`}>
        {label && (
          <label htmlFor={selectId} className="block text-sm sm:text-base font-bold text-slate-700">
            {label}
            {isRequired && <span className="text-red-500 mr-1 sm:mr-2 text-base sm:text-lg">*</span>}
          </label>
        )}
        <div className="h-11 sm:h-12 bg-slate-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className={`w-full space-y-2 sm:space-y-3 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm sm:text-base font-bold text-slate-700">
          {label}
          {isRequired && <span className="text-red-500 mr-1 sm:mr-2 text-base sm:text-lg">*</span>}
        </label>
      )}

      <div className="relative">
        <Select
          {...(register ? register(name) : {})}
          id={selectId}
          inputId={selectId}
          instanceId={selectId}
          options={selectOptions}
          isMulti={isMulti}
          isLoading={isLoading}
          isDisabled={disabled}
          isClearable={isClearable}
          isSearchable
          placeholder={placeholder || (isMulti ? "انتخاب کنید..." : "یک گزینه انتخاب کنید...")}
          noOptionsMessage={() => "گزینه‌ای یافت نشد"}
          loadingMessage={() => "در حال بارگذاری..."}
          value={getCurrentValue()}
          onChange={handleChange}
          styles={customStyles}
          components={{
            DropdownIndicator,
            ClearIndicator,
            MultiValueRemove,
            IndicatorSeparator: () => null,
          }}
          classNamePrefix="react-select"
          menuPlacement="auto"
          menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
          {...props}
        />

        {/* Error Message */}
        {error && (
          <div className="mt-1 sm:mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p 
              className="text-red-700 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2"
              role="alert"
              id={`${selectId}-error`}
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full flex-shrink-0"></span>
              {error.message}
            </p>
          </div>
        )}
      </div>

      {/* Helper Text for Multi-Select */}
      {isMulti && !error && (
        <p className="text-xs text-slate-600 bg-slate-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
          {getCurrentValue().length > 0 
            ? `${getCurrentValue().length} مورد انتخاب شده` 
            : "می‌توانید چندین گزینه انتخاب کنید"
          }
        </p>
      )}
    </div>
  );
}

export default RHFMultipleSelection;