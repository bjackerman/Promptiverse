import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

# Database Config
MONGODB_URL = os.environ.get("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.environ.get("DATABASE_NAME", "promptiverse")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

STYLES = [
    {
        "_id": "style.neo_noir.v1",
        "name": "Neo-Noir Cinematic",
        "description": "High contrast, dark shadows, urban atmosphere, teal and orange palette",
        "tags": ["cinematic", "noir", "urban", "dramatic"],
        "schema_version": "1.0.0",
        "style": {
            "aesthetic": {
                "movements": [{"value": "film noir", "weight": 1.5}, {"value": "neo-noir", "weight": 1.0}],
                "mood": [{"value": "tense", "weight": 0.7}, {"value": "moody", "weight": 0.9}]
            },
            "palette": {
                "mode": "limited_palette",
                "colors": [{"hex": "#0b1020", "role": "background"}, {"hex": "#ff3b30", "role": "accent"}],
                "contrast": "high", 
                "temperature": "cool"
            }
        },
        "is_template": True
    },
    {
        "_id": "style.studio_ghibli.v1",
        "name": "Studio Ghibli",
        "description": "Whimsical, hand-drawn aesthetic, lush environments, vibrant natural colors",
        "tags": ["anime", "whimsical", "hand-drawn", "nature"],
        "schema_version": "1.0.0",
        "style": {
             "aesthetic": {
                "movements": [{"value": "studio ghibli", "weight": 1.0}],
                "mood": [{"value": "whimsical", "weight": 1.0}, {"value": "peaceful", "weight": 0.8}]
            },
            "palette": {
                "mode": "full_color",
                "contrast": "medium",
                "temperature": "warm"
            }
        },
        "is_template": True
    },
    {
        "_id": "style.cyberpunk.v1",
        "name": "Cyberpunk Neon",
        "description": "Futuristic, neon lights, high tech low life, rain-slicked streets",
        "tags": ["scifi", "neon", "futuristic", "urban"],
        "schema_version": "1.0.0",
        "style": {
             "aesthetic": {
                "movements": [{"value": "cyberpunk", "weight": 1.0}],
                "mood": [{"value": "energetic", "weight": 0.8}, {"value": "gritty", "weight": 0.6}]
            },
             "palette": {
                "mode": "limited_palette",
                 "colors": [{"hex": "#00ff00", "role": "neon"}, {"hex": "#ff00ff", "role": "neon"}, {"hex": "#050505", "role": "dark"}],
                "contrast": "high"
            }
        },
        "is_template": True
    },
    {
        "_id": "style.vaporwave.v1",
        "name": "Vaporwave",
        "description": "Retro 80s/90s aesthetic, pastel colors, glitch art elements, marble statues",
        "tags": ["retro", "pastel", "surreal", "80s"],
        "schema_version": "1.0.0",
        "style": {
            "palette": {
                "mode": "limited_palette",
                "colors": [{"hex": "#ff99cc", "role": "pink"}, {"hex": "#99ccff", "role": "blue"}],
                "contrast": "low",
                "temperature": "cool"
            }
        },
        "is_template": True
    },
    {
        "_id": "style.oil_painting.v1",
        "name": "Oil Painting",
        "description": "Textured brushstrokes, rich colors, classical composition",
        "tags": ["traditional", "artistic", "painterly"],
        "schema_version": "1.0.0",
        "style": {
             "aesthetic": {
                "medium": "oil painting"
            },
             "rendering": {
                 "style": "painterly"
             }
        },
        "is_template": True
    },
    {
        "_id": "style.dslr_portrait.v1",
        "name": "DSLR Portrait",
        "description": "Photorealistic, sharp focus, bokeh background, flattering lighting",
        "tags": ["photo", "realistic", "portrait"],
        "schema_version": "1.0.0",
        "style": {
             "camera": {
                 "lens": "85mm",
                 "aperture": "f/1.8"
             }
        },
        "is_template": True
    },
    {
        "_id": "style.pixar_3d.v1",
        "name": "Pixar 3D",
        "description": "3D render, smooth surfaces, expressive characters, bright lighting",
        "tags": ["3d", "animation", "cute"],
        "schema_version": "1.0.0",
        "style": {
             "aesthetic": {
                 "movements": [{"value": "pixar", "weight": 1.0}]
             },
             "rendering": {
                 "engine": "octane render"
             }
        },
        "is_template": True
    },
    {
        "_id": "style.polaroid.v1",
        "name": "Polaroid",
        "description": "Vintage instant film look, soft focus, vignette, color shift",
        "tags": ["vintage", "photo", "retro"],
        "schema_version": "1.0.0",
        "style": {
             "aesthetic": {
                 "medium": "polaroid"
             },
             "postprocess": {
                 "vignette": 0.5,
                 "grain": 0.3
             }
        },
        "is_template": True
    },
    {
        "_id": "style.anime_cel.v1",
        "name": "Anime Cel",
        "description": "Flat shading, bold lines, distinct shadows, anime aesthetic",
        "tags": ["anime", "2d", "flat"],
        "schema_version": "1.0.0",
        "style": {
             "aesthetic": {
                 "medium": "cel shaded"
             },
             "rendering": {
                 "style": "flat"
             }
        },
        "is_template": True
    },
    {
        "_id": "style.sketchbook.v1",
        "name": "Sketchbook",
        "description": "Rough pencil lines, monochrome or subtle color, paper texture",
        "tags": ["sketch", "drawing", "monochrome"],
        "schema_version": "1.0.0",
        "style": {
             "aesthetic": {
                 "medium": "pencil sketch"
             },
             "palette": {
                 "mode": "monochrome"
             }
        },
        "is_template": True
    }
]

async def seed():
    print("Checking database connection...")
    try:
        # Ping
        await client.admin.command('ping')
        print("Connected to MongoDB.")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        return

    collection = db["style_profiles"]
    
    for style in STYLES:
        existing = await collection.find_one({"_id": style["_id"]})
        if not existing:
            await collection.insert_one(style)
            print(f"Seeded: {style['name']}")
        else:
            print(f"Skipped (Exists): {style['name']}")

    print("Seeding complete.")

if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(seed())
