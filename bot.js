const { Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { openai } = require('@ai-sdk/openai');
const { generateText } = require('ai');

// All bot code in a single file to avoid import issues
async function startBot() {
  try {
    console.log("Starting Discord bot...");
    
    // Array of help images
    const helpImages = [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8523-jfkds47v1ZAjUoKV22aqjdOqd5g6NU.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7756-oB60NSceEgBeCGIx2Lm9tb0JLe2bcV.jpeg",
    ];
    
    // Create a map to store conversation history
    const conversationHistory = new Map();
    
    // Commands
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
    ];
    
    // Register slash commands
    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);
    console.log("Started refreshing application (/) commands.");
    
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { 
      body: commands 
    });
    
    console.log("Successfully reloaded application (/) commands.");
    
    // Create a new client instance
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    });
    
    // When the client is ready, run this code
    client.once(Events.ClientReady, (readyClient) => {
      console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });
    
    // Helper functions
    function getRandomCasualResponse() {
      const casualResponses = [
        "no", "aight", "sybau", "k", "lol", "bruh", "fr", "cap", "bet", "sus",
        "yep", "nah", "idk", "sure", "whatever", "cool", "facts", "based", "wild", "mood",
      ];
      return casualResponses[Math.floor(Math.random() * casualResponses.length)];
    }
    
    function isBasicConversation(message) {
      const lowerMessage = message.toLowerCase().trim();
      
      if (lowerMessage.length < 15) return true;
      
      const greetings = ["hi", "hey", "hello", "sup", "yo", "wassup", "what's up"];
      if (greetings.some(g => lowerMessage.includes(g))) return true;
      
      const simpleQuestions = ["how are you", "what are you doing", "you good", "u good"];
      if (simpleQuestions.some(q => lowerMessage.includes(q))) return true;
      
      if (!lowerMessage.includes("?") && lowerMessage.length < 25) return true;
      
      return false;
    }
    
    async function getChatResponse(message, history = []) {
      try {
        const historyText = history.map(msg => 
          `${msg.role === "user" ? "User" : "Bot"}: ${msg.content}`
        ).join("\n");
        
        const { text } = await generateText({
          model: openai("gpt-4o"),
          system: "You are a lazy Discord bot that responds with minimal effort. Keep responses short, casual, and sometimes use slang. Your personality is laid-back and unbothered.",
          prompt: `${historyText ? historyText + "\n" : ""}User: ${message}\nBot:`,
        });
        return text;
      } catch (error) {
        console.error("Error generating chat response:", error);
        return "whatever";
      }
    }
    
    // Handle interactions (slash commands)
    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      
      const { commandName } = interaction;
      
      try {
        await interaction.deferReply();
        
        switch (commandName) {
          case "meme":
            await interaction.editReply({
              content: "Here's a meme",
              files: ["https://via.placeholder.com/400x400?text=Meme"],
            });
            break;
            
          case "chat":
            const message = interaction.options.getString("message");
            const userId = interaction.user.id;
            
            if (!conversationHistory.has(userId)) {
              conversationHistory.set(userId, []);
            }
            
            const history = conversationHistory.get(userId);
            history.push({ role: "user", content: message });
            
            const limitedHistory = history.slice(-10);
            
            let response;
            if (isBasicConversation(message)) {
              response = getRandomCasualResponse();
            } else {
              response = await getChatResponse(message, limitedHistory);
            }
            
            history.push({ role: "assistant", content: response });
            await interaction.editReply(response);
            break;
            
          case "intro":
            await interaction.editReply({
              content: "Developed by eram003\nSigma portfolio https://eram003.vercel.app/",
              files: [
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-08%20at%205.53.10%E2%80%AFAM-9NlNUtj2f6bBupUrrLgckVJSPOk2Ts.png",
                "https://sjc.microlink.io/k9lGobPPgnPpiZPsIIqFbHlSguCJUFKkXUXLHPAqtrjvF7yCvVgmqLyif1ea0PUD3Lkp-nGB91VCsgr-1eanHw.jpeg",
              ],
            });
            break;
            
          case "help":
            const randomHelpImage = helpImages[Math.floor(Math.random() * helpImages.length)];
            await interaction.editReply({
              content: "just shoot me gng",
              files: [randomHelpImage],
            });
            break;
            
          default:
            await interaction.editReply("no");
        }
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        await interaction.editReply("bruh");
      }
    });
    
    // Handle regular messages
    client.on(Events.MessageCreate, async (message) => {
      if (message.author.bot) return;
      
      const isMentioned = message.mentions.users.has(client.user.id);
      
      if (isMentioned) {
        try {
          const content = message.content.replace(/<@!?\d+>/g, "").trim();
          const userId = message.author.id;
          
          if (!conversationHistory.has(userId)) {
            conversationHistory.set(userId, []);
          }
          
          const history = conversationHistory.get(userId);
          history.push({ role: "user", content });
          
          const limitedHistory = history.slice(-10);
          
          let response;
          if (isBasicConversation(content)) {
            response = getRandomCasualResponse();
          } else {
            response = await getChatResponse(content, limitedHistory);
          }
          
          history.push({ role: "assistant", content: response });
          await message.reply(response);
        } catch (error) {
          console.error("Error responding to message:", error);
          await message.reply("idk");
        }
      } else {
        const shouldRespond = Math.random() < 0.05;
        
        if (shouldRespond) {
          try {
            const keywords = ["funny", "lol", "haha", "joke", "meme"];
            const hasKeyword = keywords.some(keyword => 
              message.content.toLowerCase().includes(keyword)
            );
            
            if (hasKeyword) {
              await message.reply(getRandomCasualResponse());
            }
          } catch (error) {
            console.error("Error responding to message:", error);
          }
        }
      }
    });
    
    // Handle process events
    process.on("SIGINT", async () => {
      console.log("Received SIGINT. Bot is shutting down...");
      if (client) await client.destroy();
      process.exit(0);
    });
    
    process.on("SIGTERM", async () => {
      console.log("Received SIGTERM. Bot is shutting down...");
      if (client) await client.destroy();
      process.exit(0);
    });
    
    process.on("uncaughtException", (error) => {
      console.error("Uncaught exception:", error);
    });
    
    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled promise rejection:", reason);
    });
    
    // Log in to Discord
    await client.login(process.env.DISCORD_BOT_TOKEN);
    console.log("Discord bot started successfully!");
    
    return client;
  } catch (error) {
    console.error("Failed to start Discord bot:", error);
    console.log("Attempting to restart in 10 seconds...");
    setTimeout(startBot, 10000);
  }
}

// Start the bot
startBot();
