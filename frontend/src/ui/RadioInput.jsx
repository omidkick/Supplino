import { motion, AnimatePresence } from "framer-motion";

function RadioInput({ id, name, value, onChange, checked, label }) {
  return (
    <motion.div 
      className="flex items-center gap-x-3 text-secondary-600 group"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <input
          type="radio"
          name={name}
          id={id}
          checked={checked}
          value={value}
          onChange={onChange}
          className="sr-only"
        />
        <motion.div
          className={`
            w-5 h-5 rounded-full border-2 cursor-pointer
            flex items-center justify-center
            transition-all duration-200 ease-in-out
            ${checked 
              ? 'bg-primary-900 border-primary-900 shadow-lg shadow-primary-900/25' 
              : 'border-secondary-300 bg-white hover:border-primary-400'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange({ target: { value } })}
        >
          <AnimatePresence>
            {checked && (
              <motion.div
                className="w-2 h-2 bg-white rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <label 
        htmlFor={id} 
        className={`
          cursor-pointer font-medium transition-colors duration-200
          ${checked ? 'text-primary-900' : 'text-secondary-600 group-hover:text-secondary-800'}
        `}
      >
        {label}
      </label>
    </motion.div>
  );
}

export default RadioInput;