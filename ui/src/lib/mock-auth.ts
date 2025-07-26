// Mock Authentication System 
// Professional Authentication για Development & Testing
// 20+ Years Experience - Production-Ready Architecture

import { UserRole, SubscriptionPlan } from './clerk-config';

export interface MockUser {
  id: string;
  email: string;
  password: string; // In real app, this would be hashed
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  organizationRole: string;
  subscriptionPlan: SubscriptionPlan;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  metadata: {
    phone?: string;
    department?: string;
    bio?: string;
    preferences?: any;
  };
}

export interface MockOrganization {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string;
  type: 'agency' | 'enterprise' | 'startup' | 'freelancer';
  membersCount: number;
  plan: SubscriptionPlan;
  features: string[];
  settings: {
    allowSelfRegistration: boolean;
    requireTwoFactor: boolean;
    sessionTimeout: number;
  };
  createdAt: Date;
  owner: string; // user id
}

// Professional Mock Users για Testing
export const MOCK_USERS: MockUser[] = [
  // SUPER ADMIN - Platform Administrator
  {
    id: 'admin_001',
    email: 'admin@adspro.com',
    password: 'admin123',
    firstName: 'Athanasios',
    lastName: 'Vlachos - Admin',
    imageUrl: null,
    role: UserRole.SUPER_ADMIN,
    organizationId: 'adspro_platform',
    organizationName: 'Ads Pro Platform',
    organizationRole: 'owner',
    subscriptionPlan: SubscriptionPlan.ENTERPRISE,
    permissions: [
      // Admin permissions
      'access_admin_panel',
      'manage_organization', 
      'manage_users', 
      'manage_platform',
      'view_all_organizations',
      'manage_system_settings',
      'manage_billing',
      
      // Campaign permissions
      'manage_campaigns',
      'campaigns:read',
      'campaigns:write',
      'campaigns:delete',
      'campaign-analysis:read',
      'campaign-analysis:write',
      
      // Analytics permissions
      'view_analytics',
      'analytics:read',
      'analytics:write',
      'analytics:delete',
      'analytics:advanced',
      'advanced-analytics:read',
      'advanced-analytics:write',
      'analytics-studio:read',
      'analytics-studio:write',
      'funnel-analysis:read',
      'funnel-analysis:write',
      'realtime:read',
      'realtime:write',
      'reporting-hub:read',
      'reporting-hub:write',
      'reports:create',
      
      // Integration permissions
      'manage_integrations',
      'integrations:read',
      'integrations:write',
      'integrations:delete',
      
      // AI and Attribution permissions
      'access_ai_features',
      'ai:read',
      'ai:write',
      'ai_predictions',
      'ml_engine',
      'access_attribution_features',
      'attribution:read',
      'attribution:write',
      'attribution_modeling',
      
      // Data permissions
      'data:read',
      'data:write',
      'data:delete',
      'export:read',
      'export:write',
      
      // User management permissions
      'users:read',
      'users:write',
      'users:delete',
      'roles:read',
      'roles:write',
      'roles:delete',
      
      // Organization permissions
      'organizations:read',
      'organizations:write',
      'organizations:delete',
      
      // Billing permissions
      'billing:read',
      'billing:write',
      'subscriptions:read',
      'subscriptions:write',
      
      // System permissions
      'system:read',
      'system:write',
      'logs:read',
      'settings:read',
      'settings:write'
    ],
    isActive: true,
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    createdAt: new Date('2024-01-01'),
    metadata: {
      phone: '+30 210 1234567',
      department: 'Platform Administration',
      bio: 'Platform Administrator με 15+ χρόνια εμπειρίας στο digital marketing'
    }
  },

  // AGENCY ADMIN - Agency Owner
  {
    id: 'agency_admin_001',
    email: 'maria@digitalagency.gr',
    password: 'maria123',
    firstName: 'Μαρία',
    lastName: 'Παπαδοπούλου',
    imageUrl: null,
    role: UserRole.ADMIN,
    organizationId: 'digital_agency_001',
    organizationName: 'Digital Marketing Agency',
    organizationRole: 'admin',
    subscriptionPlan: SubscriptionPlan.PROFESSIONAL,
    permissions: [
      'manage_organization',
      'manage_campaigns',
      'manage_users',
      'view_analytics',
      'manage_billing',
      'manage_integrations',
      'access_ai_features',
      'access_attribution_features',
      'manage_clients'
    ],
    isActive: true,
    lastLogin: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    createdAt: new Date('2024-01-15'),
    metadata: {
      phone: '+30 210 2345678',
      department: 'Agency Management',
      bio: 'CEO & Founder της Digital Marketing Agency με 12+ χρόνια εμπειρίας'
    }
  },

  // MODERATOR - Campaign Manager
  {
    id: 'moderator_001',
    email: 'dimitris@digitalagency.gr',
    password: 'dimitris123',
    firstName: 'Δημήτρης',
    lastName: 'Κωνσταντίνου',
    imageUrl: null,
    role: UserRole.MODERATOR,
    organizationId: 'digital_agency_001',
    organizationName: 'Digital Marketing Agency',
    organizationRole: 'moderator',
    subscriptionPlan: SubscriptionPlan.PROFESSIONAL,
    permissions: [
      'manage_campaigns',
      'manage_integrations',
      'view_analytics',
      'manage_clients',
      'access_ai_features',
      'access_attribution_features'
    ],
    isActive: true,
    lastLogin: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    createdAt: new Date('2024-02-01'),
    metadata: {
      phone: '+30 210 3456789',
      department: 'Campaign Management',
      bio: 'Senior Campaign Manager ειδικός σε Meta & Google Ads'
    }
  },

  // CLIENT - End Client/Customer
  {
    id: 'client_001',
    email: 'nikos@techstartup.com',
    password: 'nikos123',
    firstName: 'Νίκος',
    lastName: 'Τεχνόπουλος',
    imageUrl: null,
    role: UserRole.CLIENT,
    organizationId: 'tech_startup_001',
    organizationName: 'Tech Startup Innovations',
    organizationRole: 'member',
    subscriptionPlan: SubscriptionPlan.STARTER,
    permissions: [
      'view_own_campaigns',
      'view_own_analytics',
      'limited_ai_features'
    ],
    isActive: true,
    lastLogin: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    createdAt: new Date('2024-02-15'),
    metadata: {
      phone: '+30 210 4567890',
      department: 'Marketing',
      bio: 'Marketing Manager σε tech startup, ψάχνω για data-driven solutions'
    }
  },

  // CLIENT 2 - E-commerce Client
  {
    id: 'client_002',
    email: 'sofia@eshop.gr',
    password: 'sofia123',
    firstName: 'Σοφία',
    lastName: 'Εμπορίου',
    imageUrl: null,
    role: UserRole.CLIENT,
    organizationId: 'ecommerce_store_001',
    organizationName: 'Premium E-shop',
    organizationRole: 'member',
    subscriptionPlan: SubscriptionPlan.PROFESSIONAL,
    permissions: [
      'view_own_campaigns',
      'view_own_analytics',
      'limited_ai_features',
      'access_ecommerce_features'
    ],
    isActive: true,
    lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    createdAt: new Date('2024-03-01'),
    metadata: {
      phone: '+30 210 5678901',
      department: 'E-commerce',
      bio: 'Owner του Premium E-shop, focused on ROAS optimization'
    }
  },

  // VIEWER - Analytics Viewer
  {
    id: 'viewer_001',
    email: 'analyst@company.com',
    password: 'analyst123',
    firstName: 'Αναστάσιος',
    lastName: 'Αναλυτής',
    imageUrl: null,
    role: UserRole.VIEWER,
    organizationId: 'digital_agency_001',
    organizationName: 'Digital Marketing Agency',
    organizationRole: 'member',
    subscriptionPlan: SubscriptionPlan.PROFESSIONAL,
    permissions: [
      'view_analytics',
      'view_campaigns'
    ],
    isActive: true,
    lastLogin: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    createdAt: new Date('2024-03-10'),
    metadata: {
      phone: '+30 210 6789012',
      department: 'Analytics',
      bio: 'Data Analyst ειδικός σε performance metrics και reporting'
    }
  }
];

