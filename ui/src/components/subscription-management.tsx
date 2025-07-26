import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Check, 
  X, 
  Zap, 
  Users, 
  Target, 
  Globe, 
  Sparkles,
  Shield,
  ArrowRight,
  AlertTriangle,
  Calendar,
  DollarSign
} from "lucide-react";
import { useSaaS } from '@/lib/demo-auth-provider';
import { SubscriptionPlan, PLAN_FEATURES } from '@/lib/clerk-config';
import { toast } from 'sonner';

const PRICING_PLANS = [
  {
    plan: SubscriptionPlan.FREE,
    name: 'Free',
    price: 0,
    description: 'Ιδανικό για να ξεκινήσετε',
    features: PLAN_FEATURES[SubscriptionPlan.FREE],
    color: 'border-gray-200',
    textColor: 'text-gray-600',
    bgColor: 'bg-gray-50',
    popular: false
  },
  {
    plan: SubscriptionPlan.STARTER,
    name: 'Starter',
    price: 29,
    description: 'Για μικρές agencies & freelancers',
    features: PLAN_FEATURES[SubscriptionPlan.STARTER],
    color: 'border-blue-200',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    popular: true
  },
  {
    plan: SubscriptionPlan.PROFESSIONAL,
    name: 'Professional',
    price: 99,
    description: 'Για μεσαίες agencies',
    features: PLAN_FEATURES[SubscriptionPlan.PROFESSIONAL],
    color: 'border-purple-200',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    popular: false
  },
  {
    plan: SubscriptionPlan.ENTERPRISE,
    name: 'Enterprise',
    price: 299,
    description: 'Για μεγάλες οργανώσεις',
    features: PLAN_FEATURES[SubscriptionPlan.ENTERPRISE],
    color: 'border-yellow-200',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    popular: false
  }
];

interface UsageStats {
  users: { current: number; limit: number };
  campaigns: { current: number; limit: number };
  platforms: { current: number; limit: number };
  clients: { current: number; limit: number };
}

// Mock usage data - in real app from API
const mockUsage: UsageStats = {
  users: { current: 3, limit: 5 },
  campaigns: { current: 12, limit: 25 },
  platforms: { current: 2, limit: 3 },
  clients: { current: 2, limit: 5 }
};

export function SubscriptionManagement() {
  const { user, organization } = useSaaS();
  const [isLoading, setIsLoading] = useState(false);
  const [usage] = useState<UsageStats>(mockUsage);

  const currentPlan = organization?.plan || SubscriptionPlan.FREE;
  const currentPlanData = PRICING_PLANS.find(p => p.plan === currentPlan);

  const handleUpgrade = async (newPlan: SubscriptionPlan) => {
    setIsLoading(true);
    
    try {
      // In real app, integrate with Stripe or payment processor
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast.success(`Επιτυχής αναβάθμιση στο ${PRICING_PLANS.find(p => p.plan === newPlan)?.name} plan! 🎉`);
      
      // Reload page to reflect changes
      window.location.reload();
      
    } catch (error: any) {
      toast.error(`Σφάλμα αναβάθμισης: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsagePercentage = (current: number, limit: number): number => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatLimit = (limit: number): string => {
    return limit === -1 ? 'Unlimited' : limit.toString();
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <Card className={`${currentPlanData?.color} ${currentPlanData?.bgColor}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className={`w-5 h-5 ${currentPlanData?.textColor}`} />
                Τρέχον Πλάνο: {currentPlanData?.name}
              </CardTitle>
              <CardDescription>
                {currentPlanData?.description}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                €{currentPlanData?.price}
                {currentPlanData?.price > 0 && <span className="text-sm font-normal">/μήνα</span>}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Επόμενη χρέωση: 15 Φεβ 2024</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>Μηνιαίο κόστος: €{currentPlanData?.price}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Χρήση Πόρων</CardTitle>
          <CardDescription>
            Παρακολουθήστε τη χρήση των περιορισμών του πλάνου σας
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Users */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Χρήστες</span>
              </div>
              <span className="font-medium">
                {usage.users.current} / {formatLimit(usage.users.limit)}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(usage.users.current, usage.users.limit)} 
              className="h-2"
            />
          </div>

          {/* Campaigns */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Καμπάνιες</span>
              </div>
              <span className="font-medium">
                {usage.campaigns.current} / {formatLimit(usage.campaigns.limit)}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(usage.campaigns.current, usage.campaigns.limit)} 
              className="h-2"
            />
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Πλατφόρμες</span>
              </div>
              <span className="font-medium">
                {usage.platforms.current} / {formatLimit(usage.platforms.limit)}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(usage.platforms.current, usage.platforms.limit)} 
              className="h-2"
            />
          </div>

          {/* Clients */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Πελάτες</span>
              </div>
              <span className="font-medium">
                {usage.clients.current} / {formatLimit(usage.clients.limit)}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage(usage.clients.current, usage.clients.limit)} 
              className="h-2"
            />
          </div>

          {/* Usage Warning */}
          {getUsagePercentage(usage.users.current, usage.users.limit) >= 80 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Πλησιάζετε στο όριο των χρηστών. Σκεφτείτε αναβάθμιση για περισσότερους χρήστες.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Διαθέσιμα Πλάνα</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PRICING_PLANS.map((planData) => (
            <Card 
              key={planData.plan}
              className={`relative transition-all hover:shadow-lg ${
                planData.plan === currentPlan ? 'ring-2 ring-blue-500' : planData.color
              }`}
            >
              {planData.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">Δημοφιλές</Badge>
                </div>
              )}
              
              {planData.plan === currentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-600 text-white">Τρέχον</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-xl">{planData.name}</CardTitle>
                <div className="text-3xl font-bold">
                  €{planData.price}
                  {planData.price > 0 && <span className="text-lg font-normal">/μήνα</span>}
                </div>
                <CardDescription>{planData.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{formatLimit(planData.features.maxUsers)} χρήστες</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>{formatLimit(planData.features.maxCampaigns)} καμπάνιες</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{formatLimit(planData.features.maxPlatforms)} πλατφόρμες</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {planData.features.aiPredictions ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                    <span>AI Predictions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {planData.features.whiteLabel ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                    <span>White Label</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {planData.features.apiAccess ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                    <span>API Access</span>
                  </div>
                </div>

                <div className="pt-4">
                  {planData.plan === currentPlan ? (
                    <Button disabled className="w-full">
                      <Check className="w-4 h-4 mr-2" />
                      Τρέχον Πλάνο
                    </Button>
                  ) : planData.plan === SubscriptionPlan.FREE ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleUpgrade(planData.plan)}
                      disabled={isLoading}
                    >
                      Υποβάθμιση σε Free
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => handleUpgrade(planData.plan)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <ArrowRight className="w-4 h-4 mr-2" />
                      )}
                      Αναβάθμιση
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Στοιχεία Χρέωσης</CardTitle>
          <CardDescription>
            Διαχειριστείτε τα στοιχεία πληρωμής και τις συνδρομές σας
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5" />
              <div>
                <div className="font-medium">Visa ending in 4242</div>
                <div className="text-sm text-muted-foreground">Λήγει 12/2025</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Επεξεργασία
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Επόμενη χρέωση</div>
              <div className="font-medium">15 Φεβρουαρίου 2024</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Ποσό χρέωσης</div>
              <div className="font-medium">€{currentPlanData?.price}/μήνα</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              Προβολή Ιστορικού
            </Button>
            <Button variant="outline">
              Κατέβασμα Τιμολογίου
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}