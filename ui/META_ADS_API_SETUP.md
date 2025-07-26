# Meta Ads API Setup Guide

This guide will help you configure the Meta Ads API integration for real Facebook Ads data.

## Prerequisites

1. **Facebook Developer Account**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app or use an existing one
   - Add the "Marketing API" product to your app

2. **Facebook Business Account**
   - Ensure you have access to a Facebook Business account
   - Note your Ad Account ID (format: act_XXXXXXXXXX)

## Step 1: Create Facebook App

1. Visit [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Choose "Business" as the app type
4. Fill in your app details
5. Add the "Marketing API" product to your app

## Step 2: Generate Access Token

### Option A: User Access Token (Recommended for testing)
1. Go to your app's dashboard
2. Navigate to "Tools" > "Graph API Explorer"
3. Select your app from the dropdown
4. Click "Generate Access Token"
5. Grant the necessary permissions:
   - `ads_management`
   - `ads_read`
   - `business_management`
   - `read_insights`

### Option B: System User Access Token (Recommended for production)
1. Go to your app's dashboard
2. Navigate to "Business Settings" > "System Users"
3. Create a new system user
4. Assign the necessary permissions
5. Generate an access token for the system user

## Step 3: Find Your Ad Account ID

1. Go to [Facebook Ads Manager](https://www.facebook.com/adsmanager/)
2. Look at the URL or account settings
3. Your Ad Account ID will be in the format: `act_XXXXXXXXXX`

## Step 4: Configure Environment Variables

Create a `.env` file in the `ui` directory with the following variables:

```env
# Meta Ads API Configuration
REACT_APP_FACEBOOK_ACCESS_TOKEN=your_access_token_here
REACT_APP_FACEBOOK_AD_ACCOUNT_ID=act_your_ad_account_id_here

# Optional: App ID for additional features
REACT_APP_FACEBOOK_APP_ID=your_app_id_here
```

## Step 5: Test the Integration

1. Restart your development server
2. Navigate to the Campaigns page
3. You should see real campaign data from your Facebook Ads account
4. If no data appears, check the browser console for error messages

## Troubleshooting

### Common Issues

1. **"Invalid access token" error**
   - Ensure your access token is valid and not expired
   - Regenerate the token if necessary

2. **"Permission denied" error**
   - Check that your app has the necessary permissions
   - Verify your Ad Account ID is correct

3. **"No campaigns found"**
   - Ensure you have active campaigns in your Facebook Ads account
   - Check that your access token has access to the specific ad account

4. **"API rate limit exceeded"**
   - The Meta Ads API has rate limits
   - Implement caching if you're making too many requests

### Debug Mode

To enable debug mode and see detailed API responses:

```typescript
// In meta-ads-api.ts, set debug to true
bizSdk.FacebookAdsApi.init(this.accessToken);
bizSdk.FacebookAdsApi.getInstance().setDebug(true);
```

## Security Considerations

1. **Never commit access tokens to version control**
   - Always use environment variables
   - Add `.env` to your `.gitignore` file

2. **Use appropriate token types**
   - Use system user tokens for production
   - User access tokens expire and require re-authentication

3. **Limit permissions**
   - Only request the permissions you actually need
   - Review and remove unnecessary permissions regularly

## Production Deployment

For production deployment:

1. **Use System User Access Tokens**
   - More secure and don't expire
   - Can be managed centrally

2. **Implement Token Refresh Logic**
   - Handle token expiration gracefully
   - Implement automatic token refresh

3. **Add Error Handling**
   - Handle API rate limits
   - Implement retry logic for failed requests

4. **Monitor API Usage**
   - Track API call volumes
   - Monitor for unusual activity

## API Limits

The Meta Ads API has the following limits:

- **Rate Limits**: 200 calls per hour per app
- **Data Retention**: Insights data available for up to 37 months
- **Breakdown Limits**: Maximum of 3 breakdowns per request

## Support

If you encounter issues:

1. Check the [Meta Ads API Documentation](https://developers.facebook.com/docs/marketing-apis/)
2. Review the [API Reference](https://developers.facebook.com/docs/marketing-api/reference)
3. Check the [Facebook Developer Community](https://developers.facebook.com/community/)

## Next Steps

Once the API is configured:

1. **Real-time Data**: The app will automatically fetch real campaign data
2. **Live Updates**: Use the refresh button to get the latest data
3. **Advanced Features**: Explore campaign insights, ad sets, and individual ads
4. **Customization**: Modify the API service to fetch additional data as needed 