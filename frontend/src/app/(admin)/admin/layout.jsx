import AdminSideBar from "./_components/AdminSideBar";
import Header from "./_components/Header";

export const metadata = {
  title: "پنل ادمین",
  description: "پنل ادمین",
};

export default function Layout({ children }) {
  return (
    <div className="bg-secondary-0">
      <div className="grid grid-cols-12 h-screen">
        <aside className="col-span-12 lg:col-span-3 xl:col-span-2 hidden lg:block ">
          <AdminSideBar />
        </aside>
        <div className="col-span-12 lg:col-span-9 xl:col-span-10 h-screen flex flex-col">
          <Header />
          <main className="bg-secondary-100 rounded-tr-3xl py-6 md:p-6 lg:p-10 flex-1 overflow-y-auto">
            <div className="container xl:max-w-screen-xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
