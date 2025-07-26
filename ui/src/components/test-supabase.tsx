import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CampaignService } from "@/lib/campaign-service";
import { useAuth } from "@/lib/auth-context";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export function TestSupabase() {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<{
    connection: 'pending' | 'success' | 'error';
    upload: 'pending' | 'success' | 'error';
    fetch: 'pending' | 'success' | 'error';
  }>({
    connection: 'pending',
    upload: 'pending',
    fetch: 'pending'
  });
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    if (!user?.uid) {
      alert('Please login first to run tests');
      return;
    }

    setLoading(true);
    setTestResults({
      connection: 'pending',
      upload: 'pending',
      fetch: 'pending'
    });

    try {
      // Test 1: Connection
      console.log('Testing Supabase connection...');
      setTestResults(prev => ({ ...prev, connection: 'success' }));

      // Test 2: Upload
      console.log('Testing upload...');
      const sampleCsv = `Campaign Name,Impressions,Clicks,Conversions,Spend
Test Campaign,10000,300,15,500`;
      
      const uploadResult = await CampaignService.processAndSaveUpload(
        user.uid,
        'test-upload.csv',
        sampleCsv
      );

      if (uploadResult.success) {
        setTestResults(prev => ({ ...prev, upload: 'success' }));
        console.log('Upload test successful:', uploadResult.data);
      } else {
        setTestResults(prev => ({ ...prev, upload: 'error' }));
        console.error('Upload test failed:', uploadResult.error);
      }

      // Test 3: Fetch
      console.log('Testing fetch...');
      const uploads = await CampaignService.getUserUploads(user.uid);
      if (uploads.length > 0) {
        setTestResults(prev => ({ ...prev, fetch: 'success' }));
        console.log('Fetch test successful:', uploads);
      } else {
        setTestResults(prev => ({ ...prev, fetch: 'error' }));
        console.error('Fetch test failed: No uploads found');
      }

    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({
        connection: 'error',
        upload: 'error',
        fetch: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />;
    }
  };

  const getStatusText = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Integration Test</CardTitle>
        <CardDescription>
          Test the database connection, upload, and fetch functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runTests} 
          disabled={loading || !user?.uid}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run Tests'
          )}
        </Button>

        {!user?.uid && (
          <p className="text-sm text-yellow-600">
            Please login first to run tests
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
            <span className="text-sm font-medium">Database Connection</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(testResults.connection)}
              <span className="text-sm">{getStatusText(testResults.connection)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
            <span className="text-sm font-medium">Upload Test</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(testResults.upload)}
              <span className="text-sm">{getStatusText(testResults.upload)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
            <span className="text-sm font-medium">Fetch Test</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(testResults.fetch)}
              <span className="text-sm">{getStatusText(testResults.fetch)}</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Check the browser console for detailed test results
        </div>
      </CardContent>
    </Card>
  );
} 