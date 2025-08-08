/**
 * Google Ads Scripts Version - No Developer Token Required
 * This script runs directly in Google Ads Scripts and exports data to Google Sheets
 * 
 * Setup Instructions:
 * 1. Go to Google Ads Scripts: https://ads.google.com/um/Welcome/Home?subid=us-en-et-g-aw-a-googleads!o3~#Scripts
 * 2. Create a new script
 * 3. Copy this code into the script editor
 * 4. Update the SHEET_URL with your Google Sheets URL
 * 5. Save and run the script
 */

// Configuration - Update these values
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1Fm27WvBokQqP_qguexymNhCQnzGN4cXL_f6pnv82oPU/edit?usp=sharing';
const DATE_RANGE_DAYS = 30; // Number of days to pull data for

/**
 * Main function to pull Google Ads data and populate sheets
 */
function main() {
  try {
    console.log('Starting Google Ads data pull...');
    
    // Get the spreadsheet
    const spreadsheet = SpreadsheetApp.openByUrl(SHEET_URL);
    
    // Get date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - DATE_RANGE_DAYS);
    
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
    console.error('Error in main:', error);
    throw error;
  }
}

/**
 * Get campaign-level data
 */
function getCampaignData(startDate, endDate) {
  try {
    const campaignIterator = AdsApp.campaigns()
      .withCondition(`segments.date BETWEEN '${formatDate(startDate)}' AND '${formatDate(endDate)}'`)
      .withCondition("campaign.status != 'REMOVED'")
      .get();
    
    const campaignData = [];
    
    while (campaignIterator.hasNext()) {
      const campaign = campaignIterator.next();
      const stats = campaign.getStatsFor(startDate, endDate);
      
      const row = {
        date: formatDate(new Date()),
        campaignId: campaign.getId(),
        campaignName: campaign.getName(),
        status: campaign.getStatus(),
        channelType: campaign.getAdvertisingChannelType(),
        impressions: stats.getImpressions(),
        clicks: stats.getClicks(),
        cost: stats.getCost(),
        conversions: stats.getConversions(),
        conversionValue: stats.getConversionValue(),
        averageCpc: stats.getAverageCpc(),
        ctr: stats.getCtr(),
        averageCpm: stats.getAverageCpm(),
        conversionRate: stats.getConversionRate()
      };
      
      campaignData.push(row);
    }
    
    console.log(`Processed ${campaignData.length} campaign records`);
    return campaignData;
    
  } catch (error) {
    console.error('Error getting campaign data:', error);
    return [];
  }
}

/**
 * Get ad group-level data
 */
function getAdGroupData(startDate, endDate) {
  try {
    const adGroupIterator = AdsApp.adGroups()
      .withCondition(`segments.date BETWEEN '${formatDate(startDate)}' AND '${formatDate(endDate)}'`)
      .withCondition("ad_group.status != 'REMOVED'")
      .get();
    
    const adGroupData = [];
    
    while (adGroupIterator.hasNext()) {
      const adGroup = adGroupIterator.next();
      const campaign = adGroup.getCampaign();
      const stats = adGroup.getStatsFor(startDate, endDate);
      
      const row = {
        date: formatDate(new Date()),
        campaignId: campaign.getId(),
        campaignName: campaign.getName(),
        adGroupId: adGroup.getId(),
        adGroupName: adGroup.getName(),
        status: adGroup.getStatus(),
        impressions: stats.getImpressions(),
        clicks: stats.getClicks(),
        cost: stats.getCost(),
        conversions: stats.getConversions(),
        averageCpc: stats.getAverageCpc(),
        ctr: stats.getCtr(),
        averageCpm: stats.getAverageCpm(),
        conversionRate: stats.getConversionRate()
      };
      
      adGroupData.push(row);
    }
    
    console.log(`Processed ${adGroupData.length} ad group records`);
    return adGroupData;
    
  } catch (error) {
    console.error('Error getting ad group data:', error);
    return [];
  }
}

/**
 * Get keyword-level data
 */
function getKeywordData(startDate, endDate) {
  try {
    const keywordIterator = AdsApp.keywords()
      .withCondition(`segments.date BETWEEN '${formatDate(startDate)}' AND '${formatDate(endDate)}'`)
      .withCondition("ad_group_criterion.status != 'REMOVED'")
      .get();
    
    const keywordData = [];
    
    while (keywordIterator.hasNext()) {
      const keyword = keywordIterator.next();
      const adGroup = keyword.getAdGroup();
      const campaign = adGroup.getCampaign();
      const stats = keyword.getStatsFor(startDate, endDate);
      
      const row = {
        date: formatDate(new Date()),
        campaignId: campaign.getId(),
        campaignName: campaign.getName(),
        adGroupId: adGroup.getId(),
        adGroupName: adGroup.getName(),
        keyword: keyword.getText(),
        status: keyword.getStatus(),
        impressions: stats.getImpressions(),
        clicks: stats.getClicks(),
        cost: stats.getCost(),
        conversions: stats.getConversions(),
        averageCpc: stats.getAverageCpc(),
        ctr: stats.getCtr(),
        averageCpm: stats.getAverageCpm(),
        conversionRate: stats.getConversionRate()
      };
      
      keywordData.push(row);
    }
    
    console.log(`Processed ${keywordData.length} keyword records`);
    return keywordData;
    
  } catch (error) {
    console.error('Error getting keyword data:', error);
    return [];
  }
}

/**
 * Write campaign data to sheet
 */
function writeCampaignData(spreadsheet, data) {
  const sheet = getOrCreateSheet(spreadsheet, 'Campaign Data');
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
  const sheet = getOrCreateSheet(spreadsheet, 'Ad Group Data');
  writeDataToSheet(sheet, data, [
    'Date', 'Campaign ID', 'Campaign Name', 'Ad Group ID', 'Ad Group Name', 'Status',
    'Impressions', 'Clicks', 'Cost', 'Conversions', 'Average CPC', 'CTR', 'Average CPM', 'Conversion Rate'
  ]);
}

/**
 * Write keyword data to sheet
 */
function writeKeywordData(spreadsheet, data) {
  const sheet = getOrCreateSheet(spreadsheet, 'Keyword Data');
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
  const sheet = getOrCreateSheet(spreadsheet, 'Summary');
  
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
 * Format date for Google Ads API
 */
function formatDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

/**
 * Set up automatic trigger to run daily
 */
function createDailyTrigger() {
  // Note: Google Ads Scripts handles scheduling differently
  // You can set up scheduling in the Google Ads Scripts interface
  console.log('To set up daily scheduling:');
  console.log('1. Go to Google Ads Scripts');
  console.log('2. Click on your script');
  console.log('3. Click "Schedule"');
  console.log('4. Set it to run daily');
}

/**
 * Manual function to test the script
 */
function testScript() {
  console.log('Starting test run...');
  main();
  console.log('Test run completed');
} 