import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { getRandomCasualResponse, isBasicConversation } from "@/lib/casual-responses"

// Array of help images
const helpImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8523-jfkds47v1ZAjUoKV22aqjdOqd5g6NU.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7756-oB60NSceEgBeCGIx2Lm9tb0JLe2bcV.jpeg",
]

// This route handles webhook callbacks to update deferred responses
export async function POST(req: Request) {
  try {
    const { interactionId, type, data } = await req.json()

    if (!interactionId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Discord webhook URL for updating interactions
    const webhookUrl = `https://discord.com/api/v10/webhooks/${process.env.DISCORD_CLIENT_ID}/${interactionId}/messages/@original`

    let response

    switch (type) {
      case "meme":
        response = {
          content: "Here's a meme",
          embeds: [
            {
              image: {
                url: "https://via.placeholder.com/400x400?text=Meme",
              },
            },
          ],
        }
        break

      case "chat":
        if (!data?.message) {
          response = { content: "No message provided." }
          break
        }

        // Check if this is a basic conversation that should get a casual response
        let responseText: string
        if (isBasicConversation(data.message)) {
          responseText = getRandomCasualResponse()
        } else {
          responseText = await getChatResponse(data.message)
        }

        response = { content: responseText }
        break

      case "help":
        // Get a random help image
        const randomHelpImage = helpImages[Math.floor(Math.random() * helpImages.length)]

        response = {
          content: "just shoot me gng",
          embeds: [
            {
              image: {
                url: randomHelpImage,
              },
            },
          ],
        }
        break

      default:
        response = { content: "Unknown command type." }
    }

    // Update the deferred response
    await fetch(webhookUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
      body: JSON.stringify(response),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error handling webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function getChatResponse(message: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are a lazy Discord bot that responds with minimal effort. Keep responses short, casual, and sometimes use slang. Your personality is laid-back and unbothered.",
      prompt: message,
    })
    return text
  } catch (error) {
    console.error("Error generating chat response:", error)
    return "whatever"
  }
}

