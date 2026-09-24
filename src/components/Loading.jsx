import { Loader2 } from 'lucide-react';

/**
 * Composant de chargement pour React.lazy()
 * Utilisé lors du lazy loading des routes
 */
export default function LazyLoadFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Chargement...</p>
      </div>
    </div>
  );
}

/**
 * Loader inline pour les actions (boutons, etc.)
 */
export function InlineLoader({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className}`} 
    />
  );
}

/**
 * Skeleton loader pour les cartes produits
 */
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="bg-gray-300 h-40 rounded mb-4"></div>
      <div className="bg-gray-300 h-4 rounded w-3/4 mb-2"></div>
      <div className="bg-gray-300 h-4 rounded w-1/2"></div>
    </div>
  );
}

/**
 * Skeleton loader pour les listes
 */
export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="bg-gray-300 w-16 h-16 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="bg-gray-300 h-4 rounded w-3/4"></div>
              <div className="bg-gray-300 h-3 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
