import LightRays from "./LightRays";

export default function LightRayWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={1.5}
        lightSpread={0.6}
        rayLength={20}
        fadeDistance={2}
        mouseInfluence={0.1}
        saturation={0.5}
        className="custom-rays"
      />
      <div style={{ position: "relative", width: "100%" }}>{children}</div>
    </>
  );
}
