// Collection of casual, short responses for basic conversations
export const casualResponses = [
  "no",
  "aight",
  "sybau",
  "k",
  "lol",
  "bruh",
  "fr",
  "cap",
  "bet",
  "sus",
  "yep",
  "nah",
  "idk",
  "sure",
  "whatever",
  "cool",
  "facts",
  "based",
  "wild",
  "mood",
]

// Function to get a random casual response
export function getRandomCasualResponse(): string {
  return casualResponses[Math.floor(Math.random() * casualResponses.length)]
}

// Function to determine if a message is likely a basic conversation
// This checks if the message is short and doesn't contain complex questions
export function isBasicConversation(message: string): boolean {
  // Convert to lowercase for easier comparison
  const lowerMessage = message.toLowerCase().trim()

  // Check if message is short (less than 15 characters)
  if (lowerMessage.length < 15) {
    return true
  }

  // Check if message is a simple greeting
  const greetings = ["hi", "hey", "hello", "sup", "yo", "wassup", "what's up"]
  if (greetings.some((greeting) => lowerMessage.includes(greeting))) {
    return true
  }

  // Check if message is a simple question
  const simpleQuestions = ["how are you", "what are you doing", "you good", "u good"]
  if (simpleQuestions.some((question) => lowerMessage.includes(question))) {
    return true
  }

  // Check if message doesn't end with a question mark and is relatively short
  if (!lowerMessage.includes("?") && lowerMessage.length < 25) {
    return true
  }

  return false
}

