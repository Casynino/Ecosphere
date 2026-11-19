import type { StaticImageData } from 'next/image';
import cranesAndSkyline from '@/public/images/field/cranes-and-skyline.jpg';
import drawingsReview from '@/public/images/field/drawings-review.jpg';
import drawingsReview2 from '@/public/images/field/drawings-review-2.jpg';
import siteBriefing from '@/public/images/field/site-briefing.jpg';
import siteMeeting from '@/public/images/field/site-meeting.jpg';
import siteWalk from '@/public/images/field/site-walk.jpg';
import teamAtHarbour from '@/public/images/field/team-at-harbour.jpg';
import teamOnWharf from '@/public/images/field/team-on-wharf.jpg';
import teamSiteOffice from '@/public/images/field/team-site-office.jpg';
import teamWharfWide from '@/public/images/field/team-wharf-wide.jpg';
import cloudForest from '@/public/images/stock/cloud-forest.jpg';
import craterGreen from '@/public/images/stock/crater-green.jpg';
import cropRows from '@/public/images/stock/crop-rows.jpg';
import darAerial from '@/public/images/stock/dar-aerial.jpg';
import darBrt from '@/public/images/stock/dar-brt.jpg';
import forestCanopy from '@/public/images/stock/forest-canopy.jpg';
import greenHills from '@/public/images/stock/green-hills.jpg';
import handsSoil from '@/public/images/stock/hands-soil.jpg';
import heroSavanna from '@/public/images/stock/hero-savanna.jpg';
import kilimanjaro from '@/public/images/stock/kilimanjaro.jpg';
import mangroveAerial from '@/public/images/stock/mangrove-aerial.jpg';
import offshorePlatform from '@/public/images/stock/offshore-platform.jpg';
import openPitMine from '@/public/images/stock/open-pit-mine.jpg';
import plantingSeedling from '@/public/images/stock/planting-seedling.jpg';
import rainforestMist from '@/public/images/stock/rainforest-mist.jpg';
import riverAerial from '@/public/images/stock/river-aerial.jpg';
import riverForest from '@/public/images/stock/river-forest.jpg';
import sunriseMist from '@/public/images/stock/sunrise-mist.jpg';
import type { Localized } from './types';

// `photos`: the client's own site-visit photos (made by scripts/prepare-media.mjs).
// `stock`: free-licence photos from Unsplash (sources listed in IMAGE_CREDITS.md).
// Swap any of them for the client's own photography when it is available.

export type Photo = {
  src: StaticImageData;
  alt: Localized;
  shape: 'landscape' | 'portrait';
  /** CSS object-position, used when the photo is cropped to fit a tile. */
  position?: string;
};

