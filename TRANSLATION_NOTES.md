# Swahili translation notes

The Swahili text was written to read as natural, professional Kiswahili (Tanzanian usage).
It has **not** been reviewed by a native-speaking specialist yet. Please ask one to read the
`/sw` pages and check the terms below.

Where the text lives:

- Interface and page copy: `messages/sw.json`
- Services, sectors, leadership, projects, photo descriptions: the `sw:` lines in `content/*.ts`
- News articles: `content/news/sw/*.mdx`

Run `npm run check:i18n` after editing `messages/*.json`. It confirms both languages have the same keys.

## Kept in English on purpose

| Item | Reason |
| --- | --- |
| Company name, people's names, honorifics (Dr., Eng., Adv.) | Proper nouns |
| Job titles, e.g. "Founder & Executive Director" | The brief asked for titles to stay unchanged. Suggested Swahili if wanted later: "Mwanzilishi na Mkurugenzi Mtendaji", "Mkurugenzi wa Uendeshaji na Uendelezaji wa Biashara", "Mkurugenzi wa Tabianchi, Nishati na Uendelevu", "Mkurugenzi wa Utawala, Uzingatiaji na Masuala ya Udhibiti" |
| Tagline inside the logo and share image ("We Are The Solution.") | Part of the artwork |
| WhatsApp, Google Maps, RSS | Product names |

## Terms to confirm

| English | Swahili used | Note |
| --- | --- | --- |
| We Are The Solution. (tagline in text) | Sisi Ndio Suluhisho. | Confirm the company is happy to translate the tagline at all |
| Environmental impact assessment (EIA) | Tathmini ya Athari kwa Mazingira (TAM) | Standard regulatory term; confirm the abbreviation TAM |
| Compliance | Uzingatiaji (wa sheria) | Alternative: "utekelezaji wa matakwa ya sheria" |
| Advocacy | Utetezi | Alternative: "uchechemuzi" |
| Compliance & Advocacy (service name) | Uzingatiaji wa Sheria na Utetezi | |
| Community Engagement | Ushirikishwaji wa Jamii | |
| Capacity Building | Kujenga Uwezo | |
| Partnerships & Collaboration | Ubia na Ushirikiano | |
| Natural Resource Protection | Ulinzi wa Maliasili | |
| Transport (sector) | Uchukuzi | Alternative: "Usafirishaji" |
| Mining (sector) | Madini | Alternative: "Uchimbaji Madini" |
| Climate strategy / climate policy | Mkakati wa tabianchi / Sera ya tabianchi | |
| Energy transition | Mpito wa Nishati | |
| Green development | Maendeleo ya Kijani | |
| Corporate governance | Utawala Bora wa Kampuni | |
| Regulatory strategy | Mkakati wa Udhibiti | Least certain term on the list |
| Risk management | Usimamizi wa Vihatarishi | Alternative: "usimamizi wa hatari" |
| Responsible investment | Uwekezaji unaowajibika | |
| Global leader | Kinara wa kimataifa | |
| Sustainable livelihoods | Njia endelevu za kujipatia kipato | |
| NGOs | Mashirika yasiyo ya kiserikali | |
| International partners | Wadau wa kimataifa | |
| Tailings | Mabaki ya uchenjuaji | Technical mining term |
| Waste rock | Mawe taka | Technical mining term |
| Runoff | Maji machafu yanayotiririka | |
| Habitat | Makazi ya viumbe | |
| Agrochemicals | Kemikali za kilimo | |
| News & insights | Habari na uchambuzi | |
| Projects & impact | Miradi na matokeo | |
| Field work | Kazi za uwandani | |
| Placeholder (label on unfinished content) | Maudhui ya muda | |
| Site visit | Ziara ya eneo la mradi | |
| Wharf | Gati | Used in photo descriptions |
| Crane | Winchi | Used in photo descriptions |
| Life jacket | Boya la kujiokolea | Used in photo descriptions |
| Safety vest | Kizibao cha usalama | Used in photo descriptions |
| Rapid transit buses | Mabasi ya mwendokasi | Used in a photo description |

## Style choices

- Leadership bios use verb forms without pronouns ("Hutoa uongozi...", "Huongoza..."), matching the
  gender-neutral English bios.
- Form messages use polite "Tafadhali ...".
- Dates are formatted by the browser's Swahili rules (for example "19 Novemba 2026").
- The six news articles (content/news/sw/) are translations of the client's English posts and need a native
  review before they are promoted. Names of organisations, events and the book title are kept in English.
