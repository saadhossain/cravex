export default function DashboardSkeletonLoader() {
  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards Skeleton */}
      <div className="flex gap-4 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-[calc(25%-13px)] h-32 bg-card rounded-xl animate-pulse"
          />
        ))}
      </div>
      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-card rounded-xl animate-pulse" />
        <div className="h-80 bg-card rounded-xl animate-pulse" />
      </div>
      {/* Table Skeleton */}
      <div className="h-96 bg-card rounded-xl animate-pulse" />
    </div>
  );
}
