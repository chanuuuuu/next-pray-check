"use client";
import "./UserCardLoading.css";

export function UserCardLoading({ height }: { height?: number }) {
  const customClass = height ? `content${height}` : "";

  return (
    <div className="loadingCard">
      <div className="loadingCardHeader">
        <div className="loadingUserInfo">
          <div className="loadingName shimmer" />
          <div className="loadingGisu shimmer" />
        </div>
      </div>
      <div className={`loadingContent shimmer ${customClass}`} />
    </div>
  );
}