export const MOCK_ORGANIZATIONS: MockOrganization[] = [
  {
    id: 'adspro_platform',
    name: 'Ads Pro Platform',
    slug: 'ads-pro-platform',
    imageUrl: null,
    description: 'Enterprise advertising analytics platform',
    type: 'enterprise',
    membersCount: 1,
    plan: SubscriptionPlan.ENTERPRISE,
    features: ['all_features', 'white_label', 'api_access', 'custom_integrations'],
    settings: {
      allowSelfRegistration: false,
      requireTwoFactor: true,
      sessionTimeout: 8
    },
    createdAt: new Date('2024-01-01'),
    owner: 'admin_001'
  },
  {
    id: 'digital_agency_001',
    name: 'Digital Marketing Agency',
    slug: 'digital-marketing-agency',
    imageUrl: null,
    description: 'Full-service digital marketing agency specializing in performance marketing',
    type: 'agency',
    membersCount: 3,
    plan: SubscriptionPlan.PROFESSIONAL,
    features: ['advanced_analytics', 'ai_features', 'attribution', 'white_label'],
    settings: {
      allowSelfRegistration: true,
      requireTwoFactor: false,
      sessionTimeout: 4
    },
    createdAt: new Date('2024-01-15'),
    owner: 'agency_admin_001'
  },
  {
    id: 'tech_startup_001',
    name: 'Tech Startup Innovations',
    slug: 'tech-startup',
    imageUrl: null,
    description: 'Innovative tech startup focused on SaaS solutions',
    type: 'startup',
    membersCount: 1,
    plan: SubscriptionPlan.STARTER,
    features: ['basic_analytics', 'campaign_management'],
    settings: {
      allowSelfRegistration: false,
      requireTwoFactor: false,
      sessionTimeout: 2
    },
    createdAt: new Date('2024-02-15'),
    owner: 'client_001'
  },
  {
    id: 'ecommerce_store_001',
    name: 'Premium E-shop',
    slug: 'premium-eshop',
    imageUrl: null,
    description: 'Premium e-commerce store with focus on high-end products',
    type: 'enterprise',
    membersCount: 1,
    plan: SubscriptionPlan.PROFESSIONAL,
    features: ['advanced_analytics', 'ecommerce_tracking', 'ai_features'],
    settings: {
      allowSelfRegistration: false,
      requireTwoFactor: true,
      sessionTimeout: 6
    },
    createdAt: new Date('2024-03-01'),
    owner: 'client_002'
  }
];

