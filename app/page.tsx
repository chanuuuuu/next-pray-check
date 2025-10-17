"use client";
import LightRays from "@/app/component/Common/ReactBits/LightRays";

export default function Home() {
  // 최초 진입시 세션 체크 및 로그인 확인
  return (
    <div>
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={10}
        fadeDistance={5}
        mouseInfluence={0.1}
        saturation={0.5}
        className="custom-rays"
      />
    </div>
  );
}
