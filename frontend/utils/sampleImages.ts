// Placeholder data structure for sample glasses images
// In a real application, these URLs would point to actual images
// You might map these based on the *recommendation text* or the *predicted shape*

export const sampleGlassesImages: Record<string, string[]> = {
  // Examples mapping based on keywords potentially found in recommendations
  "Wayfarer": [
    "https://assets.lenscrafters.com/is/image/LensCrafters/8056597891097__001.png",
  ],
  "Aviator": [
    "https://assets.lenscrafters.com/is/image/LensCrafters/8053672741872__STD__shad__cfr.png?impolicy=LC_grey",
  ],
  "Square": [
    "https://i5.walmartimages.com/asr/3076594c-b7de-4550-82b0-82aea340eed0.3c928bf48e56f721564b9fc069605ec8.jpeg?odnHeight=264&odnWidth=264&odnBg=FFFFFF",
  ],
  "Round": [
    "https://img.drz.lazcdn.com/3rd/q/aHR0cDovL3BzcGsubG9uZ3BlYW4uY29tLzI0OTU5MTE0MDA3OTgxLmpwZWc=_960x960q80.png_.webp",
  ],
  "Oval": [
    "https://assets.lenscrafters.com/is/image/LensCrafters/8053672602869__001.png",
  ],
  "Cat-eye": [
    "https://cdn11.bigcommerce.com/s-hcrifnprha/images/stencil/1280x1280/products/19632/68066/8434d__10081.1687131277.jpg?c=2?imbypass=on",
  ],
  "Browline": [
    "https://res.ygstatic.com/frame/1407/14072/1/2.1800.1659348126-a95.jpg",
  ],
  "Rimless": [
    "https://m.media-amazon.com/images/I/51te4fNnhrL._AC_SL1500_.jpg",
  ],
  "Geometric": [
    "https://www.bonlook.ca/cdn/shop/files/Prism_DeepGold_Front_O_close-up.jpg?v=1701700512",
  ],
  // Example fallback if shape is directly used (less precise)
  "default": [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkIS7HlVoavb0L2Wg5DCZhm-vdRop0lNIhBw&s",
  ]
};

// Helper function to extract relevant keywords from recommendations
// This is a very basic example, you might need more sophisticated matching
export const getKeywordsFromRecommendations = (recommendations: string[]): string[] => {
  const keywords = new Set<string>();
  const knownStyles = Object.keys(sampleGlassesImages).filter(k => k !== 'default');

  recommendations.forEach(rec => {
    const lowerRec = rec.toLowerCase();
    knownStyles.forEach(style => {
      // Added word boundary check for more accuracy
      const regex = new RegExp(`\\b${style.toLowerCase()}\\b`);
      if (regex.test(lowerRec)) {
        keywords.add(style);
      }
    });
  });

  // Add some simple heuristics if no direct keyword found
  if (keywords.size === 0) {
    if (recommendations.some(rec => rec.toLowerCase().includes("angular") || rec.toLowerCase().includes("rectangular"))) {
      keywords.add("Square");
      keywords.add("Geometric");
    }
    if (recommendations.some(rec => rec.toLowerCase().includes("soften"))) {
      keywords.add("Round");
      keywords.add("Oval");
    }
     if (recommendations.some(rec => rec.toLowerCase().includes("balance"))) {
      keywords.add("Aviator");
      keywords.add("Round");
    }
  }

  return Array.from(keywords);
}; 