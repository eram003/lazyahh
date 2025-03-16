// This file contains utility functions for handling images

// A collection of funny meme URLs
// In a real implementation, you would use actual image URLs
export const memeImages = [
  "https://via.placeholder.com/400x400?text=Funny+Meme+1",
  "https://via.placeholder.com/400x400?text=Funny+Meme+2",
  "https://via.placeholder.com/400x400?text=Funny+Meme+3",
  "https://via.placeholder.com/400x400?text=Funny+Meme+4",
  "https://via.placeholder.com/400x400?text=Funny+Meme+5",
]

// Get a random meme image URL
export function getRandomMeme(): string {
  return memeImages[Math.floor(Math.random() * memeImages.length)]
}

// A map of keywords to image URLs
// In a real implementation, you would use actual image URLs
export const keywordImages: Record<string, string[]> = {
  cat: ["https://via.placeholder.com/400x400?text=Cat+1", "https://via.placeholder.com/400x400?text=Cat+2"],
  dog: ["https://via.placeholder.com/400x400?text=Dog+1", "https://via.placeholder.com/400x400?text=Dog+2"],
  funny: ["https://via.placeholder.com/400x400?text=Funny+1", "https://via.placeholder.com/400x400?text=Funny+2"],
  meme: ["https://via.placeholder.com/400x400?text=Meme+1", "https://via.placeholder.com/400x400?text=Meme+2"],
}

// Get an image URL based on a keyword
export function getImageForKeyword(keyword: string): string | null {
  const normalizedKeyword = keyword.toLowerCase()

  for (const [key, urls] of Object.entries(keywordImages)) {
    if (normalizedKeyword.includes(key)) {
      return urls[Math.floor(Math.random() * urls.length)]
    }
  }

  return null
}

// Check if a message contains any of the keywords
export function containsImageKeyword(message: string): boolean {
  const normalizedMessage = message.toLowerCase()

  return Object.keys(keywordImages).some((keyword) => normalizedMessage.includes(keyword))
}

