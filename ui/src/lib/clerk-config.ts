// Clerk Configuration - Multi-tenant SaaS with Roles & Organizations
// Note: Clerk is not installed, using mock configuration for development

export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_development-fallback-key';

// User Roles for the SaaS platform
export enum UserRole {
  SUPER_ADMIN = 'super_admin',     // Platform administrator (us)
  ADMIN = 'admin',                 // Agency owner/administrator
  MODERATOR = 'moderator',         // Agency manager/moderator
  CLIENT = 'client',               // End client/user
  VIEWER = 'viewer'                // Read-only access
}

// Subscription Plans
export enum SubscriptionPlan {
  FREE = 'free',
  STARTER = 'starter',             // €29/month - Small agencies
  PROFESSIONAL = 'professional',   // €99/month - Medium agencies
  ENTERPRISE = 'enterprise',       // €299/month - Large agencies
  CUSTOM = 'custom'                // Custom pricing
}

// Organization (Agency) Types
export enum OrganizationType {
  MARKETING_AGENCY = 'marketing_agency',
  DIGITAL_AGENCY = 'digital_agency',
  ECOMMERCE_BUSINESS = 'ecommerce_business',
  ENTERPRISE = 'enterprise',
  FREELANCER = 'freelancer'
}

// Feature Permissions per Plan
export const PLAN_FEATURES = {
  [SubscriptionPlan.FREE]: {
    maxUsers: 2,
    maxCampaigns: 5,
    maxPlatforms: 1,
    aiPredictions: false,
    whiteLabel: false,
    apiAccess: false,
    prioritySupport: false,
    dataRetention: 30, // days
    maxClients: 1
  },
  [SubscriptionPlan.STARTER]: {
    maxUsers: 5,
    maxCampaigns: 25,
    maxPlatforms: 3,
    aiPredictions: true,
    whiteLabel: false,
    apiAccess: false,
    prioritySupport: false,
    dataRetention: 90,
    maxClients: 5
  },
  [SubscriptionPlan.PROFESSIONAL]: {
    maxUsers: 15,
    maxCampaigns: 100,
    maxPlatforms: 5,
    aiPredictions: true,
    ai_predictions: true,
    ml_engine: true,
    attribution_modeling: true,
    whiteLabel: true,
    apiAccess: true,
    prioritySupport: true,
    dataRetention: 365,
    maxClients: 25
  },
  [SubscriptionPlan.ENTERPRISE]: {
    maxUsers: -1, // unlimited
    maxCampaigns: -1,
    maxPlatforms: -1,
    aiPredictions: true,
    ai_predictions: true,
    ml_engine: true,
    attribution_modeling: true,
    whiteLabel: true,
    apiAccess: true,
    prioritySupport: true,
    dataRetention: -1, // unlimited
    maxClients: -1
  }
};

// Role-based permissions
export const ROLE_PERMISSIONS = {
  [UserRole.SUPER_ADMIN]: [
    'manage_platform',
    'view_all_organizations',
    'manage_subscriptions',
    'access_admin_panel',
    'view_analytics',
    'manage_users',
    'manage_billing'
  ],
  [UserRole.ADMIN]: [
    'manage_organization',
    'manage_users_in_org',
    'manage_campaigns',
    'manage_integrations',
    'view_analytics',
    'manage_billing',
    'manage_clients',
    'access_ai_features'
  ],
  [UserRole.MODERATOR]: [
    'manage_campaigns',
    'manage_integrations',
    'view_analytics',
    'manage_clients',
    'access_ai_features'
  ],
  [UserRole.CLIENT]: [
    'view_own_campaigns',
    'view_own_analytics',
    'limited_ai_features'
  ],
  [UserRole.VIEWER]: [
    'view_analytics',
    'view_campaigns'
  ]
};

