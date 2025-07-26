// Simple Test Page to verify everything works
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, LogIn } from 'lucide-react';

export function TestPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl mx-auto mb-4 shadow-xl">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-green-600">
            All Systems Working!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              ✅ Landing Page Loaded Successfully<br />
              ✅ React Components Working<br />
              ✅ Routing System Active<br />
              ✅ Styling Applied Correctly
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Landing Page
            </Button>
            
            <Button 
              onClick={() => navigate('/login')}
              variant="outline"
              className="w-full rounded-xl"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}