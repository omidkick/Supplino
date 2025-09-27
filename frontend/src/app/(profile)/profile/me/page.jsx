import { Suspense } from "react";

import { Spinner } from "@/ui/Spinner";
import PersonalInfo from "./_/components/PersonalInfo";
import { HiInformationCircle } from "react-icons/hi";

async function Page() {
  return (
    <div>
      <h1 className="text-secondary-700 mb-6 font-bold text-xl text-center">
        اطلاعات حساب کاربری
      </h1>
      <p className="text-xs flex items-center gap-1 font-medium text-secondary-400 hover:text-primary-900 mb-3 justify-center">
        <span>
          <HiInformationCircle className="w-4 h-4" />
        </span>
        <span> شماره کاربر قابل ویرایش نیست.</span>
      </p>

      <Suspense fallback={<Spinner />}>
        <PersonalInfo />
      </Suspense>
    </div>
  );
}
export default Page;
