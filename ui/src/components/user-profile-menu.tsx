// User Profile Menu Component
// Professional User Menu με Logout & Profile Management
// 20+ Years Experience - Production-Ready

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Settings,
  LogOut,
  Shield,
  Crown,
  Star,
  Users,
  Zap,
  Building,
  CreditCard,
  Bell,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { useSaaS } from '@/lib/demo-auth-provider';
import { mockAuthService, MOCK_USERS } from '@/lib/mock-auth';
import { UserRole } from '@/lib/clerk-config';
import { toast } from 'sonner';

export function UserProfileMenu() {
  const navigate = useNavigate();
  const { user, organization, isAuthenticated } = useSaaS();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      mockAuthService.logout();
      toast.success('Αποσυνδεθήκατε επιτυχώς! 👋');
      navigate('/login');
    } catch (error) {
      toast.error('Σφάλμα κατά την αποσύνδεση');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSwitchUser = (userId: string) => {
    const success = mockAuthService.switchUser(userId);
    if (success) {
      const newUser = mockAuthService.getCurrentUser();
      toast.success(`Μεταβήκατε στον χρήστη: ${newUser?.firstName} ${newUser?.lastName} 🔄`);
      window.location.reload(); // Refresh to update UI
    } else {
      toast.error('Σφάλμα κατά την αλλαγή χρήστη');
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return <Crown className="w-4 h-4 text-yellow-600" />;
      case UserRole.ADMIN: return <Shield className="w-4 h-4 text-blue-600" />;
      case UserRole.MODERATOR: return <Star className="w-4 h-4 text-purple-600" />;
      case UserRole.CLIENT: return <Users className="w-4 h-4 text-green-600" />;
      case UserRole.VIEWER: return <Zap className="w-4 h-4 text-gray-600" />;
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const otherUsers = MOCK_USERS.filter(u => u.id !== user.id && u.isActive);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-12 w-auto px-3 hover:bg-white/80 dark:hover:bg-gray-800/80 rounded-xl transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {user.imageUrl && <AvatarImage src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} />}
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-semibold">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
                {user.firstName} {user.lastName}
              </span>
              <div className="flex items-center gap-1">
                {getRoleIcon(user.role)}
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {user.role}
                </span>
              </div>
            </div>
            
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-2xl p-2" align="end">
        {/* User Info Header */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl mb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {user.imageUrl && <AvatarImage src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} />}
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                {user.firstName} {user.lastName}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${getRoleColor(user.role)} text-xs font-medium border`}>
                  {getRoleIcon(user.role)}
                  {user.role}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {user.subscriptionPlan}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Organization Info */}
        {organization && (
          <>
            <div className="px-2 py-1">
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Building className="w-4 h-4 text-gray-600" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {organization.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {organization.membersCount} members • {organization.plan}
                  </div>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Navigation Items */}
        <DropdownMenuItem 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70"
        >
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70"
        >
          <Settings className="w-4 h-4" />
          <span>Application Settings</span>
        </DropdownMenuItem>

        {user.permissions.includes('manage_billing') && (
          <DropdownMenuItem 
            onClick={() => navigate('/billing')}
            className="flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70"
          >
            <CreditCard className="w-4 h-4" />
            <span>Billing & Plans</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem 
          onClick={() => navigate('/notifications')}
          className="flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70"
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => navigate('/help')}
          className="flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Demo: Switch User */}
        {otherUsers.length > 0 && (
          <>
            <DropdownMenuLabel className="px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
              Demo: Switch User
            </DropdownMenuLabel>
            
            <div className="max-h-32 overflow-y-auto">
              {otherUsers.slice(0, 3).map((otherUser) => (
                <DropdownMenuItem 
                  key={otherUser.id}
                  onClick={() => handleSwitchUser(otherUser.id)}
                  className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70"
                >
                  <Avatar className="h-6 w-6">
                    {otherUser.imageUrl && <AvatarImage src={otherUser.imageUrl} alt={`${otherUser.firstName} ${otherUser.lastName}`} />}
                    <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white text-xs">
                      {getInitials(otherUser.firstName, otherUser.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {otherUser.firstName} {otherUser.lastName}
                    </div>
                    <div className="flex items-center gap-1">
                      {getRoleIcon(otherUser.role)}
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {otherUser.role}
                      </span>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            
            <DropdownMenuSeparator />
          </>
        )}

        {/* Logout */}
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400"
        >
          <LogOut className="w-4 h-4" />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}