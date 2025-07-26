// Tenant Data Isolation Service - Multi-tenant SaaS Security
// Ensures complete data separation between organizations

import { useSaaS } from './demo-auth-provider';
import { UserRole } from './clerk-config';

export interface TenantContext {
  organizationId: string;
  userId: string;
  userRole: UserRole;
  permissions: string[];
  isIsolated: boolean;
}

export interface TenantQuery {
  table: string;
  filters: Record<string, any>;
  context: TenantContext;
}

export interface TenantData {
  organizationId: string;
  data: any;
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    accessLevel: 'private' | 'organization' | 'public';
  };
}

class TenantIsolationService {
  private static instance: TenantIsolationService;
  
  static getInstance(): TenantIsolationService {
    if (!TenantIsolationService.instance) {
      TenantIsolationService.instance = new TenantIsolationService();
    }
    return TenantIsolationService.instance;
  }

  // **CRITICAL**: Always apply organization filter to queries
  applyTenantFilter<T>(query: any, context: TenantContext): any {
    if (!context.organizationId) {
      throw new Error('Organization context required for data access');
    }

    // Super admins can access all data if explicitly requested
    if (context.userRole === UserRole.SUPER_ADMIN && query.bypassTenantFilter) {
      return query;
    }

    // Apply organization filter to all queries
    const tenantFilter = {
      organizationId: context.organizationId
    };

    // Merge with existing filters
    if (query.where) {
      query.where = { ...query.where, ...tenantFilter };
    } else {
      query.where = tenantFilter;
    }

    return query;
  }

  // **SECURITY**: Validate data access permissions
  validateDataAccess(
    data: TenantData, 
    context: TenantContext, 
    operation: 'read' | 'write' | 'delete'
  ): { allowed: boolean; reason?: string } {
    
    // Super admin can access everything
    if (context.userRole === UserRole.SUPER_ADMIN) {
      return { allowed: true };
    }

    // Check organization ownership
    if (data.organizationId !== context.organizationId) {
      return { 
        allowed: false, 
        reason: 'Data belongs to different organization' 
      };
    }

    // Check access level
    switch (data.metadata.accessLevel) {
      case 'private':
        // Only creator can access private data
        if (data.metadata.createdBy !== context.userId) {
          return { 
            allowed: false, 
            reason: 'Private data - access denied' 
          };
        }
        break;

      case 'organization':
        // Any organization member can read, but write requires admin/moderator
        if (operation !== 'read' && 
            !context.permissions.includes('manage_organization') &&
            !context.permissions.includes('manage_campaigns')) {
          return { 
            allowed: false, 
            reason: 'Insufficient permissions for organization data' 
          };
        }
        break;

      case 'public':
        // Public data - everyone can read, admins can write
        if (operation !== 'read' && 
            !context.permissions.includes('manage_organization')) {
          return { 
            allowed: false, 
            reason: 'Admin permissions required for public data modification' 
          };
        }
        break;
    }

    return { allowed: true };
  }

  // **SECURITY**: Wrap data with tenant metadata
  wrapTenantData<T>(
    data: T, 
    context: TenantContext, 
    accessLevel: 'private' | 'organization' | 'public' = 'organization'
  ): TenantData {
    return {
      organizationId: context.organizationId,
      data,
      metadata: {
        createdAt: new Date(),
        createdBy: context.userId,
        updatedAt: new Date(),
        updatedBy: context.userId,
        accessLevel
      }
    };
  }

  // **SECURITY**: Sanitize data for client consumption
  sanitizeDataForClient<T>(
    data: TenantData[], 
    context: TenantContext
  ): T[] {
    return data
      .filter(item => {
        const access = this.validateDataAccess(item, context, 'read');
        return access.allowed;
      })
      .map(item => {
        // Remove sensitive metadata for non-admins
        if (!context.permissions.includes('manage_organization')) {
          const { metadata, ...sanitizedData } = item;
          return sanitizedData.data as T;
        }
        return item.data as T;
      });
  }

  // **AUDIT**: Log data access for security monitoring
  logDataAccess(
    context: TenantContext,
    operation: string,
    resource: string,
    success: boolean,
    reason?: string
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      organizationId: context.organizationId,
      userId: context.userId,
      userRole: context.userRole,
      operation,
      resource,
      success,
      reason,
      ip: window.location.hostname, // In real app, get from request
      userAgent: navigator.userAgent
    };

    // In production, send to secure logging service
    console.log('[TENANT_AUDIT]', logEntry);
    
