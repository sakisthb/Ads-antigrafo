import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export function Breadcrumbs() {
  const location = useLocation();
  const { t } = useTranslation();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: t('navigation.dashboard'),
        path: '/',
        icon: <Home className="w-4 h-4" />
      }
    ];

    if (pathSegments.length === 0) {
      return breadcrumbs;
    }

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      
      // Map path segments to readable labels
      let label = segment;
      let icon: React.ReactNode | undefined;

      switch (segment) {
        case 'campaigns':
          label = t('navigation.campaigns');
          break;
        case 'analytics':
          label = t('navigation.analytics');
          break;
        case 'campaign-analysis':
          label = t('navigation.campaignAnalysis');
          break;
        case 'funnel-analysis':
          label = t('navigation.funnelAnalysis');
          break;
        case 'settings':
          label = t('navigation.settings');
          break;
        default:
          // Convert kebab-case to Title Case
          label = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
      }

      breadcrumbs.push({
        label,
        path: currentPath,
        icon
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on home page
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isFirst = index === 0;

        return (
          <div key={breadcrumb.path} className="flex items-center">
            {!isFirst && (
              <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground/50" />
            )}
            
            {isLast ? (
              <span className="flex items-center gap-1 font-medium text-foreground">
                {breadcrumb.icon}
                {breadcrumb.label}
              </span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link to={breadcrumb.path} className="flex items-center gap-1">
                  {breadcrumb.icon}
                  {breadcrumb.label}
                </Link>
              </Button>
            )}
          </div>
        );
      })}
    </nav>
  );
} 