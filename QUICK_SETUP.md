# Quick Setup Guide - Google Ads to Google Sheets

This guide will help you set up the Google Ads to Google Sheets integration in 5 simple steps.

## ✅ Your Google Sheets is Ready!

Your Google Sheets URL has been configured:
**https://docs.google.com/spreadsheets/d/1Fm27WvBokQqP_qguexymNhCQnzGN4cXL_f6pnv82oPU/edit?usp=sharing**

## Prerequisites Checklist

Before starting, make sure you have:
- [x] A Google Sheets document (✅ Ready!)
- [ ] A Google Ads account with API access
- [ ] A Google account (for Apps Script)
- [ ] A Google Ads Developer Token

## Step 1: Get Your Google Ads Developer Token

**You need a developer token to use the Google Ads API. Here's how to get one:**

### Option A: Apply for a Developer Token (Recommended)

1. **Go to Google Ads API Center**:
   - Visit: [https://developers.google.com/google-ads/api/docs/first-call/dev-token](https://developers.google.com/google-ads/api/docs/first-call/dev-token)
   - Sign in with your Google Ads account

2. **Apply for Developer Token**:
   - Click "Apply for a developer token"
   - Fill out the application form
   - You'll need to provide:
     - Your Google Ads account information
     - Business details
     - Intended use case (select "Data analysis and reporting")
   - Submit the application

3. **Wait for Approval**:
   - Google typically responds within 1-3 business days
   - You'll receive an email with your developer token
   - The token will also appear in your Google Ads account

### Option B: Use Google Ads Scripts (Alternative)

If you can't get a developer token immediately, you can use **Google Ads Scripts** instead:

1. **Go to Google Ads Scripts**:
   - Visit: [https://ads.google.com/um/Welcome/Home?subid=us-en-et-g-aw-a-googleads!o3~#Scripts](https://ads.google.com/um/Welcome/Home?subid=us-en-et-g-aw-a-googleads!o3~#Scripts)
   - Sign in with your Google Ads account

2. **Create a New Script**:
   - Click the "+" button to create a new script
   - Name it "Google Ads to Sheets Integration"

3. **Use the Alternative Script**:
   - I can provide you with a Google Ads Scripts version that doesn't require a developer token
   - This will work with your existing Google Sheets

### Option C: Contact Google Support

If you're having trouble with the application:
1. Go to [Google Ads Help Center](https://support.google.com/google-ads/)
2. Search for "developer token application"
3. Contact Google Ads support for assistance

## Step 2: Get Your Google Ads Customer ID

1. Log into your Google Ads account
2. Look at the URL in your browser
3. The customer ID is the 10-digit number in the URL (e.g., `https://ads.google.com/um/Welcome/Home?subid=us-en-et-g-aw-a-googleads!o3~1234567890`)
4. Copy this number (1234567890 in this example)

## Step 3: Set Up Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Name your project (e.g., "Google Ads Integration")
4. Delete the default code and paste the contents of `enhanced-google-ads-script.gs` (recommended) or `google-ads-to-sheets.gs`
5. Update the remaining configuration variables in the script:
   ```javascript
   // Replace these values:
   CUSTOMER_ID: 'YOUR_GOOGLE_ADS_CUSTOMER_ID', // Your 10-digit customer ID
   DEVELOPER_TOKEN: 'YOUR_DEVELOPER_TOKEN',     // Your developer token
   ```
6. Save the project (Ctrl+S or Cmd+S)

## Step 4: Set Up Authentication

1. In the Apps Script editor, go to "Services" (left sidebar)
2. Click the "+" button to add a service
3. Find and add "Google Ads API"
4. Click "Add"
5. Configure OAuth2 authentication when prompted

## Step 5: Test and Run

1. In the Apps Script editor, select the `testScript` function from the dropdown
2. Click the "Run" button
3. Grant permissions when prompted
4. Check your Google Sheets to see if data was populated
5. If successful, run the `setup` function to create daily automation

## 🎯 What You'll Get

Once configured, your Google Sheets will automatically receive:

### Enhanced Script (Recommended)
- **Campaign Data** sheet: Campaign-level metrics
- **Ad Group Data** sheet: Ad group-level metrics  
- **Keyword Data** sheet: Keyword-level metrics
- **Summary** sheet: Overall performance summary

### Basic Script
- **Single sheet** with all campaign and ad group data

## 📊 Metrics That Will Be Pulled

- **Impressions**: Number of times ads were shown
- **Clicks**: Number of clicks on ads
- **Cost**: Total cost in your account currency
- **Conversions**: Number of conversions
- **CTR**: Click-through rate
- **Average CPC**: Average cost per click
- **Average CPM**: Average cost per thousand impressions
- **Conversion Rate**: Conversion rate from interactions

## Troubleshooting

### Common Issues:

**"Authorization required" error:**
- Make sure you've granted all necessary permissions
- Check that your Google Ads account has API access enabled

**"Invalid customer ID" error:**
- Verify your customer ID is correct (10 digits, no dashes)
- Make sure you're using the right Google Ads account

**"No data returned" error:**
- Check that you have campaigns with data in the specified date range
- Verify your developer token is correct

**"Permission denied" error:**
- Make sure your Google Sheets is shared with your Google account
- Check that you have edit permissions on the sheet

### Getting Help:

1. Check the execution logs in Apps Script (View > Execution log)
2. Verify all configuration values are correct
3. Test with a smaller date range first
4. Make sure your Google Ads account has active campaigns

## Next Steps

Once the basic setup is working:

1. **Customize the script**: Modify the date range, metrics, or sheet structure
2. **Set up automation**: Create daily triggers for automatic data updates
3. **Add more metrics**: Extend the script to pull additional data
4. **Create reports**: Build dashboards and visualizations in Google Sheets

## Support

For additional help:
- Check the full README.md for detailed documentation
- Review the Google Ads API documentation
- Check the Apps Script execution logs for error details 