    // Store in secure audit log
    this.storeAuditLog(logEntry);
  }

  private storeAuditLog(entry: any): void {
    // In production, this would send to a secure audit logging service
    const auditLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
    auditLogs.push(entry);
    
    // Keep only last 1000 entries in local storage
    if (auditLogs.length > 1000) {
      auditLogs.splice(0, auditLogs.length - 1000);
    }
    
    localStorage.setItem('audit_logs', JSON.stringify(auditLogs));
  }

  // **SECURITY**: Encrypt sensitive data at rest
  encryptSensitiveData(data: any, context: TenantContext): string {
    // In production, use proper encryption with organization-specific keys
    const dataString = JSON.stringify(data);
    const key = context.organizationId; // Simplified - use proper key derivation
    
    // Simple base64 encoding (use real encryption in production)
    return btoa(dataString + '|' + key);
  }

  decryptSensitiveData(encryptedData: string, context: TenantContext): any {
    try {
      // Simple base64 decoding (use real decryption in production)
      const decoded = atob(encryptedData);
      const [dataString, key] = decoded.split('|');
      
      if (key !== context.organizationId) {
        throw new Error('Invalid decryption key for organization');
      }
      
      return JSON.parse(dataString);
    } catch (error) {
      throw new Error('Failed to decrypt data');
    }
  }

  // **SECURITY**: Generate organization-specific API keys
  generateOrganizationApiKey(organizationId: string): string {
    // In production, use cryptographically secure key generation
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    const orgHash = btoa(organizationId).substring(0, 8);
    
    return `ak_${orgHash}_${timestamp}_${random}`;
  }

  // **SECURITY**: Validate API key belongs to organization
  validateApiKey(apiKey: string, organizationId: string): boolean {
    try {
      const [prefix, orgHash, timestamp, random] = apiKey.split('_');
      
      if (prefix !== 'ak') return false;
      
      const expectedOrgHash = btoa(organizationId).substring(0, 8);
      return orgHash === expectedOrgHash;
    } catch {
      return false;
    }
  }
}

// Custom hook for tenant-aware data operations
export const useTenantData = () => {
  const { user, organization } = useSaaS();
  const isolationService = TenantIsolationService.getInstance();

  const getTenantContext = (): TenantContext | null => {
    if (!user || !organization) return null;

    return {
      organizationId: organization.id,
      userId: user.id,
      userRole: user.role,
      permissions: user.permissions,
      isIsolated: true
    };
  };

  const secureQuery = <T>(query: any): Promise<T[]> => {
    const context = getTenantContext();
    if (!context) {
      throw new Error('User not authenticated or no organization context');
    }

    // Apply tenant filter
    const tenantQuery = isolationService.applyTenantFilter(query, context);
    
    // Log the operation
    isolationService.logDataAccess(
      context,
      'query',
      query.table || 'unknown',
      true
    );

    // In real app, execute the query against your database
    return Promise.resolve([]);
  };

  const secureCreate = <T>(data: T, accessLevel?: 'private' | 'organization' | 'public'): Promise<TenantData> => {
    const context = getTenantContext();
    if (!context) {
      throw new Error('User not authenticated or no organization context');
    }

    // Wrap with tenant metadata
    const tenantData = isolationService.wrapTenantData(data, context, accessLevel);

    // Log the operation
    isolationService.logDataAccess(
      context,
      'create',
      'data',
      true
    );

    // In real app, save to database with tenant isolation
    return Promise.resolve(tenantData);
  };

  const secureUpdate = <T>(id: string, data: T): Promise<TenantData> => {
    const context = getTenantContext();
    if (!context) {
      throw new Error('User not authenticated or no organization context');
    }

    // In real app, first fetch existing data and validate access
    // Then update with tenant validation

    // Log the operation
    isolationService.logDataAccess(
      context,
      'update',
      `data:${id}`,
      true
    );

    return Promise.resolve(isolationService.wrapTenantData(data, context));
  };

  const secureDelete = (id: string): Promise<boolean> => {
    const context = getTenantContext();
    if (!context) {
      throw new Error('User not authenticated or no organization context');
    }

    // In real app, validate delete permissions and execute

    // Log the operation
    isolationService.logDataAccess(
      context,
      'delete',
      `data:${id}`,
      true
    );

    return Promise.resolve(true);
  };

  return {
    context: getTenantContext(),
    query: secureQuery,
    create: secureCreate,
    update: secureUpdate,
    delete: secureDelete,
    isolationService
  };
};

// Export singleton instance
export const tenantIsolation = TenantIsolationService.getInstance();