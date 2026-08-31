/**
 * Hope Homeo Clinic — booking log and email notification.
 *
 * Every appointment request and website enquiry is written to the sheet AND
 * emailed to the clinic. This runs inside the clinic's own Google account, so
 * it does not depend on any third-party form service.
 *
 * Paste this whole file into Extensions -> Apps Script on a Google Sheet,
 * then Deploy -> New deployment -> Web app, with:
 *   Execute as:      Me
 *   Who has access:  Anyone
 * Copy the /exec URL it gives you into assets/config.js as sheetEndpoint.
 * Full walkthrough: SETUP.md, step 1.
 */

var NOTIFY = 'hopehomeoclinic15@gmail.com';   // where notifications are sent
var HEADERS = ['Received', 'Name', 'Phone', 'Age', 'City', 'Concern', 'Preferred', 'Notes', 'Message'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var data = JSON.parse(e.postData.contents);
    var stamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, HH:mm');

    // 1. append to the sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    sheet.appendRow(HEADERS.map(function (h) {
      return h === 'Received' ? stamp : (data[h] || '');
    }));

    // 2. email the clinic
    notify(data, stamp);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function notify(data, stamp) {
  var isBooking = !!data.Concern;
  var who = data.Name || 'Someone';
  var subject = isBooking
    ? 'Appointment request — ' + who + ' (' + data.Concern + ')'
    : 'Website enquiry — ' + who;

  var rows = HEADERS.slice(1)
    .filter(function (h) { return data[h] && data[h] !== '—'; })
    .map(function (h) {
      return '<tr>' +
        '<td style="padding:7px 16px 7px 0;color:#6b6b66;font-size:13px;white-space:nowrap">' + h + '</td>' +
        '<td style="padding:7px 0;color:#23231F;font-size:15px;font-weight:600">' + esc(data[h]) + '</td></tr>';
    }).join('');

  var digits = String(data.Phone || '').replace(/\D/g, '');
  var body =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px">' +
      '<p style="color:#6b6b66;font-size:13px;margin:0 0 4px">' + stamp + '</p>' +
      '<h2 style="color:#2F3E64;font-size:20px;margin:0 0 16px">' + esc(subject) + '</h2>' +
      '<table style="border-collapse:collapse;width:100%">' + rows + '</table>' +
      (digits ? '<p style="margin:22px 0 0">' +
        '<a href="tel:+' + digits + '" style="background:#2F3E64;color:#fff;text-decoration:none;padding:11px 20px;font-weight:600;font-size:14px;display:inline-block">Call back</a>' +
        '&nbsp;&nbsp;' +
        '<a href="https://wa.me/' + digits + '" style="background:#25D366;color:#0b3d1f;text-decoration:none;padding:11px 20px;font-weight:600;font-size:14px;display:inline-block">WhatsApp</a>' +
        '</p>' : '') +
      '<p style="color:#8a8a84;font-size:12px;margin-top:24px">Sent from hopehomeoclinic.com</p>' +
    '</div>';

  MailApp.sendEmail({
    to: NOTIFY,
    subject: subject,
    htmlBody: body,
    name: 'Hope Homeo Clinic website',
    replyTo: NOTIFY,
  });
}

function esc(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput('Hope Homeo Clinic booking log is running.');
}

/** Run this once from the editor to check the sheet and email both work. */
function testNotification() {
  var stamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, HH:mm');
  notify({
    Name: 'Test Patient', Phone: '+91 9876543210', Age: '34',
    City: 'Purnea', Concern: 'Hair fall',
    Preferred: 'Any day this week · Morning', Notes: 'This is a test.',
  }, stamp);
  Logger.log('Test email sent to ' + NOTIFY);
}
