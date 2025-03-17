const { Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { openai } = require('@ai-sdk/openai');
const { generateText } = require('ai');
const http = require('http');

// Create a simple HTTP server to keep Render happy
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Discord Bot is running!\n');
});

// Get the port from environment variable or use 3000 as default
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

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
      
      // New fun commands
      new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Ask the magic 8-ball a question")
        .addStringOption(option => 
          option.setName("question").setDescription("What do you want to ask?").setRequired(true)
        ),
      
      new SlashCommandBuilder()
        .setName("fortune")
        .setDescription("Get your fortune told"),
      
      new SlashCommandBuilder()
        .setName("joke")
        .setDescription("Get a random joke"),
      
      new SlashCommandBuilder()
        .setName("roast")
        .setDescription("Get roasted by the bot")
        .addUserOption(option => 
          option.setName("user").setDescription("Who do you want to roast?").setRequired(false)
        ),
      
      new SlashCommandBuilder()
        .setName("fact")
        .setDescription("Get a random useless fact"),
      
      new SlashCommandBuilder()
        .setName("choose")
        .setDescription("Let the bot choose between options")
        .addStringOption(option => 
          option.setName("options").setDescription("Comma-separated options (e.g., pizza, burger, tacos)").setRequired(true)
        ),
      
      new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Roll a dice")
        .addIntegerOption(option => 
          option.setName("sides").setDescription("Number of sides on the dice").setRequired(false)
        ),
      
      new SlashCommandBuilder()
        .setName("flip")
        .setDescription("Flip a coin"),
      
      new SlashCommandBuilder()
        .setName("rate")
        .setDescription("Rate something out of 10")
        .addStringOption(option => 
          option.setName("thing").setDescription("What do you want rated?").setRequired(true)
        ),
      
      new SlashCommandBuilder()
        .setName("vibe")
        .setDescription("Check the current vibe"),
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
    
    // New fun functions
    function getMagic8BallResponse() {
      const responses = [
        "It is certain.", "It is decidedly so.", "Without a doubt.", "Yes definitely.", "You may rely on it.",
        "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.",
        "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.",
        "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful.",
        "no lol", "bruh what", "idk maybe", "ask someone who cares", "whatever you want", "in your dreams"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    function getFortune() {
      const fortunes = [
        "You will find unexpected money soon.",
        "Someone is thinking about you right now.",
        "Your crush doesn't know you exist.",
        "You'll be ghosted by someone important this week.",
        "You will embarrass yourself in public soon.",
        "Your next meal will be mid.",
        "You'll get left on read by your crush.",
        "Someone will steal your idea and get credit for it.",
        "You'll step in something wet while wearing socks.",
        "You'll find happiness in the most unexpected place.",
        "Your phone will die at the worst possible moment.",
        "You'll forget something important tomorrow.",
        "Someone will compliment you when you least expect it.",
        "You'll lose something important but find it in the last place you look.",
        "Your next big purchase will break within a week.",
        "You'll get stuck in traffic when you're already late.",
        "You'll accidentally like an old post while stalking someone.",
        "You'll get a random burst of motivation at 3 AM.",
        "Your next selfie will be fire.",
        "You'll think of the perfect comeback hours after the argument."
      ];
      return fortunes[Math.floor(Math.random() * fortunes.length)];
    }
    
    function getJoke() {
      const jokes = [
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
        "Why don't scientists trust atoms? Because they make up everything.",
        "What's the best thing about Switzerland? I don't know, but the flag is a big plus.",
        "I'm on a seafood diet. I see food and I eat it.",
        "Why don't skeletons fight each other? They don't have the guts.",
        "What do you call a fake noodle? An impasta.",
        "I'm reading a book about anti-gravity. It's impossible to put down.",
        "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
        "Why was the math book sad? It had too many problems.",
        "What did the janitor say when he jumped out of the closet? Supplies!",
        "Why did the scarecrow win an award? Because he was outstanding in his field.",
        "I told my girlfriend she drew her eyebrows too high. She seemed surprised.",
        "Parallel lines have so much in common. It's a shame they'll never meet.",
        "My friend says to me: 'What rhymes with orange?' I said: 'No it doesn't.'",
        "Why don't eggs tell jokes? They'd crack each other up.",
        "I'm so good at sleeping, I can do it with my eyes closed.",
        "Why did the invisible man turn down the job offer? He couldn't see himself doing it.",
        "I used to play piano by ear, but now I use my hands.",
        "I couldn't figure out why the baseball kept getting larger. Then it hit me.",
        "I'm on a whiskey diet. I've lost three days already."
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }
    
    function getRoast(target) {
      const roasts = [
        `${target} is so boring, watching paint dry filed a restraining order.`,
        `I'd roast ${target}, but my mom said I'm not allowed to burn trash.`,
        `${target} is living proof that evolution can go in reverse.`,
        `${target}'s personality is like a Wikipedia page - anyone can edit it and it's still not interesting.`,
        `${target} is the human equivalent of a participation award.`,
        `If ${target} was a spice, they'd be flour.`,
        `${target} is the reason shampoo has instructions.`,
        `${target} is like a cloud - when they disappear, it's a beautiful day.`,
        `${target} is so dense, light bends around them.`,
        `I'd tell ${target} to go outside and touch grass, but I don't want the grass to suffer.`,
        `${target} has an entire life to live and they chose to spend it like this.`,
        `${target} is the human equivalent of a soggy french fry.`,
        `${target} is so basic, they raise the pH level of any room they enter.`,
        `${target} is like a slinky - not really good for anything but brings a smile to your face when pushed down the stairs.`,
        `${target} is the reason we have warning labels on everything.`,
        `${target} is so irrelevant, even spam emails ignore them.`,
        `${target} is like a broken pencil - pointless.`,
        `${target} is the human equivalent of a loading screen.`,
        `${target} is so forgettable, their imaginary friends forgot about them.`,
        `If disappointment had a face, it would look better than ${target}.`
      ];
      return roasts[Math.floor(Math.random() * roasts.length)];
    }
    
    function getRandomFact() {
      const facts = [
        "A day on Venus is longer than a year on Venus.",
        "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion.",
        "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat.",
        "Bananas are berries, but strawberries aren't.",
        "A group of flamingos is called a 'flamboyance'.",
        "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.",
        "The average person will spend six months of their life waiting for red lights to turn green.",
        "A cloud can weigh more than a million pounds.",
        "Cows have best friends and get stressed when they're separated.",
        "The inventor of the frisbee was turned into a frisbee after he died. When Walter Morrison died in 2010, his family had him cremated and his ashes were molded into frisbees.",
        "The world's oldest piece of chewing gum is 9,000 years old.",
        "A day on Mercury is longer than a year on Mercury.",
        "Octopuses have three hearts, nine brains, and blue blood.",
        "Cats can't taste sweet things because of a genetic mutation.",
        "The average person walks the equivalent of three times around the world in their lifetime.",
        "The shortest commercial flight in the world is between the Scottish islands of Westray and Papa Westray, with a flight time of just two minutes.",
        "A small child could swim through the veins of a blue whale.",
        "The word 'nerd' was first coined by Dr. Seuss in 'If I Ran the Zoo' in 1950.",
        "There are more possible iterations of a game of chess than there are atoms in the known universe.",
        "The total weight of all the ants on Earth is greater than the total weight of all the humans on Earth."
      ];
      return facts[Math.floor(Math.random() * facts.length)];
    }
    
    function getVibeCheck() {
      const vibes = [
        "The vibe is immaculate right now.",
        "The vibe is off. Mercury must be in retrograde or something.",
        "The vibe is chaotic neutral.",
        "The vibe is giving main character energy.",
        "The vibe is straight trash today.",
        "The vibe is unmatched.",
        "The vibe is mid at best.",
        "The vibe is absolutely feral.",
        "The vibe is lowkey sus.",
        "The vibe is elite.",
        "The vibe is giving 2008 Tumblr.",
        "The vibe is aggressively average.",
        "The vibe is unhinged in the best way possible.",
        "The vibe is giving 'I haven't slept in 48 hours'.",
        "The vibe is chef's kiss.",
        "The vibe is giving 'first day of summer vacation'.",
        "The vibe is giving 'last slice of pizza'.",
        "The vibe is giving 'forgot to charge your phone overnight'.",
        "The vibe is giving 'free wifi at a coffee shop'.",
        "The vibe is giving 'finding money in your old jacket'."
      ];
      return vibes[Math.floor(Math.random() * vibes.length)];
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
            
          // New fun commands
          case "8ball":
            const question = interaction.options.getString("question");
            await interaction.editReply(`🎱 **Question:** ${question}\n**Answer:** ${getMagic8BallResponse()}`);
            break;
            
          case "fortune":
            await interaction.editReply(`🔮 **Your fortune:** ${getFortune()}`);
            break;
            
          case "joke":
            await interaction.editReply(`😂 ${getJoke()}`);
            break;
            
          case "roast":
            const user = interaction.options.getUser("user") || interaction.user;
            await interaction.editReply(`🔥 ${getRoast(user.toString())}`);
            break;
            
          case "fact":
            await interaction.editReply(`📚 **Random fact:** ${getRandomFact()}`);
            break;
            
          case "choose":
            const optionsString = interaction.options.getString("options");
            const options = optionsString.split(",").map(option => option.trim()).filter(option => option.length > 0);
            
            if (options.length < 2) {
              await interaction.editReply("bruh give me at least two options");
            } else {
              const choice = options[Math.floor(Math.random() * options.length)];
              await interaction.editReply(`🤔 I choose: **${choice}**`);
            }
            break;
            
          case "roll":
            const sides = interaction.options.getInteger("sides") || 6;
            if (sides < 2) {
              await interaction.editReply("that's not how dice work");
            } else {
              const result = Math.floor(Math.random() * sides) + 1;
              await interaction.editReply(`🎲 You rolled a **${result}** (d${sides})`);
            }
            break;
            
          case "flip":
            const flip = Math.random() < 0.5 ? "Heads" : "Tails";
            await interaction.editReply(`🪙 Coin flip: **${flip}**`);
            break;
            
          case "rate":
            const thing = interaction.options.getString("thing");
            const rating = Math.floor(Math.random() * 11);
            
            let comment;
            if (rating <= 2) comment = "absolute trash";
            else if (rating <= 4) comment = "pretty mid";
            else if (rating <= 6) comment = "it's aight";
            else if (rating <= 8) comment = "pretty good";
            else comment = "elite";
            
            await interaction.editReply(`⭐ I rate **${thing}** a **${rating}/10**\n${comment}`);
            break;
            
          case "vibe":
            await interaction.editReply(`✨ **Vibe check:** ${getVibeCheck()}`);
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
        // Random chance to respond to messages without being mentioned
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
