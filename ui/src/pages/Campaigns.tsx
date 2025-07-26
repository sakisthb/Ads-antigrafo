import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  TrendingUp, 
  TrendingDown,
  Eye,
  MousePointer,
  DollarSign,
  Users,
  Calendar,
  Target,
  BarChart3,
  Sparkles,
  Zap,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import metaAdsApi from '../lib/meta-ads-api';
import { ExportDialog } from '../components/export-dialog';
import type { MetaAdsCampaign } from '../lib/meta-ads-api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Campaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  cpa: number;
  roas: number;
  start_date: string;
  end_date: string;
  objective: string;
  ad_account_id: string;
  platform?: string; // Optional for backwards compatibility
}

// Map MetaAdsCampaign to Campaign (fill missing fields with defaults)
function mapMetaToCampaign(meta: MetaAdsCampaign): Campaign {
  const budget = meta.daily_budget || meta.lifetime_budget || 0;
  const spend = meta.budget_remaining ? budget - meta.budget_remaining : Math.floor(budget * 0.6); // Simulate spending
  const impressions = Math.floor(Math.random() * 50000) + 10000;
  const clicks = Math.floor(impressions * (Math.random() * 0.05 + 0.01)); // 1-6% CTR
  const conversions = Math.floor(clicks * (Math.random() * 0.1 + 0.02)); // 2-12% conversion rate
  
  return {
    id: meta.id,
    name: meta.name,
    status: (meta.status?.toUpperCase() as Campaign['status']) || 'ACTIVE',
    budget,
    spend,
    impressions,
    clicks,
    ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
    cpc: clicks > 0 ? spend / clicks : 0,
    conversions,
    cpa: conversions > 0 ? spend / conversions : 0,
    roas: spend > 0 ? (conversions * 25) / spend : 0, // Assume €25 revenue per conversion
    start_date: meta.start_time || '',
    end_date: meta.stop_time || '',
    objective: meta.objective || '',
    ad_account_id: meta.id + '_account',
    platform: 'facebook',
  };
}

export default function Campaigns() {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const navigate = useNavigate();

  // Enable demo mode for testing
  useEffect(() => {
    localStorage.setItem('demoMode', 'true');
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data: MetaAdsCampaign[] = await metaAdsApi.getCampaigns();
        setCampaigns(data.map(mapMetaToCampaign));
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || campaign.platform === platformFilter;
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'PAUSED':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return t('campaigns.status.active');
      case 'PAUSED':
        return t('campaigns.status.paused');
      case 'COMPLETED':
        return t('campaigns.status.completed');
      default:
        return status;
    }
  };

  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spend, 0);
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-pulse">
            <Target className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg text-muted-foreground">{t('campaigns.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t('navigation.dashboard')}</span>
            <span>/</span>
            <span className="text-foreground">{t('navigation.campaigns')}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-full border border-blue-200/50 dark:border-blue-800/30">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('campaigns.management')}</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t('navigation.campaigns')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('campaigns.description')}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowExportDialog(true)}
                variant="outline"
                className="border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-gray-900/70 rounded-2xl px-6 py-3 transition-all duration-300"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {t('common.export')}
              </Button>
              <Button 
                onClick={() => {
                  toast.info('Δημιουργία νέας καμπάνιας - Σύντομα διαθέσιμο!');
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('campaigns.newCampaign')}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10 hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                >
                  <ArrowUpRight className="w-3 h-3" />
                  12.5%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{t('campaigns.totalCost')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">€{totalSpent.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10 hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                >
                  <ArrowUpRight className="w-3 h-3" />
                  8.2%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{t('analytics.impressions')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalImpressions.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10 hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MousePointer className="w-5 h-5 text-white" />
                </div>
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
                >
                  <ArrowUpRight className="w-3 h-3" />
                  3.24%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{t('analytics.ctr')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{avgCTR.toFixed(2)}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10 hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800"
                >
                  <ArrowUpRight className="w-3 h-3" />
                  15.7%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{t('analytics.clicks')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalClicks.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t('campaigns.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white/70 dark:focus:bg-gray-800/70 transition-all duration-300"
                />
              </div>
              
              <div className="flex gap-3 w-full lg:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-48 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white/70 dark:focus:bg-gray-800/70 transition-all duration-300">
                    <SelectValue placeholder={t('campaigns.status')} />
                  </SelectTrigger>
                  <SelectContent className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl">
                    <SelectItem value="all">{t('campaigns.allStatuses')}</SelectItem>
                    <SelectItem value="ACTIVE">{t('campaigns.status.active')}</SelectItem>
                    <SelectItem value="PAUSED">{t('campaigns.status.paused')}</SelectItem>
                    <SelectItem value="COMPLETED">{t('campaigns.status.completed')}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger className="w-full lg:w-48 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white/70 dark:focus:bg-gray-800/70 transition-all duration-300">
                    <SelectValue placeholder={t('campaigns.platform')} />
                  </SelectTrigger>
                  <SelectContent className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl">
                    <SelectItem value="all">{t('campaigns.allPlatforms')}</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10 hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                      {campaign.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-3 py-1 rounded-full ${getStatusColor(campaign.status)}`}
                      >
                        {getStatusLabel(campaign.status)}
                      </Badge>
                      <Badge variant="outline" className="text-xs px-3 py-1 rounded-full bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800">
                        {campaign.platform}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      toast.info(`${t('campaigns.optionsFor')}: ${campaign.name}`);
                    }}
                    className="rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Budget Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('campaigns.budget')}</span>
                    <span className="font-medium">€{campaign.budget.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min((campaign.spend / campaign.budget) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t('campaigns.spent')}: €{campaign.spend.toLocaleString()}</span>
                    <span>{((campaign.spend / campaign.budget) * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/30 dark:bg-gray-800/30 rounded-2xl">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{campaign.impressions.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{t('analytics.impressions')}</p>
                  </div>
                  <div className="text-center p-3 bg-white/30 dark:bg-gray-800/30 rounded-2xl">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{campaign.clicks.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{t('analytics.clicks')}</p>
                  </div>
                  <div className="text-center p-3 bg-white/30 dark:bg-gray-800/30 rounded-2xl">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{campaign.ctr.toFixed(2)}%</p>
                    <p className="text-xs text-muted-foreground">{t('analytics.ctr')}</p>
                  </div>
                  <div className="text-center p-3 bg-white/30 dark:bg-gray-800/30 rounded-2xl">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">€{campaign.cpc.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{t('analytics.cpc')}</p>
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(campaign.start_date).toLocaleDateString('el-GR')} - {new Date(campaign.end_date).toLocaleDateString('el-GR')}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-gray-900/70 rounded-xl transition-all duration-300"
                    onClick={() => {
                      toast.info(`Ανάλυση καμπάνιας: ${campaign.name} - Σύντομα διαθέσιμο!`);
                    }}
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    {t('common.analytics')}
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      toast.info(`${t('campaigns.editCampaign')}: ${campaign.name}`);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 rounded-xl transition-all duration-300"
                  >
                    <Activity className="w-3 h-3 mr-1" />
                    {t('common.edit')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('campaigns.noCampaignsFound')}</h3>
              <p className="text-muted-foreground mb-6">{t('campaigns.noCampaignsDescription')}</p>
              <Button 
                onClick={() => {
                  toast.info('Δημιουργία νέας καμπάνιας - Σύντομα διαθέσιμο!');
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('campaigns.createCampaign')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Export Dialog */}
        {showExportDialog && (
          <ExportDialog
            dataType="campaigns"
            data={filteredCampaigns}
            trigger={null}
          />
        )}
      </div>
    </div>
  );
} 