# Project Plan: GenAI Prompt Repo PWA

**Goal:** Build a complete MVP of a PWA-compatible GenAI prompt repository with a guided JSON style editor.

## 1. Backend Verification & Completion (Python/FastAPI)
- [ ] **Verify Database Connection:** Check `backend/app/database.py` for correct Motor/MongoDB URL (Docker friendly).
- [ ] **Verify Models:** Check `backend/app/models/prompt.py` and `backend/app/models/style_profile.py` against `req.md`.
- [ ] **Implement Style Validation:** Ensure `backend/app/api/styles.py` implements JSON Schema validation using `image-schema.json`.
- [ ] **Create Seed Script:** Create a script to seed the database with the 10 required style presets.
- [ ] **Docker Check:** Ensure `backend/Dockerfile` and `docker-compose.yml` are correctly configured for the API.

## 2. Frontend Scaffolding (React/Vite)
- [ ] **Initialize Project:** `npm create vite@latest frontend -- --template react-ts`.
- [ ] **Install Dependencies:**
    - UI: `tailwindcss postcss autoprefixer shadcn-ui lucide-react clsx tailwind-merge`
    - Logic: `zustand react-hook-form @hookform/resolvers zod axios`
    - Forms: `@rjsf/core @rjsf/utils @rjsf/validator-ajv8`
    - PWA: `vite-plugin-pwa`
- [ ] **Configure Tailwind:** `npx tailwindcss init -p`, configure `content` paths.
- [ ] **Setup Directory Structure:** `components/ui`, `pages`, `hooks`, `lib`, `schemas`.
- [ ] **Copy Schema:** Copy `image-schema.json` to `frontend/public/schemas/` (or `frontend/src/schemas/` if importing directly).

## 3. Frontend Core Logic
- [ ] **API Client:** Create `frontend/src/lib/api.ts` (Axios instance).
- [ ] **State Management:** Create `frontend/src/hooks/usePrompts.ts` and `frontend/src/hooks/useStyles.ts` (Zustand).
- [ ] **Schema Loader:** Utility to fetch/load `image-schema.json` for validation.

## 4. Feature Implementation
- [ ] **Navigation/Layout:** Main App shell with navigation (Prompts, Styles).
- [ ] **Prompt Management:**
    - [ ] `PromptList` component (Grid/List view).
    - [ ] `PromptForm` component (Create/Edit).
    - [ ] Detail view with Style Profile summary.
- [ ] **Style Management:**
    - [ ] `StyleList` component.
    - [ ] `GuidedStyleForm` (The "Key UX Feature").
        - Implement tabs/accordion for schema sections.
        - Map schema fields to UI controls (Sliders, Dropdowns, Chip inputs).
        - Live JSON preview panel.

## 5. PWA & Deployment
- [ ] **PWA Config:** Configure `vite.config.ts` with `VitePWA` plugin (manifest, icons, caching strategies).
- [ ] **Service Worker:** Ensure offline caching for "last 50 prompts, 20 styles".
- [ ] **Docker Compose:** Finalize `docker-compose.yml` to orchestrate Frontend (Nginx/Serve), Backend (Uvicorn), and Mongo.

## 6. Verification
- [ ] **Manual Testing:** Walkthrough of all User Stories (Create Prompt, Edit Style, Offline check).
- [ ] **Automated Checks:** Linting, Build check.
