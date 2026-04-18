// image helper for getting recipe photos
// using curated unsplash URLs since the source API got deprecated

export type ImageSize = [width: number, height: number];

// these are the sizes I use across the app
export const IMAGE_SIZES = {
  hero: [800, 500] as ImageSize,
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
// checks the curated map first, falls back to loremflickr if I haven't added one yet
export function recipeImage(
  imageQuery: string,
  size: ImageSize = IMAGE_SIZES.thumbnail
): string {
  const [w, h] = size;
  const curated = CURATED_PHOTOS[imageQuery];

  if (curated) {
    return `${curated}&w=${w}&h=${h}&q=80`;
  }

  // fallback for any new recipes that don't have a curated photo yet
  const query = encodeURIComponent(imageQuery.replace(/\s+/g, ","));
  return `https://loremflickr.com/${w}/${h}/food,${query}`;
}
