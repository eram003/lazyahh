import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { getRandomCasualResponse, isBasicConversation } from "@/lib/casual-responses"

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
          content: "Here's a funny meme!",
          embeds: [
            {
              image: {
                url: "https://via.placeholder.com/400x400?text=Funny+Meme",
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
      system: "You are a funny Discord bot that responds with humor and wit. Keep responses short and entertaining.",
      prompt: message,
    })
    return text
  } catch (error) {
    console.error("Error generating chat response:", error)
    return "I would love to chat, but my AI brain is taking a coffee break! Try again in a bit."
  }
}

