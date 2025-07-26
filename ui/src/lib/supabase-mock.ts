// Mock Supabase client for testing
// This will be replaced with the real @supabase/supabase-js once the package is installed

export interface CampaignUpload {
  id: string;
  user_id: string;
  filename: string;
  uploaded_at: string;
  raw_csv?: string;
  processed_json?: any;
}

export interface CampaignUploadInsert {
  user_id: string;
  filename: string;
  raw_csv?: string;
  processed_json?: any;
}

// Mock data storage
// const mockData: CampaignUpload[] = [];

const supabase = {
  from: (_table: string) => ({
    insert: async (..._args: any[]) => Promise.resolve({ data: [], error: null }),
    select: async (..._args: any[]) => Promise.resolve({ data: [], error: null }),
    eq: async (..._args: any[]) => Promise.resolve({ data: [], error: null }),
    order: async (..._args: any[]) => Promise.resolve({ data: [], error: null }),
    delete: async (..._args: any[]) => Promise.resolve({ data: [], error: null })
  })
};

// Mock environment variables
const mockEnv = {
  VITE_SUPABASE_URL: 'https://mock.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'mock-anon-key'
};

// Mock import.meta.env
if (typeof import.meta !== 'undefined') {
  (import.meta as any).env = mockEnv;
}

export { supabase }; 