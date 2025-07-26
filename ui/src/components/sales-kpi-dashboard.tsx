import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Users, 
  Target, 
  Activity,
  Heart,
  Repeat,
  ShoppingCart,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart as ReLineChart, Line, CartesianGrid, Legend, Pie, PieChart, Cell } from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SalesKPIDashboardProps {
  metrics: {
    roas: number;
    revenue: number;
    conversionRate: number;
    cpa: number;
    aov: number;
    cac: number;
    salesGrowth: number;
    leadToSaleRate: number;
    churnRate: number;
  };
}

export function SalesKPIDashboard({ metrics }: SalesKPIDashboardProps) {
  const getPerformanceColor = (value: number, threshold: number) => {
    return value >= threshold ? 'text-green-600' : 'text-red-600';
  };

  // Demo data for charts (extended)
  const kpiChartData = [
    { name: 'Jan', roas: 2.1, revenue: 12000, sales: 120, conversionRate: 3.2, cpa: 10, aov: 100, cac: 12, salesGrowth: 0.05, leads: 300, leadToSale: 0.4, churnRate: 0.12 },
    { name: 'Feb', roas: 2.4, revenue: 13500, sales: 135, conversionRate: 3.5, cpa: 11, aov: 105, cac: 13, salesGrowth: 0.08, leads: 320, leadToSale: 0.42, churnRate: 0.13 },
    { name: 'Mar', roas: 2.7, revenue: 15000, sales: 150, conversionRate: 3.8, cpa: 9, aov: 110, cac: 11, salesGrowth: 0.11, leads: 350, leadToSale: 0.43, churnRate: 0.11 },
    { name: 'Apr', roas: 2.3, revenue: 14000, sales: 140, conversionRate: 3.3, cpa: 10.5, aov: 102, cac: 12.5, salesGrowth: 0.07, leads: 330, leadToSale: 0.41, churnRate: 0.14 },
    { name: 'May', roas: 2.9, revenue: 16000, sales: 160, conversionRate: 4.0, cpa: 8.5, aov: 115, cac: 10, salesGrowth: 0.13, leads: 370, leadToSale: 0.45, churnRate: 0.10 },
    { name: 'Jun', roas: 3.1, revenue: 17000, sales: 170, conversionRate: 4.2, cpa: 8, aov: 120, cac: 9.5, salesGrowth: 0.15, leads: 390, leadToSale: 0.46, churnRate: 0.09 },
  ];

  // Pie data for lead-to-sale
  const leadToSalePie = [
    { name: 'Leads', value: 220 }, // 390 - 170
    { name: 'Sales', value: 170 },
  ];
  // Pie data for churn
  const churnPie = [
    { name: 'Active', value: 900 }, // 1000 - 100
    { name: 'Churned', value: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Revenue (Line) */}
        <Card>
          <CardHeader>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle>Έσοδα (Line Chart)</CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Revenue - Συνολικά έσοδα από τις καμπάνιες</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <CardDescription>Έσοδα ανά μήνα</CardDescription>
          </CardHeader>
          <CardContent style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={kpiChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#60a5fa" name="Έσοδα" />
              </ReLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Number of Sales (Bar) */}
        <Card>
          <CardHeader>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle>Αριθμός Πωλήσεων (Bar Chart)</CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of Sales/Purchases - Πόσες αγορές πραγματοποιήθηκαν</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <CardDescription>Αριθμός πωλήσεων ανά μήνα</CardDescription>
          </CardHeader>
          <CardContent style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#34d399" name="Πωλήσεις" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Conversion Rate (Line) */}
        <Card>
          <CardHeader>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle>Ποσοστό Μετατροπής (Line Chart)</CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Conversion Rate - Ποσοστό επισκεπτών που έγιναν πελάτες</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <CardDescription>Conversion Rate ανά μήνα</CardDescription>
          </CardHeader>
          <CardContent style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={kpiChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="conversionRate" stroke="#f59e42" name="Μετατροπή %" />
              </ReLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* CPA (Bar) */}
        <Card>
          <CardHeader>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle>Κόστος ανά Πώληση (CPA)</CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cost per Acquisition - Κόστος για κάθε νέα πώληση</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <CardDescription>Κόστος ανά πώληση</CardDescription>
          </CardHeader>
          <CardContent style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cpa" fill="#a78bfa" name="CPA" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* ROAS (Bar) */}
        <Card>
          <CardHeader>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle>Απόδοση Διαφημιστικής Δαπάνης (ROAS)</CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Return on Ad Spend - Απόδοση διαφημιστικής δαπάνης</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <CardDescription>Return on Ad Spend</CardDescription>
          </CardHeader>
          <CardContent style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="roas" fill="#f472b6" name="ROAS" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* AOV (Line) */}
        <Card>
          <CardHeader>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle>Μέση Τιμή Παραγγελίας (AOV)</CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Average Order Value - Μέση αξία κάθε παραγγελίας</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <CardDescription>Average Order Value</CardDescription>
          </CardHeader>
          <CardContent style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={kpiChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="aov" stroke="#10b981" name="AOV" />
              </ReLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.roas.toFixed(2)}x</div>
            <p className="text-xs text-muted-foreground">
              <span className={getPerformanceColor(metrics.roas, 4)}>+{((metrics.roas - 3.5) / 3.5 * 100).toFixed(1)}%</span> from target
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={getPerformanceColor(metrics.salesGrowth, 15)}>+{metrics.salesGrowth.toFixed(1)}%</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className={getPerformanceColor(metrics.conversionRate, 3)}>+{((metrics.conversionRate - 3.2) / 3.2 * 100).toFixed(1)}%</span> from target
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPA</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.cpa.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={getPerformanceColor(25, metrics.cpa)}>-{((25 - metrics.cpa) / 25 * 100).toFixed(1)}%</span> from target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AOV</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.aov.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={getPerformanceColor(metrics.aov, 80)}>+{((metrics.aov - 75) / 75 * 100).toFixed(1)}%</span> from target
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CAC</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.cac.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={getPerformanceColor(20, metrics.cac)}>-{((20 - metrics.cac) / 20 * 100).toFixed(1)}%</span> from target
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead to Sale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.leadToSaleRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className={getPerformanceColor(metrics.leadToSaleRate, 60)}>+{((metrics.leadToSaleRate - 55) / 55 * 100).toFixed(1)}%</span> from target
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <Repeat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.churnRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className={getPerformanceColor(15, metrics.churnRate)}>-{((15 - metrics.churnRate) / 15 * 100).toFixed(1)}%</span> from target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Lead to Sale Conversion
            </CardTitle>
            <CardDescription>Lead conversion rate breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                                     <Pie
                     data={leadToSalePie}
                     cx="50%"
                     cy="50%"
                     labelLine={false}
                     label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                     outerRadius={80}
                     fill="#8884d8"
                     dataKey="value"
                   >
                    {leadToSalePie.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#60a5fa' : '#34d399'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Customer Retention
            </CardTitle>
            <CardDescription>Customer churn vs retention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                                     <Pie
                     data={churnPie}
                     cx="50%"
                     cy="50%"
                     labelLine={false}
                     label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                     outerRadius={80}
                     fill="#8884d8"
                     dataKey="value"
                   >
                    {churnPie.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Summary
          </CardTitle>
          <CardDescription>Key insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-semibold">Top Performers</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded">
                  <span className="text-sm">ROAS</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {metrics.roas.toFixed(2)}x
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded">
                  <span className="text-sm">Revenue Growth</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    +{metrics.salesGrowth.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded">
                  <span className="text-sm">Lead to Sale Rate</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {metrics.leadToSaleRate.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Areas for Improvement</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                  <span className="text-sm">Churn Rate</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    {metrics.churnRate.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                  <span className="text-sm">CPA</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    ${metrics.cpa.toFixed(2)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                  <span className="text-sm">Conversion Rate</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    {metrics.conversionRate.toFixed(2)}%
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 