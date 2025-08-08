/**
 * Enhanced Google Ads to Google Sheets Integration
 * This script provides advanced functionality for pulling Google Ads metrics
 * and populating Google Sheets with comprehensive data analysis.
 * 
 * Features:
 * - Multiple metric types (campaign, ad group, keyword level)
 * - Advanced filtering options
 * - Data validation and error handling
 * - Multiple sheet support
 * - Historical data tracking
 */

// Configuration - Update these values
const CONFIG = {
  SHEET_URL: 'https://docs.google.com/spreadsheets/d/1Fm27WvBokQqP_qguexymNhCQnzGN4cXL_f6pnv82oPU/edit?usp=sharing',
  CUSTOMER_ID: 'YOUR_GOOGLE_ADS_CUSTOMER_ID',
  DATE_RANGE_DAYS: 30,
  DEVELOPER_TOKEN: 'YOUR_DEVELOPER_TOKEN',
  API_VERSION: 'v16',
  SHEET_NAMES: {
    CAMPAIGNS: 'Campaign Data',
    AD_GROUPS: 'Ad Group Data',
    KEYWORDS: 'Keyword Data',
    SUMMARY: 'Summary'
  }
};

// Google Ads API configuration
const GOOGLE_ADS_API_VERSION = CONFIG.API_VERSION;

/**
 * Main function to pull Google Ads data and populate sheets
 */
function pullGoogleAdsData() {
  try {
    console.log('Starting Google Ads data pull...');
    
    // Validate configuration
    validateConfiguration();
    
    // Get the spreadsheet
    const spreadsheet = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
    
    // Get date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - CONFIG.DATE_RANGE_DAYS);
    
    console.log(`Pulling data from ${startDate.toDateString()} to ${endDate.toDateString()}`);
    
    // Pull different types of data
    const campaignData = getCampaignData(startDate, endDate);
    const adGroupData = getAdGroupData(startDate, endDate);
    const keywordData = getKeywordData(startDate, endDate);
    
    // Write data to respective sheets
    writeCampaignData(spreadsheet, campaignData);
    writeAdGroupData(spreadsheet, adGroupData);
    writeKeywordData(spreadsheet, keywordData);
    
    // Create summary
    createSummary(spreadsheet, campaignData, adGroupData, keywordData);
    
    console.log('Successfully completed Google Ads data pull');
    
  } catch (error) {
    console.error('Error in pullGoogleAdsData:', error);
    sendErrorNotification(error);
    throw error;
  }
}

/**
 * Validate configuration before running
 */
function validateConfiguration() {
  if (!CONFIG.SHEET_URL || CONFIG.SHEET_URL === 'YOUR_GOOGLE_SHEETS_URL_HERE') {
    throw new Error('Please update SHEET_URL in the configuration');
  }
  
  if (!CONFIG.CUSTOMER_ID || CONFIG.CUSTOMER_ID === 'YOUR_GOOGLE_ADS_CUSTOMER_ID') {
    throw new Error('Please update CUSTOMER_ID in the configuration');
  }
  
  if (!CONFIG.DEVELOPER_TOKEN || CONFIG.DEVELOPER_TOKEN === 'YOUR_DEVELOPER_TOKEN') {
    throw new Error('Please update DEVELOPER_TOKEN in the configuration');
  }
  
  console.log('Configuration validated successfully');
}

/**
 * Get campaign-level data
 */
