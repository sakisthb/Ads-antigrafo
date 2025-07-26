import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  Bell, 
  Menu,
  Sparkles,
  TrendingUp,
  BarChart3,
  Target,
  Home,
  Bot
} from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../lib/notifications-context';
import { useTranslation } from 'react-i18next';
import { UserProfileMenu } from './user-profile-menu';
import { DataSourceSwitcher } from './DataSourceSwitcher';
import { useSaaS } from '@/lib/demo-auth-provider';
import { toast } from 'sonner';

export function Navbar() {
  const { user, isAuthenticated } = useSaaS();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  if (!isAuthenticated || !user) {
    return null;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const navigationItems = [
    { name: t('navigation.dashboard'), path: '/', icon: Home },
    { name: t('navigation.campaigns'), path: '/campaigns', icon: Target },
    { name: t('navigation.analytics'), path: '/analytics', icon: BarChart3 },
    { name: t('navigation.funnelAnalysis'), path: '/funnel-analysis', icon: TrendingUp },
    { name: 'Mystery AI', path: '/mystery-ai', icon: Sparkles },
    { name: 'Ρώτησε τον Saki - AI', path: '/ask-saki-ai', icon: Bot },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl shadow-lg shadow-gray-500/10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Ads Pro
                </h1>
                <p className="text-xs text-muted-foreground">Platforms Analysis</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`relative px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30'
                      : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  )}
                </Button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Αναζήτηση..."
                className="pl-10 pr-4 py-2 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white/70 dark:focus:bg-gray-800/70 transition-all duration-300"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
              onClick={() => {
                toast.info(`Έχετε ${unreadCount} νέες ειδοποιήσεις`, {
                  description: 'Πατήστε εδώ για να τις δείτε όλες'
                });
              }}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs p-0 flex items-center justify-center animate-pulse"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>

            {/* Theme Toggle */}
            <ModeToggle />

            {/* User Profile Menu */}
            <UserProfileMenu />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Αναζήτηση..."
                className="pl-10 pr-4 py-3 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white/70 dark:focus:bg-gray-800/70 transition-all duration-300"
              />
            </div>
            
            {/* Mobile Navigation */}
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={`w-full justify-start px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30'
                        : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}