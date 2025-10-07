"use client";

import OtpInput from "react-otp-input";
import { motion } from "framer-motion";

function CustomOTPInput({ value, onChange, inputName = "otp", ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <OtpInput
        value={value}
        onChange={onChange}
        numInputs={6}
        inputType="tel"
        inputMode="numeric"
        shouldAutoFocus={true}
        renderSeparator={<span className="mx-1 sm:mx-2" />}
        renderInput={(inputProps, index) => (
          <motion.input
            {...inputProps}
            whileTap={{ scale: 0.95 }}
            whileFocus={{ scale: 1.05 }}
            className="!w-12 !h-12 md:!w-13 md:!h-13  border-2 border-secondary-200 rounded-2xl text-center text-xl bg-secondary-0 transition-all duration-300 hover:border-primary-300 focus:border-primary-900 outline-none text-secondary-900"
            id={`${inputName}-${index}`} 
            name={`${inputName}-${index}`}
            data-index={index} 
            onFocus={(e) => {
              e.target.select();
            }}
          />
        )}
        containerStyle={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.1rem",
        }}
        {...props}
      />
    </motion.div>
  );
}

export default CustomOTPInput;