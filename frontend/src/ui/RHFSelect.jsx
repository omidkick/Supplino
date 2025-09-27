function RHFSelect({ label, name, register, options, isRequired, errors }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-secondary-700">
        {label} {isRequired && <span className="text-error">*</span>}
      </label>
      <select
        {...register(name)}
        id={name}
        className="textField__input"
        defaultValue=""
      >
        <option value="" disabled hidden>
          {label} را انتخاب کنید
        </option>

        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.title}
          </option>
        ))}
      </select>
      {/* Handle validation's error */}
      {errors?.[name] && (
        <span className="text-red-600 block text-xs mt-2">
          {errors[name].message}
        </span>
      )}
    </div>
  );
}

export default RHFSelect;
