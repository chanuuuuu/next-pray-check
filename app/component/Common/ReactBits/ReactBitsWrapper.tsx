import LightRays from "./LightRays";
import Prism from "./Prism";

export function LightRayWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ReactBitsWrapper
      component={
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
      }
    >
      {children}
    </ReactBitsWrapper>
  );
}

export function PrismWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ReactBitsWrapper
      component={
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={4.5}
          scale={1.9}
          hueShift={0}
          colorFrequency={1}
          glow={1}
        />
      }
    >
      {children}
    </ReactBitsWrapper>
  );
}

export function ReactBitsWrapper({
  component,
  children,
}: {
  component: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      {component}
      <div style={{ position: "relative", width: "100%", height: "inherit" }}>
        {children}
      </div>
    </>
  );
}
