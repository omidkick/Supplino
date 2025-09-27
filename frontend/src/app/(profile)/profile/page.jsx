"use client";

import { useGetUser } from "@/hooks/useAuth";
import Fallback from "@/ui/Fallback";
import Loading from "@/ui/Loading";
import { SparklesIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import React, { Suspense } from "react";
import CardsWrapper from "./_components/CardsWrapper";
import PaymentsTable from "./payments/_components/PaymentsTable";
import { HiArrowDownLeft } from "react-icons/hi2";
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "next/link";

function Profile() {
  const { data, error, isLoading } = useGetUser();
  const { user, cart, payments } = data || {};

  if (isLoading) return <Loading />;

  return (
    <div>
      {/* Welcome message */}
      <div className="bg-secondary-0 rounded-xl p-3 lg:p-6 max-w-xl shadow-lg shadow-secondary-100 mb-8 lg:mb-12">
        <p className="text-secondary-700">
          <span className="font-black text-xl ml-2">
            {user?.name} &nbsp;عزیز 😍؛
          </span>
          <span>به پنل کاربری خود خوش آمدی 👋</span>
        </p>
      </div>

      {/* Card Stats Section */}
      <div className="mb-6 md:mb-10">
        <h2 className="text-xl md:text-2xl font-black text-secondary-700 flex items-center gap-x-2 mb-6">
          <UserGroupIcon className="w-6 md:w-7 h-6 md:h-7 text-primary-900" />
          سوابق من
        </h2>
        <Suspense fallback={<Fallback />}>
          <CardsWrapper data={data} />
        </Suspense>
      </div>

      {/* Latest Posts Table */}
      <div className="mt-14 md:mt-20">
        <div className="flex flex-col md:flex-row gap-y-2  md:items-center md:justify-between mb-6 lg:mb-8">
          <h2 className="text-lg md:text-xl lg:text-2xl font-extrabold text-secondary-700 flex items-center gap-x-2">
            <SparklesIcon className="w-6 h-6 text-primary-900" />
            آخرین سفارش های من
          </h2>

          <Link
            href="/profile/payments"
            className="flex items-center gap-x-2 text-secondary-700 hover:text-primary-900 transition-all duration-300"
          >
            <h3 className="font-medium text-sm mg:text-base">
              مشاهده همه سفارش ها
            </h3>
            <FaArrowLeftLong className="w-4 h-4" />
          </Link>
        </div>
        <Suspense fallback={<Fallback />}>
          <PaymentsTable
            payments={payments
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 3)}
            isLoading={isLoading}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default Profile;
