'use client';

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i}
          className="bg-bg-sub rounded-xl p-4 border border-border flex items-center gap-4"
        >
          <div className="w-8 h-8 rounded-full skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded skeleton" />
            <div className="h-3 w-24 rounded skeleton" />
          </div>
          <div className="h-6 w-16 rounded skeleton" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-bg-sub rounded-xl p-4 md:p-6 border border-border">
            <div className="h-3 w-12 rounded skeleton mb-2" />
            <div className="h-8 w-16 rounded skeleton" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-bg-sub rounded-xl p-4 md:p-6 border border-border">
          <div className="h-4 w-24 rounded skeleton mb-4" />
          <div className="h-36 md:h-48 skeleton rounded" />
        </div>
        <div className="bg-bg-sub rounded-xl p-4 md:p-6 border border-border">
          <div className="h-4 w-24 rounded skeleton mb-4" />
          <div className="h-36 md:h-48 skeleton rounded" />
        </div>
      </div>

      {/* Recent Tests */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-bg-sub rounded-xl p-4 border border-border">
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 rounded skeleton" />
              <div className="h-5 w-16 rounded skeleton" />
            </div>
            <div className="flex gap-4 mt-2">
              <div className="h-3 w-12 rounded skeleton" />
              <div className="h-3 w-16 rounded skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SnippetSkeleton() {
  return (
    <div className="bg-bg-sub rounded-xl p-4 md:p-8 min-h-[200px] md:min-h-[300px] border border-border">
      <div className="space-y-3">
        <div className="h-4 w-3/4 rounded skeleton" />
        <div className="h-4 w-1/2 rounded skeleton" />
        <div className="h-4 w-2/3 rounded skeleton" />
        <div className="h-4 w-1/3 rounded skeleton" />
        <div className="h-4 w-3/4 rounded skeleton" />
        <div className="h-4 w-1/2 rounded skeleton" />
      </div>
    </div>
  );
}
