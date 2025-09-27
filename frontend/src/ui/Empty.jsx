import Image from "next/image";

function Empty({ resourceName = "موردی" }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-10">
      <div className="relative w-60 h-60 sm:w-72 sm:h-72 mb-6">
        <Image
          src="/images/emptySVG.svg"
          alt="Empty state illustration"
          fill
          className="object-contain"
          priority
        />
      </div>
      <p className="text-lg font-bold text-secondary-700">
        {resourceName} یافت نشد.
      </p>
      <p className="text-sm text-secondary-500 mt-2">
        هنوز هیچ {resourceName} ثبت نشده است.
      </p>
    </div>
  );
}

export default Empty;
