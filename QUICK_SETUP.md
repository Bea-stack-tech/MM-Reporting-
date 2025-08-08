# Quick Setup Guide - Google Ads to Google Sheets

This guide will help you set up the Google Ads to Google Sheets integration in 5 simple steps.

## Prerequisites Checklist

Before starting, make sure you have:
- [ ] A Google Ads account with API access
- [ ] A Google Sheets document
- [ ] A Google account (for Apps Script)
- [ ] A Google Ads Developer Token

## Step 1: Get Your Google Ads Developer Token

1. Go to [Google Ads API Center](https://developers.google.com/google-ads/api/docs/first-call/dev-token)
2. Sign in with your Google Ads account
3. Apply for a developer token if you don't have one
4. Copy your developer token (you'll need this later)

## Step 2: Create a Google Sheets Document

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet
3. Copy the URL from your browser (it should look like: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`)
4. Share the sheet with your Google account (make sure you have edit permissions)

## Step 3: Get Your Google Ads Customer ID

1. Log into your Google Ads account
2. Look at the URL in your browser
3. The customer ID is the 10-digit number in the URL (e.g., `https://ads.google.com/um/Welcome/Home?subid=us-en-et-g-aw-a-googleads!o3~1234567890`)
4. Copy this number (1234567890 in this example)

## Step 4: Set Up Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Name your project (e.g., "Google Ads Integration")
4. Delete the default code and paste the contents of `google-ads-to-sheets.gs`
5. Update the configuration variables at the top of the script:
   ```javascript
   const SHEET_URL = 'YOUR_GOOGLE_SHEETS_URL_HERE';
   const CUSTOMER_ID = 'YOUR_GOOGLE_ADS_CUSTOMER_ID';
   const DEVELOPER_TOKEN = 'YOUR_DEVELOPER_TOKEN';
   ```
6. Save the project (Ctrl+S or Cmd+S)

## Step 5: Test and Run

1. In the Apps Script editor, select the `testScript` function from the dropdown
2. Click the "Run" button
3. Grant permissions when prompted
4. Check your Google Sheets to see if data was populated
5. If successful, run the `setup` function to create daily automation

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