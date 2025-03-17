const { Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require("discord.js")
const { openai } = require("@ai-sdk/openai")
const { generateText } = require("ai")

// Update the commands array to include the help command
const commands = [
  new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Chat with the bot")
    .addStringOption((option) =>
      option.setName("message").setDescription("What do you want to chat about?").setRequired(true),
    ),
  new SlashCommandBuilder().setName("meme").setDescription("Get a random meme"),
  new SlashCommandBuilder().setName("intro").setDescription("Show information about the bot developer"),
  new SlashCommandBuilder().setName("help").setDescription("Get help when you need it most"),
]

// Array of help images
const helpImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8523-jfkds47v1ZAjUoKV22aqjdOqd5g6NU.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7756-oB60NSceEgBeCGIx2Lm9tb0JLe2bcV.jpeg",
]

// Create a map to store conversation history
const conversationHistory = new Map()

// Get random casual response
function getRandomCasualResponse() {
  const casualResponses = [
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
  return casualResponses[Math.floor(Math.random() * casualResponses.length)]
}

// Check if message is a basic conversation
function isBasicConversation(message) {
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

// Initialize the Discord bot
async function initializeBot() {
  try {
    // Register slash commands
    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN)

    console.log("Started refreshing application (/) commands.")

    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands })

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
              content: "Here's a meme",
              files: ["https://via.placeholder.com/400x400?text=Meme"],
            })
            break

          case "chat":
            const message = interaction.options.getString("message")
            const userId = interaction.user.id

            // Initialize conversation history if it doesn't exist
            if (!conversationHistory.has(userId)) {
              conversationHistory.set(userId, [])
            }

            // Get conversation history
            const history = conversationHistory.get(userId)

            // Add user message to history
            history.push({ role: "user", content: message })

            // Limit history to last 10 messages to prevent token overflow
            const limitedHistory = history.slice(-10)

            // Check if this is a basic conversation that should get a casual response
            let response
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

          case "help":
            // Get a random help image
            const randomHelpImage = helpImages[Math.floor(Math.random() * helpImages.length)]

            await interaction.editReply({
              content: "just shoot me gng",
              files: [randomHelpImage],
            })
            break

          default:
            await interaction.editReply("no")
        }
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error)
        await interaction.editReply("bruh")
      }
    })

    // Handle regular messages
    client.on(Events.MessageCreate, async (message) => {
      // Ignore messages from bots to prevent loops
      if (message.author.bot) return

      // Check if the bot is mentioned
      const isMentioned = message.mentions.users.has(client.user.id)

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
          const history = conversationHistory.get(userId)

          // Add user message to history
          history.push({ role: "user", content })

          // Limit history to last 10 messages
          const limitedHistory = history.slice(-10)

          // Check if this is a basic conversation that should get a casual response
          let response
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
          await message.reply("idk")
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
              const response = getRandomCasualResponse()
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

async function getChatResponse(message, history = []) {
  try {
    // Convert history to a format that can be used in the prompt
    const historyText = history.map((msg) => `${msg.role === "user" ? "User" : "Bot"}: ${msg.content}`).join("\n")

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are a lazy Discord bot that responds with minimal effort. Keep responses short, casual, and sometimes use slang. Your personality is laid-back and unbothered.",
      prompt: `${historyText ? historyText + "\n" : ""}User: ${message}\nBot:`,
    })
    return text
  } catch (error) {
    console.error("Error generating chat response:", error)
    return "whatever"
  }
}

module.exports = { initializeBot }

