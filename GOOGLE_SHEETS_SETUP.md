# Backend Setup Guide: Google Sheets & Apps Script

To make the registration form work, you need to set up a Google Sheet to receive the data. This "serverless" approach keeps your site static and secure.

## Step 1: Create the Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a **New Spreadsheet**.
2. Name it something clear, like `CoNeJo 2026 Registrations`.
3. Rename the firstde tab (at the bottom) to `Registrations`.
4. Create the **Hear Row** (Row 1) with exactly these column names (order matters for clarity, but script scans by name usually, here we align with array):
   * **A1**: Timestamp
   * **B1**: First Name
   * **C1**: Last Name
   * **D1**: Email
   * **E1**: Position
   * **F1**: Affiliation
   * **G1**: Dietary
   * **H1**: Reimbursement Needed?
   * **I1**: Origin
   * **J1**: Estimated Cost
   * **K1**: File URL

## Step 2: Add the Code
1. In the spreadsheet, click on **Extensions** > **Apps Script** in the top menu.
2. A new tab will open with a code editor.
3. **Delete everything** currently in the editor (`function myFunction()...`).
4. **Copy and Paste** the following code exactly:

```javascript
/* 
  CONFIGURATION 
  - Change FOLDER_NAME if you want attachments stored elsewhere.
*/
const CONFIG = {
  FOLDER_NAME: "CoNeJo_Receipts", // Folder in Drive where uploads go
  SHEET_NAME: "Registrations"
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheetByName(CONFIG.SHEET_NAME);

    // Parse data. The frontend sends JSON text/plain to avoid CORS issues sometimes, 
    // so we parse postData.contents.
    const rawData = e.postData.contents;
    const data = JSON.parse(rawData);

    // Handle File Upload
    let fileUrl = "";
    if (data.fileContent && data.fileName) {
      fileUrl = saveFileToDrive(data.fileContent, data.fileName, data.mimeType, data.email);
    }

    // Prepare Row Data (adjust order to match your Sheet Step 1)
    // [Timestamp, First, Last, Email, Position, Affiliation, Dietary, Reimbursement?, Origin, Cost, File]
    const nextRow = sheet.getLastRow() + 1;
    const newRow = [
      new Date(), 
      data.firstName, 
      data.lastName, 
      data.email, 
      data.position,
      data.affiliation,
      data.dietary || "",
      data.needsReimbursement ? "YES" : "NO",
      data.origin || "",
      data.cost || "",
      fileUrl
    ];

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

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

function saveFileToDrive(base64Content, fileName, mimeType, userEmail) {
  try {
    // Decode
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Content), mimeType, fileName);
    
    // Find or Create Folder
    const folders = DriveApp.getFoldersByName(CONFIG.FOLDER_NAME);
    let folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(CONFIG.FOLDER_NAME);
    }
    
    // Create file
    // Prefix filename with email for safety
    const safeName = `${userEmail}_${fileName}`;
    blob.setName(safeName);
    const file = folder.createFile(blob);
    
    // Return URL
    return file.getUrl();
  } catch (e) {
    return "Error saving file: " + e.toString();
  }
}
```

## Step 3: Deploy as Web App (CRITICAL)
1. Click the blue **Deploy** button (top right) > **New deployment**.
2. Click the specific **gear icon** next to "Select type" > select **Web app**.
3. **Description**: "Registration API".
4. **Execute as**: `Me` (your email).
5. **Who has access**: `Anyone` (Important! This lets your website, accessed by anyone, talk to the script).
6. Click **Deploy**.
7. You might see a screen asking to **Authorize Access**. Click it, sign in, go to "Advanced" -> "Go to (Project Name) (unsafe)" -> "Allow".
   *(It says unsafe because you wrote it yourself just now, don't worry).*
8. **Copy** the `Web App URL` (it ends with `/exec`).

## Step 4: Update the Website
1. Open `assets/js/registration.js` in your VS Code.
2. Replace `PLACEHOLDER_URL_FROM_SETUP_GUIDE` (Line 2) with the URL you just copied.
3. Save the file.

Done! Your Static Site form is now live and working.
