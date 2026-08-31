/* ============================================================
   Hope Homeo Clinic — the only file you need to edit to make
   appointment notifications work. Nothing else references keys.
   ============================================================ */
window.HHC_CONFIG = {

  /* 1. BOOKINGS -> your inbox and a spreadsheet.  ** required **
        A Google Apps Script running in the clinic's own Google
        account. It emails hopehomeoclinic15@gmail.com and adds a
        row to a sheet you own. Follow SETUP.md step 1, then paste
        the /exec web-app URL between the quotes below.          */
  sheetEndpoint: "",

  /* 2. Optional second email route via web3forms.com. Not needed
        if step 1 is done. The key is public by design, so it is
        safe here. SETUP.md step 2.                              */
  web3formsKey: "",

  /* 3. Clinic contact — used by the WhatsApp and call buttons.  */
  whatsapp: "917481908030",
  phone: "+917481908030",
  email: "hopehomeoclinic15@gmail.com",
};
