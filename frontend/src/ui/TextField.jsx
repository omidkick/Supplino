function TextField({ label, name, value, onChange, placeholder, type = "text", inputMode, pattern, dir }) {
  return (
    <div>
      <label htmlFor={name} className="block mb-4 text-secondary-400">
        {label}
      </label>
      <input
        autoComplete="off"
        className="textField__input placeholder:text-left placeholder:text-secondary-300"
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        pattern={pattern}
        dir={dir}
      />
    </div>
  );
}
export default TextField;