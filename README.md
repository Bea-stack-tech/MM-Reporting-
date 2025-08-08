# Google Ads to Google Sheets Integration

This Google Apps Script automatically pulls Google Ads metrics and populates a Google Sheets with the data. The script can be configured to run daily and will pull metrics like impressions, clicks, cost, conversions, CTR, and more.

## Features

- **Automatic Data Pulling**: Fetches Google Ads metrics automatically
- **Comprehensive Metrics**: Includes impressions, clicks, cost, conversions, CTR, CPC, CPM, and conversion rates
- **Daily Automation**: Can be set to run daily at a specified time
- **Easy Setup**: Simple configuration with clear instructions
- **Error Handling**: Comprehensive error handling and logging

## Prerequisites

Before setting up this script, you'll need:

1. **Google Ads Account**: An active Google Ads account with API access
2. **Google Sheets**: A Google Sheets document where you want to store the data
3. **Google Apps Script**: Access to Google Apps Script (free with Google account)
4. **Google Ads API Access**: Developer token and OAuth2 credentials

## Setup Instructions

### Step 1: Google Ads API Setup

1. **Get a Developer Token**:
   - Go to [Google Ads API Center](https://developers.google.com/google-ads/api/docs/first-call/dev-token)
   - Apply for a developer token if you don't have one
   - Note down your developer token

2. **Set up OAuth2**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Ads API
   - Create OAuth2 credentials (Service Account or OAuth2 Client ID)
   - Download the credentials JSON file

### Step 2: Google Sheets Setup

1. **Create a new Google Sheets document**
2. **Note the URL** - you'll need this for the script configuration
3. **Share the sheet** with the email address associated with your Google Apps Script

### Step 3: Google Apps Script Setup

1. **Create a new Google Apps Script project**:
   - Go to [script.google.com](https://script.google.com)
   - Click "New Project"
   - Name your project (e.g., "Google Ads to Sheets Integration")

2. **Copy the script code**:
   - Replace the default code with the contents of `google-ads-to-sheets.gs`
   - Save the project

3. **Configure the script**:
   - Update the following variables in the script:
     ```javascript
     const SHEET_URL = 'YOUR_GOOGLE_SHEETS_URL_HERE';
     const CUSTOMER_ID = 'YOUR_GOOGLE_ADS_CUSTOMER_ID';
     const DATE_RANGE_DAYS = 30;
     ```
   - Replace `YOUR_DEVELOPER_TOKEN` with your actual developer token

4. **Set up authentication**:
   - In the Apps Script editor, go to "Services"
   - Add the "Google Ads API" service
   - Configure OAuth2 authentication

### Step 4: Test the Script

1. **Run the setup function**:
   - In the Apps Script editor, select the `setup` function
   - Click the "Run" button
   - Grant necessary permissions when prompted

2. **Test the data pull**:
   - Run the `testScript` function to verify everything works
   - Check your Google Sheets to see if data was populated

### Step 5: Set Up Automation

1. **Create a daily trigger**:
   - The `setup` function automatically creates a daily trigger
   - You can also manually create triggers in the Apps Script editor
   - Go to "Triggers" in the left sidebar
   - Click "Add Trigger"
   - Configure to run `pullGoogleAdsData` daily at your preferred time

## Configuration Options

### Date Range
```javascript
const DATE_RANGE_DAYS = 30; // Number of days to pull data for
```

### Metrics Included
The script pulls the following metrics:
- **Impressions**: Number of times ads were shown
- **Clicks**: Number of clicks on ads
- **Cost**: Total cost in your account currency
- **Conversions**: Number of conversions
- **Average CPC**: Average cost per click
- **CTR**: Click-through rate
- **Average CPM**: Average cost per thousand impressions
- **Conversion Rate**: Conversion rate from interactions

### Customization

You can customize the script by:

1. **Adding more metrics**: Modify the GAQL query in `getGoogleAdsData()`
2. **Changing the date range**: Update `DATE_RANGE_DAYS`
3. **Adding filters**: Modify the WHERE clause in the query
4. **Changing the output format**: Modify `writeDataToSheet()`

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Ensure OAuth2 is properly configured
   - Check that the service account has access to Google Ads
   - Verify the developer token is correct

2. **Permission Errors**:
   - Make sure the Google Sheets is shared with the script's account
   - Check that the Google Ads account has API access enabled

3. **No Data Returned**:
   - Verify the customer ID is correct
   - Check that there's data in the specified date range
   - Ensure the GAQL query is valid

### Debugging

1. **Check the logs**:
   - In Apps Script editor, go to "Executions"
   - View the logs for any error messages

2. **Test individual functions**:
   - Run `testScript()` to test the entire flow
   - Run individual functions to isolate issues

## API Limits

- **Google Ads API**: Has rate limits and quotas
- **Google Apps Script**: Has execution time limits (6 minutes)
- **Google Sheets**: Has write limits per request

## Support

For issues and questions:
1. Check the [Google Ads API documentation](https://developers.google.com/google-ads/api/docs/start)
2. Review [Google Apps Script documentation](https://developers.google.com/apps-script)
3. Check the execution logs in Apps Script for error details

## License

This script is provided as-is for educational and business use. Please ensure compliance with Google's terms of service and API usage policies. 