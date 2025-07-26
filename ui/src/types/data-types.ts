export interface Campaign {
  id: string;
  name: string;
  status: string;
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
}

export interface AnalyticsData {
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  spend: number;
  conversions: number;
  cpa: number;
  roas: number;
  reach: number;
  frequency: number;
  unique_clicks: number;
  unique_ctr: number;
  cost_per_unique_click: number;
  unique_link_clicks: number;
  unique_link_click_ctr: number;
  cost_per_unique_link_click: number;
}

export interface FunnelData {
  stage: string;
  impressions: number;
  clicks: number;
  conversions: number;
  rate: number;
  cost: number;
  cpa: number;
  dropoff_rate: number;
} 