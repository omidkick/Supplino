import Search from "@/ui/Search";
import { Suspense } from "react";
import Loader from "@/ui/Loader";
import UsersList from "./_components/UsersList";

async function UsersPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  return (
    <div>
      {/* Title and Search*/}
      <div className="flex flex-col md:flex-row items-center justify-between text-secondary-800 gap-y-6 mb-6 md:mb-12 mt-8 md:mt-2">
        <h1 className="font-extrabold text-xl md:text-2xl">لیست کاربران</h1>
        <Search />
      </div>

      <Suspense
        fallback={<Loader />}
        key={JSON.stringify(resolvedSearchParams)}
      >
        <UsersList searchParams={resolvedSearchParams} />
      </Suspense>
    </div>
  );
}

export default UsersPage;
