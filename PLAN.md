# Plan for GenAI Prompt Repo PWA

1. *Initialize Frontend Project*
   - Create `frontend/` directory using Vite (React + TypeScript).
   - Install dependencies: `tailwindcss`, `shadcn/ui`, `react-hook-form`, `zod`, `@rjsf/core`, `zustand`, `lucide-react`, `vite-plugin-pwa`.
   - Configure Tailwind CSS.
   - Setup project structure (`src/components`, `src/pages`, `src/hooks`, `src/lib`).

2. *Backend Implementation Check & Fix*
   - Verify `backend/app/models/` for `Prompt` and `StyleProfile` models.
   - Verify `backend/app/api/` for endpoints (`prompts.py`, `styles.py`).
   - Ensure MongoDB connection in `backend/app/database.py` handles Docker connection string.
   - Add `image-schema.json` to backend schemas if missing.

3. *Implement Frontend Infrastructure*
   - Setup API client (`src/lib/api.ts`) using `axios` or `fetch`.
   - Setup global state using `zustand` (`usePrompts`, `useStyles`).
   - Setup routing (`react-router-dom` or similar).

4. *Implement Prompt Management (Frontend)*
   - Create `PromptList` component with filters.
   - Create `PromptForm` component for creating/editing prompts.
   - Create `PromptDetail` view.
   - Implement `Prompts.tsx` page.

5. *Implement Style Management (Frontend)*
   - Create `StyleList` component.
   - Create `StyleEditor` component.
   - Implement `Styles.tsx` page.

6. *Implement Guided Style Editor (Frontend)*
   - Create `GuidedStyleForm.tsx` using `@rjsf/core` or custom form components mapping to `image-schema.json`.
   - Implement sections: Intent, Aesthetic, Palette, etc.
   - Add live JSON preview.

7. *Docker Compose & Deployment*
   - Verify `docker-compose.yml` serves frontend (port 3000), backend (port 8000), and MongoDB.
   - Ensure correct networking between containers.

8. *Data Seeding*
   - Create a script (e.g., `backend/seed.py`) to insert the 10 style presets into MongoDB.
   - Add a step in `docker-compose` or `main.py` to run seeding on startup if empty.

9. *PWA & Offline Support*
   - Configure `vite-plugin-pwa` in `frontend/vite.config.ts`.
   - Implement service worker caching strategies.

10. *Verification & Testing*
    - Verify all acceptance criteria from `req.md`.
    - Test "Create prompt → list → detail → edit → delete".
    - Test "Create style → guided form → validate → save → list".
    - Test "Attach style to image prompt → export merged JSON".
    - Verify PWA installation audit.
    - Run pre-commit checks.

11. *Submit*
    - Submit the changes.
