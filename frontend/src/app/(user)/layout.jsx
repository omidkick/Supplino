import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "خانه",
  description: "",
};
function layout({ children }) {
  return (
    <>
      <div className="w-full bg-primary-700"></div>
      <Header />
      <div className="container xl:max-w-screen-xl mx-auto px-4 pb-20 md:pb-0">
        {children}
      </div>

      <Footer />
    </>
  );
}

export default layout;
