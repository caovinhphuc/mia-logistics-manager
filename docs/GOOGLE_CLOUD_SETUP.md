# Google Cloud Platform Setup Guide

## 🔧 Complete GCP Configuration for MIA Logistics Manager

### 1. Create Google Cloud Project

```bash
# Using gcloud CLI
gcloud projects create mia-logistics-prod --name="MIA Logistics Production"
gcloud config set project mia-logistics-prod

# Enable billing
gcloud beta billing projects link mia-logistics-prod \
  --billing-account=YOUR_BILLING_ACCOUNT_ID
```

### 2. Enable Required APIs

```bash
# Enable all required APIs
gcloud services enable sheets.googleapis.com
gcloud services enable drive.googleapis.com
gcloud services enable script.googleapis.com
gcloud services enable maps-backend.googleapis.com
gcloud services enable places-backend.googleapis.com
gcloud services enable directions-backend.googleapis.com
gcloud services enable distance-matrix-backend.googleapis.com
gcloud services enable geocoding-backend.googleapis.com
gcloud services enable geolocation.googleapis.com
```

### 3. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create mia-logistics-service \
  --display-name="MIA Logistics Service Account" \
  --description="Service account for MIA Logistics Manager"

# Get service account email
SA_EMAIL=$(gcloud iam service-accounts list \
  --filter="displayName:MIA Logistics Service Account" \
  --format="value(email)")

# Grant necessary roles
gcloud projects add-iam-policy-binding mia-logistics-prod \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/sheets.editor"

gcloud projects add-iam-policy-binding mia-logistics-prod \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/drive.file"

gcloud projects add-iam-policy-binding mia-logistics-prod \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/script.developer"

# Create and download key
gcloud iam service-accounts keys create credentials/service-account-key.json \
  --iam-account=$SA_EMAIL
```

### 4. Configure OAuth 2.0

```bash
# Create OAuth 2.0 client ID (Web application)
# This must be done through the Console UI
```

**Console Steps:**

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client ID**
3. Select **Web application**
4. Add authorized origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
   - `https://yourdomain.com/auth/google/callback`

### 5. API Key Configuration

```bash
# Create API key for Maps
gcloud alpha services api-keys create \
  --display-name="MIA Logistics Maps API Key"

# Get the API key
API_KEY=$(gcloud alpha services api-keys list \
  --filter="displayName:MIA Logistics Maps API Key" \
  --format="value(name)")

# Restrict API key to specific APIs
gcloud alpha services api-keys update $API_KEY \
  --api-target=maps-backend.googleapis.com \
  --api-target=places-backend.googleapis.com \
  --api-target=directions-backend.googleapis.com

# Restrict to specific websites (production)
gcloud alpha services api-keys update $API_KEY \
  --allowed-referrers="https://yourdomain.com/*"
```

### 6. Set API Quotas

```yaml
# Recommended quotas for production
Maps JavaScript API: 25,000 requests/day
Places API: 1,000 requests/day
Directions API: 2,500 requests/day
Distance Matrix API: 2,500 requests/day
Geocoding API: 2,500 requests/day
Google Sheets API: 100 requests/100 seconds/user
Google Drive API: 1,000 requests/100 seconds/user
```

### 7. Monitoring and Alerts

```bash
# Enable Cloud Monitoring
gcloud services enable monitoring.googleapis.com

# Create alerting policy for API quotas
gcloud alpha monitoring policies create \
  --policy-from-file=monitoring/api-quota-policy.yaml
```

**monitoring/api-quota-policy.yaml:**

```yaml
displayName: "API Quota Alert"
conditions:
  - displayName: "Maps API Quota"
    conditionThreshold:
      filter: 'resource.type="consumed_api" AND metric.type="serviceruntime.googleapis.com/api/request_count" AND resource.label.service="maps-backend.googleapis.com"'
      comparison: COMPARISON_GREATER_THAN
      thresholdValue: 20000
      duration: 300s
notificationChannels:
  - projects/mia-logistics-prod/notificationChannels/EMAIL_CHANNEL_ID
```

## 📊 Google Sheets Configuration

### 1. Create Main Spreadsheet

