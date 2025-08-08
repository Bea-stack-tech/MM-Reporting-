# Google Ads Scripts Setup Guide - No Developer Token Required

This guide will walk you through setting up the Google Ads Scripts version that works without a developer token.

## ✅ What You'll Get

Your Google Sheets will automatically receive:
- **Campaign Data** sheet: Campaign-level metrics (impressions, clicks, cost, conversions, etc.)
- **Ad Group Data** sheet: Ad group-level performance data
- **Keyword Data** sheet: Keyword-level performance data
- **Summary** sheet: Overall performance summary with totals and averages

## 🚀 Step-by-Step Setup

### Step 1: Access Google Ads Scripts

1. **Go to Google Ads Scripts**:
   - Visit: [https://ads.google.com/um/Welcome/Home?subid=us-en-et-g-aw-a-googleads!o3~#Scripts](https://ads.google.com/um/Welcome/Home?subid=us-en-et-g-aw-a-googleads!o3~#Scripts)
   - Sign in with your Google Ads account
   - Make sure you're in the correct Google Ads account

### Step 2: Create a New Script

1. **Click the "+" button** to create a new script
2. **Name your script**: "Google Ads to Sheets Integration"
3. **Click "Create"**

### Step 3: Copy the Script Code

1. **Delete the default code** in the script editor
2. **Copy the entire code** from `google-ads-scripts-version.gs`
3. **Paste it** into the script editor

The script is already configured with your Google Sheets URL:
```javascript
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1Fm27WvBokQqP_qguexymNhCQnzGN4cXL_f6pnv82oPU/edit?usp=sharing';
```

### Step 4: Save and Test

1. **Click "Save"** (or press Ctrl+S)
2. **Click "Run"** to test the script
3. **Grant permissions** when prompted:
   - Allow access to Google Sheets
   - Allow access to Google Ads data
4. **Check the execution log** for any errors

### Step 5: Check Your Google Sheets

1. **Open your Google Sheets**: [https://docs.google.com/spreadsheets/d/1Fm27WvBokQqP_qguexymNhCQnzGN4cXL_f6pnv82oPU/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1Fm27WvBokQqP_qguexymNhCQnzGN4cXL_f6pnv82oPU/edit?usp=sharing)
2. **Look for new sheets**:
   - Campaign Data
   - Ad Group Data
   - Keyword Data
   - Summary

### Step 6: Set Up Daily Scheduling

1. **In Google Ads Scripts**, click on your script
2. **Click "Schedule"**
3. **Set up daily scheduling**:
   - Frequency: Daily
   - Time: Choose a time (e.g., 9:00 AM)
   - Time zone: Your preferred timezone
4. **Click "Save"**

## 📊 What Data Will Be Pulled

The script will automatically pull these metrics for the last 30 days:

### Campaign Data
- Campaign ID, Name, Status, Channel Type
- Impressions, Clicks, Cost, Conversions
- Conversion Value, Average CPC, CTR, Average CPM, Conversion Rate

### Ad Group Data
- Campaign and Ad Group information
- Performance metrics (impressions, clicks, cost, conversions)
- Efficiency metrics (CTR, CPC, CPM, conversion rate)

### Keyword Data
- Campaign, Ad Group, and Keyword information
- Performance metrics for each keyword
- Status and efficiency metrics

### Summary Data
- Total campaigns, ad groups, keywords
- Overall performance totals
- Average metrics (CTR, CPC, CPM, conversion rate, ROAS)

## 🔧 Customization Options

### Change Date Range
To pull data for a different number of days, edit this line in the script:
```javascript
const DATE_RANGE_DAYS = 30; // Change this number
```

### Add More Metrics
You can modify the script to pull additional metrics by editing the data collection functions.

## 🚨 Troubleshooting

### Common Issues:

**"No data returned" error:**
- Check that you have active campaigns in your Google Ads account
- Verify the date range (default is 30 days)
- Make sure you have data in the specified date range

**"Permission denied" error:**
- Make sure your Google Sheets is shared with your Google account
- Check that you have edit permissions on the sheet
- Try running the script again

**"Script execution failed" error:**
- Check the execution logs for specific error messages
- Make sure you're in the correct Google Ads account
- Verify the script code was copied correctly

### Getting Help:

1. **Check execution logs** in Google Ads Scripts
2. **Verify your Google Sheets URL** is correct
3. **Test with a smaller date range** first
4. **Make sure your Google Ads account has active campaigns**

## 🎯 Next Steps

Once the script is working:

1. **Monitor the data** in your Google Sheets
2. **Set up daily scheduling** for automatic updates
3. **Customize the script** if needed (date range, metrics, etc.)
4. **Create reports and dashboards** in Google Sheets
5. **Share the sheets** with team members if needed

## 📞 Support

If you encounter issues:
1. Check the execution logs in Google Ads Scripts
2. Verify all permissions are granted
3. Make sure your Google Ads account has active campaigns
4. Test with a smaller date range first

---

**You're all set!** Your Google Ads data will now automatically flow into your Google Sheets every day. 🎉 