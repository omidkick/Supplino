import MiniLoading from "./MiniLoading";

const btnType = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  outline: "btn--outline",
  danger: "btn--danger",
};

function Button({
  children,
  onClick,
  variant = "primary",
  className,
  disabled = false,
  loading = false,
  loadingColor= "#ffffff",
  ...rest
}) {
  return (
    <button
      onClick={onClick}
      className={`btn ${btnType[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <MiniLoading color={loadingColor} /> : children}
    </button>
  );
}

export default Button;

// const btnType = {
//   primary: "btn--primary",
//   secondary: "btn--secondary",
//   outline: "btn--outline",
//   danger: "btn--danger",
// };

// function Button({
//   children,
//   onClick,
//   variant = "primary",
//   className,
//   ...rest
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`btn ${btnType[variant]} ${className}`}
//       {...rest}
//     >
//       {children}
//     </button>
//   );
// }

// export default Button;
