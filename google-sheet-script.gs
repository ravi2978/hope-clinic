/**
 * Hope Homeo Clinic — booking log.
 *
 * Paste this whole file into Extensions -> Apps Script on a Google Sheet,
 * then Deploy -> New deployment -> Web app, with:
 *   Execute as:      Me
 *   Who has access:  Anyone
 * Copy the /exec URL it gives you into assets/config.js as sheetEndpoint.
 * Full walkthrough: SETUP.md, step 3.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var data = JSON.parse(e.postData.contents);

    // Column order, written once on the empty sheet.
    var headers = ['Received', 'Name', 'Phone', 'Age', 'City', 'Concern', 'Preferred', 'Notes', 'Message'];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var stamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, HH:mm');
    sheet.appendRow(headers.map(function (h) {
      return h === 'Received' ? stamp : (data[h] || '');
    }));

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('Hope Homeo Clinic booking log is running.');
}
