type PageSkeletonProps = {
  children: React.ReactNode;
};

export function PageSkeleton({ children }: PageSkeletonProps) {
  return (
    <div className="min-h-screen bg-app-gradient pb-24">
      {children}
    </div>
  );
}
