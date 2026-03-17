"use client";

import { SkeletonPulse } from "@/app/component/Common/SkeletonPulse";
import { PageSkeleton } from "@/app/component/Common/PageSkeleton";

export default function RequestLoading() {
  return (
    <PageSkeleton>
      {/* 헤더 스켈레톤 */}
      <div className="glass-strong sticky top-0 z-40 px-5 pt-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <SkeletonPulse className="h-5 w-20 rounded-lg" />
          <SkeletonPulse className="h-8 w-16 rounded-xl" />
        </div>
        <div className="flex gap-2 pb-3">
          {[1, 2, 3].map((i) => (
            <SkeletonPulse key={i} className="h-6 w-14 rounded-full" />
          ))}
        </div>
      </div>

      {/* 카드 스켈레톤 */}
      <div className="px-5 pt-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <SkeletonPulse className="h-4 w-16 rounded-md" />
              <SkeletonPulse className="h-4 w-10 rounded-full" />
            </div>
            <SkeletonPulse className="h-3 w-full rounded-md" />
            <SkeletonPulse className="h-3 w-4/5 rounded-md" />
          </div>
        ))}
      </div>
    </PageSkeleton>
  );
}
