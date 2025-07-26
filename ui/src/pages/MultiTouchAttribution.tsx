// Multi-Touch Attribution Page - SOS PRIORITY
// Enterprise Marketing Attribution Analysis

import { MultiTouchAttributionDashboard } from '@/components/multi-touch-attribution-dashboard';
import { useSaaS, ProtectedRoute } from '@/lib/demo-auth-provider';

export function MultiTouchAttribution() {
  return (
    <ProtectedRoute requiredPermission="access_attribution_features">
      <div className="container mx-auto px-4 py-6">
        <MultiTouchAttributionDashboard />
      </div>
    </ProtectedRoute>
  );
}