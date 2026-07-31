# Campus Pathfinder

Frontend prototype for **University of Missouri** — a campus navigation and student life hub built with React + Vite.

## Live demo

Once GitHub Pages is enabled: **https://namre10.github.io/campus-pathfinder/**

> Enable Pages: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**

## Features

- **Campus map** — Leaflet map with category markers, directions (OpenRouteService), location detail, favorites, and tips
- **Events** — Directory with filters, timeline view, saved events, calendar export
- **Career advising** — Advisor directory, slot booking, my meetings, calendar export
- **Communities** — Club directory, join/leave, interest filters, activity listings
- **Dashboard** — Unified view of saved events, meetings, locations, and communities

## Static JSON data (read-only)

Campus data is published as JSON — usable by the app or any external client:

| File | Live URL (after deploy) |
|---|---|
| Locations | `https://namre10.github.io/campus-pathfinder/data/locations.json` |
| Events | `https://namre10.github.io/campus-pathfinder/data/events.json` |
| Communities | `https://namre10.github.io/campus-pathfinder/data/communities.json` |
| Advisors | `https://namre10.github.io/campus-pathfinder/data/advisors.json` |
| Availability slots | `https://namre10.github.io/campus-pathfinder/data/availability-slots.json` |

From the repo (raw GitHub):

```
https://raw.githubusercontent.com/namre10/campus-pathfinder/main/public/data/locations.json
```

Example fetch:

```js
const res = await fetch('https://namre10.github.io/campus-pathfinder/data/events.json')
const events = await res.json()
```

Read-only — no writes or auth. User actions (saved events, joined communities, bookings) stay in browser `localStorage`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

For walking directions, add an [OpenRouteService](https://openrouteservice.org/) API key under **Advanced settings** on the map.

## Stack

React 18 · Vite 5 · React Router v6 · Leaflet · Fuse.js · localStorage persistence

## Status

Frontend-only prototype with mock data. No backend or authentication yet.
