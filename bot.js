const { Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { openai } = require('@ai-sdk/openai');
const { generateText } = require('ai');
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Discord Bot is running!\n');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function startBot() {
  try {
    console.log("Starting Discord bot...");
    
    const helpImages = [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8523-jfkds47v1ZAjUoKV22aqjdOqd5g6NU.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7756-oB60NSceEgBeCGIx2Lm9tb0JLe2bcV.jpeg",
    ];
    
    const coolYoutubeLinks = [
      "https://youtu.be/dmmnx4VQmPU",
      "https://youtu.be/vnU81QnWhXA",
      "https://youtu.be/QbHkYkxH5-E",
      "https://youtu.be/b3vRYfXJ7Rg",
      "https://youtu.be/2Q9MqL83FeE",
      "https://youtu.be/DhOv8OoPBUI",
      "https://youtu.be/zeElcWPwphg",
      "https://youtu.be/tCO4i2t-Aso?si=hRoTsEk3eng2oAv5",
      "https://youtu.be/BnC-cpUCdns",
      "https://youtu.be/HLDVlzLWxN0"
    ];
    
    const conversationHistory = new Map();
    
    const commands = [
      new SlashCommandBuilder()
        .setName("yapp")
        .setDescription("chat with the bot or smth")
        .addStringOption((option) =>
          option.setName("message").setDescription("yap smth random").setRequired(true),
        ),
      new SlashCommandBuilder().setName("intro").setDescription("check who made this shit"),
      new SlashCommandBuilder().setName("help").setDescription("exam core"),
      
      new SlashCommandBuilder()
        .setName("ballsofwisdome")
        .setDescription("ask the balls questions")
        .addStringOption(option => 
          option.setName("question").setDescription("what you wanna ask bro").setRequired(true)
        ),
      
      new SlashCommandBuilder()
        .setName("fortune")
        .setDescription("my nigga you're already cooked"),
      
      new SlashCommandBuilder()
        .setName("choose")
        .setDescription("lemme choose between options blud")
        .addStringOption(option => 
          option.setName("options").setDescription("(e.g., pizza, burger, tacos)").setRequired(true)
        ),
      
      new SlashCommandBuilder()
        .setName("flip")
        .setDescription("flip da coin"),
      
      new SlashCommandBuilder()
        .setName("rate")
        .setDescription("rate something outta 10")
        .addStringOption(option => 
          option.setName("thing").setDescription("wot you want rated bro").setRequired(true)
        ),
      
      new SlashCommandBuilder()
        .setName("coolshi")
        .setDescription("random cool vids I fw"),
    ];
    
    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);
    console.log("Started refreshing application (/) commands.");
    
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { 
      body: commands 
    });
    
    console.log("Successfully reloaded application (/) commands.");
    
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    });
    
    client.once(Events.ClientReady, (readyClient) => {
      console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });
    
    function getRandomCasualResponse() {
      const casualResponses = [
        "no", "bro can you like not talk to me", "nahhhhh", "oh hell nah", "aight bro", "sybau", "nigga", "k", "lol", "bruh", "fr", "cap", "bet", "nigga thats sus",
        "yep", "uhh sure", "just log out twin", "nigga what", "insane", "that's wild", "nah", "idk", "sure", "aight bro sure", "das cool", "facts", "based", "wild", "mood", "stfu", 
      ];
      return casualResponses[Math.floor(Math.random() * casualResponses.length)];
    }
    
    function isBasicConversation(message) {
      const lowerMessage = message.toLowerCase().trim();
      
      if (lowerMessage.length < 15) return true;
      
      const greetings = ["hi", "hey", "hello", "sup", "yo nigga", "wassup", "what's up"];
      if (greetings.some(g => lowerMessage.includes(g))) return true;
      
      const simpleQuestions = ["helo", "yo wassup nigga", "you good", "sup blud"];
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
    
    function getMagic8BallResponse() {
      const responses = [
        "it is certain nigga", "I see the vision", "without a doubt.", "yeah definitely", "you may rely on it",
        "as I see it, yes.", "most likely.", "probably bro", "outlook good", "yeah", "yeah I'm not so sure on this one",
        "Yeah Idk blud", "ask again later", "I don't get paid enough to answer your shi", "cannot predict now.", "yeah Im kinda tired now nigga ask later",
        "Don't count on it", "I don't see the vision twin", "My reply is no.", "my sources say no", "outlook not so good", "highly doubtful.",
        "no lol", "bruh what", "idk maybe", "ask someone who cares", "whatever you want", "in your dreams"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    function getFortune() {
      const fortunes = [
        "you finna fail yo exams twin",
        "ape looking ahh",
        "bro Idfk",
        "your ahh will get ghosted by your friends",
        "public execution in 5 days",
        "Your next meal will be mid",
        "you'll get left on read by your father again",
        "someone will steal your idea and get credit for it",
        "you gonna step in something wet while wearing socks",
        "dont pull up at 308 Negra Arroyo Lane, Albuquerque, New Mexico, 87104.",
        "your phone will die at the worst possible moment",
        "you'll forget something important tomorrow",
        "listen to ninja tuna",
        "You'll lose something important but find it in the last place you look.",
        "your next big purchase will break within a week",
        "you'll get stuck in traffic when you're already late",
        "you'll accidentally like an old post while stalking someone",
        "the academic comeback ain't happening lil bro",
        "Your next selfie will be fire (I lied)",
        "your ahh will think of the perfect comeback hours after the argument"
      ];
      return fortunes[Math.floor(Math.random() * fortunes.length)];
    }
    
    function getRandomYoutubeLink() {
      return coolYoutubeLinks[Math.floor(Math.random() * coolYoutubeLinks.length)];
    }
    
    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      
      const { commandName } = interaction;
      
      try {
        await interaction.deferReply();
        
        switch (commandName) {
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
              content: "this shit wasn't built by eram003\nvery epic sigma portfolio https://eram003.vercel.app/",
              files: [
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-08%20at%205.53.10%E2%80%AFAM-9NlNUtj2f6bBupUrrLgckVJSPOk2Ts.png",
               
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
            
          case "ballsofwisdome":
            const question = interaction.options.getString("question");
            await interaction.editReply(` bros question: ${question}\nhonest reaction: ${getMagic8BallResponse()}`);
            break;
            
          case "fortune":
            await interaction.editReply(`fortune: ${getFortune()}`);
            break;
            
          case "choose":
            const optionsString = interaction.options.getString("options");
            const options = optionsString.split(",").map(option => option.trim()).filter(option => option.length > 0);
            
            if (options.length < 2) {
              await interaction.editReply("bruh give me at least two options");
            } else {
              const choice = options[Math.floor(Math.random() * options.length)];
              await interaction.editReply(`Imma choose: **${choice}**`);
            }
            break;
            
          case "flip":
            const flip = Math.random() < 0.5 ? "heads 💀" : "tails 😔";
            await interaction.editReply(`flipa clip: **${flip}**`);
            break;
            
          case "rate":
            const thing = interaction.options.getString("thing");
            const rating = Math.floor(Math.random() * 11);
            
            let comment;
            if (rating <= 2) comment = "absolute trash";
            else if (rating <= 4) comment = "pretty mid";
            else if (rating <= 6) comment = "uhh its aight";
            else if (rating <= 8) comment = "its pretty good I guess";
            else comment = "absolute cinema";
            
            await interaction.editReply(`I'm gonna rate **${thing}** a **${rating}/10**\n${comment}`);
            break;
            
          case "coolshi":
            const youtubeLink = getRandomYoutubeLink();
            await interaction.editReply(`a random cool vid: ${youtubeLink}`);
            break;
            
          default:
            await interaction.editReply("no");
        }
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        await interaction.editReply("bruh");
      }
    });
    
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
    
    await client.login(process.env.DISCORD_BOT_TOKEN);
    console.log("Discord bot started successfully!");
    
    return client;
  } catch (error) {
    console.error("Failed to start Discord bot:", error);
    console.log("Attempting to restart in 10 seconds...");
    setTimeout(startBot, 10000);
  }
}

startBot();
