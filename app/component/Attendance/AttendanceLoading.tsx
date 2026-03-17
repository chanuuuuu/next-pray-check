"use client";

import { SkeletonPulse } from "@/app/component/Common/SkeletonPulse";

export function AttendanceLoading() {
  return (
    <div className="min-h-screen bg-app-gradient pb-24">
      {/* 헤더 스켈레톤 */}
      <div className="glass-strong sticky top-0 z-40 px-5 pt-3 pb-3">
        <SkeletonPulse className="h-5 w-24 rounded-lg" />
      </div>

      {/* 조별 카드 스켈레톤 */}
      <div className="px-5 pt-4 pb-8 space-y-5">
        {[1, 2, 3].map((cell) => (
          <div key={cell}>
            <SkeletonPulse className="h-3 w-12 rounded-md mb-2" />
            <div className="glass rounded-2xl overflow-hidden">
              {/* 헤더 행 */}
              <div className="flex items-center px-4 py-2 border-b border-border/50 gap-2">
                <SkeletonPulse className="flex-1 h-3 w-8 rounded-sm" />
                <SkeletonPulse className="w-16 h-3 rounded-sm mx-auto" />
                <SkeletonPulse className="w-16 h-3 rounded-sm" />
              </div>
              {/* 멤버 행 */}
              {[1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="flex items-center px-4 py-3 border-b border-border/20 last:border-0"
                >
                  <SkeletonPulse className="flex-1 h-4 w-16 rounded-md" />
                  <div className="w-16 flex justify-center">
                    <SkeletonPulse className="w-7 h-7 rounded-lg" />
                  </div>
                  <div className="w-16 flex justify-center">
                    <SkeletonPulse className="w-7 h-7 rounded-lg" />
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
