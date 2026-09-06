# Centralized Submissions Sheet — Setup (5 minutes)

Every contact-form submission can be appended to a single Google Sheet. Once set up, **the temple admin can open this one sheet and see every devotee message ever submitted**, plus name, email, phone, timestamp, and reference ID.

## 1. Create the sheet
1. Open [sheets.new](https://sheets.new).
2. Name it `Shanta Malleshwara — Contact Submissions`.
3. In **row 1**, add these column headers exactly:
   `Reference | Submitted | Name | Email | Phone | Message | Origin`

## 2. Add the Apps Script
1. In the sheet, go to **Extensions → Apps Script**.
2. Replace the placeholder code with:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data.ref || '',
      data.submittedAt || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.message || '',
      data.origin || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Deploy → New deployment**.
4. Choose type **Web app**.
5. Settings:
   - **Execute as**: *Me*
   - **Who has access**: *Anyone*
6. Click **Deploy**. Authorize when Google asks.
7. Copy the **Web app URL** (ends in `/exec`).

## 3. Paste it into the site
Open `components/contact-service.jsx` and update:

```javascript
const SHEETS_ENDPOINT = 'PASTE_YOUR_URL_HERE/exec';
```

Save. From the next submission onward, every entry will:
- 📧 Email `trigmatic07@gmail.com` via **Formspree** (form id `mbdbzvdk`)
- 📊 Append a new row to your central sheet
- 💾 Be logged locally as a safety net

## 4. Verify it's working
- Submit a test message from the contact form.
- Within seconds you should see:
  1. A success message with a reference ID on the page.
  2. A new row in your Google Sheet.
  3. An email in `trigmatic07@gmail.com`.
- Press `Ctrl+Shift+L` on the site any time to open the **admin log viewer** with a CSV export.

## Notes
- Formspree (free tier) handles 50 submissions/month with reply-to + spam filtering out of the box; upgrade in the dashboard if the temple receives more volume.
- Google Apps Script web apps are free with very generous quotas (~20,000 calls/day).
- All submissions are also stored in the browser's localStorage as a third redundancy — visible via the admin viewer.