// Authentication Service για Mock Users
export class MockAuthService {
  private static instance: MockAuthService;
  private currentUser: MockUser | null = null;
  private currentOrganization: MockOrganization | null = null;
  private listeners: (() => void)[] = [];

  static getInstance(): MockAuthService {
    if (!MockAuthService.instance) {
      MockAuthService.instance = new MockAuthService();
    }
    return MockAuthService.instance;
  }

  constructor() {
    this.loadPersistedAuth();
    
    // Auto-login in development mode if no auth found
    if (!this.currentUser && import.meta.env.DEV) {
      console.log('🔧 Auto-logging in development mode...');
      this.autoLoginDevelopment();
    }
  }

  private autoLoginDevelopment() {
    // Auto-login με τον πρώτο SUPER_ADMIN χρήστη
    const adminUser = MOCK_USERS.find(u => u.role === UserRole.SUPER_ADMIN);
    const defaultOrg = MOCK_ORGANIZATIONS[0]; // Ads Pro Platform
    
    if (adminUser && defaultOrg) {
      this.currentUser = adminUser;
      this.currentOrganization = defaultOrg;
      this.persistAuth();
      this.notifyListeners();
      console.log(`✅ Auto-logged in as ${adminUser.firstName} ${adminUser.lastName} (${adminUser.role})`);
      console.log(`🔑 User permissions:`, adminUser.permissions);
    }
  }

