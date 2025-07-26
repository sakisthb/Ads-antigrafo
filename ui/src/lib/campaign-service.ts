import { supabase, type CampaignUpload, type CampaignUploadInsert } from './supabase-mock';
import { AnalyticsService, type AnalyticsResult } from './analytics-service';

export class CampaignService {
  /**
   * Save campaign upload to Supabase
   */
  static async saveUpload(
    userId: string, 
    filename: string, 
    rawCsv: string, 
    analyticsResult: AnalyticsResult
  ): Promise<CampaignUpload | null> {
    try {
      console.log('CampaignService: Saving upload for user:', userId);
      const uploadData: CampaignUploadInsert = {
        user_id: userId,
        filename,
        raw_csv: rawCsv,
        processed_json: analyticsResult,
      };

      const result = await supabase
        .from('campaign_uploads')
        .insert([uploadData]);

      console.log('CampaignService: Save result:', result);

      if (result.error) {
        console.error('Error saving campaign upload:', result.error);
        throw result.error;
      }

      return result.data?.[0] || null;
    } catch (error) {
      console.error('Failed to save campaign upload:', error);
      return null;
    }
  }

  /**
   * Get all uploads for a user
   */
  static async getUserUploads(userId: string): Promise<CampaignUpload[]> {
    try {
      console.log('CampaignService: Fetching uploads for user:', userId);
      const allUploads = await supabase
        .from('campaign_uploads')
        .select('*');
      const data = (allUploads.data || []).filter((u: any) => u.user_id === userId);
      return data;
    } catch (error) {
      console.error('Failed to fetch user uploads:', error);
      return [];
    }
  }

  /**
   * Get a specific upload by ID
   */
  static async getUploadById(uploadId: string): Promise<CampaignUpload | null> {
    try {
      const allUploads2 = await supabase
        .from('campaign_uploads')
        .select('*');
      const data2 = (allUploads2.data || []).filter((u: any) => u.id === uploadId);
      return data2[0] || null;
    } catch (error) {
      console.error('Failed to fetch upload:', error);
      return null;
    }
  }

  /**
   * Delete an upload
   */
  static async deleteUpload(): Promise<boolean> {
    try {
      await supabase
        .from('campaign_uploads')
        .delete();
      return true;
    } catch (error) {
      console.error('Failed to delete upload:', error);
      return false;
    }
  }

  /**
   * Process CSV and save to database
   */
  static async processAndSaveUpload(
    userId: string,
    filename: string,
    csvContent: string
  ): Promise<{ success: boolean; data?: AnalyticsResult; error?: string }> {
    try {
      // Parse CSV content
      const lines = csvContent.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        return row;
      }).filter(row => Object.values(row).some(val => val && val !== ''));

      // Process with analytics service
      const analyticsResult = AnalyticsService.processData(data);

      // Save to database
      const savedUpload = await this.saveUpload(userId, filename, csvContent, analyticsResult);

      if (savedUpload) {
        return { success: true, data: analyticsResult };
      } else {
        return { success: false, error: 'Failed to save upload' };
      }
    } catch (error) {
      console.error('Error processing and saving upload:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
} 