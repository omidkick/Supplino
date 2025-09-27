const SectionHeader = ({ icon: Icon, title }) => {
  return (
    <span className="flex items-center gap-x-3 md:gap-x-5">
      <div
        className="flex items-center justify-center 
        md:w-16 md:h-16 
        rounded-2xl md:rounded-[22px] 
        bg-gradient-to-tr from-primary-500 via-primary-600 to-primary-800 
        text-white 
     shadow-card p-3
      "
      >
        {Icon && <Icon className="w-6 h-6 md:w-8 md:h-8" />}
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-secondary-900">
        {title}
      </h2>
    </span>
  );
};

export default SectionHeader;