export const photos = {
  teamOnWharf: {
    src: teamOnWharf,
    shape: 'landscape',
    alt: {
      en: 'Six team members in safety vests and helmets standing on a wharf beside the sea during a site visit',
      sw: 'Wanatimu sita waliovaa vizibao vya usalama na kofia ngumu wakiwa wamesimama gatini kando ya bahari wakati wa ziara ya eneo la mradi',
    },
  },
  siteBriefing: {
    src: siteBriefing,
    shape: 'landscape',
    alt: {
      en: 'Team members in safety gear talking with site staff at a waterfront construction site',
      sw: 'Wanatimu waliovaa vifaa vya usalama wakizungumza na wafanyakazi katika eneo la ujenzi lililo kando ya bahari',
    },
  },
  cranesAndSkyline: {
    src: cranesAndSkyline,
    shape: 'landscape',
    alt: {
      en: 'Team members crossing a construction site with cranes and the city skyline behind them',
      sw: 'Wanatimu wakipita katika eneo la ujenzi lenye winchi, huku majengo ya jiji yakionekana nyuma yao',
    },
  },
  teamAtHarbour: {
    src: teamAtHarbour,
    shape: 'landscape',
    alt: {
      en: 'Team members in safety vests standing together at the edge of the harbour',
      sw: 'Wanatimu waliovaa vizibao vya usalama wakiwa wamesimama pamoja ukingoni mwa bandari',
    },
  },
  siteWalk: {
    src: siteWalk,
    shape: 'portrait',
    alt: {
      en: 'Team members in life jackets and helmets on a site walk near cranes',
      sw: 'Wanatimu waliovaa maboya ya kujiokolea na kofia ngumu wakitembelea eneo la mradi karibu na winchi',
    },
  },
  drawingsReview: {
    src: drawingsReview,
    shape: 'portrait',
    position: '50% 35%',
    alt: {
      en: 'Two team members in safety vests reviewing project drawings at a site office',
      sw: 'Wanatimu wawili waliovaa vizibao vya usalama wakipitia michoro ya mradi katika ofisi ya eneo la ujenzi',
    },
  },
  drawingsReview2: {
    src: drawingsReview2,
    shape: 'portrait',
    position: '50% 35%',
    alt: {
      en: 'Team members looking through large project drawings on a site office table',
      sw: 'Wanatimu wakipitia michoro mikubwa ya mradi mezani katika ofisi ya eneo la ujenzi',
    },
  },
  teamSiteOffice: {
    src: teamSiteOffice,
    shape: 'portrait',
    position: '50% 30%',
    alt: {
      en: 'Two team members in high-visibility vests outside a site office',
      sw: 'Wanatimu wawili waliovaa vizibao vya usalama nje ya ofisi ya eneo la ujenzi',
    },
  },
  siteMeeting: {
    src: siteMeeting,
    shape: 'landscape',
    alt: {
      en: 'Team members and site staff talking beside the water at a construction site',
      sw: 'Wanatimu na wafanyakazi wa eneo la ujenzi wakizungumza kando ya maji',
    },
  },
  teamWharfWide: {
    src: teamWharfWide,
    shape: 'landscape',
    alt: {
      en: 'Team members standing in a line on a wide wharf with the sea behind them',
      sw: 'Wanatimu wakiwa wamesimama kwa mstari kwenye gati pana, bahari ikiwa nyuma yao',
    },
  },
} satisfies Record<string, Photo>;

