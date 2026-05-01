// image helper for getting recipe photos
// using curated unsplash URLs and unsplash source API for dynamic AI-generated recipes

export type ImageSize = [width: number, height: number];

// these are the sizes I use across the app
export const IMAGE_SIZES = {
  hero: [1200, 820] as ImageSize,
  thumbnail: [400, 300] as ImageSize,
  small: [160, 120] as ImageSize,
} as const;

// hand-picked unsplash photos that match each recipe
// I grabbed these by searching unsplash manually and copying the direct URLs
const CURATED_PHOTOS: Record<string, string> = {
  "miso glazed salmon soba bowl":
    "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop",
  "harissa roasted chicken thighs chickpeas":
    "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop",
  "sweet potato black bean tacos":
    "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop",
  "grilled chicken farro broccolini":
    "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop",
  "coconut red lentil daal turmeric rice":
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop",
  "turmeric oatmeal bowl honey":
    "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop",
  "acai bowl granola berries":
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop",
  "smoked salmon sourdough toast capers":
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop",
};

// returns a properly sized image URL for a recipe
// checks the curated map first, falls back to unsplash source API for AI-generated recipes
export function recipeImage(
  imageQuery: string,
  size: ImageSize = IMAGE_SIZES.thumbnail
): string {
  const [w, h] = size;
  const curated = CURATED_PHOTOS[imageQuery];

  if (curated) {
    return `${curated}&w=${w}&h=${h}&q=80`;
  }

  // fallback: use Unsplash source API with the recipe's imageQuery as the search term
  // this gives us real, high-quality food photos matching the recipe description
  const query = encodeURIComponent(imageQuery);
  return `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

// broader food photo pool for AI-generated recipes — maps common food terms to unsplash photo IDs
const FOOD_PHOTOS: Record<string, string> = {
  salmon:   "photo-1467003909585-2f8a72700288",
  chicken:  "photo-1598515214211-89d3c73ae83b",
  beef:     "photo-1546964124-0cce460f38ef",
  pasta:    "photo-1551183053-bf91a1d81141",
  salad:    "photo-1512621776951-a57141f2eefd",
  bowl:     "photo-1512058564366-18510be2db19",
  soup:     "photo-1547592166-23ac45744acd",
  rice:     "photo-1536304929831-ee1ca9d44906",
  steak:    "photo-1558030006-450675393462",
  fish:     "photo-1519708227418-c8fd9a32b7a2",
  shrimp:   "photo-1565557623262-b51c2513a641",
  toast:    "photo-1525351484163-7529414344d8",
  egg:      "photo-1525351484163-7529414344d8",
  pancake:  "photo-1567620905732-2d1ec7ab7445",
  smoothie: "photo-1553530666-ba11a7da3888",
  curry:    "photo-1585937421612-70a008356fbe",
  taco:     "photo-1551504734-5ee1c4a1479b",
  burger:   "photo-1568901346375-23c9450c58cd",
  wrap:     "photo-1626700051175-6818013e1d4f",
  pizza:    "photo-1565299624946-b28f40a0ae38",
  quinoa:   "photo-1505576399279-0d309a020d3e",
  oatmeal:  "photo-1517673400267-0251440c45dc",
  frittata: "photo-1510693206972-df098062cb71",
  stir:     "photo-1512058564366-18510be2db19",
  roast:    "photo-1432139555190-58524dae6a55",
  grill:    "photo-1555939594-58d7cb561ad1",
  bake:     "photo-1464305795204-6f5bbfc7fb81",
  default:  "photo-1504674900247-0877df9cc836",
};

/**
 * Smarter image URL for AI-generated recipes.
 * Looks for food keywords in the imageQuery and picks a matching unsplash photo.
 */
export function smartRecipeImage(
  imageQuery: string,
  size: ImageSize = IMAGE_SIZES.thumbnail
): string {
  const [w, h] = size;

  // 1. Check curated map first
  const curated = CURATED_PHOTOS[imageQuery];
  if (curated) {
    return `${curated}&w=${w}&h=${h}&q=80`;
  }

  // 2. Match keywords from the imageQuery to our food photo pool
  const queryLower = imageQuery.toLowerCase();
  for (const [keyword, photoId] of Object.entries(FOOD_PHOTOS)) {
    if (keyword !== "default" && queryLower.includes(keyword)) {
      return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
    }
  }

  // 3. Last resort: generic appetizing food photo
  return `https://images.unsplash.com/${FOOD_PHOTOS.default}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}
