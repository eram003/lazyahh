import { NextResponse } from "next/server"
import { verifyKey } from "discord-interactions"

// This route handles Discord interactions (slash commands)
export async function POST(req: Request) {
  try {
    // Verify the request is coming from Discord
    const signature = req.headers.get("x-signature-ed25519")
    const timestamp = req.headers.get("x-signature-timestamp")

    if (!signature || !timestamp) {
      return NextResponse.json({ error: "Missing signature or timestamp" }, { status: 401 })
    }

    const body = await req.text()

    const isValid = verifyKey(body, signature, timestamp, process.env.DISCORD_PUBLIC_KEY!)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const interaction = JSON.parse(body)

    // Handle PING (type 1)
    if (interaction.type === 1) {
      return NextResponse.json({ type: 1 })
    }

    // Handle APPLICATION_COMMAND (type 2)
    if (interaction.type === 2) {
      const { name, options } = interaction.data

      // Defer the response to give us time to process
      const deferResponse = {
        type: 5, // DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
      }

      switch (name) {
        case "meme":
          // We'll defer and then update with the meme
          return NextResponse.json(deferResponse)

        case "chat":
          const message = options?.find((opt: any) => opt.name === "message")?.value
          if (!message) {
            return NextResponse.json({
              type: 4,
              data: {
                content: "Please provide a message to chat about.",
              },
            })
          }

          // We'll defer and then update with the chat response
          return NextResponse.json(deferResponse)

        default:
          return NextResponse.json({
            type: 4,
            data: {
              content: `Unknown command: ${name}`,
            },
          })
      }
    }

    return NextResponse.json({ error: "Unsupported interaction type" }, { status: 400 })
  } catch (error) {
    console.error("Error handling Discord interaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

