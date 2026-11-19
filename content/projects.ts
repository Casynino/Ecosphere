import type { StaticImageData } from 'next/image';
import type { Localized } from './types';

// Project case studies shown on /projects.
// The three entries below are PLACEHOLDERS. Replace them with real projects
// supplied by the client and set `placeholder: false` (and add an image).
// Do not publish invented projects, clients, statistics or results.

export type Project = {
  slug: string;
  placeholder: boolean;
  title: Localized;
  sector: Localized;
  location: Localized;
  summary: Localized;
  image: { src: StaticImageData; alt: Localized } | null;
};

const placeholderProject = (number: number): Project => ({
  slug: `placeholder-project-${number}`,
  placeholder: true,
  title: { en: `Project title ${number}`, sw: `Jina la mradi ${number}` },
  sector: { en: 'Sector', sw: 'Sekta' },
  location: { en: 'Location', sw: 'Mahali' },
  summary: {
    en: 'Summary: what the project needed, what Ecosphere Solutions did and the outcome. To be supplied.',
    sw: 'Muhtasari: mahitaji ya mradi, kazi iliyofanywa na Ecosphere Solutions na matokeo yake. Yataongezwa.',
  },
  image: null,
});

export const projects: Project[] = [placeholderProject(1), placeholderProject(2), placeholderProject(3)];
