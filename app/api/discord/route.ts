import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// This is a simplified version of a Discord bot API route
// In a real implementation, you would need to verify Discord's signature
export async function POST(req: Request) {
  try {
    const { type, data } = await req.json()

    // Handle Discord interactions
    if (type === "MESSAGE_CREATE") {
      const { content, author } = data

      // Ignore messages from bots to prevent loops
      if (author.bot) {
        return NextResponse.json({ success: true })
      }

      // Check for commands
      if (content.startsWith("!")) {
        const command = content.split(" ")[0].substring(1).toLowerCase()
        const args = content.split(" ").slice(1).join(" ")

        switch (command) {
          case "joke":
            return NextResponse.json({
              type: "reply",
              content: await getJoke(),
            })

          case "meme":
            return NextResponse.json({
              type: "image",
              content: "Here's a funny meme!",
              imageUrl: "/placeholder.svg?height=400&width=400",
            })

          case "chat":
            if (!args) {
              return NextResponse.json({
                type: "reply",
                content: "What would you like to chat about?",
              })
            }

            const chatResponse = await getChatResponse(args)
            return NextResponse.json({
              type: "reply",
              content: chatResponse,
            })

          case "image":
            if (!args) {
              return NextResponse.json({
                type: "reply",
                content: "Please provide a description for the image.",
              })
            }

            return NextResponse.json({
              type: "image",
              content: `Here's an image of "${args}"`,
              imageUrl: `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(args)}`,
            })

          default:
            return NextResponse.json({
              type: "reply",
              content: `Unknown command: ${command}. Try !joke, !meme, !chat, or !image.`,
            })
        }
      }

      // Respond to certain keywords in messages
      const keywords = ["funny", "lol", "haha", "joke", "meme"]
      if (keywords.some((keyword) => content.toLowerCase().includes(keyword))) {
        return NextResponse.json({
          type: "reply",
          content: await getRandomResponse(),
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error handling Discord interaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function getJoke() {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: "Tell me a short, funny joke that would be appropriate for a Discord server.",
    })
    return text
  } catch (error) {
    console.error("Error generating joke:", error)
    return "Why did the chicken cross the road? To get to the other side!"
  }
}

async function getChatResponse(message: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: "You are a funny Discord bot that responds with humor and wit. Keep responses short and entertaining.",
      prompt: message,
    })
    return text
  } catch (error) {
    console.error("Error generating chat response:", error)
    return "I would love to chat, but my AI brain is taking a coffee break! Try again in a bit."
  }
}

async function getRandomResponse() {
  const responses = [
    "That's what she said!",
    "I'm not laughing, you're laughing!",
    "If I had a dollar for every time I heard that, I'd have exactly $0!",
    "That's hilarious! Almost as funny as watching paint dry.",
    "Hold my virtual beer while I process how funny that was.",
    "I'd tell you a joke in response, but I'm afraid you'd laugh so hard you'd break your keyboard.",
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

