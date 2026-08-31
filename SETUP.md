# Setup — the five things only you can do

Work through these in order. Steps 1 and 5 matter most.
Nothing here needs a developer, and nothing costs money.

---

## 1. Make bookings reach you (20 minutes) — **required**

Right now a patient can fill in the booking form, but only the WhatsApp
button actually delivers it. This step makes every request email you
automatically, and log itself to a spreadsheet, whether or not the patient
taps WhatsApp.

This runs entirely inside your own Google account. No third-party form
service, nothing to sign up for, no monthly limit to run out of.

1. Create a new sheet at **https://sheets.new**, name it `Hope Homeo Bookings`
2. **Extensions → Apps Script**
3. Delete whatever is in the editor and paste the whole contents of
   **`google-sheet-script.gs`** from this repository
4. Press **Save**, then in the function dropdown at the top pick
   **`testNotification`** and press **Run**. Google will ask you to authorise
   it — click through *Advanced → Go to (project name)* if it warns about an
   unverified app; it is your own script.
   **Check `hopehomeoclinic15@gmail.com` — a test booking email should arrive.**
   If it does, the hard part is done.
5. **Deploy → New deployment** → gear icon → **Web app**
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**  ← must be "Anyone", or the website cannot post to it
6. **Deploy**, then copy the **Web app URL** (it ends in `/exec`)
7. Open **`assets/config.js`** in this repository and paste it in:

   ```js
   sheetEndpoint: "https://script.google.com/macros/s/AKfy.../exec",
   ```

8. Save, commit, push. Within a minute the live site starts emailing you
   every appointment request and logging it to the sheet.

**Test it:** open https://hopehomeoclinic.com/book, submit a booking with
your own number, and check both the inbox and the spreadsheet.

Every notification email has **Call back** and **WhatsApp** buttons wired to
the patient's number, so you can reply straight from your phone.

---

## 2. Email via Web3Forms — optional second route

`assets/config.js` also has a `web3formsKey` line. It is a belt-and-braces
alternative to step 1, not a replacement.

Get a free key at **https://web3forms.com** by entering
`hopehomeoclinic15@gmail.com`; they email you an access key to paste in.
The key is public by design — Web3Forms' own documentation says it is safe
to expose in the page — so it is fine to commit.

Worth knowing: the free plan only accepts requests from real browsers, and
it could not be verified end to end from outside one. Step 1 has no such
restriction and is the route to trust. Leave this blank if you prefer.

---

## 3. Check the WhatsApp route (2 minutes)

No setup needed; confirm it behaves the way you want.

- Every page has a green WhatsApp button (bottom-right, on phones)
- After a patient submits the booking form, the confirmation screen shows
  **"Also send it on WhatsApp"** — tapping it opens *their* WhatsApp with
  the whole booking already typed out, addressed to +91 7481 908 030.
  They press send; it lands in your chat with their number attached.

Open https://hopehomeoclinic.com/book on your phone, submit a test booking,
and tap the button.

---

## 4. Domain — done

The site is live at **https://hopehomeoclinic.com**, and
`www.hopehomeoclinic.com` redirects to it. Recorded here in case it ever
needs rebuilding.

Namecheap **Domain List -> Manage -> Advanced DNS -> Host Records**:

| Type  | Host  | Value                 |
|-------|-------|-----------------------|
| A     | `@`   | `185.199.108.153`     |
| A     | `@`   | `185.199.109.153`     |
| A     | `@`   | `185.199.110.153`     |
| A     | `@`   | `185.199.111.153`     |
| CNAME | `www` | `ravi2978.github.io.` |

GitHub: **Settings -> Pages**, source `main` / `(root)`, custom domain
`hopehomeoclinic.com`, **Enforce HTTPS** ticked. The `CNAME` file in the
repository root holds the domain — deleting it unbinds the site.

Certificate is Let's Encrypt, renewed by GitHub automatically.

---

## 5. Put the clinic on Google Maps (20 minutes) — **the highest-value step**

> Everything to paste into the form — name, categories, description,
> services, hours, photo checklist — is written out in
> **`google-business-profile.md`** in this repository. Open that alongside
> this step.

The map on the site is pinned to your exact location
(25.777687, 87.486572 — on Khazanchi Road, beside Khazanchi Hat) and is
labelled "Hope Homeo Clinic" by a card the site draws itself.

But inside Google Maps and Google Search the pin is still just coordinates,
because **Hope Homeo Clinic is not registered as a business with Google.**
Until it is, someone searching "homeopathy doctor near me" in Purnea will
not find the clinic — and that is where most patients look first. The
website cannot fix this from the outside. Registration is free.

1. Go to **https://business.google.com** and sign in with
   `hopehomeoclinic15@gmail.com`
2. **Add your business** → name it exactly **Hope Homeo Clinic**
3. Category: **Homeopath** (add **Alternative medicine practitioner** as a
   second category)
4. Address: `Jhanda Chowk, Khazanchi Road, Purnea, Bihar 854301`
   — when it shows the map, **drag the pin to the exact clinic door**
5. Phone `+91 7481 908 030`, website: your domain once you have it
6. Hours: **Monday–Saturday 10:00–17:00, Sunday closed**
7. Verification: Google posts a **postcard with a code** to the clinic
   (usually 5–14 days in Bihar), or sometimes offers phone/video. Enter the
   code when it arrives — the listing is not live until you do.
8. After it goes live, add photos: the clinic board, the entrance, the
   consulting room, Dr. Kumari. Listings with photos get far more calls.

Once verified, "Hope Homeo Clinic" appears by name in Google Maps and in
Search, with your hours, phone and a directions button — and the pin on
this website will show the clinic's real name too, automatically.

---

## Things worth confirming before you share the site widely

- **Consultation fee ₹200** appears on `/book` and `/fees`. It is
  not printed on the visiting card — confirm it is correct.
- **Patient testimonials** on the home page describe specific outcomes
  (rheumatoid arthritis, ringworm, alopecia, kidney stones, PCOD). The
  original design notes call them written examples rather than real
  quotes. If they are not from real patients who agreed to be quoted,
  they should be removed or replaced — India's Drugs & Magic Remedies
  (Objectionable Advertisements) Act restricts advertised cure claims,
  and invented testimonials would be a real problem for the clinic.
  **Tell me which they are and I will handle it.**
- **Research citations** on `/remedies` are still bracketed
  placeholders like `[Review title — to be filled]` and `[Journal]`.
  Either supply the real references or the placeholders should come out.
- **Clinic photograph** on `/about` is a branded placeholder. Drop a
  real photo in as `assets/clinic.png` and tell me — it is a one-line swap.
