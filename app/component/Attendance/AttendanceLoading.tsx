"use client";
import { useEffect } from "react";
import { UserCardLoading } from "@/app/component/Common/UserCardLoading";
import "./AttendanceLoading.css";

export function AttendanceLoading() {
  useEffect(() => {
    console.log("AttendanceLoading");
  });
  return (
    <section className="page">
      <h1 className="title">출석부</h1>
      <div className="loading-container">
        <div className="loadingHeader ">
          <div className="loadingSelect shimmer" />
          <div className="loadingButton shimmer" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <UserCardLoading key={i} height={40} />
        ))}
      </div>
    </section>
  );
}
