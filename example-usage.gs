/**
 * Example Usage - Google Ads to Google Sheets Integration
 * 
 * This file shows examples of how to use the Google Ads to Sheets integration
 * for different use cases and scenarios.
 */

// Example 1: Basic data pull for the last 7 days
function exampleBasicPull() {
  // Override the date range for this example
  const originalDateRange = CONFIG.DATE_RANGE_DAYS;
  CONFIG.DATE_RANGE_DAYS = 7;
  
  try {
    pullGoogleAdsData();
    console.log('Basic data pull completed successfully');
  } finally {
    // Restore original date range
    CONFIG.DATE_RANGE_DAYS = originalDateRange;
  }
}

// Example 2: Pull data for a specific date range
function exampleCustomDateRange() {
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-01-31');
  
  try {
    // Get the spreadsheet
    const spreadsheet = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
    
    // Pull campaign data for specific date range
    const campaignData = getCampaignData(startDate, endDate);
    
    // Write to a specific sheet
    const sheet = getOrCreateSheet(spreadsheet, 'January 2024 Data');
    writeDataToSheet(sheet, campaignData, [
      'Date', 'Campaign ID', 'Campaign Name', 'Status', 'Channel Type',
      'Impressions', 'Clicks', 'Cost', 'Conversions', 'Conversion Value',
      'Average CPC', 'CTR', 'Average CPM', 'Conversion Rate'
    ]);
    
    console.log('Custom date range data pull completed');
  } catch (error) {
    console.error('Error in custom date range pull:', error);
  }
}

// Example 3: Pull only high-performing campaigns
function exampleHighPerformingCampaigns() {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    // Get campaign data
    const campaignData = getCampaignData(startDate, endDate);
    
    // Filter for high-performing campaigns (CTR > 2% and conversions > 0)
    const highPerforming = campaignData.filter(campaign => 
      campaign.ctr > 2 && campaign.conversions > 0
    );
    
    // Write to sheet
    const spreadsheet = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
    const sheet = getOrCreateSheet(spreadsheet, 'High Performing Campaigns');
    writeDataToSheet(sheet, highPerforming, [
      'Date', 'Campaign ID', 'Campaign Name', 'Status', 'Channel Type',
      'Impressions', 'Clicks', 'Cost', 'Conversions', 'Conversion Value',
      'Average CPC', 'CTR', 'Average CPM', 'Conversion Rate'
    ]);
    
    console.log(`Found ${highPerforming.length} high-performing campaigns`);
  } catch (error) {
    console.error('Error filtering high-performing campaigns:', error);
  }
}

// Example 4: Create a daily summary report
function exampleDailySummary() {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 1); // Yesterday only
    
    // Get all data for yesterday
    const campaignData = getCampaignData(startDate, endDate);
    const adGroupData = getAdGroupData(startDate, endDate);
    const keywordData = getKeywordData(startDate, endDate);
    
    // Calculate daily summary
    const summary = calculateSummaryMetrics(campaignData, adGroupData, keywordData);
    
    // Create daily summary sheet
    const spreadsheet = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
    const sheet = getOrCreateSheet(spreadsheet, 'Daily Summary');
    
    // Add date to summary
    const dailySummary = [
      ['Date', 'Metric', 'Value'],
      [Utilities.formatDate(startDate, Session.getScriptTimeZone(), 'yyyy-MM-dd'), 'Total Campaigns', summary.totalCampaigns],
      [Utilities.formatDate(startDate, Session.getScriptTimeZone(), 'yyyy-MM-dd'), 'Total Impressions', summary.totalImpressions],
      [Utilities.formatDate(startDate, Session.getScriptTimeZone(), 'yyyy-MM-dd'), 'Total Clicks', summary.totalClicks],
      [Utilities.formatDate(startDate, Session.getScriptTimeZone(), 'yyyy-MM-dd'), 'Total Cost', summary.totalCost],
      [Utilities.formatDate(startDate, Session.getScriptTimeZone(), 'yyyy-MM-dd'), 'Total Conversions', summary.totalConversions],
      [Utilities.formatDate(startDate, Session.getScriptTimeZone(), 'yyyy-MM-dd'), 'Average CTR', summary.averageCtr],
      [Utilities.formatDate(startDate, Session.getScriptTimeZone(), 'yyyy-MM-dd'), 'Average CPC', summary.averageCpc],
      [Utilities.formatDate(startDate, Session.getScriptTimeZone(), 'yyyy-MM-dd'), 'Conversion Rate', summary.conversionRate],
      [Utilities.formatDate(startDate, Session.getScriptTimeZone(), 'yyyy-MM-dd'), 'ROAS', summary.roas]
    ];
    
    // Append to existing data (don't clear)
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      // Write headers if sheet is empty
      sheet.getRange(1, 1, 1, 3).setValues([['Date', 'Metric', 'Value']]);
      sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
      sheet.getRange(2, 1, dailySummary.length - 1, 3).setValues(dailySummary.slice(1));
    } else {
      // Append new data
      sheet.getRange(lastRow + 1, 1, dailySummary.length - 1, 3).setValues(dailySummary.slice(1));
    }
    
    console.log('Daily summary created successfully');
  } catch (error) {
    console.error('Error creating daily summary:', error);
  }
}