```javascript
// Apps Script to create spreadsheet structure
function createMIALogisticsSpreadsheet() {
  const ss = SpreadsheetApp.create('MIA Logistics Database');

  // Transport Requests Sheet (54 columns)
  const transportSheet = ss.insertSheet('Transport_Requests');
  const transportHeaders = [
    'ID', 'RequestDate', 'CustomerID', 'CustomerName', 'CustomerPhone',
    'CustomerEmail', 'OriginAddress', 'OriginLat', 'OriginLng', 'DestinationAddress',
    'DestinationLat', 'DestinationLng', 'CargoType', 'CargoWeight', 'CargoVolume',
    'CargoValue', 'VehicleType', 'DriverID', 'DriverName', 'VehicleID',
    'VehiclePlate', 'Status', 'Priority', 'ScheduledDate', 'ActualStartDate',
    'ActualEndDate', 'Distance', 'EstimatedCost', 'ActualCost', 'FuelCost',
    'TollCost', 'OtherCosts', 'PaymentMethod', 'PaymentStatus', 'Notes',
    'CreatedBy', 'CreatedAt', 'UpdatedBy', 'UpdatedAt', 'Route',
    'EstimatedDuration', 'ActualDuration', 'WeatherCondition', 'TrafficCondition', 'CustomerRating',
    'DriverRating', 'CompletionNotes', 'DocumentsUploaded', 'InsuranceInfo', 'SpecialInstructions',
    'ContactPerson', 'BackupDriver', 'EmergencyContact', 'ComplianceCheck'
  ];
  transportSheet.getRange(1, 1, 1, transportHeaders.length).setValues([transportHeaders]);

  // Set column widths and formatting
  transportSheet.setFrozenRows(1);
  transportSheet.getRange(1, 1, 1, transportHeaders.length)
    .setBackground('#1976d2')
    .setFontColor('white')
    .setFontWeight('bold');

  // Add data validation for Status column
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Pending', 'Confirmed', 'In Transit', 'Delivered', 'Cancelled'])
    .build();
  transportSheet.getRange(2, 22, 1000, 1).setDataValidation(statusRule);

  // Warehouse Inventory Sheet (67 columns)
  const warehouseSheet = ss.insertSheet('Warehouse_Inventory');
  // ... (similar setup for warehouse)

  // Continue for other sheets...

  Logger.log('Spreadsheet created: ' + ss.getUrl());
  return ss.getUrl();
}
```

### 2. Share Spreadsheet with Service Account

```javascript
function shareWithServiceAccount() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const serviceAccountEmail = 'mia-logistics-service@mia-logistics-prod.iam.gserviceaccount.com';

  // Share with edit permissions
  ss.addEditor(serviceAccountEmail);

  Logger.log('Shared with service account: ' + serviceAccountEmail);
}
```

### 3. Setup Data Validation and Protection

```javascript
function setupDataProtection() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Protect header rows
  const sheets = ss.getSheets();
  sheets.forEach(sheet => {
    const protection = sheet.getRange(1, 1, 1, sheet.getLastColumn()).protect();
    protection.setDescription('Header row - Do not edit');
    protection.removeEditors(protection.getEditors());
    protection.addEditor('admin@mialogistics.com');
  });

  // Setup conditional formatting for status
  const transportSheet = ss.getSheetByName('Transport_Requests');
  const statusRange = transportSheet.getRange(2, 22, 1000, 1);

  // Green for Delivered
  const deliveredRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Delivered')
    .setBackground('#4CAF50')
    .setFontColor('#FFFFFF')
    .setRanges([statusRange])
    .build();

  // Red for Cancelled
  const cancelledRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Cancelled')
    .setBackground('#F44336')
    .setFontColor('#FFFFFF')
    .setRanges([statusRange])
    .build();

  transportSheet.setConditionalFormatRules([deliveredRule, cancelledRule]);
}
```

## 🗂️ Google Drive Configuration

### 1. Create Folder Structure

```javascript
function createDriveFolderStructure() {
  // Create main folder
  const mainFolder = DriveApp.createFolder('MIA Logistics Files');

  // Create subfolders
  const folders = [
    'Transport Documents',
    'Warehouse Images',
    'Staff Documents',
    'Partner Contracts',
    'System Backups',
    'Invoice Templates',
    'Reports Archive',
    'Vehicle Documents',
    'Insurance Papers',
    'Compliance Records'
  ];

  folders.forEach(folderName => {
    mainFolder.createFolder(folderName);
  });

  // Share main folder with service account
  const serviceAccountEmail = 'mia-logistics-service@mia-logistics-prod.iam.gserviceaccount.com';
  mainFolder.addEditor(serviceAccountEmail);

  Logger.log('Main folder ID: ' + mainFolder.getId());
  Logger.log('Folder URL: ' + mainFolder.getUrl());

  return mainFolder.getId();
}
```

### 2. Setup File Organization

```javascript
function setupFileNamingConvention() {
  // File naming convention:
  // Transport: TR_YYYYMMDD_ID_TYPE.ext
  // Warehouse: WH_YYYYMMDD_ITEMCODE_TYPE.ext
  // Staff: ST_STAFFID_TYPE_YYYYMMDD.ext

  const namingRules = {
    transport: 'TR_{date}_{transportId}_{type}',
    warehouse: 'WH_{date}_{itemCode}_{type}',
    staff: 'ST_{staffId}_{type}_{date}',
    partner: 'PT_{partnerId}_{type}_{date}'
  };

  // Store naming rules in spreadsheet for reference
  const ss = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
  const configSheet = ss.insertSheet('File_Naming_Rules');

  Object.keys(namingRules).forEach((key, index) => {
    configSheet.getRange(index + 1, 1).setValue(key);
    configSheet.getRange(index + 1, 2).setValue(namingRules[key]);
  });
}
```

