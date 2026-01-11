GenAI Prompt Repo PWA - Complete Requirements
Project: Web-based, PWA-compatible repository for multimodal GenAI prompts with guided JSON image style editor.
Target: Hand this spec to a CLI coding agent to build a fully functional MVP.
Date: January 11, 2026
​
Schema Reference: image-schema.json (attached/embedded) - upper-bound JSON Schema for image style profiles.
​

🚀 High-level goals
Build a web app (desktop + mobile) with PWA support (installable, offline-friendly) that manages a personal repository of GenAI prompts:

Prompts: text, image, video, code (modal-type aware).

Image styles: JSON documents conforming to the attached schema with guided editor (forms, examples, autocomplete, sliders, presets) instead of raw JSON editing.
​

Extensible to video styles, code styles later.

Single-tenant/self-hosted deployment. MongoDB backend.

📊 Core data model
Prompt collection
json
{
  "id": "ulid",
  "title": "string",
  "description": "string?",
  "modal_type": "text|image|video|code|audio|other",
  "content": {
    // text: "string"
    // image: { "prompt": "string", "content_descriptor": {}? }
    // video: { "prompt": "string", "shot_list": []? }
    // code: { "language": "string", "snippet": "string", "instructions": "string" }
  },
  "style_profile_id": "string?",
  "tags": ["string"],
  "metadata": {},
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "owner_id": "string"  // for future multi-user
}
StyleProfile collection
json
{
  "id": "string",  // e.g. "style.neo_noir.v1"
  "schema_version": "1.0.0",
  "name": "string",
  "description": "string",
  "tags": ["string"],
  "style_json": {},  // MUST validate against image-schema.json
  "is_template": boolean,
  "usage_count": number,
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "owner_id": "string"
}
Validation: Server-side JSON Schema validation for style_json. Store schema in /public/schemas/image-style-profile.schema.json.
​

🎯 Functional requirements
1. Prompt management
text
CRUD:
- /prompts          GET  → paginated list
- /prompts/:id      GET/PUT/DELETE
- /prompts          POST → create

Filters:
- modal_type, tags, style_profile_id
Detail view:

Show content + style summary (name, top movements/mood/palette.mode).

"Edit style" → navigate to style_profile_id editor.

Export: raw prompt JSON, merged content+style JSON.

2. Style library
text
CRUD:
- /styles           GET  → paginated list
- /styles/:id       GET/PUT/DELETE
- /styles           POST → create
- /styles/validate  POST → validate arbitrary JSON against schema
Search:

text
GET /styles?search=neo&tags=cinematic&intent=style_only
3. Guided style editor (key UX feature)
Multi-tab/accordion layout mapping to schema sections:

text
1. Intent & Scaffolding
2. Aesthetic
3. Palette
4. Lighting
5. Composition
6. Camera
7. Materials
8. Rendering
9. Post-process
10. Typography
11. Consistency
12. References
13. Negative
14. Output
15. Safety & Engine
Control patterns by field type:

Schema type	UI Control	Examples/Suggestions
enum string	Dropdown	palette.mode: full_color, limited_palette, monochrome
weighted_string[]	Chip input + weight slider (-5 to 5)	movements: "film noir"(1.5), "neo-noir"(1.0)
number 0-1	Slider	postprocess.bloom: 0 → 1
number 0-2	Slider	references[].strength: 0 → 2
colors[].hex	Color picker	#0b1020 (background)
arrays of strings	Token input + presets	negative.artifact_avoidance: ["extra fingers", "watermarks"]
Live preview: JSON panel + validation status (green/red).

Presets (hardcode 10 initial styles):

text
"Neo-Noir Cinematic", "Studio Ghibli", "Cyberpunk Neon", "Vaporwave", "Oil Painting", "DSLR Portrait", "Pixar 3D", "Polaroid", "Anime Cel", "Sketchbook"
Autocomplete dictionary (static JSON):

text
art_movements: ["film noir", "cyberpunk", "impressionism", "studio ghibli", "pixar"],
lighting_setups: ["low-key", "chiaroscuro", "neon practicals", "golden hour"],
camera_angles: ["low angle", "dutch tilt", "overhead"]
4. Export features
text
From prompt/style detail:
- Copy raw JSON
- Copy expanded NL prompt (using prompt_scaffolding.template)
- Download JSON file
5. PWA offline
text
Service worker:
- Cache app shell
- Cache last 50 prompts, 20 styles
- Queue mutations → sync on reconnect
🏗️ Tech stack
text
Frontend: React 18 + Vite + TypeScript + Tailwind + React Hook Form
- PWA: vite-plugin-pwa
- JSON Schema: @rjsf/core (form gen) + ajv (validation)
- State: Zustand or Jotai
- UI: shadcn/ui + lucide-react icons

