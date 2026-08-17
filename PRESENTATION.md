# Campus Pathfinder — Full Project Documentation for Presentation

**Team project:** University of Missouri (Mizzou) — Pathfinders  
**App name:** Campus Pathfinder  
**Core product:** Tiger Guide — Mizzou AI copilot  
**Category:** College to Career (also touches Overcoming Obstacles & Degree Planning)  
**Live demo:** https://namre10.github.io/campus-pathfinder/  
**Repository:** https://github.com/namre10/campus-pathfinder  

---

## 1. Elevator pitch (30 seconds)

Mizzou students already use **Stellic**, **Handshake**, **MizzouOne**, **Mizzou Mentoring**, and **offcampus.missouri.edu** — but each tool lives in its own place. There is no single front door.

**Campus Pathfinder** solves that with **Tiger Guide**: students ask one question in plain English, get a clear answer, and jump to the right official Mizzou tool. We also added a **Mizzou Tools Hub** (every official app in one list), a **career roadmap**, **housing map**, and an animated **welcome experience**.

> **We connect. We don't replace.**

---

## 2. The problem

| Pain point | Why it matters |
|------------|----------------|
| **Scattered portals** | Holds → MizzouOne. Classes → Stellic. Jobs → Handshake. Housing → offcampus.missouri.edu |
| **No single conversation** | Students ask: *"What do I do next?"* and hunt across websites |
| **Context switching** | Registration blockers + internship search + housing search = three different mental models |
| **College to Career gap** | Handshake lists jobs; it doesn't tell you *when* to start or *what to ask* a mentor |

---

## 3. What Mizzou already has (we do NOT replace these)

| Official Mizzou tool | URL | Purpose |
|---------------------|-----|---------|
| **Stellic** | stellic.missouri.edu | Degree planning & registration prep |
| **myZou** | myzou.missouri.edu | Enrollment & student records |
| **MizzouOne** | mizzouone.missouri.edu | Holds, required tasks, student hub |
| **Handshake** | career.missouri.edu | Jobs, internships, career fairs |
| **Mizzou Mentoring** | mizzou.xinspire.com | Alumni mentor matching |
| **Official campus map** | map.missouri.edu | Buildings, parking, accessibility |
| **Off-campus housing** | offcampus.missouri.edu | Listings & commute |
| **MU Engage** | engage.missouri.edu | Clubs & involvement |
| **Career Center** | career.missouri.edu | Resume, interviews, advising |
| **Big Interview** | career.missouri.edu | Mock interview practice |

**Key honest line for judges:** Mizzou's official campus map and housing site are more complete than our prototype for those specific jobs. Our value is the **connection layer**, not rebuilding their data.

---

## 4. What WE built (what Mizzou does NOT bundle together)

### 4.1 Tiger Guide — AI copilot (Home page)

The main feature. A chat interface where students ask questions and receive structured answers.

| Capability | Details |
|------------|---------|
| **AI powered** | Google Gemini (`gemini-2.0-flash`) when API key is set |
| **Mock fallback** | Keyword-matched answers from knowledge base if no key or rate limit |
| **Knowledge-grounded** | 10 curated Mizzou topics (holds, Stellic, jobs, housing, etc.) |
| **Structured responses** | Title, answer, numbered steps, tips, official link buttons |
| **Career profile injection** | Major, year, goal personalizes Gemini prompts |
| **Suggested prompts** | One-click common questions |
| **Chat history** | Last 6 turns sent to Gemini for context |

**Knowledge topics covered:**
1. Financial hold  
2. Advisor hold  
3. Registration prep  
4. CS 2270 prerequisite  
5. Change of major  
6. Alumni mentoring  
7. Internships & jobs  
8. Off-campus housing  
9. Stellic help  
10. MizzouOne required tasks  

**Official links Tiger Guide sends users to:** MizzouOne, Stellic, Handshake, Mizzou Mentoring, offcampus.missouri.edu, Career Center, Academic Advising, Cashiers Office.

---

### 4.2 Animated welcome screen

