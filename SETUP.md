# Setup — the five things only you can do

Work through these in order. Steps 1 and 5 matter most.
Nothing here needs a developer, and nothing costs money.

---

## 1. Make bookings arrive in your email (10 minutes) — **required**

Right now a patient can fill in the booking form, but the email
half of the delivery is switched off until you paste in a key.
(The WhatsApp button already works without any setup.)

1. Go to **https://web3forms.com**
2. Type `hopehomeoclinic15@gmail.com` in the box and press **Create Access Key**
3. Check that Gmail inbox — Web3Forms sends you an access key
   (a long code like `a1b2c3d4-e5f6-...`)
4. Open the file **`assets/config.js`** in this repository
5. Paste the key between the empty quotes on the `web3formsKey` line:

   ```js
   web3formsKey: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
   ```

6. Save, commit, push. Within a minute the live site starts emailing you
   every appointment request and every contact enquiry.

**Test it:** open your live `book.html`, submit a booking with your own
number, and check the inbox. The email arrives with the patient's name,
phone, age, city, concern, preferred date and slot, and their notes.

Free tier is 250 submissions/month — far more than this clinic will use.

---

## 2. Check the WhatsApp route (2 minutes)

No setup needed; confirm it behaves the way you want.

- Every page has a green WhatsApp button (bottom-right, on phones)
- After a patient submits the booking form, the confirmation screen shows
  **"Also send it on WhatsApp"** — tapping it opens *their* WhatsApp with
  the whole booking already typed out, addressed to +91 7481 908 030.
  They press send; it lands in your chat with their number attached.

Open `book.html` on your phone, submit a test booking, and tap the button.

---

## 3. Log every booking to a Google Sheet (15 minutes) — optional

Gives you a searchable list of enquiries instead of only an inbox.

1. Create a new sheet at **https://sheets.new**, name it `Hope Homeo Bookings`
2. **Extensions → Apps Script**
3. Delete whatever is in the editor and paste the whole contents of
   **`google-sheet-script.gs`** (in this repository)
4. **Deploy → New deployment** → gear icon → **Web app**
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**  ← must be "Anyone", or the site cannot post to it
5. **Deploy**, authorise when Google asks, then copy the **Web app URL**
   (it ends in `/exec`)
6. Paste it into `assets/config.js` on the `sheetEndpoint` line:

   ```js
   sheetEndpoint: "https://script.google.com/macros/s/AKfy.../exec",
   ```

7. Save, commit, push.

---

## 4. Point your domain at the site (once you have bought it)

GitHub Pages serves the site free on your own domain, with HTTPS.

1. In the repository: **Settings → Pages → Custom domain**, type the domain,
   **Save**. Tick **Enforce HTTPS** once it becomes available (up to 24 h).
2. At your registrar (GoDaddy, Namecheap, BigRock, Hostinger…), add these
   DNS records — replace `USERNAME` with your GitHub username:

   | Type  | Name  | Value                     |
   |-------|-------|---------------------------|
   | A     | `@`   | `185.199.108.153`         |
   | A     | `@`   | `185.199.109.153`         |
   | A     | `@`   | `185.199.110.153`         |
   | A     | `@`   | `185.199.111.153`         |
   | CNAME | `www` | `USERNAME.github.io.`     |

3. DNS takes 15 minutes to a few hours.
4. **Then tell me the domain** — the `<link rel="canonical">` tags,
   `sitemap.xml` and the structured data still say
   `hopehomeoclinic.github.io`. They must be changed to the real domain or
   Google will keep indexing the old address. It is a one-line change and
   a rebuild.

---

## 5. Put the clinic on Google Maps (20 minutes) — **the highest-value step**

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

- **Consultation fee ₹200** appears on `book.html` and `fees.html`. It is
  not printed on the visiting card — confirm it is correct.
- **Patient testimonials** on the home page describe specific outcomes
  (rheumatoid arthritis, ringworm, alopecia, kidney stones, PCOD). The
  original design notes call them written examples rather than real
  quotes. If they are not from real patients who agreed to be quoted,
  they should be removed or replaced — India's Drugs & Magic Remedies
  (Objectionable Advertisements) Act restricts advertised cure claims,
  and invented testimonials would be a real problem for the clinic.
  **Tell me which they are and I will handle it.**
- **Research citations** on `remedies.html` are still bracketed
  placeholders like `[Review title — to be filled]` and `[Journal]`.
  Either supply the real references or the placeholders should come out.
- **Clinic photograph** on `about.html` is a branded placeholder. Drop a
  real photo in as `assets/clinic.png` and tell me — it is a one-line swap.
