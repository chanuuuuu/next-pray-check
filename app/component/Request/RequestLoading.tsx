"use client";
import { LightRayWrapper } from "../Common/ReactBits/ReactBitsWrapper";
import "./RequestLoading.css";

function LoadingCard() {
  return (
    <div className="loadingCard">
      <div className="loadingCardHeader">
        <div className="loadingUserInfo">
          <div className="loadingName shimmer" />
          <div className="loadingGisu shimmer" />
        </div>
      </div>
      <div className="loadingContent shimmer" />
    </div>
  );
}

export default function RequestLoading() {
  return (
    <section className="page">
      <h1 className="title">기도제목</h1>
      <LightRayWrapper>
        <div className="loading-container">
          <div className="loadingHeader ">
            <div className="loadingSelect shimmer" />
            <div className="loadingButton shimmer" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </LightRayWrapper>
    </section>
  );
}
