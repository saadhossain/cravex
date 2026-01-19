export default function TableSkeletonLoader() {
  return (
    <div className="w-full rounded-lg border border-slate-800 bg-slate-900 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-slate-800 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-40 bg-slate-800 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-slate-800 rounded animate-pulse"></div>
          <div className="h-10 w-28 bg-slate-800 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 gap-4 mb-4 pb-3 border-b border-slate-800">
        <div className="h-4 w-16 bg-slate-800 rounded animate-pulse"></div>
        <div className="h-4 w-36 bg-slate-800 rounded animate-pulse"></div>
        <div className="h-4 w-24 bg-slate-800 rounded animate-pulse"></div>
        <div className="h-4 w-20 bg-slate-800 rounded animate-pulse"></div>
        <div className="h-4 w-16 bg-slate-800 rounded animate-pulse"></div>
      </div>

      {/* Table Rows */}
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-5 gap-4 py-4 border-b border-slate-800/50"
        >
          {/* Item Column */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-800 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-slate-800 rounded animate-pulse"></div>
          </div>

          {/* Customer & Order Column */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-32 bg-slate-800 rounded animate-pulse"></div>
            <div className="h-3 w-36 bg-slate-800 rounded animate-pulse"></div>
          </div>

          {/* Restaurant Column */}
          <div className="flex items-center">
            <div className="h-4 w-28 bg-slate-800 rounded animate-pulse"></div>
          </div>

          {/* Amount Column */}
          <div className="flex items-center">
            <div className="h-4 w-20 bg-slate-800 rounded animate-pulse"></div>
          </div>

          {/* Status Column */}
          <div className="flex items-center">
            <div className="h-7 w-24 bg-slate-800 rounded-full animate-pulse"></div>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Show:</span>
          <div className="h-9 w-16 bg-slate-800 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-slate-800 rounded animate-pulse ml-2"></div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-9 w-9 bg-slate-800 rounded animate-pulse"></div>
          <div className="h-9 w-9 bg-slate-800 rounded animate-pulse"></div>
          <div className="h-9 w-9 bg-slate-800 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-slate-800 rounded animate-pulse mx-2"></div>
          <div className="h-9 w-9 bg-slate-800 rounded animate-pulse"></div>
          <div className="h-9 w-9 bg-slate-800 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