// Clerk configuration options
export const clerkConfig = {
  appearance: {
    theme: 'light',
    variables: {
      colorPrimary: '#6366f1', // Indigo
      colorTextOnPrimaryBackground: '#ffffff',
      colorBackground: '#ffffff',
      colorInputBackground: '#f8fafc',
      colorInputText: '#1e293b',
      borderRadius: '0.5rem'
    },
    layout: {
      socialButtonsPlacement: 'bottom',
      socialButtonsVariant: 'iconButton'
    },
    elements: {
      formButtonPrimary: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700',
      card: 'shadow-xl border-0',
      headerTitle: 'text-2xl font-bold',
      headerSubtitle: 'text-gray-600'
    }
  },
  signIn: {
    routing: 'path',
    path: '/sign-in',
    redirectUrl: '/dashboard'
  },
  signUp: {
    routing: 'path', 
    path: '/sign-up',
    redirectUrl: '/onboarding'
  },
  userProfile: {
    routing: 'path',
    path: '/profile'
  },
  organizationProfile: {
    routing: 'path',
    path: '/organization'
  }
};

// Helper functions for role checking
export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
};

export const canAccessFeature = (plan: SubscriptionPlan, feature: keyof typeof PLAN_FEATURES[SubscriptionPlan.FREE]): boolean => {
  const planFeatures = PLAN_FEATURES[plan];
  return planFeatures && planFeatures[feature] === true;
};

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    [UserRole.SUPER_ADMIN]: 'Super Administrator - Athanasios Vlachos',
    [UserRole.ADMIN]: 'Agency Administrator', 
    [UserRole.MODERATOR]: 'Agency Moderator',
    [UserRole.CLIENT]: 'Client',
    [UserRole.VIEWER]: 'Viewer'
  };
  return roleNames[role] || role;
};

export const getPlanDisplayName = (plan: SubscriptionPlan): string => {
  const planNames = {
    [SubscriptionPlan.FREE]: 'Free Plan',
    [SubscriptionPlan.STARTER]: 'Starter Plan',
    [SubscriptionPlan.PROFESSIONAL]: 'Professional Plan',
    [SubscriptionPlan.ENTERPRISE]: 'Enterprise Plan',
    [SubscriptionPlan.CUSTOM]: 'Custom Plan'
  };
  return planNames[plan] || plan;
};

// Security: Validate user permissions on sensitive operations
export const validateUserAccess = (
  userRole: UserRole, 
  requiredPermission: string, 
  userPlan: SubscriptionPlan,
  requiredFeature?: keyof typeof PLAN_FEATURES[SubscriptionPlan.FREE]
): { allowed: boolean; reason?: string } => {
  
  // Check role permission
  if (!hasPermission(userRole, requiredPermission)) {
    return {
      allowed: false,
      reason: 'Insufficient role permissions'
    };
  }

  // Check plan feature access if required
  if (requiredFeature && !canAccessFeature(userPlan, requiredFeature)) {
    return {
      allowed: false,
      reason: 'Feature not available in current plan'
    };
  }

  return { allowed: true };
};

// Default organization metadata structure
export const createOrganizationMetadata = (
  type: OrganizationType,
  plan: SubscriptionPlan = SubscriptionPlan.FREE
) => ({
  type,
  plan,
  createdAt: new Date().toISOString(),
  features: PLAN_FEATURES[plan],
  settings: {
    whiteLabel: {
      enabled: false,
      logoUrl: '',
      brandColor: '#6366f1',
      customDomain: ''
    },
    notifications: {
      emailReports: true,
      slackIntegration: false,
      webhooks: []
    },
    security: {
      twoFactorRequired: false,
      ipWhitelist: [],
      sessionTimeout: 24 // hours
    }
  }
});

// User metadata structure
export const createUserMetadata = (
  role: UserRole,
  organizationId?: string
) => ({
  role,
  organizationId,
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
  permissions: ROLE_PERMISSIONS[role],
  preferences: {
    theme: 'light',
    language: 'el',
    timezone: 'Europe/Athens',
    notifications: {
      email: true,
      browser: true,
      mobile: false
    }
  }
});

export default clerkConfig;