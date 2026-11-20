# Content still needed from Ecosphere Solutions

Everything below is a placeholder or an assumption. Nothing here was invented as fact:
where real content is missing, the site says so on screen.

## Needed before launch
      Dr. Norga Komba and Eng. Ian Komba are in place. Eng. Ian's photo is small (420 px wide); a larger
      original would look sharper. Add files to the client folder, list them in `scripts/prepare-media.mjs`
      and set `photo` in `content/leadership.ts`.
- [ ] **Resend account and keys** for the contact form (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`).
- [ ] **Domain name** and, when ready, the **domain email** to replace `intecosphere.solutions@gmail.com`
      (`NEXT_PUBLIC_CONTACT_EMAIL` and `CONTACT_TO_EMAIL`).
- [ ] **Native-speaker review of the Swahili text** (see `TRANSLATION_NOTES.md`).

## Placeholders shown on the site
- [ ] **Service details.** The "What's included" list on each service page is hidden until the client supplies it
      (`included` in `content/services.ts`).
      Add real ones as `included` in `content/services.ts`.
- [ ] **Project case studies.** Hidden on `/projects` until real projects are supplied; the three entries in
      `content/projects.ts` are placeholders (title, sector, location, summary).
      Their photos are from the site-visit set and only show how a finished case study will look.
      Replace them in `content/projects.ts`. Do not publish clients, figures or results that are not confirmed.
- [x] **News articles.** Six real articles from the client (November 2026), with photos, in `content/news/`.
- [ ] **News: points to confirm.** Where the client's text and the photos disagreed, the photos were followed:
      the FOCAC Legal Forum is dated 10–11 July 2025 (the text said May 11-13; the badge, banner and podium say
      July), its text names Jordan University College (missing in the text; taken from the forum programme), and the
      Phewa Dialogue theme ends "and Governance" (the text said "Government"). The date of the meeting at the
      Communication University of China is not known, so that article shows no date.

## To confirm
- [ ] **EIA wording.** The copy mentions the environmental impact assessment (EIA) process because it is a
      target search phrase. Confirm the company offers this, and how it should be described.
- [ ] **Certifications and registrations** (for example NEMC registration). None are shown. Send any that
      should appear.
- [ ] **Which services apply to which sectors** (`sectors` in `content/services.ts`). Current mapping is a
      reasonable assumption.
- [ ] **Sector descriptions** on `/sectors` are general descriptions of each industry's environmental
      challenges, written for this site. Please review.
- [ ] **"How we work" step descriptions** (Assess, Advise, Implement, Comply & Sustain) were written for this site.
- [ ] **Leader bios** use the gender-neutral wording from the brief. The later version pasted in chat says "He" for
      Adv. Violet Mushi; confirm before any pronouns are added.
- [ ] **Map pin.** The Google Map searches for the street address. Confirm it lands on the right building, or
      send a Google Maps link to the office.
- [ ] **Partner and client logos.** None are shown.

## Photos and video
- [ ] The site photos used come from the client's folder. Photos showing other companies' logos (the wall with
      China Harbour, Inter-Consult and Inros Lackner, and the Nandhra safety board) were **not** used. Confirm
      whether permission exists to show them.
- [ ] Confirm that the people in the site photos and clips are happy to appear on the website.
- [ ] The three video clips are short and silent because the speech in the originals could not be checked.
      Full versions with sound can be added if the company approves the content.
- [ ] Landscape photographs are free stock images (see `IMAGE_CREDITS.md`). Replace with the company's own
      photography of its projects when available.
- [ ] Captions for gallery photos and titles for clips are generic. Real project names and dates would be better.
