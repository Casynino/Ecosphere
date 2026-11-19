import { notFound } from 'next/navigation';

// Any address that matches no page shows the translated "not found" page.
export default function CatchAll() {
  notFound();
}