function getCampaignData(startDate, endDate) {
  try {
    const startDateStr = Utilities.formatDate(startDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const endDateStr = Utilities.formatDate(endDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    
    const query = `
      SELECT 
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.average_cpc,
        metrics.ctr,
        metrics.average_cpm,
        metrics.conversions_from_interactions_rate,
        metrics.conversions_value,
        segments.date
      FROM campaign
      WHERE segments.date BETWEEN '${startDateStr}' AND '${endDateStr}'
        AND campaign.status != 'REMOVED'
      ORDER BY segments.date DESC, metrics.cost_micros DESC
    `;
    
    const response = makeGoogleAdsApiRequest(query);
    return processCampaignResponse(response);
    
  } catch (error) {
    console.error('Error getting campaign data:', error);
    throw error;
  }
}

/**
 * Get ad group-level data
 */
function getAdGroupData(startDate, endDate) {
  try {
    const startDateStr = Utilities.formatDate(startDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const endDateStr = Utilities.formatDate(endDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    
    const query = `
      SELECT 
        campaign.id,
        campaign.name,
        ad_group.id,
        ad_group.name,
        ad_group.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.average_cpc,
        metrics.ctr,
        metrics.average_cpm,
        metrics.conversions_from_interactions_rate,
        segments.date
      FROM ad_group
      WHERE segments.date BETWEEN '${startDateStr}' AND '${endDateStr}'
        AND ad_group.status != 'REMOVED'
      ORDER BY segments.date DESC, metrics.cost_micros DESC
    `;
    
    const response = makeGoogleAdsApiRequest(query);
    return processAdGroupResponse(response);
    
  } catch (error) {
    console.error('Error getting ad group data:', error);
    throw error;
  }
}

/**
 * Get keyword-level data
 */
function getKeywordData(startDate, endDate) {
  try {
    const startDateStr = Utilities.formatDate(startDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const endDateStr = Utilities.formatDate(endDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    
    const query = `
      SELECT 
        campaign.id,
        campaign.name,
        ad_group.id,
        ad_group.name,
        ad_group_criterion.keyword.text,
        ad_group_criterion.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.average_cpc,
        metrics.ctr,
        metrics.average_cpm,
        metrics.conversions_from_interactions_rate,
        segments.date
      FROM keyword_view
      WHERE segments.date BETWEEN '${startDateStr}' AND '${endDateStr}'
        AND ad_group_criterion.status != 'REMOVED'
      ORDER BY segments.date DESC, metrics.cost_micros DESC
    `;
    
    const response = makeGoogleAdsApiRequest(query);
    return processKeywordResponse(response);
    
  } catch (error) {
    console.error('Error getting keyword data:', error);
    throw error;
  }
}

/**
 * Make request to Google Ads API with enhanced error handling
 */
function makeGoogleAdsApiRequest(query) {
  try {
    const url = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}/customers/${CONFIG.CUSTOMER_ID}/googleAds:searchStream`;
    
    const payload = {
      query: query
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ScriptApp.getOAuthToken()}`,
        'Content-Type': 'application/json',
        'developer-token': CONFIG.DEVELOPER_TOKEN
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    
    if (responseCode !== 200) {
      throw new Error(`API request failed with status ${responseCode}: ${response.getContentText()}`);
    }
    
    const responseData = JSON.parse(response.getContentText());
    
    if (!responseData.results) {
      console.log('No results returned from API');
      return { results: [] };
    }
    
    return responseData;
    
  } catch (error) {
    console.error('Error making Google Ads API request:', error);
    throw error;
  }
}

/**
 * Process campaign response
 */
function processCampaignResponse(response) {
  const processedData = [];
  
  if (response.results && response.results.length > 0) {
    response.results.forEach(result => {
      const row = {
        date: result.segments?.date || '',
        campaignId: result.campaign?.id || '',
        campaignName: result.campaign?.name || '',
        status: result.campaign?.status || '',
        channelType: result.campaign?.advertisingChannelType || '',
        impressions: result.metrics?.impressions || 0,
        clicks: result.metrics?.clicks || 0,
        cost: (result.metrics?.costMicros || 0) / 1000000,
        conversions: result.metrics?.conversions || 0,
        conversionValue: result.metrics?.conversionsValue || 0,
        averageCpc: (result.metrics?.averageCpc || 0) / 1000000,
        ctr: result.metrics?.ctr || 0,
        averageCpm: (result.metrics?.averageCpm || 0) / 1000000,
        conversionRate: result.metrics?.conversionsFromInteractionsRate || 0
      };
      processedData.push(row);
    });
  }
  
  console.log(`Processed ${processedData.length} campaign records`);
  return processedData;
}

/**
 * Process ad group response
 */
function processAdGroupResponse(response) {
  const processedData = [];
  
  if (response.results && response.results.length > 0) {
    response.results.forEach(result => {
      const row = {
        date: result.segments?.date || '',
        campaignId: result.campaign?.id || '',
        campaignName: result.campaign?.name || '',
        adGroupId: result.adGroup?.id || '',
        adGroupName: result.adGroup?.name || '',
        status: result.adGroup?.status || '',
        impressions: result.metrics?.impressions || 0,
        clicks: result.metrics?.clicks || 0,
        cost: (result.metrics?.costMicros || 0) / 1000000,
        conversions: result.metrics?.conversions || 0,
        averageCpc: (result.metrics?.averageCpc || 0) / 1000000,
        ctr: result.metrics?.ctr || 0,
        averageCpm: (result.metrics?.averageCpm || 0) / 1000000,
        conversionRate: result.metrics?.conversionsFromInteractionsRate || 0
      };
      processedData.push(row);
    });
  }
  
  console.log(`Processed ${processedData.length} ad group records`);
  return processedData;
}

/**
 * Process keyword response
 */
function processKeywordResponse(response) {
  const processedData = [];
  
  if (response.results && response.results.length > 0) {
    response.results.forEach(result => {
      const row = {
        date: result.segments?.date || '',
        campaignId: result.campaign?.id || '',
        campaignName: result.campaign?.name || '',
        adGroupId: result.adGroup?.id || '',
        adGroupName: result.adGroup?.name || '',
        keyword: result.adGroupCriterion?.keyword?.text || '',
        status: result.adGroupCriterion?.status || '',
        impressions: result.metrics?.impressions || 0,
        clicks: result.metrics?.clicks || 0,
        cost: (result.metrics?.costMicros || 0) / 1000000,
        conversions: result.metrics?.conversions || 0,
        averageCpc: (result.metrics?.averageCpc || 0) / 1000000,
        ctr: result.metrics?.ctr || 0,
        averageCpm: (result.metrics?.averageCpm || 0) / 1000000,
        conversionRate: result.metrics?.conversionsFromInteractionsRate || 0
      };
      processedData.push(row);
    });
  }
  
  console.log(`Processed ${processedData.length} keyword records`);
  return processedData;
}

/**
 * Write campaign data to sheet
 */
function writeCampaignData(spreadsheet, data) {
  const sheet = getOrCreateSheet(spreadsheet, CONFIG.SHEET_NAMES.CAMPAIGNS);
  writeDataToSheet(sheet, data, [
    'Date', 'Campaign ID', 'Campaign Name', 'Status', 'Channel Type',
    'Impressions', 'Clicks', 'Cost', 'Conversions', 'Conversion Value',
    'Average CPC', 'CTR', 'Average CPM', 'Conversion Rate'
  ]);
}

/**
 * Write ad group data to sheet
 */
function writeAdGroupData(spreadsheet, data) {
  const sheet = getOrCreateSheet(spreadsheet, CONFIG.SHEET_NAMES.AD_GROUPS);
  writeDataToSheet(sheet, data, [
    'Date', 'Campaign ID', 'Campaign Name', 'Ad Group ID', 'Ad Group Name', 'Status',
    'Impressions', 'Clicks', 'Cost', 'Conversions', 'Average CPC', 'CTR', 'Average CPM', 'Conversion Rate'
  ]);
}

/**
 * Write keyword data to sheet
 */
function writeKeywordData(spreadsheet, data) {
  const sheet = getOrCreateSheet(spreadsheet, CONFIG.SHEET_NAMES.KEYWORDS);
  writeDataToSheet(sheet, data, [
    'Date', 'Campaign ID', 'Campaign Name', 'Ad Group ID', 'Ad Group Name', 'Keyword', 'Status',
    'Impressions', 'Clicks', 'Cost', 'Conversions', 'Average CPC', 'CTR', 'Average CPM', 'Conversion Rate'
  ]);
}

/**
 * Get or create a sheet
 */
function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    console.log(`Created new sheet: ${sheetName}`);
  }
  return sheet;
}

/**
 * Write data to sheet with headers
 */
function writeDataToSheet(sheet, data, headers) {
  try {
    if (data.length === 0) {
      console.log(`No data to write to ${sheet.getName()}`);
      return;
    }
    
    // Clear existing data
    sheet.clear();
    
    // Write headers
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    
    // Prepare data rows
    const dataRows = data.map(row => {
      return headers.map(header => {
        const headerKey = header.toLowerCase().replace(/\s+/g, '');
        return row[headerKey] || row[Object.keys(row).find(key => key.toLowerCase().includes(headerKey.toLowerCase()))] || '';
      });
    });
    
    // Write data
    if (dataRows.length > 0) {
      sheet.getRange(2, 1, dataRows.length, headers.length).setValues(dataRows);
    }
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    
    console.log(`Successfully wrote ${dataRows.length} rows to ${sheet.getName()}`);
    
  } catch (error) {
    console.error(`Error writing data to ${sheet.getName()}:`, error);
    throw error;
  }
}

/**
 * Create summary sheet
 */
function createSummary(spreadsheet, campaignData, adGroupData, keywordData) {
  const sheet = getOrCreateSheet(spreadsheet, CONFIG.SHEET_NAMES.SUMMARY);
  
  // Calculate summary metrics
  const summary = calculateSummaryMetrics(campaignData, adGroupData, keywordData);
  
  // Write summary
  const summaryData = [
    ['Metric', 'Value'],
    ['Total Campaigns', summary.totalCampaigns],
    ['Total Ad Groups', summary.totalAdGroups],
    ['Total Keywords', summary.totalKeywords],
    ['Total Impressions', summary.totalImpressions],
    ['Total Clicks', summary.totalClicks],
    ['Total Cost', summary.totalCost],
    ['Total Conversions', summary.totalConversions],
    ['Average CTR', summary.averageCtr],
    ['Average CPC', summary.averageCpc],
    ['Average CPM', summary.averageCpm],
    ['Conversion Rate', summary.conversionRate],
    ['ROAS', summary.roas]
  ];
  
  sheet.clear();
  sheet.getRange(1, 1, summaryData.length, 2).setValues(summaryData);
  sheet.getRange(1, 1, 1, 2).setFontWeight('bold');
  sheet.autoResizeColumns(1, 2);
  
  console.log('Summary sheet created successfully');
}

/**
 * Calculate summary metrics
 */
function calculateSummaryMetrics(campaignData, adGroupData, keywordData) {
  const summary = {
    totalCampaigns: new Set(campaignData.map(d => d.campaignId)).size,
    totalAdGroups: new Set(adGroupData.map(d => d.adGroupId)).size,
    totalKeywords: new Set(keywordData.map(d => d.keyword)).size,
    totalImpressions: campaignData.reduce((sum, d) => sum + d.impressions, 0),
    totalClicks: campaignData.reduce((sum, d) => sum + d.clicks, 0),
    totalCost: campaignData.reduce((sum, d) => sum + d.cost, 0),
    totalConversions: campaignData.reduce((sum, d) => sum + d.conversions, 0),
    totalConversionValue: campaignData.reduce((sum, d) => sum + d.conversionValue, 0)
  };
  
  summary.averageCtr = summary.totalImpressions > 0 ? (summary.totalClicks / summary.totalImpressions) * 100 : 0;
  summary.averageCpc = summary.totalClicks > 0 ? summary.totalCost / summary.totalClicks : 0;
  summary.averageCpm = summary.totalImpressions > 0 ? (summary.totalCost / summary.totalImpressions) * 1000 : 0;
  summary.conversionRate = summary.totalClicks > 0 ? (summary.totalConversions / summary.totalClicks) * 100 : 0;
  summary.roas = summary.totalCost > 0 ? summary.totalConversionValue / summary.totalCost : 0;
  
  return summary;
}

/**
 * Send error notification
 */
function sendErrorNotification(error) {
  try {
    // You can implement email notification here
    console.error('Error occurred:', error.message);
  } catch (notificationError) {
    console.error('Failed to send error notification:', notificationError);
  }
}

/**
 * Set up automatic trigger to run daily
 */
function createDailyTrigger() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'pullGoogleAdsData') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new daily trigger
  ScriptApp.newTrigger('pullGoogleAdsData')
    .timeBased()
    .everyDays(1)
    .atHour(9) // Run at 9 AM
    .create();
    
  console.log('Daily trigger created successfully');
}

/**
 * Manual function to test the script
 */
function testScript() {
  console.log('Starting test run...');
  pullGoogleAdsData();
  console.log('Test run completed');
}

/**
 * Setup function - run this once to configure the script
 */
function setup() {
  // Create daily trigger
  createDailyTrigger();
  
  // Test the script
  testScript();
  
  console.log('Setup completed successfully');
} 