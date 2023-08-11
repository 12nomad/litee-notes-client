const BoardSkeleton = () => {
  return (
    <div className="flex gap-4 items-center">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={idx}
          role="status"
          className="w-[284px] h-[103px]  grid place-items-center gap-2 p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
        >
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 "></div>
          <span className="sr-only">Loading...</span>
        </div>
      ))}
    </div>
  );
};

export default BoardSkeleton;