Backend: FastAPI + Pydantic + Motor (MongoDB)
- Schema validation: jsonschema
- CORS: allow frontend origin

Database: MongoDB (local or Atlas)
- Collections: prompts, style_profiles, schemas

Deployment:
- Docker compose: frontend nginx + backend uvicorn + mongodb
- Or: Vercel (frontend) + Render (backend) + Atlas
File structure:

text
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PromptList.tsx
│   │   │   ├── StyleEditor.tsx
│   │   │   └── GuidedForm.tsx
│   │   ├── hooks/
│   │   ├── schemas/
│   │   │   └── image-style-profile.schema.json
│   │   └── pages/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── prompts.py
│   │   │   └── styles.py
│   │   ├── models/
│   │   │   └── style_profile.py
│   │   └── schemas/
│   │       └── image_style_schema.json
├── docker-compose.yml
└── README.md
🔧 Backend API spec (OpenAPI)
text
POST /api/prompts
  Body: PromptCreate
  Returns: Prompt

GET /api/prompts?page=1&limit=20&modal_type=image&tags=cinematic
  Returns: { items: Prompt[], total: number }

POST /api/styles/validate
  Body: { style_json: object }
  Returns: { valid: boolean, errors: [] }

POST /api/styles/{id}/expand
  Body: { content: string }
  Returns: { natural_prompt: string }
Pydantic models:

python
class StyleJSON(BaseModel):
    # Generated from schema
    schema_version: str
    style: dict  # etc.

class PromptCreate(BaseModel):
    title: str
    modal_type: Literal["text", "image", "video", "code"]
    content: dict
    style_profile_id: str | None = None
🎨 UI wireframes (text)
Style library
text
[Search: neo noir] [Filter: Image] [New Style]

Neo-Noir Cinematic ● ● ● (12 uses)
tags: noir, cinematic, moody
palette: limited (cool blues + red accent)
lighting: low-key dramatic

Studio Ghibli ● ● ● (8 uses)
tags: anime, whimsical, hand-drawn
Guided style editor
text
Style: Neo-Noir Cinematic [Save] [Clone]

Intent (dropdowns)
☑ style_only  priority: high  strictness: balanced

Aesthetic
Movements: [film noir ● 1.5] [neo-noir ● 1.0] [+ Add]
Medium: [cinematic still ● 1.0]
Mood: [tense ● 0.7]

Palette
Mode: ▽ limited_palette
Colors: [ #0b1020 ● bg 45% ] [ #ff3b30 ● accent 20% ] [+ Color]
Contrast: ▽ high  Temp: ▽ cool

[Live JSON Preview →]  ✓ Valid
📦 Initial data (seed 10 style presets)
Embed in backend seed script. Example for "Neo-Noir Cinematic":

json
{
  "id": "style.neo_noir.v1",
  "schema_version": "1.0.0",
  "name": "Neo-Noir Cinematic",
  "style": {
    "aesthetic": {
      "movements": [{"value": "film noir", "weight": 1.5}, {"value": "neo-noir", "weight": 1.0}],
      "mood": [{"value": "tense", "weight": 0.7}, {"value": "moody", "weight": 0.9}]
    },
    "palette": {
      "mode": "limited_palette",
      "colors": [{"hex": "#0b1020", "role": "background"}],
      "contrast": "high", "temperature": "cool"
    }
  }
}
✅ Acceptance criteria
MVP complete when:

✅ App installs as PWA (Chrome devtools audit).

✅ Create prompt → list → detail → edit → delete.

✅ Create style → guided form → validate → save → list.

✅ Attach style to image prompt → export merged JSON.

✅ Style editor covers 80% schema fields with proper controls.

✅ Docker compose up → works on localhost:3000 (frontend), :8000 (API).

✅ Offline: cache works, queue mutations sync.

Nice-to-have (post-MVP):

Multi-user (users table).

Image preview for reference.images.

Prompt testing (integrate OpenAI API key).