# Hope Homeo Clinic — original design handoff

> Archived. These `.dc.html` files are the original Claude Design canvas
> artboards the live site was generated from. The site now served from the
> repository root is plain static HTML and does not depend on them.
> Kept for reference and for reworking the design later.

Static, self-contained pages. Each page is one file that opens in a browser; navigation is plain `<a href>` links, so any host (Netlify, Vercel, Hostinger, Apache) serves it as-is.

## Pages

| File | Page | Notes |
|---|---|---|
| `index.dc.html` | Home | Hero, specialities, doctor, process, testimonials, map |
| `about.dc.html` | About | Doctor bio, what homoeopathy is, credentials, logo drop slot |
| `treatments.dc.html` | Treatments | 8 conditions, each an anchor: `#hair-fall`, `#pcod`, `#menstrual`, `#piles`, `#kidney-stone`, `#joint-pain`, `#skin`, `#child-health` |
| `diet-charts.dc.html` | Diet charts | 9 charts, anchors: `#hair-fall`, `#pcod`, `#piles`, `#kidney-stone`, `#arthritis`, `#skin`, `#acidity`, `#thyroid`, `#medicine-rules` |
| `remedies.dc.html` | Remedies & research | 10 remedies + citation placeholders |
| `book.dc.html` | Book appointment | Working client-side form with validation and success state |
| `fees.dc.html` | Fees & timings | Fee table, weekly hours, FAQ at `#faq` |
| `contact.dc.html` | Contact | Address, directions, enquiry form |
| `SiteHeader.dc.html` | Shared header | Edit once, applies to every page |
| `SiteFooter.dc.html` | Shared footer | Edit once, applies to every page |

## Backend work to wire up

> All three items below are now done in the generated site. See `SETUP.md`.

**1. Appointment form — `book.dc.html`**
Field names already set: `name`, `phone`, `age`, `city`, `concern`, `date`, `notes`. Slot is component state (`Morning` / `Midday` / `Afternoon`).
Currently `onSubmit` validates that the phone has 10 digits, then renders the success card locally. Replace the body of `onSubmit` in the logic class with a `POST` to your endpoint, keep the same success/error states.
Suggested: `POST /api/appointments` → store, then send the clinic a WhatsApp or SMS notification and reply `{ ok: true, id }`.

**2. Enquiry form — `contact.dc.html`**
Fields: `name`, `phone`, `message`. Same pattern — `POST /api/enquiries`.

**3. Photos**
The doctor portrait is real (`assets/doctor-portrait.png`, used on home and About). Remaining placeholder: one clinic photo on About. For production, replace each `<image-slot>` with a plain `<img src="...">` pointing at the real file.

**4. Maps**
Both maps are live Google Maps embeds (no API key needed), and every "Get directions" link opens the clinic's own Google Maps short link `https://maps.app.goo.gl/cbJ5e2ap1pZY3Nk4A` in a new tab. If you want an exact pin rather than an address search, replace the iframe `src` query with `q=<lat>,<lng>`.

**5. Content still to supply**
- Logo supplied and in use: `assets/logo-gold.png` (also `logo-cream.png`, `logo-navy.png`, `logo-white.png` — recoloured from the original transparent PNG).
- Confirm the ₹200 consultation fee — not printed on the visiting card
- Research citations on `remedies.dc.html` are bracketed placeholders
- Testimonials on the home page are written examples, not real patient quotes

## Clinic details used throughout

- Dr. Chandani Kumari, Homoeopathic Physician, B.H.M.S. (B.U.), Reg. No. 36342
- Hope Homeo Clinic, Jhanda Chowk, Khazanchi Road, Purnea – 854301, Bihar
- +91 7481 908 030 (phone and WhatsApp) · hopehomeoclinic15@gmail.com
- Monday to Saturday, 10:00 am – 5:00 pm. Sunday closed.
- Specialities: hair fall, P.C.O.D., menstrual problems, piles, kidney stone, joint pain, skin conditions, child health

## Design tokens

Navy `#2F3E64` · gold `#B0863C` · teal `#0E6B54` · cream `#F8F4EB` · white `#FFFFFF` · ink `#23231F`
Display type: Newsreader. UI and body: Manrope. Hindi: Noto Sans Devanagari.
Layout: content capped at 1280px, gutters `clamp(18px, 4vw, 48px)`, fluid type via `clamp()` — no breakpoints needed.
