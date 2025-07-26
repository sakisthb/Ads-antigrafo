import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Building2, 
  CreditCard, 
  BarChart3,
  Search,
  Filter,
  UserPlus,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  Ban,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  Globe
} from "lucide-react";
import { useSaaS, ProtectedRoute } from '@/lib/demo-auth-provider';
import { UserRole, SubscriptionPlan, getRoleDisplayName, getPlanDisplayName } from '@/lib/clerk-config';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  plan: SubscriptionPlan;
  status: 'active' | 'suspended' | 'pending';
  lastActive: Date;
  createdAt: Date;
  totalSpend: number;
}

interface Organization {
  id: string;
  name: string;
  type: string;
  plan: SubscriptionPlan;
  memberCount: number;
  status: 'active' | 'suspended' | 'trial';
  createdAt: Date;
  lastBilling: Date;
  monthlyRevenue: number;
  totalSpend: number;
}

interface PlatformStats {
  totalUsers: number;
  totalOrganizations: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  totalCampaigns: number;
  averageROAS: number;
  growthRate: number;
}

// Mock data - In real app, this would come from API
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@digitalagency.com',
    firstName: 'Γιάννης',
    lastName: 'Παπαδόπουλος',
    role: UserRole.ADMIN,
    organizationId: 'org_1',
    organizationName: 'Digital Agency Pro',
    plan: SubscriptionPlan.PROFESSIONAL,
    status: 'active',
    lastActive: new Date('2024-01-15'),
    createdAt: new Date('2024-01-01'),
    totalSpend: 25000
  },
  {
    id: '2',
    email: 'maria@ecommerce.gr',
    firstName: 'Μαρία',
    lastName: 'Κωνσταντίνου',
    role: UserRole.CLIENT,
    organizationId: 'org_2',
    organizationName: 'E-commerce Store',
    plan: SubscriptionPlan.STARTER,
    status: 'active',
    lastActive: new Date('2024-01-14'),
    createdAt: new Date('2024-01-05'),
    totalSpend: 8500
  }
];

const mockOrganizations: Organization[] = [
  {
    id: 'org_1',
    name: 'Digital Agency Pro',
    type: 'Marketing Agency',
    plan: SubscriptionPlan.PROFESSIONAL,
    memberCount: 8,
    status: 'active',
    createdAt: new Date('2024-01-01'),
    lastBilling: new Date('2024-01-15'),
    monthlyRevenue: 99,
    totalSpend: 25000
  },
  {
    id: 'org_2', 
    name: 'E-commerce Store',
    type: 'E-commerce Business',
    plan: SubscriptionPlan.STARTER,
    memberCount: 3,
    status: 'active',
    createdAt: new Date('2024-01-05'),
    lastBilling: new Date('2024-01-15'),
    monthlyRevenue: 29,
    totalSpend: 8500
  }
];

const mockStats: PlatformStats = {
  totalUsers: 1247,
  totalOrganizations: 342,
  activeSubscriptions: 298,
  monthlyRevenue: 28450,
  totalCampaigns: 2341,
  averageROAS: 4.2,
  growthRate: 23.5
};

