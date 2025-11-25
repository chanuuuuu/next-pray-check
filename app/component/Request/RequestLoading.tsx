"use client";
import { LightRayWrapper } from "@/app/component/Common/ReactBits/ReactBitsWrapper";
import { UserCardLoading } from "@/app/component/Common/UserCardLoading";
import "./RequestLoading.css";

export default function RequestLoading() {
  return (
    <section className="page">
      <LightRayWrapper>
        <div className="loading-container">
          <div className="loadingHeader ">
            <div className="loadingSelect shimmer" />
            <div className="loadingButton shimmer" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <UserCardLoading key={i} />
          ))}
        </div>
      </LightRayWrapper>
    </section>
  );
}
