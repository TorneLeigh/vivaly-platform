interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'hero' | 'stats';
  count?: number;
}

export default function LoadingSkeleton({ variant = 'card', count = 1 }: LoadingSkeletonProps) {
  const renderCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm animate-pulse overflow-hidden">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );

  const renderHeroSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
      <div className="h-12 bg-gray-200 rounded-xl w-full max-w-2xl mx-auto"></div>
    </div>
  );

  const renderStatsSkeleton = () => (
    <div className="text-center animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
    </div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'list':
        return renderListSkeleton();
      case 'hero':
        return renderHeroSkeleton();
      case 'stats':
        return renderStatsSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}