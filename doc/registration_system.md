# CNJ 2026 Registration System Documentation

This document explicitly details the architecture, setup, and maintenance of the registration system for the CNJ 2026 event.

## 1. System Architecture
The system uses a **Serverless Architecture** to handle registrations without a traditional backend server.
*   **Frontend**: Static HTML/CSS/JS hosted on GitHub Pages.
*   **Backend**: Google Apps Script (GAS) acting as an API.
*   **Database**: Google Sheets.
*   **File Storage**: Google Drive.
*   **Email Service**: Gmail (via GAS `MailApp`).

## 2. Frontend Implementation

### Core Files
*   **`events/cnj-register.html`**: The registration form. Contains custom CSS for the autocomplete dropdown and file input.
*   **`assets/js/registration.js`**: Handles:
    *   Form validation (on submit).
    *   Intelligent Autocomplete logic (Fuzzy search).
    *   Data transmission (`fetch` POST request) to Google Apps Script.
*   **`assets/js/institutions.js`**: Database of universities and research centers used by the autocomplete feature.

### Key Features
*   **Intelligent Autocomplete**:
    *   Located in `registration.js` (function `findMatches`).
    *   Uses **Levenshtein Distance** and token-based matching to find institutions even with typos (e.g., "Univdeersry").
    *   Mapping: `institutions.js` maps keywords (e.g., "CNR", "Padova") to official names.
*   **Validation**: Errors are shown only after a failed submission attempt.
*   **File Upload**: Files are converted to Base64 in the browser before sending.

## 3. Backend (Google Apps Script)

### Setup Instructions
1.  Create a **Google Sheet**.
2.  Go to **Extensions > Apps Script**.
3.  Paste the code below into `Code.gs` (or `Registration.gs`).

### The Backend Code (`Registration.gs`)
```javascript
/* 
  CONFIGURATION - CNJ 2026 Registration Backend
  Spreadsheet ID configured for: CNJ 2026 Registrations
*/
const CONFIG = {
  SPREADSHEET_ID: "1-No9wPRUgJE5qmTpwGdpSlKhqaeTx5g_UpQNNfKNVuc", 
  FOLDER_NAME: "CNJ_Receipts",
  SHEET_NAME: "Registrations"
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // 1. Connect to Spreadsheet
    const doc = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = doc.getSheetByName(CONFIG.SHEET_NAME);

    // 2. Parse Data
    const rawData = e.postData.contents;
    const data = JSON.parse(rawData);

    // 3. Save to Sheet
    // Columns: A=Timestamp, B=First, C=Last, D=Email, E=Affiliation
    const nextRow = sheet.getLastRow() + 1;
    const newRow = [
      new Date(), 
      data.firstName, 
      data.lastName, 
      data.email, 
      data.affiliation
    ];
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    // 4. Send Confirmation Email
    try {
      const emailBody = "Dear " + data.firstName + ",\n\n" +
        "Thank you for registering for CNJ: Consciousness - A Neuroscience Journey.\n\n" +
        "Event Details:\n" +
        "Date: March 25, 2026\n" +
        "Time: 10:00 - 16:00\n" +
        "Venue: Fondazione Ricerca Biomedica Avanzata VIMM\n" +
        "Via Giuseppe Orus 2, Seminar Room, Padova, Italy\n\n" +
        "We look forward to seeing you!\n\n" +
        "Best regards,\n" +
        "The AWARENET Team";
      
      MailApp.sendEmail({
        to: data.email,
        subject: "Registration Confirmed - CNJ 2026",
        body: emailBody
      });
    } catch(emailError) {
      console.log("Email send error: " + emailError);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success", "message": "Row added" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

### Deployment (Critical)
Every time you modify the Apps Script code, you **MUST** create a new version:
1.  Click **Deploy** -> **Manage deployments**.
2.  Click **Edit** (Pencil icon).
3.  **Version**: Select **New version**.
4.  Click **Deploy**.
5.  **Copy the Web App URL** and update `SCRIPT_URL` in `assets/js/registration.js`.

**Permissions**:
*   **Execute as**: Me (your email).
*   **Who has access**: Anyone.

## 4. Maintenance & Troubleshooting

### Updating Institutions
To add new universities, edit `assets/js/institutions.js`. No backend deployment needed.

### "Email Body Empty" Issue
If emails arrive empty or data is missing in the Sheet:
1.  Check that the **frontend** `registration.js` has the correct field names matching `doPost` (e.g., `firstName`, `email`).
2.  Ensure you have **Redeployed** the Apps Script as a "New version". Saving the script file is not enough.

### CORS Errors
The script uses `Content-Type: text/plain` for the request header to avoid complex CORS preflight checks. The backend parses the JSON manually. **Do not change this** unless you configure comprehensive CORS handling server-side.
