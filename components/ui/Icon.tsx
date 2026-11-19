import {
  Flame,
  FlaskConical,
  GraduationCap,
  Handshake,
  Leaf,
  Pickaxe,
  Scale,
  Sprout,
  Trees,
  Truck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '@/content/types';

const icons: Record<IconName, LucideIcon> = {
  leaf: Leaf,
  trees: Trees,
  users: Users,
  flask: FlaskConical,
  scale: Scale,
  graduation: GraduationCap,
  handshake: Handshake,
  pickaxe: Pickaxe,
  flame: Flame,
  sprout: Sprout,
  truck: Truck,
};

/** Decorative icon chosen by name in the content files. */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Component = icons[name];
  return <Component className={className} strokeWidth={1.75} aria-hidden="true" />;
}
