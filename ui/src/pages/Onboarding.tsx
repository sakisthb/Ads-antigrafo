import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Users, 
  Sparkles, 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Target,
  BarChart3,
  ShoppingCart,
  Globe,
  CreditCard,
  Shield,
  Zap
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useSaaS } from '@/lib/demo-auth-provider';
import { OrganizationType, SubscriptionPlan, PLAN_FEATURES } from '@/lib/clerk-config';
import { toast } from 'sonner';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

interface OnboardingData {
  organizationType: OrganizationType | '';
  organizationName: string;
  organizationSize: string;
  selectedPlan: SubscriptionPlan;
  goals: string[];
  platforms: string[];
  hasExistingCampaigns: boolean;
  monthlyAdSpend: string;
  teamSize: string;
  primaryUseCase: string;
}

const INITIAL_DATA: OnboardingData = {
  organizationType: '',
  organizationName: '',
  organizationSize: '',
  selectedPlan: SubscriptionPlan.FREE,
  goals: [],
  platforms: [],
  hasExistingCampaigns: false,
  monthlyAdSpend: '',
  teamSize: '',
  primaryUseCase: ''
};

// Step 1: Organization Type & Basic Info
const OrganizationStep = ({ data, updateData }: { data: OnboardingData; updateData: (updates: Partial<OnboardingData>) => void }) => {
  const organizationTypes = [
    {
      type: OrganizationType.MARKETING_AGENCY,
      title: 'Marketing Agency',
      description: 'Full-service digital marketing agency',
      icon: Target,
      recommended: SubscriptionPlan.PROFESSIONAL
    },
    {
      type: OrganizationType.DIGITAL_AGENCY,
      title: 'Digital Agency',
      description: 'Digital transformation and advertising',
      icon: Globe,
      recommended: SubscriptionPlan.PROFESSIONAL
    },
    {
      type: OrganizationType.ECOMMERCE_BUSINESS,
      title: 'E-commerce Business',
      description: 'Online store and retail business',
      icon: ShoppingCart,
      recommended: SubscriptionPlan.STARTER
    },
    {
      type: OrganizationType.ENTERPRISE,
      title: 'Enterprise',
      description: 'Large corporation with multiple brands',
      icon: Building2,
      recommended: SubscriptionPlan.ENTERPRISE
    },
    {
      type: OrganizationType.FREELANCER,
      title: 'Freelancer',
      description: 'Independent marketing consultant',
      icon: Users,
      recommended: SubscriptionPlan.STARTER
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Καλώς ήρθατε στο Ads Pro!</h2>
        <p className="text-muted-foreground">Ας δημιουργήσουμε την οργάνωσή σας</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="orgName">Όνομα Οργάνωσης</Label>
          <Input
            id="orgName"
            value={data.organizationName}
            onChange={(e) => updateData({ organizationName: e.target.value })}
            placeholder="π.χ. Digital Marketing Pro"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Τύπος Οργάνωσης</Label>
          <div className="grid gap-3 mt-2">
            {organizationTypes.map((org) => {
              const Icon = org.icon;
              return (
                <Card 
                  key={org.type}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    data.organizationType === org.type ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => updateData({ 
                    organizationType: org.type,
                    selectedPlan: org.recommended 
                  })}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{org.title}</h3>
                      <p className="text-sm text-muted-foreground">{org.description}</p>
                    </div>
                    <Badge variant="outline">
                      Προτείνεται: {org.recommended.charAt(0).toUpperCase() + org.recommended.slice(1)}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 2: Goals & Use Cases
const GoalsStep = ({ data, updateData }: { data: OnboardingData; updateData: (updates: Partial<OnboardingData>) => void }) => {
  const goals = [
    'Παρακολούθηση campaign performance',
    'Βελτιστοποίηση ROAS',
    'Αυτοματοποίηση reporting',
    'Multi-platform management',
    'Client reporting',
    'Budget optimization',
    'Competitive analysis',
    'AI-powered insights'
  ];

  const platforms = [
    'Meta Ads (Facebook & Instagram)',
    'Google Ads',
    'TikTok Ads',
    'Google Analytics',
    'WooCommerce'
  ];

  const useCases = [
    'Διαχείριση πελατών',
    'Internal campaigns',
    'E-commerce optimization', 
    'Lead generation',
    'Brand awareness'
  ];

  const toggleGoal = (goal: string) => {
    const newGoals = data.goals.includes(goal)
      ? data.goals.filter(g => g !== goal)
      : [...data.goals, goal];
    updateData({ goals: newGoals });
  };

  const togglePlatform = (platform: string) => {
    const newPlatforms = data.platforms.includes(platform)
      ? data.platforms.filter(p => p !== platform)
      : [...data.platforms, platform];
    updateData({ platforms: newPlatforms });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Ποιοι είναι οι στόχοι σας;</h2>
        <p className="text-muted-foreground">Επιλέξτε όσα ταιριάζουν στις ανάγκες σας</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold">Κύριοι Στόχοι</Label>
          <div className="grid gap-2 mt-2">
            {goals.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={goal}
                  checked={data.goals.includes(goal)}
                  onCheckedChange={() => toggleGoal(goal)}
                />
                <Label htmlFor={goal} className="text-sm">{goal}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold">Πλατφόρμες που χρησιμοποιείτε</Label>
          <div className="grid gap-2 mt-2">
            {platforms.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={platform}
                  checked={data.platforms.includes(platform)}
                  onCheckedChange={() => togglePlatform(platform)}
                />
                <Label htmlFor={platform} className="text-sm">{platform}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="useCase">Κύρια Χρήση</Label>
          <Select value={data.primaryUseCase} onValueChange={(value) => updateData({ primaryUseCase: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Επιλέξτε κύρια χρήση" />
            </SelectTrigger>
            <SelectContent>
              {useCases.map((useCase) => (
                <SelectItem key={useCase} value={useCase}>{useCase}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

// Step 3: Team & Budget Info
const TeamBudgetStep = ({ data, updateData }: { data: OnboardingData; updateData: (updates: Partial<OnboardingData>) => void }) => {
  const teamSizes = [
    '1 άτομο (μόνος μου)',
    '2-5 άτομα',
    '6-15 άτομα', 
    '16-50 άτομα',
    '50+ άτομα'
  ];

  const budgetRanges = [
    '€0 - €1,000/μήνα',
    '€1,000 - €5,000/μήνα',
    '€5,000 - €20,000/μήνα',
    '€20,000 - €100,000/μήνα',
    '€100,000+/μήνα'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Πείτε μας για την ομάδα σας</h2>
        <p className="text-muted-foreground">Θα μας βοηθήσει να προτείνουμε το κατάλληλο πλάνο</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold">Μέγεθος Ομάδας</Label>
          <RadioGroup 
            value={data.teamSize} 
            onValueChange={(value) => updateData({ teamSize: value })}
            className="mt-2"
          >
            {teamSizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <RadioGroupItem value={size} id={size} />
                <Label htmlFor={size}>{size}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-semibold">Μηνιαίος Budget για Διαφημίσεις</Label>
          <RadioGroup 
            value={data.monthlyAdSpend} 
            onValueChange={(value) => updateData({ monthlyAdSpend: value })}
            className="mt-2"
          >
            {budgetRanges.map((range) => (
              <div key={range} className="flex items-center space-x-2">
                <RadioGroupItem value={range} id={range} />
                <Label htmlFor={range}>{range}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-semibold">Υπάρχουσες Καμπάνιες</Label>
          <RadioGroup 
            value={data.hasExistingCampaigns.toString()} 
            onValueChange={(value) => updateData({ hasExistingCampaigns: value === 'true' })}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="has-campaigns" />
              <Label htmlFor="has-campaigns">Ναι, έχω ενεργές καμπάνιες</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="no-campaigns" />
              <Label htmlFor="no-campaigns">Όχι, ξεκινάω από την αρχή</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

// Step 4: Plan Selection
const PlanStep = ({ data, updateData }: { data: OnboardingData; updateData: (updates: Partial<OnboardingData>) => void }) => {
  const plans = [
    {
      plan: SubscriptionPlan.FREE,
      name: 'Free',
      price: 'Δωρεάν',
      description: 'Ιδανικό για δοκιμή',
      features: PLAN_FEATURES[SubscriptionPlan.FREE],
      color: 'border-gray-200',
      badge: null
    },
    {
      plan: SubscriptionPlan.STARTER,
      name: 'Starter',
      price: '€29/μήνα',
      description: 'Για μικρές agencies',
      features: PLAN_FEATURES[SubscriptionPlan.STARTER],
      color: 'border-blue-200',
      badge: 'Δημοφιλές'
    },
    {
      plan: SubscriptionPlan.PROFESSIONAL,
      name: 'Professional', 
      price: '€99/μήνα',
      description: 'Για μεσαίες agencies',
      features: PLAN_FEATURES[SubscriptionPlan.PROFESSIONAL],
      color: 'border-purple-200',
      badge: 'Προτείνεται'
    },
    {
      plan: SubscriptionPlan.ENTERPRISE,
      name: 'Enterprise',
      price: '€299/μήνα',
      description: 'Για μεγάλες οργανώσεις',
      features: PLAN_FEATURES[SubscriptionPlan.ENTERPRISE],
      color: 'border-gold-200',
      badge: 'Πλήρες'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Επιλέξτε το πλάνο σας</h2>
        <p className="text-muted-foreground">Μπορείτε να αλλάξετε ανά πάσα στιγμή</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((planData) => (
          <Card 
            key={planData.plan}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              data.selectedPlan === planData.plan ? 'ring-2 ring-blue-500 bg-blue-50' : planData.color
            }`}
            onClick={() => updateData({ selectedPlan: planData.plan })}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{planData.name}</CardTitle>
                {planData.badge && (
                  <Badge variant="secondary">{planData.badge}</Badge>
                )}
              </div>
              <div className="text-2xl font-bold text-blue-600">{planData.price}</div>
              <CardDescription>{planData.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                    {planData.features.maxUsers === -1 ? 'Unlimited' : planData.features.maxUsers} χρήστες
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>
                    {planData.features.maxCampaigns === -1 ? 'Unlimited' : planData.features.maxCampaigns} καμπάνιες
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>
                    {planData.features.maxPlatforms === -1 ? 'Όλες' : planData.features.maxPlatforms} πλατφόρμες
                  </span>
                </div>
                {planData.features.aiPredictions && (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Predictions</span>
                  </div>
                )}
                {planData.features.whiteLabel && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>White Label</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export function Onboarding() {
  const navigate = useNavigate();
  const { createOrganization } = useSaaS();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'organization',
      title: 'Οργάνωση',
      description: 'Βασικές πληροφορίες',
      component: OrganizationStep
    },
    {
      id: 'goals',
      title: 'Στόχοι',
      description: 'Τι θέλετε να πετύχετε',
      component: GoalsStep
    },
    {
      id: 'team',
      title: 'Ομάδα',
      description: 'Μέγεθος & budget',
      component: TeamBudgetStep
    },
    {
      id: 'plan',
      title: 'Πλάνο',
      description: 'Επιλέξτε subscription',
      component: PlanStep
    }
  ];

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.organizationName && data.organizationType;
      case 1:
        return data.goals.length > 0 && data.primaryUseCase;
      case 2:
        return data.teamSize && data.monthlyAdSpend;
      case 3:
        return data.selectedPlan;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Create organization with Clerk
      await createOrganization(data.organizationName, data.organizationType);
      
      // Store onboarding data
      localStorage.setItem('onboarding_data', JSON.stringify(data));
      
      toast.success('Η οργάνωση δημιουργήθηκε επιτυχώς! 🎉');
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      toast.error(`Σφάλμα: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ads Pro Setup
              </h1>
              <p className="text-muted-foreground">Professional Marketing Platform</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              {steps.map((step, index) => (
                <div key={step.id} className={`flex flex-col items-center ${index <= currentStep ? 'text-blue-600' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    index < currentStep ? 'bg-blue-600 border-blue-600 text-white' :
                    index === currentStep ? 'border-blue-600 text-blue-600' :
                    'border-gray-300 text-gray-300'
                  }`}>
                    {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="text-xs mt-1">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <CurrentStepComponent data={data} updateData={updateData} />

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Προηγούμενο
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleComplete}
                disabled={!canProceed() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Δημιουργία...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Ολοκλήρωση
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
              >
                Επόμενο
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}