// Example 5: Monitor budget spending
function exampleBudgetMonitoring() {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7); // Last 7 days
    
    // Get campaign data
    const campaignData = getCampaignData(startDate, endDate);
    
    // Calculate daily spending
    const dailySpending = {};
    campaignData.forEach(campaign => {
      const date = campaign.date;
      if (!dailySpending[date]) {
        dailySpending[date] = 0;
      }
      dailySpending[date] += campaign.cost;
    });
    
    // Create budget monitoring sheet
    const spreadsheet = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
    const sheet = getOrCreateSheet(spreadsheet, 'Budget Monitoring');
    
    const budgetData = Object.entries(dailySpending).map(([date, cost]) => [date, cost]);
    budgetData.unshift(['Date', 'Daily Spend']);
    
    // Clear and write data
    sheet.clear();
    sheet.getRange(1, 1, budgetData.length, 2).setValues(budgetData);
    sheet.getRange(1, 1, 1, 2).setFontWeight('bold');
    
    // Add conditional formatting for high spending days
    const range = sheet.getRange(2, 2, budgetData.length - 1, 1);
    const rule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(100) // Highlight days spending more than $100
      .setBackground('#ffcdd2')
      .setRanges([range])
      .build();
    
    sheet.setConditionalFormatRules([rule]);
    
    console.log('Budget monitoring data created');
  } catch (error) {
    console.error('Error creating budget monitoring:', error);
  }
}

// Example 6: Export data to CSV format
function exampleExportToCSV() {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    // Get campaign data
    const campaignData = getCampaignData(startDate, endDate);
    
    // Convert to CSV format
    const headers = ['Date', 'Campaign ID', 'Campaign Name', 'Impressions', 'Clicks', 'Cost', 'Conversions', 'CTR', 'CPC'];
    const csvData = [headers.join(',')];
    
    campaignData.forEach(row => {
      const csvRow = [
        row.date,
        row.campaignId,
        `"${row.campaignName}"`, // Quote strings to handle commas
        row.impressions,
        row.clicks,
        row.cost,
        row.conversions,
        row.ctr,
        row.averageCpc
      ];
      csvData.push(csvRow.join(','));
    });
    
    // Create CSV content
    const csvContent = csvData.join('\n');
    
    // Create a new sheet with CSV data
    const spreadsheet = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
    const sheet = getOrCreateSheet(spreadsheet, 'CSV Export');
    
    // Write CSV data as text
    sheet.clear();
    sheet.getRange(1, 1).setValue(csvContent);
    
    console.log('CSV export completed');
  } catch (error) {
    console.error('Error exporting to CSV:', error);
  }
}

// Example 7: Set up multiple triggers for different purposes
function exampleMultipleTriggers() {
  try {
    // Delete existing triggers
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      ScriptApp.deleteTrigger(trigger);
    });
    
    // Create daily trigger for full data pull
    ScriptApp.newTrigger('pullGoogleAdsData')
      .timeBased()
      .everyDays(1)
      .atHour(9)
      .create();
    
    // Create hourly trigger for budget monitoring
    ScriptApp.newTrigger('exampleBudgetMonitoring')
      .timeBased()
      .everyHours(1)
      .create();
    
    // Create weekly trigger for summary report
    ScriptApp.newTrigger('exampleDailySummary')
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.MONDAY)
      .atHour(8)
      .create();
    
    console.log('Multiple triggers created successfully');
  } catch (error) {
    console.error('Error creating multiple triggers:', error);
  }
}

// Example 8: Error handling and notifications
function exampleWithErrorHandling() {
  try {
    console.log('Starting data pull with enhanced error handling...');
    
    // Set up error notification
    const originalErrorNotification = CONFIG.SEND_ERROR_NOTIFICATIONS;
    CONFIG.SEND_ERROR_NOTIFICATIONS = true;
    
    // Attempt to pull data
    pullGoogleAdsData();
    
    // Send success notification
    sendSuccessNotification();
    
    console.log('Data pull completed successfully with error handling');
  } catch (error) {
    console.error('Error in data pull:', error);
    sendErrorNotification(error);
  } finally {
    // Restore original settings
    CONFIG.SEND_ERROR_NOTIFICATIONS = originalErrorNotification;
  }
}

// Helper function to send success notification
function sendSuccessNotification() {
  try {
    if (CONFIG.SEND_ERROR_NOTIFICATIONS && CONFIG.ERROR_NOTIFICATION_EMAIL) {
      const subject = 'Google Ads Data Pull - Success';
      const message = `Google Ads data pull completed successfully at ${new Date().toLocaleString()}`;
      
      MailApp.sendEmail(CONFIG.ERROR_NOTIFICATION_EMAIL, subject, message);
    }
  } catch (error) {
    console.error('Failed to send success notification:', error);
  }
} 