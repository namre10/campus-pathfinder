# Campus Pathfinder

Frontend prototype for **University of Missouri** — a campus navigation and student life hub built with React + Vite.

## Features

- **Campus map** — Leaflet map with category markers, directions (OpenRouteService), location detail, favorites, and tips
- **Events** — Directory with filters, timeline view, saved events, calendar export
- **Career advising** — Advisor directory, slot booking, my meetings, calendar export
- **Communities** — Club directory, join/leave, interest filters, activity listings
- **Dashboard** — Unified view of saved events, meetings, locations, and communities

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
