"use client";

import { useGetUser, useGetUsers } from "@/hooks/useAuth";
import Fallback from "@/ui/Fallback";
import { Suspense } from "react";
import CardsWrapper from "./_components/CardsWrapper";
import Loading from "@/ui/Loading";
import { useProductActions } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { usePaymentActions } from "@/hooks/usePayments";
import SalesChart from "./_components/SalesChart";
import ProductsDonutChart from "./_components/ProductsDonutChart";
import { UserGroupIcon, SparklesIcon } from "@heroicons/react/24/outline";
import LatestProducts from "./_components/LatestProducts";
import LatestTickets from "./_components/LatestTickets";
import { HiTicket } from "react-icons/hi";
import Link from "next/link";
import { useAdminSupportActions } from "@/hooks/useSupports";
import { useAllComments } from "@/hooks/useComment";

// Move all the component logic to a separate component
function AdminContent() {
  // Admin Info
  const { data: userData } = useGetUser();
  const { user } = userData || {};

  // Users
  const { data, isLoading } = useGetUsers();
  const { users } = data || {};

  // Products
  const { products, totalCount } = useProductActions();

  // Categories
  const { categories } = useCategories();

  // Payments
  const { payments, totalPaymentsCount } = usePaymentActions();

  // Tickets
  const { allTicketsTotal } = useAdminSupportActions();

  // Comments
  const { commentsCount } = useAllComments();

  if (isLoading) return <Loading message="در حال بارگزاری اطلاعات" />;

  return (
    <div>
      {/* Welcome message */}
      <div className="bg-secondary-0 rounded-xl p-3 lg:p-6 max-w-xl shadow-lg shadow-secondary-100 mb-10 lg:mb-20">
        <p className="text-secondary-700">
          <span className="font-black text-xl ml-2">
            {user?.name} &nbsp;عزیز 😍؛
          </span>
          <span>به پنل ادمین خوش آمدی 👋</span>
        </p>
      </div>

      {/* Card Stats Section */}
      <div className="mb-10 md:mb-14 lg:mb-18">
        <h2 className="text-xl md:text-2xl font-black text-secondary-700 flex items-center gap-x-2 mb-6">
          <UserGroupIcon className="w-6 md:w-7 h-6 md:h-7 text-primary-900" />
          اطلاعات کلی
        </h2>
        <Suspense fallback={<Fallback />}>
          <CardsWrapper
            users={users}
            products={totalCount}
            categories={categories}
            payments={totalPaymentsCount}
            tickets={allTicketsTotal}
            comments={commentsCount}
          />
        </Suspense>
      </div>

      {/* Charts Section  */}
      <div className="mb-10 md:mb-14 lg:mb-18 ">
        {/* Sales Chart */}
        <div className="mb-8 md:mb-10">
          <SalesChart payments={payments} />
        </div>

        {/* Products Donut Chart */}
        <div className="">
          <ProductsDonutChart products={products} />
        </div>
      </div>

      {/* Latest Product Table */}
      <div className="mt-14 md:mt-20">
        <h2 className="text-xl md:text-2xl font-black text-secondary-700 flex items-center gap-x-2 mb-6">
          <SparklesIcon className="w-6 md:w-7 h-6 md:h-7 text-primary-900" />
          آخرین محصولات
        </h2>
        <LatestProducts />
      </div>

      {/* Latest Ticket Table */}
      <div className="mt-14 md:mt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-black text-secondary-700 flex items-center gap-x-2 ">
            <HiTicket className="w-6 md:w-7 h-6 md:h-7 text-primary-900" />
            آخرین تیکت ها
          </h2>

          <Link
            href="/admin/supports"
            className="flex items-center gap-x-2 text-secondary-700 hover:text-primary-900 transition-all duration-300 text-sm"
          >
            <p>مشاهده همه</p>
          </Link>
        </div>
        <LatestTickets />
      </div>
    </div>
  );
}

// Main component with Suspense boundary
function Admin() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminContent />
    </Suspense>
  );
}

export default Admin;
