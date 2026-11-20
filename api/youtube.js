// Server-side proxy for the youtube-v31 RapidAPI (Vercel serverless function).
// Keeps the RapidAPI key out of the browser bundle. Only the three endpoints
// the app uses are reachable, with validated parameters, capped page sizes,
// CDN caching, and a simple per-IP rate limit.

const UPSTREAM = 'https://youtube-v31.p.rapidapi.com';
const HOST = 'youtube-v31.p.rapidapi.com';

const PART = /^[a-zA-Z]+(,[a-zA-Z]+)*$/;
const ID_LIST = /^[A-Za-z0-9_-]+(,[A-Za-z0-9_-]+){0,49}$/;
const MAX_RESULTS = /^\d{1,3}$/;

const RULES = {
  search: {
    params: {
      part: PART,
      q: /^[\s\S]{1,100}$/,
      channelId: /^[A-Za-z0-9_-]{1,64}$/,
      relatedToVideoId: /^[A-Za-z0-9_-]{1,32}$/,
      type: /^(video|channel|playlist)(,(video|channel|playlist))*$/,
      order: /^(date|rating|relevance|title|videoCount|viewCount)$/,
      maxResults: MAX_RESULTS,
    },
    oneOf: ['q', 'channelId', 'relatedToVideoId'],
    cacheSeconds: 300,
  },
  videos: {
    params: { part: PART, id: ID_LIST, maxResults: MAX_RESULTS },
    oneOf: ['id'],
    cacheSeconds: 3600,
  },
  channels: {
    params: { part: PART, id: ID_LIST, maxResults: MAX_RESULTS },
    oneOf: ['id'],
    cacheSeconds: 3600,
  },
};

// In-memory sliding-window limiter. Best effort on serverless: every warm
// instance enforces its own window, so this caps bursts per instance.
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 40;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (!v.length || now - v[v.length - 1] > WINDOW_MS) hits.delete(k);
    }
  }
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.RAPIDAPI_KEY;
  if (!key) return res.status(500).json({ error: 'Server is not configured' });

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (isRateLimited(ip)) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ error: 'Too many requests' });
  }

  const raw = Array.isArray(req.query.u) ? req.query.u[0] : req.query.u;
  if (!raw || raw.length > 2500) {
    return res.status(400).json({ error: 'Missing or invalid u parameter' });
  }

  const splitAt = raw.indexOf('?');
  const path = splitAt === -1 ? raw : raw.slice(0, splitAt);
  const queryString = splitAt === -1 ? '' : raw.slice(splitAt + 1);
  const rule = RULES[path];
  if (!rule) return res.status(400).json({ error: 'Endpoint not allowed' });

  const clean = new URLSearchParams();
  for (const [name, value] of new URLSearchParams(queryString)) {
    const pattern = rule.params[name];
    if (!pattern) {
      return res.status(400).json({ error: `Parameter not allowed: ${name}` });
    }
    if (!pattern.test(value)) {
      return res.status(400).json({ error: `Invalid value for: ${name}` });
    }
    clean.set(name, value);
  }
  if (rule.oneOf && !rule.oneOf.some((name) => clean.has(name))) {
    return res
      .status(400)
      .json({ error: `One of ${rule.oneOf.join(', ')} is required` });
  }
  if (!clean.has('part')) clean.set('part', 'snippet');
  clean.set('country', 'EG');
  const requested = parseInt(clean.get('maxResults') || '50', 10);
  clean.set('maxResults', String(Math.min(Math.max(requested, 1), 50)));

  try {
    const upstream = await fetch(`${UPSTREAM}/${path}?${clean.toString()}`, {
      headers: { 'X-RapidAPI-Key': key, 'X-RapidAPI-Host': HOST },
    });
    if (!upstream.ok) {
      return res
        .status(502)
        .json({ error: 'Upstream request failed', status: upstream.status });
    }
    const body = await upstream.text();
    res.setHeader(
      'Cache-Control',
      `public, s-maxage=${rule.cacheSeconds}, stale-while-revalidate=${
        rule.cacheSeconds * 2
      }`
    );
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(body);
  } catch {
    return res.status(502).json({ error: 'Upstream request failed' });
  }
}
