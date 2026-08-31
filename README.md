# Hope Homeo Clinic — website

Static website for Hope Homeo Clinic, Jhanda Chowk, Khazanchi Road,
Purnea – 854301, Bihar. Dr. Chandani Kumari, B.H.M.S. (B.U.), Reg. No. 36342.

Plain HTML and CSS. No build step, no framework, no npm install, nothing to
compile. Open any `.html` file in a browser and it works.

## → Read [SETUP.md](SETUP.md) first

Five things only you can do: switch on booking emails, log bookings to a
Google Sheet, point your domain here, and — most valuable of all —
register the clinic on Google Maps.

## Pages

| File | Page |
|---|---|
| `index.html` | Home — hero, specialities, doctor, process, testimonials, map |
| `about.html` | About Dr. Kumari and what homoeopathy is |
| `treatments.html` | Eight conditions the clinic sees most |
| `diet-charts.html` | Nine diet charts patients can follow at home |
| `remedies.html` | Common remedies and research notes |
| `book.html` | Appointment request form |
| `fees.html` | Fees, weekly timings, FAQ |
| `contact.html` | Address, directions, map, enquiry form |

Deep links work too, e.g. `treatments.html#pcod`, `diet-charts.html#thyroid`,
`fees.html#faq`.

## What happens when someone books

1. The form checks there is a name and a 10-digit phone number.
2. It emails the details to `hopehomeoclinic15@gmail.com` via Web3Forms.
3. If a Google Sheet endpoint is configured, it also appends a row.
4. The patient sees a confirmation with everything they entered, and a
   **Send on WhatsApp** button that opens their WhatsApp with the booking
   pre-typed to +91 7481 908 030.

If the email key is not configured, or the network call fails, the
confirmation makes WhatsApp the primary action instead — so a booking is
never silently lost.

## Editing

| To change | Edit |
|---|---|
| Booking notifications, phone, WhatsApp number | `assets/config.js` |
| Colours, spacing, hover, mobile nav, map card | `assets/site.css` |
| Form behaviour, validation, menu | `assets/site.js` |
| Page text | the `.html` file itself |

Contact details appear in the header and footer of every page, so a phone
number change means find-and-replace across all eight files.

## Layout

```
index.html … contact.html   the site
assets/                     logos, portrait, visiting card, site.css, site.js, config.js
design-source/              original Claude Design canvas artboards (not served)
uploads/                    original supplied artwork
sitemap.xml, robots.txt     for search engines
.nojekyll                   tells GitHub Pages to serve files as-is
```

`design-source/` is kept for reference only. The live site does not read
from it, and nothing there needs to be edited to change the website.

## Hosting

Any static host serves this. On GitHub Pages: **Settings → Pages → Deploy
from a branch → `main` / `(root)`**.

## Details used throughout

- Dr. Chandani Kumari, Homoeopathic Physician, B.H.M.S. (B.U.), Reg. No. 36342
- Jhanda Chowk, Khazanchi Road, Purnea – 854301, Bihar
- +91 7481 908 030 (phone and WhatsApp) · hopehomeoclinic15@gmail.com
- Monday to Saturday, 10:00 am – 5:00 pm. Sunday closed.
- Map pin: 25.777687, 87.486572

## Design

Navy `#2F3E64` · gold `#B0863C` · teal `#0E6B54` · cream `#F8F4EB` · ink `#23231F`
Newsreader for display, Manrope for body, Noto Sans Devanagari for Hindi.
Content capped at 1280px with `clamp()` gutters and fluid type; the navigation
collapses to a menu button below 900px.