## 🚀 Apps Script Deployment

### 1. Create and Deploy Apps Script

```javascript
// Deploy configuration
function deployWebApp() {
  const scriptId = 'YOUR_APPS_SCRIPT_ID';

  // This would be done through the Apps Script interface
  // or using the Apps Script API

  const deploymentConfig = {
    versionNumber: 'HEAD',
    manifestFileName: 'appsscript',
    description: 'MIA Logistics Manager API v1.0'
  };

  Logger.log('Deploy configuration ready');
}
```

### 2. Setup Triggers

```javascript
function setupTriggers() {
  // Delete existing triggers
  ScriptApp.getProjectTriggers().forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });

  // Daily backup trigger
  ScriptApp.newTrigger('dailyBackup')
    .timeBased()
    .everyDays(1)
    .atHour(2) // 2 AM
    .create();

  // Hourly data sync trigger
  ScriptApp.newTrigger('syncData')
    .timeBased()
    .everyHours(1)
    .create();

  Logger.log('Triggers set up successfully');
}

function dailyBackup() {
  // Create daily backup of important data
  const ss = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
  const timestamp = Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMdd_HHmmss');

  // Create backup spreadsheet
  const backup = ss.copy('MIA_Logistics_Backup_' + timestamp);

  // Move to backup folder
  const backupFolder = DriveApp.getFolderById('BACKUP_FOLDER_ID');
  DriveApp.getFileById(backup.getId()).moveTo(backupFolder);

  Logger.log('Backup created: ' + backup.getUrl());
}
```

## 🔒 Security Configuration

### 1. API Security

```bash
# Restrict API keys by IP (for server-side calls)
gcloud alpha services api-keys update $API_KEY \
  --allowed-ips="YOUR_SERVER_IP/32"

# Restrict by HTTP referrer (for client-side calls)
gcloud alpha services api-keys update $API_KEY \
  --allowed-referrers="https://yourdomain.com/*,https://www.yourdomain.com/*"
```

### 2. OAuth Configuration

```json
{
  "web": {
    "client_id": "YOUR_CLIENT_ID",
    "project_id": "mia-logistics-prod",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uris": [
      "https://yourdomain.com/auth/google/callback"
    ],
    "javascript_origins": [
      "https://yourdomain.com"
    ]
  }
}
```

### 3. Service Account Security

```bash
# Rotate service account keys regularly
gcloud iam service-accounts keys create new-key.json \
  --iam-account=$SA_EMAIL

# Delete old keys
gcloud iam service-accounts keys delete OLD_KEY_ID \
  --iam-account=$SA_EMAIL
```

## 📊 Monitoring Setup

### 1. Cloud Monitoring Dashboard

```yaml
# dashboard-config.yaml
displayName: "MIA Logistics Monitoring"
widgets:
  - title: "API Requests"
    xyChart:
      dataSets:
        - timeSeriesQuery:
            filter: 'resource.type="consumed_api"'
            aggregation:
              alignmentPeriod: "60s"
              perSeriesAligner: "ALIGN_RATE"
  - title: "Error Rate"
    xyChart:
      dataSets:
        - timeSeriesQuery:
            filter: 'resource.type="consumed_api" AND metric.label.response_code_class="4xx"'
```

### 2. Logging Configuration

```javascript
// Enhanced logging for Apps Script
function logApiCall(functionName, parameters, result, duration) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    function: functionName,
    parameters: JSON.stringify(parameters),
    success: result.success,
    duration: duration,
    error: result.error || null
  };

  // Log to Stackdriver
  console.log(JSON.stringify(logEntry));

  // Also log to spreadsheet for analysis
  const logSheet = SpreadsheetApp.openById('LOG_SPREADSHEET_ID').getSheetByName('API_Logs');
  logSheet.appendRow([
    logEntry.timestamp,
    logEntry.function,
    logEntry.parameters,
    logEntry.success,
    logEntry.duration,
    logEntry.error
  ]);
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Quota Exceeded Errors**

   ```bash
   # Check quota usage
   gcloud logging read "protoPayload.methodName=SheetsService.BatchUpdate" \
     --limit=50 --format="table(timestamp,protoPayload.authenticationInfo.principalEmail)"
   ```

2. **Permission Denied**

   ```bash
   # Check service account permissions
   gcloud projects get-iam-policy mia-logistics-prod \
     --flatten="bindings[].members" \
     --filter="bindings.members:*mia-logistics-service*"
   ```

3. **API Key Issues**

   ```bash
   # Test API key
   curl "https://maps.googleapis.com/maps/api/geocode/json?address=Hanoi&key=YOUR_API_KEY"
   ```

### Support Resources

- **GCP Support**: <https://cloud.google.com/support>
- **Apps Script Help**: <https://developers.google.com/apps-script/support>
- **Community Forum**: <https://stackoverflow.com/questions/tagged/google-apps-script>