| Feature | Details |
|---------|---------|
| **When it shows** | First visit per session; every time user clicks **Campus Pathfinder** logo |
| **Content** | "Welcome, Mizzou Students" + Mizzou black/gold branding |
| **Animated tool map** | Visual: Tiger Guide center → Stellic, MizzouOne, Handshake, Housing |
| **Intent tiles** | Clear a hold · Plan classes · Find housing · Jobs & mentors |
| **Actions** | Get started (runs chosen intent) or Skip intro |

---

### 4.3 Mizzou Tools Hub (`/tools`)

**One web page listing every Mizzou app** — the feature you asked for.

| Section | Count | Description |
|---------|-------|-------------|
| **Pathfinder features (ours)** | 4 | Tiger Guide, map, career timeline, mentor builder |
| **Official Mizzou links** | 18 | Stellic, Handshake, myZou, MizzouOne, etc. |
| **Categories** | 4 | Academic, Career, Campus life, Money & support |
| **Search** | Yes | Filter tools by name or description |

**Live URL:** https://namre10.github.io/campus-pathfinder/#/tools  
**Important:** Use `#/tools` in the URL (HashRouter).

---

### 4.4 College to Career bundle

| Feature | Route | What it does |
|---------|-------|--------------|
| **Career profile** | Home sidebar + Career pages | Major, year (Freshman–Senior), goal (Internship, Full-time, Grad school, Explore). Saved in browser. |
| **Internship timeline** | `/career/timeline` | Year-by-year checklist (Freshman → Senior) with links to Handshake, Career Center, Mizzou Mentoring, Stellic |
| **Mentor question builder** | `/career/mentor-questions` | Generates 5 tailored questions + copy button + link to Mizzou Mentoring |
| **Career advising** | `/career` | Advisor directory, book mock meetings, my meetings (prototype) |

**What's new vs Mizzou:** Handshake has jobs; Mizzou Mentoring has mentors. Neither gives you a **year-by-year roadmap** or **question prep** in one student-facing flow tied to Tiger Guide.

---

### 4.5 Campus & Columbia housing map

| Feature | Details |
|---------|---------|
| **Campus map** | Leaflet map with POI markers (Study, Dining, Classroom, Recreation, Parking, Services, Transit) |
| **Categories & search** | Filter and search campus locations |
| **Walking directions** | Route between campus points (OpenRouteService API — optional key) |
| **Location favorites** | Save campus locations (★) |
| **Columbia housing layer** | 22 off-campus apartment complexes across Columbia |
| **Walk time to campus** | Estimated minutes walking to **Mizzou Student Center** |
| **Bike time** | Estimated bike time to Student Center |
| **Distance** | km/miles from each complex to campus |
| **Filters** | Neighborhood, max rent, min bedrooms, max walk time |
| **Save apartments** | ♥ favorite — shows in ♥ Saved tab and Tiger Guide sidebar |
| **Compare apartments** | ⇄ select 2–3 — side-by-side table (rent, beds, walk/bike, neighborhood) |
| **Chat → map links** | Housing answers link to filtered map (e.g. ≤15 min walk) |

**Honest note for presentation:** Housing walk times are **estimates to the Student Center**, not to every individual building. Campus directions are **building-to-building** when using the directions tool.

---

### 4.6 Events, communities & supporting features

| Module | Route | Features |
|--------|-------|----------|
| **Events** | `/events` | Directory, filters, timeline view, save events, event detail |
| **Communities** | `/community` | Club directory, join/leave, profiles, activities |
| **Career meetings** | `/career/my-meetings` | Book advisor slots, calendar export (prototype mock data) |

---

## 5. How the app is organized (navigation)

| Nav item | Route | Purpose |
|----------|-------|---------|
| **Home** | `/` | Tiger Guide chat |
| **Mizzou tools** | `/tools` | Official app directory + Pathfinder features |
| **Map** | `/map` | Campus + Columbia housing |
| **Events** | `/events` | Campus events |
| **Community** | `/community` | Student clubs |
| **Career** | `/career` | Career hub, timeline, mentors, advisors |

