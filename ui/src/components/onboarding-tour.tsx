import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Home, 
  BarChart3, 
  Target, 
  TrendingUp, 
  HelpCircle,
  Play,
  X,
  Check
} from 'lucide-react';

interface OnboardingTourProps {
  isFirstTime?: boolean;
  onComplete?: () => void;
}

const TOUR_STEPS: Step[] = [
  {
    target: '.navbar',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Καλώς ήρθατε στο Ads Pro! 🎉</h3>
        <p>Αυτή είναι η κύρια γραμμή πλοήγησης. Εδώ θα βρείτε:</p>
        <ul className="space-y-1 text-sm">
          <li>• Ειδοποιήσεις και ειρήνες</li>
          <li>• Γρήγορη πρόσβαση σε λειτουργίες</li>
          <li>• Εναλλαγή θέματος και γλώσσας</li>
        </ul>
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.sidebar',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Κύρια Μενού</h3>
        <p>Εδώ θα βρείτε όλες τις κύριες σελίδες της εφαρμογής:</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>Campaigns</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>Funnel Analysis</span>
          </div>
        </div>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '.dashboard-content',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Dashboard - Επισκόπηση</h3>
        <p>Εδώ θα δείτε μια γρήγορη επισκόπηση των καμπανιών σας:</p>
        <ul className="space-y-1 text-sm">
          <li>• Κύρια KPIs και μετρήσεις</li>
          <li>• Γραφήματα απόδοσης</li>
          <li>• Πρόσφατες δραστηριότητες</li>
          <li>• Γρήγορα φίλτρα και αναζήτηση</li>
        </ul>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '.demo-mode-toggle',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Demo Mode</h3>
        <p>Μεταβείτε εύκολα μεταξύ demo δεδομένων και πραγματικών δεδομένων Facebook API:</p>
        <div className="space-y-2">
          <Badge variant="default" className="w-fit">
            <Play className="w-3 h-3 mr-1" />
            Demo Mode: Για παρουσιάσεις
          </Badge>
          <Badge variant="secondary" className="w-fit">
            <Check className="w-3 h-3 mr-1" />
            Real Data: Για πραγματική εργασία
          </Badge>
        </div>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '.keyboard-shortcuts',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Keyboard Shortcuts</h3>
        <p>Χρησιμοποιήστε συντομεύσεις πληκτρολογίου για γρήγορη πρόσβαση:</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><kbd className="px-2 py-1 bg-muted rounded">Ctrl/Cmd + K</kbd> <span>Global Search</span></div>
          <div><kbd className="px-2 py-1 bg-muted rounded">Ctrl/Cmd + ?</kbd> <span>Shortcuts Help</span></div>
          <div><kbd className="px-2 py-1 bg-muted rounded">Ctrl/Cmd + R</kbd> <span>Refresh</span></div>
          <div><kbd className="px-2 py-1 bg-muted rounded">Ctrl/Cmd + T</kbd> <span>Toggle Theme</span></div>
        </div>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '.facebook-connection',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Facebook Connection</h3>
        <p>Συνδέστε το Facebook Ads account σας για να δείτε πραγματικά δεδομένα:</p>
        <ul className="space-y-1 text-sm">
          <li>• Ασφαλής OAuth σύνδεση</li>
          <li>• Αυτόματη ανανέωση tokens</li>
          <li>• Rate limiting για ασφάλεια</li>
          <li>• Multi-user support</li>
        </ul>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '.export-features',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Export & Share</h3>
        <p>Εξάγετε τα δεδομένα σας σε διάφορες μορφές:</p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <Badge variant="outline">CSV</Badge>
          <Badge variant="outline">JSON</Badge>
          <Badge variant="outline">PDF</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Χρησιμοποιήστε το κουμπί Export σε κάθε σελίδα για να εξάγετε τα δεδομένα.
        </p>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '.help-section',
    content: (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Βοήθεια & Υποστήριξη</h3>
        <p>Βρείτε βοήθεια όταν χρειάζεστε:</p>
        <ul className="space-y-1 text-sm">
          <li>• Συχνές ερωτήσεις (FAQ)</li>
          <li>• Video tutorials</li>
          <li>• Documentation</li>
          <li>• Επικοινωνία με support</li>
        </ul>
        <p className="text-xs text-muted-foreground">
          Μπορείτε να επανεκκινήσετε αυτόν τον οδηγό από τις Ρυθμίσεις.
        </p>
      </div>
    ),
    placement: 'top',
  },
];

