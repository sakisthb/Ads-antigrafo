import { 
  Home, 
  Settings, 
  BarChart3,
  Target,
  PieChart,
  Activity,
  Zap,
  RefreshCw,
  Download,
  TrendingUp,
  FileText,
  Brain,
  Sparkles,
  Network,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuAction,
} from "@/components/ui/sidebar";


export function AppSidebar() {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  const handleRefreshData = () => {
    toast.success('Ανανέωση δεδομένων...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleExportData = () => {
    toast.info('Εξαγωγή δεδομένων σε εξέλιξη...');
    // Simulate export process
    setTimeout(() => {
      toast.success('Εξαγωγή ολοκληρώθηκε!');
    }, 2000);
  };

  const handleQuickOptimize = () => {
    toast.info('Εκτέλεση γρήγορης βελτιστοποίησης...');
    // Simulate optimization process
    setTimeout(() => {
      toast.success('Βελτιστοποίηση ολοκληρώθηκε!');
    }, 3000);
  };

  return (
    <Sidebar collapsible="icon" className="sidebar sticky top-12 h-[calc(100vh-3rem)] z-40">
      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation.title')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={t('navigation.dashboard')} isActive={isActive('/')} asChild>
                  <Link to="/">
                    <Home className="w-4 h-4" />
                    <span>{t('navigation.dashboard')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={t('navigation.campaigns')} isActive={isActive('/campaigns')} asChild>
                  <Link to="/campaigns">
                    <Target className="w-4 h-4" />
                    <span>{t('navigation.campaigns')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={t('navigation.analytics')} isActive={isActive('/analytics')} asChild>
                  <Link to="/analytics">
                    <BarChart3 className="w-4 h-4" />
                    <span>{t('navigation.analytics')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={t('navigation.campaignAnalysis')} isActive={isActive('/campaign-analysis')} asChild>
                  <Link to="/campaign-analysis">
                    <PieChart className="w-4 h-4" />
                    <span>{t('navigation.campaignAnalysis')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Real-Time Analytics" isActive={isActive('/realtime')} asChild>
                  <Link to="/realtime">
                    <Zap className="w-4 h-4" />
                    <span>Real-Time</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={t('navigation.funnelAnalysis')} isActive={isActive('/funnel-analysis')} asChild>
                  <Link to="/funnel-analysis">
                    <Activity className="w-4 h-4" />
                    <span>{t('navigation.funnelAnalysis')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Advanced Analytics" isActive={isActive('/advanced-analytics')} asChild>
                  <Link to="/advanced-analytics">
                    <TrendingUp className="w-4 h-4" />
                    <span>Advanced Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="AI Predictions" isActive={isActive('/ai-predictions')} asChild>
                  <Link to="/ai-predictions">
                    <Brain className="w-4 h-4" />
                    <span>AI Predictions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="ML Prediction Engine" isActive={isActive('/ai-ml-predictions')} asChild>
                  <Link to="/ai-ml-predictions">
                    <Sparkles className="w-4 h-4" />
                    <span>ML Prediction Engine</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Reporting Hub" isActive={isActive('/reporting-hub')} asChild>
                  <Link to="/reporting-hub">
                    <FileText className="w-4 h-4" />
                    <span>Reporting Hub</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Analytics Studio" isActive={isActive('/analytics-studio')} asChild>
                  <Link to="/analytics-studio">
                    <BarChart3 className="w-4 h-4" />
                    <span>Analytics Studio</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Multi-Touch Attribution - SOS" isActive={isActive('/multi-touch-attribution')} asChild>
                  <Link to="/multi-touch-attribution">
                    <Network className="w-4 h-4" />
                    <span>Multi-Touch Attribution</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="WebSocket Monitor" isActive={isActive('/websocket-monitor')} asChild>
                  <Link to="/websocket-monitor">
                    <Activity className="w-4 h-4" />
                    <span>WebSocket Monitor</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation.quickActions')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleRefreshData}>
                  <RefreshCw className="w-4 h-4" />
                  <span>{t('navigation.refresh')}</span>
                </SidebarMenuButton>
                <SidebarMenuAction onClick={handleQuickOptimize}>
                  <Zap className="w-4 h-4" />
                </SidebarMenuAction>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleExportData}>
                  <Download className="w-4 h-4" />
                  <span>{t('navigation.export')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={t('navigation.settings')} isActive={isActive('/settings')} asChild>
              <Link to="/settings">
                <Settings className="w-4 h-4" />
                <span>{t('navigation.settings')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
} 