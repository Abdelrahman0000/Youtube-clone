# YouTube Clone

A YouTube-style video app built with React (Create React App) and Material UI,
powered by the [youtube-v31](https://rapidapi.com/ytdlfree/api/youtube-v31)
RapidAPI. Live at https://youtube-clone-three-lyart.vercel.app/

## Features

- Home feed by category, search, channel pages, and video pages
- Video duration badges on every thumbnail
- Click a channel avatar to open the channel page
- Subscribe to channels (stored in your browser via localStorage) and see
  their latest videos on the Following page

## Architecture

- `src/` - React SPA, deployed as a static build on Vercel
- `api/youtube.js` - Vercel serverless function that proxies the RapidAPI.
  The API key stays server-side; the browser bundle never contains it.
  The proxy only allows the `search`, `videos`, and `channels` endpoints,
  validates parameters, caps `maxResults` at 50, rate-limits per IP, and
  caches responses on the Vercel CDN to stretch the free plan's quota.

## Local development

```bash
npm install
cp .env.example .env   # then put your RapidAPI key in .env
npm start
```

The app calls RapidAPI directly when `REACT_APP_RAPID_API_KEY` is present
(local dev only). Without it, calls go to `/api/youtube`, which only exists
on the Vercel deployment - so a local `.env` is required for `npm start`.

## Deployment (Vercel)

- Pushes to `main` deploy automatically.
- Required environment variable: `RAPIDAPI_KEY` (server-side secret used by
  `api/youtube.js`). Do not add `REACT_APP_*` variables with secrets - they
  ship to the browser.
- Node.js version is set to 22.x in the project settings.
