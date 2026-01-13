import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# Presets data
presets = [
  {
    "id": "style.neo_noir.v1",
    "schema_version": "1.0.0",
    "name": "Neo-Noir Cinematic",
    "description": "High contrast, moody lighting, urban settings.",
    "tags": ["noir", "cinematic", "moody"],
    "style": {
      "aesthetic": {
        "movements": [{"value": "film noir", "weight": 1.5}, {"value": "neo-noir", "weight": 1.0}],
        "mood": [{"value": "tense", "weight": 0.7}, {"value": "moody", "weight": 0.9}]
      },
      "palette": {
        "mode": "limited_palette",
        "colors": [{"hex": "#0b1020", "role": "background", "name": "Dark Blue"}],
        "contrast": "high", "temperature": "cool"
      },
      "lighting": { "setup": "chiaroscuro", "quality": "hard" }
    }
  },
  {
    "id": "style.studio_ghibli.v1",
    "schema_version": "1.0.0",
    "name": "Studio Ghibli",
    "description": "Whimsical, hand-drawn anime style.",
    "tags": ["anime", "whimsical", "hand-drawn"],
    "style": {
        "aesthetic": {
            "movements": [{"value": "studio ghibli", "weight": 1.5}],
            "medium": [{"value": "cel shading", "weight": 1.0}, {"value": "watercolor background", "weight": 0.8}]
        },
        "palette": { "mode": "full_color", "saturation": "vivid" }
    }
  },
  {
      "id": "style.cyberpunk_neon.v1",
      "schema_version": "1.0.0",
      "name": "Cyberpunk Neon",
      "description": "Futuristic, high-tech, neon lights.",
      "tags": ["sci-fi", "neon", "cyberpunk"],
      "style": {
          "aesthetic": { "movements": [{"value": "cyberpunk", "weight": 1.5}] },
          "lighting": { "effects": [{"value": "bloom", "weight": 0.8}, {"value": "neon", "weight": 1.0}] },
          "palette": { "temperature": "cool" }
      }
  },
  {
      "id": "style.vaporwave.v1",
      "schema_version": "1.0.0",
      "name": "Vaporwave",
      "description": "Retro 80s, pastel colors, surreal.",
      "tags": ["retro", "80s", "surreal"],
      "style": {
          "aesthetic": { "movements": [{"value": "vaporwave", "weight": 1.5}] },
          "palette": { "mode": "limited_palette", "harmonies": ["triadic"] }
      }
  },
  {
      "id": "style.oil_painting.v1",
      "schema_version": "1.0.0",
      "name": "Oil Painting",
      "description": "Classic textured oil painting look.",
      "tags": ["traditional", "painting", "texture"],
      "style": {
          "aesthetic": { "medium": [{"value": "oil paint", "weight": 1.5}], "technique": [{"value": "impasto", "weight": 0.7}] }
      }
  },
  {
      "id": "style.dslr_portrait.v1",
      "schema_version": "1.0.0",
      "name": "DSLR Portrait",
      "description": "Photorealistic portrait with depth of field.",
      "tags": ["photo", "portrait", "realistic"],
      "style": {
          "camera": { "lens": { "focal_length_mm": 85, "aperture_f": 1.8 }, "depth_of_field": "shallow" },
          "materials": { "realism_level": "photoreal" }
      }
  },
  {
      "id": "style.pixar_3d.v1",
      "schema_version": "1.0.0",
      "name": "Pixar 3D",
      "description": "3D animated movie style.",
      "tags": ["3d", "animation", "cute"],
      "style": {
          "aesthetic": { "medium": [{"value": "3d render", "weight": 1.5}, {"value": "pixar style", "weight": 1.0}] },
          "rendering": { "detail": "high", "sharpness": "soft" }
      }
  },
  {
      "id": "style.polaroid.v1",
      "schema_version": "1.0.0",
      "name": "Polaroid",
      "description": "Vintage instant film look.",
      "tags": ["vintage", "film", "nostalgia"],
      "style": {
          "camera": { "film_emulation": { "enabled": true, "stock": "polaroid" } },
          "postprocess": { "vignette": 0.5, "color_grading": "vintage" }
      }
  },
  {
      "id": "style.anime_cel.v1",
      "schema_version": "1.0.0",
      "name": "Anime Cel",
      "description": "Standard 2D anime cel shading.",
      "tags": ["anime", "2d", "cel-shaded"],
      "style": {
          "aesthetic": { "medium": [{"value": "anime", "weight": 1.5}] },
          "materials": { "line_work": { "enabled": true, "thickness": "thin" } }
      }
  },
  {
      "id": "style.sketchbook.v1",
      "schema_version": "1.0.0",
      "name": "Sketchbook",
      "description": "Rough pencil or charcoal sketch.",
      "tags": ["sketch", "monochrome", "rough"],
      "style": {
           "aesthetic": { "medium": [{"value": "pencil sketch", "weight": 1.5}] },
           "palette": { "mode": "monochrome" }
      }
  }
]

async def seed():
    print("Connecting to MongoDB...")
    mongo_url = os.environ.get("MONGODB_URL", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get("DATABASE_NAME", "promptiverse")]

    collection = db["style_profiles"]

    print(f"Seeding {len(presets)} styles...")
    for preset in presets:
        # Check if exists
        existing = await collection.find_one({"_id": preset["id"]})
        if not existing:
            # Adjust _id
            data = preset.copy()
            data["_id"] = data.pop("id")
            data["created_at"] = datetime.utcnow()
            data["updated_at"] = datetime.utcnow()
            await collection.insert_one(data)
            print(f"Inserted: {preset['name']}")
        else:
            print(f"Skipped (exists): {preset['name']}")

    print("Seeding complete.")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