export function AdminDashboard() {
  const { user, hasPermission } = useSaaS();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [stats, setStats] = useState<PlatformStats>(mockStats);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    
    return matchesSearch && matchesRole && matchesPlan;
  });

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'suspended' as const } : user
    ));
    toast.success('Ο χρήστης ανεστάλη επιτυχώς');
  };

  const handleActivateUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'active' as const } : user
    ));
    toast.success('Ο χρήστης ενεργοποιήθηκε επιτυχώς');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Ενεργός</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-700">Ανεσταλμένος</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Εκκρεμής</Badge>;
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-700">Δοκιμαστικό</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: SubscriptionPlan) => {
    const colors = {
      [SubscriptionPlan.FREE]: 'bg-gray-100 text-gray-700',
      [SubscriptionPlan.STARTER]: 'bg-blue-100 text-blue-700',
      [SubscriptionPlan.PROFESSIONAL]: 'bg-purple-100 text-purple-700',
      [SubscriptionPlan.ENTERPRISE]: 'bg-yellow-100 text-yellow-700'
    };
    
    return (
      <Badge className={colors[plan] || 'bg-gray-100 text-gray-700'}>
        {getPlanDisplayName(plan)}
      </Badge>
    );
  };

  return (
    <ProtectedRoute requiredPermission="access_admin_panel">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Διαχείριση χρηστών, οργανώσεων και subscriptions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-700">
              <Shield className="w-3 h-3 mr-1" />
              {getRoleDisplayName(UserRole.SUPER_ADMIN)}
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Συνολικοί Χρήστες</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{stats.growthRate}% αυτόν τον μήνα
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Οργανώσεις</CardTitle>
              <Building2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrganizations.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                {stats.activeSubscriptions} ενεργά subscriptions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Μηνιαία Έσοδα</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.monthlyRevenue.toLocaleString()}</div>
              <div className="text-xs text-green-600">
                ARR: €{(stats.monthlyRevenue * 12).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Performance</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageROAS}x</div>
              <div className="text-xs text-muted-foreground">
                Μέσος ROAS όλων των καμπανιών
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Χρήστες</TabsTrigger>
            <TabsTrigger value="organizations">Οργανώσεις</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Διαχείριση Χρηστών</CardTitle>
                <CardDescription>
                  Προβολή και διαχείριση όλων των χρηστών της πλατφόρμας
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Αναζήτηση χρηστών..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Ρόλος" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Όλοι οι ρόλοι</SelectItem>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={UserRole.MODERATOR}>Moderator</SelectItem>
                      <SelectItem value={UserRole.CLIENT}>Client</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPlan} onValueChange={setFilterPlan}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Πλάνο" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Όλα τα πλάνα</SelectItem>
                      <SelectItem value={SubscriptionPlan.FREE}>Free</SelectItem>
                      <SelectItem value={SubscriptionPlan.STARTER}>Starter</SelectItem>
                      <SelectItem value={SubscriptionPlan.PROFESSIONAL}>Professional</SelectItem>
                      <SelectItem value={SubscriptionPlan.ENTERPRISE}>Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Χρήστης</TableHead>
                        <TableHead>Οργάνωση</TableHead>
                        <TableHead>Ρόλος</TableHead>
                        <TableHead>Πλάνο</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Τελευταία Δραστηριότητα</TableHead>
                        <TableHead>Ενέργειες</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {user.organizationName || 'Καμία οργάνωση'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getRoleDisplayName(user.role)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getPlanBadge(user.plan)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(user.status)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {user.lastActive.toLocaleDateString('el-GR')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsUserDialogOpen(true);
                                }}
                              >
                                <Settings className="w-3 h-3" />
                              </Button>
                              {user.status === 'active' ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSuspendUser(user.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Ban className="w-3 h-3" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleActivateUser(user.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Διαχείριση Οργανώσεων</CardTitle>
                <CardDescription>
                  Προβολή και διαχείριση όλων των οργανώσεων
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Οργάνωση</TableHead>
                        <TableHead>Τύπος</TableHead>
                        <TableHead>Πλάνο</TableHead>
                        <TableHead>Μέλη</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Μηνιαία Έσοδα</TableHead>
                        <TableHead>Ημερομηνία Δημιουργίας</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {organizations.map((org) => (
                        <TableRow key={org.id}>
                          <TableCell>
                            <div className="font-medium">{org.name}</div>
                          </TableCell>
                          <TableCell>{org.type}</TableCell>
                          <TableCell>{getPlanBadge(org.plan)}</TableCell>
                          <TableCell>{org.memberCount}</TableCell>
                          <TableCell>{getStatusBadge(org.status)}</TableCell>
                          <TableCell>€{org.monthlyRevenue}</TableCell>
                          <TableCell>{org.createdAt.toLocaleDateString('el-GR')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Συνολικά Έσοδα</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">€{stats.monthlyRevenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Αυτόν τον μήνα</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ενεργά Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.activeSubscriptions}</div>
                  <div className="text-sm text-muted-foreground">Από {stats.totalOrganizations} συνολικά</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Μέσος MRR</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    €{Math.round(stats.monthlyRevenue / stats.activeSubscriptions)}
                  </div>
                  <div className="text-sm text-muted-foreground">Ανά οργάνωση</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Alert>
              <Activity className="h-4 w-4" />
              <AlertDescription>
                Αναλυτικά στοιχεία χρήσης και performance metrics θα προστεθούν σύντομα.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {/* User Detail Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Στοιχεία Χρήστη</DialogTitle>
              <DialogDescription>
                Προβολή και επεξεργασία στοιχείων χρήστη
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Όνομα</Label>
                    <div className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="font-medium">{selectedUser.email}</div>
                  </div>
                  <div>
                    <Label>Ρόλος</Label>
                    <div>{getRoleDisplayName(selectedUser.role)}</div>
                  </div>
                  <div>
                    <Label>Πλάνο</Label>
                    <div>{getPlanDisplayName(selectedUser.plan)}</div>
                  </div>
                  <div>
                    <Label>Οργάνωση</Label>
                    <div>{selectedUser.organizationName || 'Καμία'}</div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div>{getStatusBadge(selectedUser.status)}</div>
                  </div>
                </div>
                
                <div>
                  <Label>Συνολικά Έξοδα Διαφημίσεων</Label>
                  <div className="text-2xl font-bold text-blue-600">
                    €{selectedUser.totalSpend.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                Κλείσιμο
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}