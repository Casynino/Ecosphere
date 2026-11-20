import { stock, type Photo } from './media';
import type { Localized, SectorSlug } from './types';

export type Sector = {
  slug: SectorSlug;
  image: Photo;
  name: Localized;
  /** One line for cards on the home page. */
  short: Localized;
  /** Short paragraph on the typical environmental challenge in the sector. */
  challenge: Localized;
};

export const sectors: Sector[] = [
  {
    slug: 'mining',
    image: stock.openPitMine,
    name: { en: 'Mining', sw: 'Madini' },
    short: {
      en: 'Managing land, waste and water impacts from exploration to closure.',
      sw: 'Kudhibiti athari kwa ardhi, taka na maji kuanzia utafutaji hadi ufungaji wa mgodi.',
    },
    challenge: {
      en: 'Mining disturbs land and generates waste rock, tailings and dust, and it can affect the rivers and groundwater that nearby communities depend on. Operators need to manage these impacts from exploration through to closure and land rehabilitation.',
      sw: 'Uchimbaji madini huathiri ardhi na huzalisha mawe taka, mabaki ya uchenjuaji na vumbi, na unaweza kuathiri mito na maji ya ardhini yanayotegemewa na jamii jirani. Waendeshaji wanahitaji kudhibiti athari hizi kuanzia hatua ya utafutaji hadi kufunga mgodi na kurejesha ardhi katika hali nzuri.',
    },
  },
  {
    slug: 'oil-gas',
    image: stock.offshorePlatform,
    name: { en: 'Oil & Gas', sw: 'Mafuta na Gesi' },
    short: {
      en: 'Reducing spill, emission and habitat risks across the life of a project.',
      sw: 'Kupunguza hatari za umwagikaji, uchafuzi wa hewa na uharibifu wa makazi ya viumbe katika kipindi chote cha mradi.',
    },
    challenge: {
      en: 'Exploration, production and transport of oil and gas carry risks of spills, air emissions and damage to sensitive land and marine habitats. Projects face strict environmental regulation and close public attention at every stage.',
      sw: 'Utafutaji, uzalishaji na usafirishaji wa mafuta na gesi huambatana na hatari za umwagikaji wa mafuta, uchafuzi wa hewa na uharibifu wa makazi nyeti ya viumbe wa nchi kavu na baharini. Miradi hii husimamiwa kwa kanuni kali za mazingira na hufuatiliwa kwa karibu na umma katika kila hatua.',
    },
  },
  {
    slug: 'energy',
    image: stock.solarFarm,
    name: { en: 'Energy', sw: 'Nishati' },
    short: {
      en: 'Energy transition: cleaner power with less harm to land and people.',
      sw: 'Mpito wa nishati: umeme safi wenye madhara madogo kwa ardhi na watu.',
    },
    challenge: {
      en: 'Energy is at the centre of the move to a low-carbon economy. Shifting from fossil fuels to solar, wind, hydropower and other clean sources cuts emissions, but power plants, transmission lines and storage can still affect land, water, wildlife and nearby communities. Careful planning, impact assessment and monitoring help keep the energy transition clean and fair.',
      sw: 'Nishati ni kiini cha mpito kuelekea uchumi wenye uzalishaji mdogo wa kaboni. Kuhama kutoka nishati ya mafuta kwenda nishati ya jua, upepo, maji na vyanzo vingine safi hupunguza uzalishaji wa gesijoto, lakini mitambo ya umeme, njia za kusafirisha umeme na hifadhi ya nishati bado vinaweza kuathiri ardhi, maji, wanyamapori na jamii jirani. Mipango makini, tathmini ya athari kwa mazingira na ufuatiliaji husaidia mpito wa nishati kuwa safi na wa haki.',
    },
  },
  {
    slug: 'agriculture',
    image: stock.cropRows,
    name: { en: 'Agriculture', sw: 'Kilimo' },
    short: {
      en: 'Protecting soil, water and livelihoods through sustainable practices.',
      sw: 'Kulinda udongo, maji na maisha ya watu kupitia mbinu endelevu.',
    },
    challenge: {
      en: 'Farming depends on healthy soil and reliable water, yet land clearing, heavy use of agrochemicals and poor water management can degrade both. Sustainable practices protect yields, ecosystems and rural livelihoods over the long term.',
      sw: 'Kilimo hutegemea udongo wenye rutuba na maji ya uhakika, lakini ufyekaji wa ardhi, matumizi makubwa ya kemikali za kilimo na usimamizi duni wa maji vinaweza kuviharibu vyote viwili. Mbinu endelevu hulinda mavuno, mifumo ya ikolojia na maisha ya wakazi wa vijijini kwa muda mrefu.',
    },
  },
  {
    slug: 'transport',
    image: stock.darBrt,
    name: { en: 'Transport', sw: 'Uchukuzi' },
    short: {
      en: 'Limiting emissions, noise and habitat loss from infrastructure.',
      sw: 'Kupunguza uchafuzi wa hewa, kelele na upotevu wa makazi ya viumbe unaotokana na miundombinu.',
    },
    challenge: {
      en: 'Roads, railways, ports and vehicle fleets produce air emissions, noise and runoff, and new infrastructure can cut through habitats and communities. Careful planning and monitoring reduce these impacts across construction and operation.',
      sw: 'Barabara, reli, bandari na vyombo vya usafiri huzalisha uchafuzi wa hewa, kelele na maji machafu yanayotiririka, na miundombinu mipya inaweza kugawa makazi ya viumbe na ya jamii. Upangaji makini na ufuatiliaji hupunguza athari hizi wakati wa ujenzi na uendeshaji.',
    },
  },
];

export function getSector(slug: SectorSlug) {
  return sectors.find((sector) => sector.slug === slug)!;
}
