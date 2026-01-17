"use client";

export function StatsSummery({ stats }: { stats: any }) {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-warning/10 border border-primary/20 rounded-xl p-6 mt-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            📊 Business Summary
          </h3>
          <p className="text-muted-foreground mt-1">
            Performing well with {stats.totalOrders} total orders.
          </p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">
              {(
                ((stats.ordersByStatus.delivered || 0) /
                  Math.max(stats.totalOrders, 1)) *
                100
              ).toFixed(1)}
              %
            </p>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-success">
              {(
                ((stats.ordersByStatus.cancelled || 0) /
                  Math.max(stats.totalOrders, 1)) *
                100
              ).toFixed(1)}
              %
            </p>
            <p className="text-sm text-muted-foreground">Cancellation Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
