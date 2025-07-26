// AI/ML Predictions Page - Advanced Marketing Analytics
// Multiple Machine Learning Models for Predictive Insights

import { AIPredictionDashboard } from '@/components/ai-prediction-dashboard';
import { useSaaS, ProtectedRoute } from '@/lib/demo-auth-provider';

export function AIMLPredictions() {
  return (
    <ProtectedRoute requiredPermission="access_ai_features">
      <div className="container mx-auto px-4 py-6">
        <AIPredictionDashboard />
      </div>
    </ProtectedRoute>
  );
}