import { SkeletonPulse } from "@/app/component/Common/SkeletonPulse";

export function ManageLoading() {
  return (
    <div className="min-h-screen bg-app-gradient pb-24">
      {/* 헤더 스켈레톤 */}
      <div className="glass-strong sticky top-0 z-40 px-5 pt-12 pb-3 flex items-center justify-between">
        <SkeletonPulse className="h-5 w-24 rounded-lg" />
        <SkeletonPulse className="w-8 h-8 rounded-xl" />
      </div>

      {/* 조별 카드 스켈레톤 */}
      <div className="px-5 pt-4 space-y-5">
        {[1, 2, 3].map((cell) => (
          <div key={cell}>
            <SkeletonPulse className="h-3 w-16 rounded-md mb-2" />
            <div className="glass rounded-2xl overflow-hidden divide-y divide-border/30">
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex items-center px-4 py-3">
                  <div className="flex-1 space-y-1.5">
                    <SkeletonPulse className="h-4 w-20 rounded-md" />
                    <SkeletonPulse className="h-3 w-28 rounded-md" />
                  </div>
                  <div className="flex items-center gap-1">
                    <SkeletonPulse className="w-8 h-8 rounded-lg" />
                    <SkeletonPulse className="w-8 h-8 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
