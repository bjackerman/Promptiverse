# GEMINI.md - GenAI Prompt Repo Coding Standards & Instructions

**For**: Gemini CLI coding agent (or equivalent)  
**Project**: GenAI Prompt Repo PWA  
**Date**: January 11, 2026  
**Instructions**: Build COMPLETE working MVP from requirements.md + this standards file.

## 🎯 BUILD INSTRUCTIONS

```
1. Clone/create new repo: "genai-prompt-repo"
2. READ requirements.md COMPLETELY first
3. Use EXACT tech stack below
4. Generate FULL Docker Compose deployment
5. Seed 10 style presets on first run
6. Test ALL acceptance criteria
7. COMMIT every major component
8. Output: working localhost:3000 app
```

## 🛠️ EXACT TECH STACK

```
FRONTEND:
├── React 18 + Vite + TypeScript 5.4
├── Tailwind CSS + shadcn/ui
├── React Hook Form + Zod
├── @rjsf/core + ajv (JSON Schema forms)
├── zustand (state)
├── lucide-react (icons)
├── vite-plugin-pwa (PWA)
├── clsx + tailwind-merge (classnames)

BACKEND:
├── FastAPI 0.115 + Pydantic v2
├── Motor (MongoDB async driver)
├── python-jsonschema (validation)
├── python-multipart (file uploads)
├── alembic (future migrations)
├── uvicorn[standard]

DATABASE:
├── MongoDB 7.x (docker)
└── Collections: prompts, style_profiles, schemas
```

## 📁 REQUIRED FILE STRUCTURE

```
genai-prompt-repo/
├── README.md                    # Setup + usage
├── docker-compose.yml           # ONE COMMAND DEPLOY
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── ui/              # shadcn components
│   │   │   ├── PromptList.tsx
│   │   │   ├── PromptForm.tsx
│   │   │   ├── StyleList.tsx
│   │   │   ├── StyleEditor.tsx
│   │   │   └── GuidedStyleForm.tsx
│   │   ├── hooks/
│   │   │   ├── usePrompts.ts
│   │   │   └── useStyles.ts
│   │   ├── lib/
│   │   │   ├── schema.ts        # AJV instance + schema loader
│   │   │   └── api.ts           # API client
│   │   ├── pages/
│   │   │   ├── Prompts.tsx
│   │   │   ├── Styles.tsx
│   │   │   └── Dashboard.tsx
│   │   └── schemas/
│   │       └── image-style-profile.schema.json
├── backend/
│   ├── requirements.txt
│   ├── main.py                  # FastAPI app
│   ├── app/
│   │   ├── __init__.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── prompts.py
│   │   │   └── styles.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── prompt.py
│   │   │   └── style_profile

[1](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/388533/09392351-d428-4990-9ad7-5ef012c7ad9b/image-schema.json)