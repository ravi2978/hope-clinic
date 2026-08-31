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

| URL | File | Page |
|---|---|---|
| `/` | `index.html` | Home — hero, specialities, doctor, process, testimonials, map |
| `/about` | `about/index.html` | About Dr. Kumari and what homoeopathy is |
| `/treatments` | `treatments/index.html` | Eight conditions the clinic sees most |
| `/diet-charts` | `diet-charts/index.html` | Nine diet charts patients can follow at home |
| `/remedies` | `remedies/index.html` | Common remedies and research notes |
| `/book` | `book/index.html` | Appointment request form |
| `/fees` | `fees/index.html` | Fees, weekly timings, FAQ |
| `/contact` | `contact/index.html` | Address, directions, map, enquiry form |

Each page is its own directory containing an `index.html`, which is what gives
the clean addresses — `hopehomeoclinic.com/about`, not `/about.html`. Every
static host serves it this way, so the site is not tied to GitHub Pages.

Links between pages and to `assets/` are **relative**, never absolute, so the
same files work unchanged at the live domain and at `ravi2978.github.io/hope-clinic/`.
Do not change them to start with `/`.

Deep links work too, e.g. `/treatments#pcod`, `/diet-charts#thyroid`,
`/fees#faq`.

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
| Page text | that page's `index.html` |

Contact details appear in the header and footer of every page, so a phone
number change means find-and-replace across all eight `index.html` files.

## Layout

```
index.html                  home page, served at /
about/index.html            served at /about
treatments/index.html       served at /treatments
diet-charts/  remedies/     …and so on for every page
book/  fees/  contact/
assets/                     logos, portrait, visiting card, site.css, site.js, config.js
design-source/              original Claude Design canvas artboards (not served)
uploads/                    original supplied artwork
sitemap.xml, robots.txt     for search engines
.nojekyll                   tells GitHub Pages to serve files as-is
```

`design-source/` is kept for reference only. The live site does not read
from it, and nothing there needs to be edited to change the website.

## Hosting

Live at **https://hopehomeoclinic.com** — GitHub Pages, from `main` / `(root)`,
with the domain registered at Namecheap. `www` redirects to the apex, and the
`CNAME` file in this repository is what binds the domain: do not delete it.
Any other static host would serve these files unchanged.

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
