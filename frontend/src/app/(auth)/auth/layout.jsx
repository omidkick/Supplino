export const metadata = {
  title: {
    absolute: "ورود | ثبت نام",
  },
  description: "",
};

function Layout({ children }) {
  return (
    <div className="flex items-center">
      <div className="w-full bg-secondary-0">{children}</div>
    </div>
  );
}

export default Layout;
