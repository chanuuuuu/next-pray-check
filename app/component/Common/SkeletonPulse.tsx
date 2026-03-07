export function SkeletonPulse({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{ background: "hsl(var(--secondary))" }}
    />
  );
}
