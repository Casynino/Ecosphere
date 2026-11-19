import type { StaticImageData } from 'next/image';
import type { Localized } from './types';

// To add a photo: save a square-ish portrait in /public/images/leadership/,
// import it here and set it as `photo`. Example:
//   import norgaKomba from '@/public/images/leadership/norga-komba.jpg';
//   ... photo: norgaKomba,
// While `photo` is null the site shows a circle with the person's initials.

export type Leader = {
  slug: string;
  /** Names and titles stay the same in every language. */
  name: string;
  initials: string;
  title: string;
  focus: Localized<string[]>;
  bio: Localized;
  photo: StaticImageData | null;
};

export const leaders: Leader[] = [
  {
    slug: 'norga-komba',
    name: 'Dr. Norga Komba',
    initials: 'NK',
    title: 'Founder & Executive Director',
    focus: {
      en: ['Strategic Leadership', 'Environmental & Natural Resources Governance', 'Policy & Sustainable Development'],
      sw: ['Uongozi wa Kimkakati', 'Utawala wa Mazingira na Maliasili', 'Sera na Maendeleo Endelevu'],
    },
    bio: {
      en: 'Provides strategic leadership to Ecosphere Solutions Limited, with expertise in environmental and natural resources governance, environmental policy, sustainable development and responsible investment.',
      sw: 'Hutoa uongozi wa kimkakati kwa Ecosphere Solutions Limited, akiwa na utaalamu katika utawala wa mazingira na maliasili, sera za mazingira, maendeleo endelevu na uwekezaji unaowajibika.',
    },
    photo: null,
  },
  {
    slug: 'ian-komba',
    name: 'Eng. Ian Komba',
    initials: 'IK',
    title: 'Director of Operations & Business Development',
    focus: {
      en: ['Structural & Civil Engineering', 'Project Delivery', 'Business Development & Strategic Growth'],
      sw: ['Uhandisi wa Miundo na Ujenzi', 'Utekelezaji wa Miradi', 'Uendelezaji wa Biashara na Ukuaji wa Kimkakati'],
    },
    bio: {
      en: 'Provides leadership in operations, project delivery and business development, bringing technical expertise in structural and civil engineering to support the successful delivery of infrastructure and sustainable development projects.',
      sw: 'Hutoa uongozi katika uendeshaji, utekelezaji wa miradi na uendelezaji wa biashara, akileta utaalamu wa kiufundi katika uhandisi wa miundo na ujenzi ili kufanikisha utekelezaji wa miradi ya miundombinu na ya maendeleo endelevu.',
    },
    photo: null,
  },
  {
    slug: 'marus-gbomagba',
    name: 'Dr. Marus Gbomagba',
    initials: 'MG',
    title: 'Director of Climate, Energy & Sustainability',
    focus: {
      en: ['Climate Strategy', 'Energy Transition', 'Climate Policy', 'Sustainability & Green Development'],
      sw: ['Mkakati wa Tabianchi', 'Mpito wa Nishati', 'Sera ya Tabianchi', 'Uendelevu na Maendeleo ya Kijani'],
    },
    bio: {
      en: "Leads the company's strategic work on climate, energy and sustainability, supporting innovative approaches to climate action, green development and sustainable solutions.",
      sw: 'Huongoza kazi za kimkakati za kampuni kuhusu tabianchi, nishati na uendelevu, akiunga mkono mbinu bunifu za kukabiliana na mabadiliko ya tabianchi, maendeleo ya kijani na suluhisho endelevu.',
    },
    photo: null,
  },
  {
    slug: 'violet-mushi',
    name: 'Adv. Violet Mushi',
    initials: 'VM',
    title: 'Director of Governance, Compliance & Regulatory Affairs',
    focus: {
      en: ['Legal Compliance', 'Corporate Governance', 'Regulatory Strategy', 'Risk Management'],
      sw: ['Uzingatiaji wa Sheria', 'Utawala Bora wa Kampuni', 'Mkakati wa Udhibiti', 'Usimamizi wa Vihatarishi'],
    },
    bio: {
      en: "Leads the company's work on legal and regulatory compliance, corporate governance and risk management, supporting clients to navigate complex regulatory and institutional environments.",
      sw: 'Huongoza kazi za kampuni kuhusu uzingatiaji wa sheria na kanuni, utawala bora wa kampuni na usimamizi wa vihatarishi, akiwasaidia wateja kukabiliana na mazingira changamano ya kisheria na kitaasisi.',
    },
    photo: null,
  },
];