export function OnboardingTour({ isFirstTime = false, onComplete }: OnboardingTourProps) {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Check if user has completed the tour
    const hasCompletedTour = localStorage.getItem('onboardingCompleted');
    
    if (isFirstTime && !hasCompletedTour) {
      // Start tour after a short delay to ensure components are rendered
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstTime]);

  const handleCallback = (data: CallBackProps) => {
    const { index, status, type } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      localStorage.setItem('onboardingCompleted', 'true');
      onComplete?.();
    } else if (type === 'step:after') {
      setStepIndex(index + 1);
    }
  };

  const handleStartTour = () => {
    setRun(true);
    setStepIndex(0);
  };

  const handleSkipTour = () => {
    setRun(false);
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete?.();
  };

  const handleRestartTour = () => {
    localStorage.removeItem('onboardingCompleted');
    setRun(true);
    setStepIndex(0);
  };

  return (
    <>
      <Joyride
        steps={TOUR_STEPS}
        run={run}
        stepIndex={stepIndex}
        continuous
        showProgress
        showSkipButton
        callback={handleCallback}
        styles={{
          options: {
            primaryColor: 'hsl(var(--primary))',
            backgroundColor: 'hsl(var(--background))',
            textColor: 'hsl(var(--foreground))',
            arrowColor: 'hsl(var(--background))',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          },
          tooltip: {
            backgroundColor: 'hsl(var(--card))',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            border: '1px solid hsl(var(--border))',
          },
          tooltipTitle: {
            color: 'hsl(var(--foreground))',
          },
          tooltipContent: {
            color: 'hsl(var(--muted-foreground))',
          },
          buttonNext: {
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            borderRadius: '6px',
            padding: '8px 16px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
          },
          buttonBack: {
            backgroundColor: 'hsl(var(--secondary))',
            color: 'hsl(var(--secondary-foreground))',
            borderRadius: '6px',
            padding: '8px 16px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
          },
          buttonSkip: {
            backgroundColor: 'transparent',
            color: 'hsl(var(--muted-foreground))',
            borderRadius: '6px',
            padding: '8px 16px',
            border: '1px solid hsl(var(--border))',
            fontSize: '14px',
            fontWeight: '500',
          },
          buttonClose: {
            backgroundColor: 'transparent',
            color: 'hsl(var(--muted-foreground))',
            borderRadius: '6px',
            padding: '4px',
            border: 'none',
            fontSize: '16px',
          },
        }}
        locale={{
          back: 'Πίσω',
          close: 'Κλείσιμο',
          last: 'Τέλος',
          next: 'Επόμενο',
          skip: 'Παράλειψη',
        }}
      />

      {/* Tour Controls (for manual start) */}
      {!run && (
        <div className="fixed bottom-4 left-4 z-50">
          <Card className="w-64 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Onboarding Tour</h3>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={handleStartTour} 
                  size="sm" 
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Ξεκινήστε τον Οδηγό
                </Button>
                <Button 
                  onClick={handleSkipTour} 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Παράλειψη
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// Hook for managing tour state
export function useOnboardingTour() {
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('onboardingCompleted') === 'true';
    setHasCompletedTour(completed);
  }, []);

  const restartTour = () => {
    localStorage.removeItem('onboardingCompleted');
    setHasCompletedTour(false);
    window.location.reload(); // Reload to restart tour
  };

  return {
    hasCompletedTour,
    restartTour,
  };
} 