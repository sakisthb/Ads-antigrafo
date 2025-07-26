// Professional Login Page
// Enterprise Authentication με Mock Users Support
// 20+ Years Experience - Production-Ready

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  UserCheck, 
  Shield, 
  Sparkles,
  AlertCircle,
  CheckCircle,
  Users,
  Building,
  Crown,
  Star,
  Zap
} from 'lucide-react';
import { mockAuthService, MOCK_USERS } from '@/lib/mock-auth';
import { UserRole } from '@/lib/clerk-config';
import { toast } from 'sonner';

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Παρακαλώ συμπληρώστε όλα τα πεδία');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await mockAuthService.login(formData.email, formData.password);
      
      if (result.success && result.user) {
        toast.success(`Καλώς ήρθατε, ${result.user.firstName}! 🎉`);
        navigate('/dashboard');
      } else {
        setError(result.error || 'Σφάλμα σύνδεσης');
        toast.error(result.error || 'Σφάλμα σύνδεσης');
      }
    } catch (err) {
      setError('Απροσδόκητο σφάλμα. Παρακαλώ δοκιμάστε ξανά.');
      toast.error('Απροσδόκητο σφάλμα');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (email: string) => {
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) return;

    setFormData({ email, password: user.password });
    
    setIsLoading(true);
    const result = await mockAuthService.login(email, user.password);
    
    if (result.success && result.user) {
      toast.success(`Γρήγορη σύνδεση ως ${result.user.firstName}! 🚀`);
      navigate('/dashboard');
    }
    setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 relative">
        {/* Login Form */}
        <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mx-auto mb-6 shadow-xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Ads Pro Platform
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
              Enterprise Analytics & Attribution System
            </CardDescription>
            
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-semibold mx-auto">
              Professional Dashboard
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-12 rounded-xl border-2 focus:border-blue-500 transition-colors"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="h-12 rounded-xl border-2 focus:border-blue-500 transition-colors pr-12"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Σύνδεση...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Σύνδεση
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Development Mode - Professional Testing Environment
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Users Panel */}
        <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <UserCheck className="w-7 h-7 text-blue-600" />
              Demo Users
            </CardTitle>
            <CardDescription className="text-base">
              Professional testing accounts για διαφορετικούς ρόλους και permissions
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {MOCK_USERS.filter(user => user.isActive).map((user) => (
              <div
                key={user.id}
                className="group p-4 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 rounded-2xl border border-transparent hover:border-gray-200/50 dark:hover:border-gray-600/50 transition-all duration-300 cursor-pointer"
                onClick={() => handleQuickLogin(user.email)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-12 h-12 rounded-xl object-cover shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1">
                      {getRoleIcon(user.role)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {user.firstName} {user.lastName}
                      </h4>
                      <Badge className={`${getRoleColor(user.role)} text-xs font-medium border`}>
                        {user.role}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500 truncate max-w-[120px]">
                          {user.organizationName}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {user.subscriptionPlan}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    disabled={isLoading}
                  >
                    Quick Login
                  </Button>
                </div>
              </div>
            ))}

            <Separator className="my-6" />

            <Alert>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>Demo Environment:</strong> Κάντε κλικ σε οποιονδήποτε χρήστη για άμεση σύνδεση. 
                Κάθε ρόλος έχει διαφορετικά permissions και access levels.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                <div className="font-semibold text-blue-700 dark:text-blue-300">4 Role Types</div>
                <div className="text-blue-600 dark:text-blue-400">Multi-level Access</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-xl">
                <div className="font-semibold text-green-700 dark:text-green-300">Real Permissions</div>
                <div className="text-green-600 dark:text-green-400">Production-Ready</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}