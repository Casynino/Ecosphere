import { photos, stock, type Photo } from './media';
import type { Localized, SectorSlug } from './types';

export type Service = {
  slug: string;
  image: Photo;
  /** A few words, shown on small cards. */
  tagline: Localized;
  title: Localized;
  /** One line, shown on cards and used as the search description. */
  summary: Localized;
  /** Opening paragraph of the service page. */
  intro: Localized;
  /**
   * "What's included" bullets. While this is null the page shows clearly
   * labelled placeholder bullets. Replace with real items, for example:
   * included: { en: ['First item', 'Second item'], sw: ['...', '...'] }
   */
  included: Localized<string[]> | null;
  /** Sectors this service applies to (to be confirmed by the client). */
  sectors: SectorSlug[];
};

const allSectors: SectorSlug[] = ['mining', 'oil-gas', 'agriculture', 'transport'];

export const services: Service[] = [
  {
    slug: 'environmental-conservation',
    image: stock.forestCanopy,
    tagline: { en: 'Mitigating environmental pollution', sw: 'Kupunguza uchafuzi wa mazingira' },
    title: { en: 'Environmental Conservation', sw: 'Uhifadhi wa Mazingira' },
    summary: {
      en: 'Strategies to mitigate environmental pollution across mining, oil and gas, agriculture and transportation.',
      sw: 'Mikakati ya kupunguza uchafuzi wa mazingira katika sekta za madini, mafuta na gesi, kilimo na uchukuzi.',
    },
    intro: {
      en: 'We design and apply strategies that reduce environmental pollution across mining, oil and gas, agriculture and transportation, so that projects can grow without degrading the land, water and air around them.',
      sw: 'Tunabuni na kutekeleza mikakati inayopunguza uchafuzi wa mazingira katika sekta za madini, mafuta na gesi, kilimo na uchukuzi, ili miradi ikue bila kuharibu ardhi, maji na hewa inayoizunguka.',
    },
    included: null,
    sectors: allSectors,
  },
  {
    slug: 'natural-resource-protection',
    image: stock.mangroveAerial,
    tagline: { en: 'Responsible use of natural resources', sw: 'Matumizi ya maliasili kwa uwajibikaji' },
    title: { en: 'Natural Resource Protection', sw: 'Ulinzi wa Maliasili' },
    summary: {
      en: 'Promoting responsible extraction and use of natural resources for long-term environmental and economic sustainability.',
      sw: 'Kuhimiza uvunaji na matumizi ya maliasili kwa uwajibikaji kwa ajili ya uendelevu wa muda mrefu wa mazingira na uchumi.',
    },
    intro: {
      en: "We promote the responsible extraction and use of natural resources, helping organisations balance today's operations with long-term environmental and economic sustainability.",
      sw: 'Tunahimiza uvunaji na matumizi ya maliasili kwa uwajibikaji, tukizisaidia taasisi kuweka uwiano kati ya shughuli za sasa na uendelevu wa muda mrefu wa mazingira na uchumi.',
    },
    included: null,
    sectors: ['mining', 'oil-gas', 'agriculture'],
  },
  {
    slug: 'community-engagement',
    image: stock.plantingSeedling,
    tagline: { en: 'Awareness, health, education and livelihoods', sw: 'Uelewa, afya, elimu na kipato' },
    title: { en: 'Community Engagement', sw: 'Ushirikishwaji wa Jamii' },
    summary: {
      en: 'Environmental awareness programmes and initiatives that improve access to healthcare, education and sustainable livelihoods.',
      sw: 'Programu za uelewa wa mazingira na mipango inayoboresha upatikanaji wa huduma za afya, elimu na njia endelevu za kujipatia kipato.',
    },
    intro: {
      en: 'We run environmental awareness programmes and support initiatives that improve access to healthcare, education and sustainable livelihoods for the communities around a project.',
      sw: 'Tunaendesha programu za uelewa wa mazingira na kuunga mkono mipango inayoboresha upatikanaji wa huduma za afya, elimu na njia endelevu za kujipatia kipato kwa jamii zinazozunguka mradi.',
    },
    included: null,
    sectors: ['mining', 'oil-gas', 'agriculture'],
  },
  {
    slug: 'research-innovation',
    image: stock.riverForest,
    tagline: { en: 'Technology for pollution control', sw: 'Teknolojia za kudhibiti uchafuzi' },
    title: { en: 'Research & Innovation', sw: 'Utafiti na Ubunifu' },
    summary: {
      en: 'Researching and adopting advanced technologies and methods for effective pollution control and resource management.',
      sw: 'Kutafiti na kutumia teknolojia na mbinu za kisasa kwa ajili ya udhibiti bora wa uchafuzi na usimamizi wa rasilimali.',
    },
    intro: {
      en: 'We research and adopt advanced technologies and methods that make pollution control and resource management more effective.',
      sw: 'Tunatafiti na kutumia teknolojia na mbinu za kisasa zinazoongeza ufanisi wa udhibiti wa uchafuzi na usimamizi wa rasilimali.',
    },
    included: null,
    sectors: allSectors,
  },
  {
    slug: 'compliance-advocacy',
    image: photos.drawingsReview,
    tagline: { en: 'Meeting environmental regulations', sw: 'Kutimiza sheria za mazingira' },
    title: { en: 'Compliance & Advocacy', sw: 'Uzingatiaji wa Sheria na Utetezi' },
    summary: {
      en: 'Ensuring projects comply with local and international environmental regulations, and advocating for policies aligned with global sustainability goals.',
      sw: 'Kuhakikisha miradi inazingatia sheria na kanuni za mazingira za ndani na za kimataifa, na kutetea sera zinazoendana na malengo ya dunia ya uendelevu.',
    },
    intro: {
      en: 'We help projects comply with local and international environmental regulations, including the environmental impact assessment (EIA) process in Tanzania, and we advocate for policies aligned with global sustainability goals.',
      sw: 'Tunasaidia miradi kuzingatia sheria na kanuni za mazingira za ndani na za kimataifa, ikiwemo mchakato wa Tathmini ya Athari kwa Mazingira (TAM) nchini Tanzania, na tunatetea sera zinazoendana na malengo ya dunia ya uendelevu.',
    },
    included: null,
    sectors: allSectors,
  },
  {
    slug: 'capacity-building',
    image: photos.teamOnWharf,
    tagline: { en: 'Mentoring young professionals', sw: 'Kuwalea wataalamu vijana' },
    title: { en: 'Capacity Building', sw: 'Kujenga Uwezo' },
    summary: {
      en: 'Mentoring and empowering young professionals, particularly engineers and environmentalists, to build expertise in sustainable practices and conservation.',
      sw: 'Kuwalea na kuwawezesha wataalamu vijana, hasa wahandisi na wataalamu wa mazingira, ili kujenga utaalamu katika mbinu endelevu na uhifadhi.',
    },
    intro: {
      en: 'We mentor and empower young professionals, particularly engineers and environmentalists, so they can build lasting expertise in sustainable practices and conservation.',
      sw: 'Tunawalea na kuwawezesha wataalamu vijana, hasa wahandisi na wataalamu wa mazingira, ili wajenge utaalamu wa kudumu katika mbinu endelevu na uhifadhi.',
    },
    included: null,
    sectors: allSectors,
  },
  {
    slug: 'partnerships-collaboration',
    image: photos.siteBriefing,
    tagline: { en: 'Working with government and industry', sw: 'Kushirikiana na serikali na viwanda' },
    title: { en: 'Partnerships & Collaboration', sw: 'Ubia na Ushirikiano' },
    summary: {
      en: 'Working with governments, industries and international organisations to address global environmental challenges and drive sustainable development.',
      sw: 'Kushirikiana na serikali, viwanda na mashirika ya kimataifa kukabiliana na changamoto za mazingira duniani na kuchochea maendeleo endelevu.',
    },
    intro: {
      en: 'We work with governments, industries and international organisations to address global environmental challenges and drive sustainable development.',
      sw: 'Tunashirikiana na serikali, viwanda na mashirika ya kimataifa kukabiliana na changamoto za mazingira duniani na kuchochea maendeleo endelevu.',
    },
    included: null,
    sectors: allSectors,
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
