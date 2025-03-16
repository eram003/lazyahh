import { Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { getRandomCasualResponse, isBasicConversation } from "./casual-responses"

// Update the commands array to include the new intro command
const commands = [
  new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Chat with the bot")
    .addStringOption((option) =>
      option.setName("message").setDescription("What do you want to chat about?").setRequired(true),
    ),
  new SlashCommandBuilder().setName("meme").setDescription("Get a random meme"),
  new SlashCommandBuilder().setName("intro").setDescription("Show information about the bot developer"),
]

// Create a map to store conversation history
const conversationHistory = new Map<string, { role: string; content: string }[]>()

// Initialize the Discord bot
export async function initializeBot() {
  try {
    // Register slash commands
    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN!)

    console.log("Started refreshing application (/) commands.")

    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), { body: commands })

    console.log("Successfully reloaded application (/) commands.")

    // Create a new client instance
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    })

    // When the client is ready, run this code
    client.once(Events.ClientReady, (readyClient) => {
      console.log(`Ready! Logged in as ${readyClient.user.tag}`)
    })

    // Handle interactions (slash commands)
    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return

      const { commandName } = interaction

      try {
        // Defer reply to give us time to process
        await interaction.deferReply()

        // Update the interaction handler switch statement
        switch (commandName) {
          case "meme":
            await interaction.editReply({
              content: "Here's a funny meme!",
              files: ["https://via.placeholder.com/400x400?text=Funny+Meme"],
            })
            break

          case "chat":
            const message = interaction.options.getString("message")!
            const userId = interaction.user.id

            // Initialize conversation history if it doesn't exist
            if (!conversationHistory.has(userId)) {
              conversationHistory.set(userId, [])
            }

            // Get conversation history
            const history = conversationHistory.get(userId)!

            // Add user message to history
            history.push({ role: "user", content: message })

            // Limit history to last 10 messages to prevent token overflow
            const limitedHistory = history.slice(-10)

            // Check if this is a basic conversation that should get a casual response
            let response: string
            if (isBasicConversation(message)) {
              response = getRandomCasualResponse()
            } else {
              response = await getChatResponse(message, limitedHistory)
            }

            // Add bot response to history
            history.push({ role: "assistant", content: response })

            await interaction.editReply(response)
            break

          case "intro":
            await interaction.editReply({
              content: "Developed by eram003\nSigma portfolio https://eram003.vercel.app/",
              files: [
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-08%20at%205.53.10%E2%80%AFAM-9NlNUtj2f6bBupUrrLgckVJSPOk2Ts.png",
                "https://sjc.microlink.io/k9lGobPPgnPpiZPsIIqFbHlSguCJUFKkXUXLHPAqtrjvF7yCvVgmqLyif1ea0PUD3Lkp-nGB91VCsgr-1eanHw.jpeg",
              ],
            })
            break

          default:
            await interaction.editReply("Unknown command")
        }
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error)
        await interaction.editReply("There was an error executing this command!")
      }
    })

    // Handle regular messages
    client.on(Events.MessageCreate, async (message) => {
      // Ignore messages from bots to prevent loops
      if (message.author.bot) return

      // Check if the bot is mentioned
      const isMentioned = message.mentions.users.has(client.user!.id)

      // Respond to mentions
      if (isMentioned) {
        try {
          // Remove the mention from the message content
          const content = message.content.replace(/<@!?\d+>/g, "").trim()

          // Get user ID
          const userId = message.author.id

          // Initialize conversation history if it doesn't exist
          if (!conversationHistory.has(userId)) {
            conversationHistory.set(userId, [])
          }

          // Get conversation history
          const history = conversationHistory.get(userId)!

          // Add user message to history
          history.push({ role: "user", content })

          // Limit history to last 10 messages
          const limitedHistory = history.slice(-10)

          // Check if this is a basic conversation that should get a casual response
          let response: string
          if (isBasicConversation(content)) {
            response = getRandomCasualResponse()
          } else {
            // Generate response
            response = await getChatResponse(content, limitedHistory)
          }

          // Add bot response to history
          history.push({ role: "assistant", content: response })

          // Send response
          await message.reply(response)
        } catch (error) {
          console.error("Error responding to message:", error)
          await message.reply("Sorry, I encountered an error while processing your message.")
        }
      } else {
        // Random chance to respond to messages without being mentioned
        // This makes the bot feel more alive and interactive
        const shouldRespond = Math.random() < 0.05 // 5% chance

        if (shouldRespond) {
          try {
            // Check for keywords that might trigger a response
            const keywords = ["funny", "lol", "haha", "joke", "meme"]
            const hasKeyword = keywords.some((keyword) => message.content.toLowerCase().includes(keyword))

            if (hasKeyword) {
              const response = await getRandomResponse()
              await message.reply(response)
            }
          } catch (error) {
            console.error("Error responding to message:", error)
          }
        }
      }
    })

    // Log in to Discord with your client's token
    await client.login(process.env.DISCORD_BOT_TOKEN)

    return client
  } catch (error) {
    console.error("Error initializing Discord bot:", error)
    throw error
  }
}

export async function createDiscordBot(token: string): Promise<any> {
  // In a real implementation, this would use discord.js to create a client
  // This is a mock implementation for demonstration purposes

  const bot = {
    sendMessage: async (channelId: string, content: string) => {
      console.log(`[Bot] Sending message to channel ${channelId}: ${content}`)
      // In a real implementation, this would use the Discord API to send a message
    },

    sendImage: async (channelId: string, content: string, imageUrl: string) => {
      console.log(`[Bot] Sending image to channel ${channelId}: ${content}, ${imageUrl}`)
      // In a real implementation, this would use the Discord API to send an image
    },

    onMessage: (callback: (message: any) => void) => {
      console.log("[Bot] Registered message handler")
      // In a real implementation, this would register an event handler for incoming messages
    },

    connect: async () => {
      console.log("[Bot] Connecting to Discord...")
      // In a real implementation, this would connect to the Discord gateway
      console.log("[Bot] Connected to Discord")
      return Promise.resolve()
    },

    disconnect: async () => {
      console.log("[Bot] Disconnecting from Discord...")
      // In a real implementation, this would disconnect from the Discord gateway
      console.log("[Bot] Disconnected from Discord")
      return Promise.resolve()
    },
  }

  return bot
}

async function getChatResponse(message: string, history: { role: string; content: string }[] = []) {
  try {
    // Convert history to a format that can be used in the prompt
    const historyText = history.map((msg) => `${msg.role === "user" ? "User" : "Bot"}: ${msg.content}`).join("\n")

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are a funny Discord bot that responds with humor and wit. Keep responses short, entertaining, and occasionally use emojis. Your personality is sarcastic but friendly.",
      prompt: `${historyText ? historyText + "\n" : ""}User: ${message}\nBot:`,
    })
    return text
  } catch (error) {
    console.error("Error generating chat response:", error)
    return "I would love to chat, but my AI brain is taking a coffee break! Try again in a bit."
  }
}

async function getRandomResponse() {
  const responses = [
    "That's what she said! 😏",
    "I'm not laughing, you're laughing! 😂",
    "If I had a dollar for every time I heard that, I'd have exactly $0! 💸",
    "That's hilarious! Almost as funny as watching paint dry. 🎨",
    "Hold my virtual beer while I process how funny that was. 🍺",
    "I'd tell you a joke in response, but I'm afraid you'd laugh so hard you'd break your keyboard. ⌨️",
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

