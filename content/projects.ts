import { photos, type Photo } from './media';
import type { Localized } from './types';

// Project case studies shown on /projects.
// The three entries below are PLACEHOLDERS. Replace them with real projects
// supplied by the client and set `placeholder: false`.
// Do not publish invented projects, clients, statistics or results.
// The photos on the placeholders are from the client's own site visits and
// are only there to show how a finished case study will look.

export type Project = {
  slug: string;
  placeholder: boolean;
  title: Localized;
  sector: Localized;
  location: Localized;
  summary: Localized;
  image: Photo | null;
};

const placeholderProject = (number: number, image: Photo): Project => ({
  slug: `placeholder-project-${number}`,
  placeholder: true,
  title: { en: `Project title ${number}`, sw: `Jina la mradi ${number}` },
  sector: { en: 'Sector', sw: 'Sekta' },
  location: { en: 'Location', sw: 'Mahali' },
  summary: {
    en: 'Summary: what the project needed, what Ecosphere Solutions did and the outcome. To be supplied.',
    sw: 'Muhtasari: mahitaji ya mradi, kazi iliyofanywa na Ecosphere Solutions na matokeo yake. Yataongezwa.',
  },
  image,
});

export const projects: Project[] = [
  placeholderProject(1, photos.siteMeeting),
  placeholderProject(2, photos.teamWharfWide),
  placeholderProject(3, photos.cranesAndSkyline),
];