  private loadPersistedAuth() {
    try {
      const storedAuth = localStorage.getItem('mock_auth_session');
      if (storedAuth) {
        const { userId, organizationId } = JSON.parse(storedAuth);
        const user = MOCK_USERS.find(u => u.id === userId);
        const org = MOCK_ORGANIZATIONS.find(o => o.id === organizationId);
        
        if (user && org) {
          this.currentUser = user;
          this.currentOrganization = org;
          this.notifyListeners();
        }
      }
    } catch (error) {
      console.error('Error loading persisted auth:', error);
    }
  }

  private persistAuth() {
    if (this.currentUser && this.currentOrganization) {
      localStorage.setItem('mock_auth_session', JSON.stringify({
        userId: this.currentUser.id,
        organizationId: this.currentOrganization.id,
        timestamp: Date.now()
      }));
    } else {
      localStorage.removeItem('mock_auth_session');
    }
  }

  public notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: MockUser }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Invalid password' };
    }

    if (!user.isActive) {
      return { success: false, error: 'Account is disabled' };
    }

    const organization = MOCK_ORGANIZATIONS.find(o => o.id === user.organizationId);
    if (!organization) {
      return { success: false, error: 'Organization not found' };
    }

    // Update last login
    user.lastLogin = new Date();
    
    this.currentUser = user;
    this.currentOrganization = organization;
    this.persistAuth();
    this.notifyListeners();

    return { success: true, user };
  }

  public logout(): void {
    this.currentUser = null;
    this.currentOrganization = null;
    this.persistAuth();
    this.notifyListeners();
  }

  public getCurrentUser(): MockUser | null {
    return this.currentUser;
  }

  public getCurrentOrganization(): MockOrganization | null {
    return this.currentOrganization;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public hasPermission(permission: string): boolean {
    return this.currentUser?.permissions.includes(permission) || false;
  }

  public getAllUsers(): MockUser[] {
    return MOCK_USERS.filter(user => user.isActive);
  }

  public getOrganizationMembers(organizationId: string): MockUser[] {
    return MOCK_USERS.filter(user => 
      user.organizationId === organizationId && user.isActive
    );
  }

  public switchUser(userId: string): boolean {
    const user = MOCK_USERS.find(u => u.id === userId && u.isActive);
    if (!user) return false;

    const organization = MOCK_ORGANIZATIONS.find(o => o.id === user.organizationId);
    if (!organization) return false;

    this.currentUser = user;
    this.currentOrganization = organization;
    this.persistAuth();
    this.notifyListeners();
    
    return true;
  }

  public refreshUserData(): void {
    if (this.currentUser) {
      // Refresh user data from MOCK_USERS array
      const refreshedUser = MOCK_USERS.find(u => u.id === this.currentUser!.id);
      if (refreshedUser) {
        this.currentUser = refreshedUser;
        this.persistAuth();
        this.notifyListeners();
        console.log(`🔄 Refreshed user data for ${refreshedUser.firstName} ${refreshedUser.lastName}`);
        console.log(`🔑 Updated permissions:`, refreshedUser.permissions);
      }
    }
  }

  public clearCachedAuth(): void {
    localStorage.removeItem('mock_auth_session');
    this.currentUser = null;
    this.currentOrganization = null;
    this.notifyListeners();
    console.log('🧹 Cleared cached authentication');
  }
}

export const mockAuthService = MockAuthService.getInstance();