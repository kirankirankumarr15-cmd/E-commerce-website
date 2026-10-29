const Skeleton = ({ className = '', variant = 'rect' }) => {
  const base = 'animate-pulse bg-surface-tertiary rounded-lg';
  const variants = {
    rect: '',
    circle: 'rounded-full',
    text: 'h-4 w-full',
  };

  return <div className={`${base} ${variants[variant]} ${className}`} aria-hidden="true" />;
};

export const ProductCardSkeleton = () => (
  <div className="bg-surface rounded-xl border border-border overflow-hidden">
    <Skeleton className="aspect-square w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" variant="text" />
      <Skeleton className="h-4 w-1/2" variant="text" />
      <Skeleton className="h-6 w-1/3" variant="text" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export default Skeleton;
