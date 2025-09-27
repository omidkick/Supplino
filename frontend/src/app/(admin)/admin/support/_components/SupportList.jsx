"use client";

import Empty from "@/ui/Empty";
import { FiSearch } from "react-icons/fi";
import SupportTable from "./SupportTable";
import { useAdminSupportActions } from "@/hooks/useSupports";
import Loading from "@/ui/Loading";
import { useSearchParams } from "next/navigation";

function SupportList() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "";

  const {
    allTickets,
    isLoadingAllTickets,
  } = useAdminSupportActions();

  if (isLoadingAllTickets) {
    return <Loading />;
  }

  return (
    <div>
      {/* Search Results Info */}
      {searchTerm && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-secondary-200 bg-secondary-0 px-4 py-3 text-secondary-700 shadow-sm transition-all duration-300">
          <FiSearch className="mt-1 h-5 w-5 text-primary-600 shrink-0" />
          <div>
            <p className="text-base font-medium">
              نتایج جستجو برای:{" "}
              <span className="text-primary-600">"{searchTerm}"</span>
            </p>
          </div>
        </div>
      )}

      {/* Tickets Table or Empty State */}
      {allTickets && allTickets.length > 0 ? (
        <SupportTable tickets={allTickets} searchTerm={searchTerm} statusFilter={statusFilter} />
      ) : (
        <Empty resourceName="تیکتی" />
      )}
    </div>
  );
}

export default SupportList;