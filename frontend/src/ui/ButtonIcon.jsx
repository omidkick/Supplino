const btnType = {
  primary:
    "bg-primary-100 text-primary-700 hover:bg-primary-900 hover:text-white",
  secondary:
    "  text-secondary-500 hover:bg-secondary-500 hover:text-secondary-0",
  outline:
    "border border-secondary-200 text-secondary-500 hover:bg-secondary-200",
  red: " text-red-500 hover:bg-red-500 hover:text-white",
  danger: "border border-red-100 text-red-500",
  edit: "bg-green-100 text-green-600 hover:bg-green-500 hover:text-white",
  blue: " text-blue-500 hover:bg-blue-500 hover:text-white",
};

function ButtonIcon({ children, onClick, className, variant, ...rest }) {
  return (
    <button
      onClick={onClick}
      className={`
      ${btnType[variant]}
      ${className} flex items-center justify-center gap-x-1 rounded-md p-1
      [&>svg]:w-4 md:[&>svg]:w-5 [&>svg]:h-4 md:[&>svg]:h-5 [&>svg]:text-inherit
      text-sm lg:text-base
      transition-all duration-300 ease-out"`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default ButtonIcon;
