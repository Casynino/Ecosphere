// Basic rate limit: at most 5 requests per visitor (IP address) in 10 minutes.
// The counts live in memory, so on serverless hosting each server instance
// keeps its own tally. That is enough to stop simple floods; for stricter
// limits move this to a shared store such as Upstash Redis.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const requests = new Map<string, number[]>();

export function allowRequest(key: string, now = Date.now()): boolean {
  const recent = (requests.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    requests.set(key, recent);
    return false;
  }

  recent.push(now);
  requests.set(key, recent);

  // Forget visitors whose requests have all expired, so the map stays small.
  if (requests.size > 2000) {
    for (const [visitor, times] of requests) {
      if (times.every((time) => now - time >= WINDOW_MS)) requests.delete(visitor);
    }
  }

  return true;
}