export const stock = {
  // First frame of the home page video (public/videos/hero.mp4).
  heroSavanna: {
    src: heroSavanna,
    shape: 'landscape',
    alt: {
      en: 'Green savanna dotted with trees stretching towards a volcano wrapped in cloud',
      sw: 'Savana ya kijani yenye miti ikielekea kwenye volkano iliyofunikwa na mawingu',
    },
  },
  sunriseMist: {
    src: sunriseMist,
    shape: 'landscape',
    alt: {
      en: 'Sunrise over a green landscape covered in morning mist, with a red earth road in the foreground',
      sw: 'Macheo juu ya mandhari ya kijani iliyofunikwa na ukungu wa asubuhi, barabara ya udongo mwekundu ikiwa mbele',
    },
  },
  riverAerial: {
    src: riverAerial,
    shape: 'landscape',
    alt: {
      en: 'Aerial view of a river bending through thick green forest beside a small settlement',
      sw: 'Picha ya juu ya mto unaopinda katikati ya msitu mnene wa kijani kando ya makazi madogo',
    },
  },
  craterGreen: {
    src: craterGreen,
    shape: 'landscape',
    alt: {
      en: 'Wide green valley floor with a lake, surrounded by steep hills',
      sw: 'Bonde pana la kijani lenye ziwa, likizungukwa na vilima vyenye miteremko mikali',
    },
  },
  cloudForest: {
    src: cloudForest,
    shape: 'landscape',
    alt: {
      en: 'Low cloud drifting over forested hills',
      sw: 'Mawingu ya chini yakipita juu ya vilima vyenye misitu',
    },
  },
  rainforestMist: {
    src: rainforestMist,
    shape: 'landscape',
    alt: {
      en: 'Mist rising through the canopy of a tropical forest',
      sw: 'Ukungu ukipanda katikati ya miti ya msitu wa kitropiki',
    },
  },
  greenHills: {
    src: greenHills,
    shape: 'landscape',
    alt: {
      en: 'Green forested hills with blue mountains on the horizon',
      sw: 'Vilima vya kijani vyenye misitu, na milima ya buluu ikionekana kwa mbali',
    },
  },
  kilimanjaro: {
    src: kilimanjaro,
    shape: 'landscape',
    alt: {
      en: 'Snow-capped Mount Kilimanjaro rising above the clouds behind acacia trees',
      sw: 'Mlima Kilimanjaro wenye theluji ukiinuka juu ya mawingu nyuma ya miti ya migunga',
    },
  },
  riverForest: {
    src: riverForest,
    shape: 'landscape',
    alt: {
      en: 'Aerial view of a river winding through dense green forest',
      sw: 'Picha ya juu ya mto unaopinda katikati ya msitu mnene wa kijani',
    },
  },
  forestCanopy: {
    src: forestCanopy,
    shape: 'landscape',
    alt: {
      en: 'Dense green forest canopy seen from above',
      sw: 'Msitu mnene wa kijani ukionekana kutoka juu',
    },
  },
  mangroveAerial: {
    src: mangroveAerial,
    shape: 'portrait',
    alt: {
      en: 'Aerial view of a creek running between bright green mangrove trees',
      sw: 'Picha ya juu ya mkondo wa maji unaopita katikati ya mikoko ya kijani kibichi',
    },
  },
  plantingSeedling: {
    src: plantingSeedling,
    shape: 'landscape',
    alt: {
      en: 'A hand planting a young tree seedling in a field',
      sw: 'Mkono ukipanda mche mchanga wa mti shambani',
    },
  },
  handsSoil: {
    src: handsSoil,
    shape: 'landscape',
    alt: {
      en: 'Hands pressing soil around a small green seedling',
      sw: 'Mikono ikishindilia udongo kuzunguka mche mdogo wa kijani',
    },
  },
  openPitMine: {
    src: openPitMine,
    shape: 'landscape',
    alt: {
      en: 'Open-pit mine with terraced walls and a pool of water, hills in the distance',
      sw: 'Mgodi wa wazi wenye kuta za ngazi na dimbwi la maji, vilima vikionekana kwa mbali',
    },
  },
  offshorePlatform: {
    src: offshorePlatform,
    shape: 'landscape',
    alt: {
      en: 'Offshore oil and gas platform on a calm blue sea',
      sw: 'Jukwaa la mafuta na gesi baharini kwenye bahari tulivu ya buluu',
    },
  },
  cropRows: {
    src: cropRows,
    shape: 'landscape',
    alt: {
      en: 'Rows of leafy green crops on a farm with trees behind',
      sw: 'Mistari ya mazao ya majani mabichi shambani, miti ikiwa nyuma',
    },
  },
  darBrt: {
    src: darBrt,
    shape: 'landscape',
    alt: {
      en: 'Rapid transit buses on a road in Dar es Salaam with office towers behind',
      sw: 'Mabasi ya mwendokasi barabarani jijini Dar es Salaam, majengo marefu ya ofisi yakiwa nyuma',
    },
  },
  darAerial: {
    src: darAerial,
    shape: 'landscape',
    alt: {
      en: 'Aerial view of Dar es Salaam city centre and harbour',
      sw: 'Picha ya juu ya katikati ya jiji la Dar es Salaam na bandari yake',
    },
  },
} satisfies Record<string, Photo>;

/** Photo gallery on the Projects page, in display order. */
export const fieldGallery: Photo[] = [
  photos.siteBriefing,
  photos.drawingsReview,
  photos.siteWalk,
  photos.teamSiteOffice,
  photos.cranesAndSkyline,
  photos.drawingsReview2,
  photos.teamOnWharf,
  photos.teamAtHarbour,
];

export type VideoClip = {
  src: string;
  poster: string;
  title: Localized;
};

/** Short silent clips on the Projects page. They only download when played. */
export const fieldVideos: VideoClip[] = [
  {
    src: '/videos/on-site-discussion.mp4',
    poster: '/videos/on-site-discussion.jpg',
    title: { en: 'On-site discussion', sw: 'Majadiliano katika eneo la mradi' },
  },
  {
    src: '/videos/site-briefing.mp4',
    poster: '/videos/site-briefing.jpg',
    title: { en: 'Site briefing', sw: 'Maelezo kuhusu eneo la mradi' },
  },
  {
    src: '/videos/site-walk.mp4',
    poster: '/videos/site-walk.jpg',
    title: { en: 'Site walk', sw: 'Ziara ya kukagua eneo la mradi' },
  },
];
