// Authentication Guard Component
// Route Protection με Professional UI
// 20+ Years Experience - Production-Ready

import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Lock, 
  AlertTriangle, 
  ArrowRight,
  Crown,
  Users,
  Star,
  Zap
} from 'lucide-react';
import { useSaaS, useRoleAccess } from '@/lib/demo-auth-provider';
import { UserRole } from '@/lib/clerk-config';

interface AuthGuardProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredRole?: UserRole;
  requiredFeature?: string;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  requiredPermission,
  requiredRole,
  requiredFeature,
  fallback,
  redirectTo = '/login'
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user, organization } = useSaaS();
  const location = useLocation();

  // Check role-based access if required
  const roleAccess = requiredPermission 
    ? useRoleAccess(requiredPermission, requiredFeature)
    : { allowed: true, loading: false, reason: '' };

  // Loading state
  if (isLoading || roleAccess.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && user?.role !== requiredRole) {
    const hasHigherRole = () => {
      const roleHierarchy = {
        [UserRole.VIEWER]: 1,
        [UserRole.CLIENT]: 2,
        [UserRole.MODERATOR]: 3,
        [UserRole.ADMIN]: 4,
        [UserRole.SUPER_ADMIN]: 5
      };
      
      const userLevel = roleHierarchy[user?.role || UserRole.VIEWER];
      const requiredLevel = roleHierarchy[requiredRole];
      
      return userLevel >= requiredLevel;
    };

    if (!hasHigherRole()) {
      return fallback || <RoleAccessDenied requiredRole={requiredRole} userRole={user?.role} />;
    }
  }

  // Check permission-based access
  if (!roleAccess.allowed) {
    return fallback || <PermissionAccessDenied reason={roleAccess.reason} requiredPermission={requiredPermission} />;
  }

  // All checks passed - render children
  return <>{children}</>;
}

// Role Access Denied Component
function RoleAccessDenied({ requiredRole, userRole }: { requiredRole: UserRole; userRole?: UserRole }) {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return <Crown className="w-6 h-6 text-yellow-600" />;
      case UserRole.ADMIN: return <Shield className="w-6 h-6 text-blue-600" />;
      case UserRole.MODERATOR: return <Star className="w-6 h-6 text-purple-600" />;
      case UserRole.CLIENT: return <Users className="w-6 h-6 text-green-600" />;
      case UserRole.VIEWER: return <Zap className="w-6 h-6 text-gray-600" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case UserRole.ADMIN: return 'bg-blue-100 text-blue-700 border-blue-200';
      case UserRole.MODERATOR: return 'bg-purple-100 text-purple-700 border-purple-200';
      case UserRole.CLIENT: return 'bg-green-100 text-green-700 border-green-200';
      case UserRole.VIEWER: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl mx-auto mb-4 shadow-xl">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-red-600">
            Access Restricted
          </CardTitle>
          <CardDescription className="text-base">
            This area requires higher privileges
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Insufficient Role Level</strong>
              <br />
              You need <strong>{requiredRole}</strong> role or higher to access this page.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Your current role:</p>
              <Badge className={`${getRoleColor(userRole || UserRole.VIEWER)} border font-medium`}>
                {getRoleIcon(userRole || UserRole.VIEWER)}
                {userRole || 'Unknown'}
              </Badge>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Required role:</p>
              <Badge className={`${getRoleColor(requiredRole)} border font-medium`}>
                {getRoleIcon(requiredRole)}
                {requiredRole}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => window.history.back()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Go Back
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              variant="outline"
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500">
              Contact your administrator to request access
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Permission Access Denied Component
function PermissionAccessDenied({ reason, requiredPermission }: { reason: string; requiredPermission?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl mx-auto mb-4 shadow-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-orange-600">
            Permission Denied
          </CardTitle>
          <CardDescription className="text-base">
            You don't have the required permissions
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Access Denied:</strong>
              <br />
              {reason}
            </AlertDescription>
          </Alert>

          {requiredPermission && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Required permission:</p>
              <Badge variant="outline" className="font-mono text-xs">
                {requiredPermission}
              </Badge>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={() => window.history.back()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Go Back
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              variant="outline"
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500">
              Contact your administrator to request the required permissions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}