---

## 6. Architecture (simple diagram)

```
Student
   │
   ▼
Welcome screen (intents)
   │
   ▼
Tiger Guide (Gemini + knowledge base)
   │
   ├──► Mizzou Tools Hub (/tools) ──► 18 official Mizzou links
   ├──► Career timeline ──► Handshake, Mentoring, Career Center
   ├──► Mentor question builder ──► Mizzou Mentoring
   ├──► Campus + housing map ──► POIs, filters, save, compare
   └──► Events / Community / Career advising
```

---

## 7. Technology stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript + JavaScript |
| **Build** | Vite 5 |
| **Routing** | React Router v6 (HashRouter for GitHub Pages) |
| **Maps** | Leaflet, react-leaflet, marker clustering |
| **AI** | Google Gemini API (`gemini-2.0-flash`) |
| **Search** | Fuse.js |
| **Storage** | Browser localStorage (favorites, career profile, saved apartments, meetings) |
| **Deploy** | GitHub Pages + GitHub Actions |
| **Backend** | None (frontend-only prototype) |

---

## 8. Live demo URLs (copy for presentation)

| Page | URL |
|------|-----|
| **Home (Tiger Guide)** | https://namre10.github.io/campus-pathfinder/ |
| **Mizzou Tools Hub** | https://namre10.github.io/campus-pathfinder/#/tools |
| **Map** | https://namre10.github.io/campus-pathfinder/#/map |
| **Housing (filtered)** | https://namre10.github.io/campus-pathfinder/#/map?housing=1&tab=housing&maxWalk=15 |
| **Career hub** | https://namre10.github.io/campus-pathfinder/#/career |
| **Career timeline** | https://namre10.github.io/campus-pathfinder/#/career/timeline |
| **Mentor questions** | https://namre10.github.io/campus-pathfinder/#/career/mentor-questions |
| **Events** | https://namre10.github.io/campus-pathfinder/#/events |

**Note:** Always use `#` before routes on GitHub Pages (e.g. `#/tools` not `/tools`).

---

## 9. Recommended 2-minute demo script

| Time | Action | Say |
|------|--------|-----|
| 0:00 | Click logo → Welcome screen | "Mizzou has many tools — we built one front door." |
| 0:15 | Pick **Jobs & mentors** or go Home | "Tiger Guide answers in plain English." |
| 0:30 | Ask: *"Where do I find internships?"* | Show answer + Handshake link |
| 0:45 | **Mizzou tools** in nav | "Every official Mizzou app in one page — 18 links." |
| 1:00 | **Career → Timeline** | "Year-by-year roadmap Mizzou doesn't bundle." |
| 1:15 | **Mentor question builder** | "Generate 5 questions before Mizzou Mentoring." |
| 1:30 | **Map → Columbia → ♥ Save** | "Housing with walk time, save, and compare." |
| 1:45 | Back to Home, show career profile | "Personalized to major, year, and goal." |
| 2:00 | Close | "Many portals → One guide → Right action." |

---

## 10. Pathfinders category fit

**Primary category:** College to Career  

**Evidence:**
- Career profile, internship timeline, mentor question builder  
- Tiger Guide topics: internships, alumni mentoring, Handshake  
- Mizzou Tools Hub links to all career official apps  

**Secondary:** Overcoming Obstacles (holds, registration, MizzouOne tasks)  
**Secondary:** Degree Planning (Stellic, prereqs, registration prep)  

**One sentence:**  
> "Tiger Guide helps Mizzou students move from confusion to action — internships, mentors, and official tools — through one conversation and one tools hub."

---

## 11. What makes us different (vs Mizzou alone)

| | Mizzou official tools | Campus Pathfinder |
|---|----------------------|-------------------|
| **Structure** | Separate apps & websites | One hub + one chat |
| **Guidance** | Static pages per site | AI conversation + steps |
| **Career path** | Handshake + Career Center separately | Timeline + mentor prep + links |
| **Housing** | offcampus.missouri.edu listings | Map + filter + save + compare + chat link |
| **Discovery** | Student must know which tool | Tools hub lists all 18 + search |
| **Personalization** | Per-app profiles | Career profile across Tiger Guide |

---

## 12. Limitations (say this honestly — builds trust)

- **Prototype only** — not an official Mizzou product  
- **Frontend-only** — no login, no live myZou/Stellic integration  
- **Knowledge base** — curated JSON, not all Mizzou policies  
- **Gemini free tier** — may rate-limit under heavy demo traffic; mock mode still works  
- **Housing walk times** — estimates to Student Center, not door-to-door to every class  
- **Mock data** — advisors, events, some listings are prototype data  
- **API key** — Gemini key in browser for demo (not production-safe)  

---

## 13. Future roadmap (vision slide)

1. **Backend Gemini proxy** — hide API key, fix rate limits  
2. **RAG over Mizzou FAQ PDFs** — richer, more accurate answers  
3. **Application tracker** — track internship apps alongside Handshake  
4. **Deeper Stellic companion** — lightweight what-if planner  
5. **Mobile PWA** — install on phone like a native app  

---

## 14. File & feature checklist (what we built in code)

| Component | File / route |
|-----------|--------------|
| Tiger Guide chat | `src/components/guide/TigerGuideChat.tsx` → `/` |
| Welcome screen | `src/components/guide/TigerGuideWelcome.tsx` |
| Gemini integration | `src/utils/tigerGuideLlm.ts` |
| Knowledge base | `src/data/tigerGuideKnowledge.json` |
| Mizzou Tools Hub | `src/components/tools/MizzouToolsHub.tsx` → `/tools` |
| Official tools data | `src/data/mizzouTools.json` |
| Career profile | `src/utils/careerProfile.ts`, `CareerProfileForm.tsx` |
| Internship timeline | `src/components/career/InternshipTimeline.tsx` → `/career/timeline` |
| Timeline data | `src/data/careerTimeline.json` |
| Mentor question builder | `src/components/career/MentorQuestionBuilder.tsx` → `/career/mentor-questions` |
| Housing map & filters | `src/utils/housing.ts`, `Sidebar.jsx`, `MapView.jsx` |
| Housing compare | `src/components/HousingComparePanel.tsx` |
| Saved apartments | `src/utils/housingFavorites.ts` |
| Pitch deck (browser) | `pitch-deck.html` |
| Pitch script | `PITCH_SCRIPT.md` |
| Deploy | `.github/workflows/deploy-pages.yml` |

---

## 15. Slide outline for PowerPoint / Gamma / Canva

1. **Title** — Campus Pathfinder · Tiger Guide · Mizzou copilot  
2. **Problem** — Many tools, no front door  
3. **Solution** — Ask → Explain → Open the right tool  
4. **Tiger Guide** — AI + knowledge + official links  
5. **Mizzou Tools Hub** — 18 official apps + 4 Pathfinder features  
6. **College to Career** — Profile, timeline, mentor questions  
7. **Map & housing** — Walk time, filter, save, compare  
8. **Live demo** — namre10.github.io/campus-pathfinder/#/tools  
9. **Differentiator** — We connect, we don't replace  
10. **Thank you / Questions**  

---

## 16. Key phrases for Q&A

**Q: How is this different from MizzouOne?**  
> MizzouOne is a task launcher. Tiger Guide is a conversation that explains *why* and routes you with steps — plus career roadmap and housing tools MizzouOne doesn't include.

**Q: How is this different from offcampus.missouri.edu?**  
> They have listings and commute. We add chat guidance, save/compare, and connect housing questions to the map from Tiger Guide.

**Q: Is the AI official Mizzou policy?**  
> No — it's a prototype grounded in a curated knowledge base. We always link to official sites for real actions.

**Q: What's actually new?**  
> The bundle: one chat + one tools directory + career roadmap + mentor prep + housing map UX — none of which Mizzou offers as one student experience.

---

*Last updated: August 2026 — Campus Pathfinder / Tiger Guide for Mizzou Pathfinders*
