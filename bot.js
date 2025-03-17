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
          option.setName("message").setDescription("tf you wanna talk ab").setRequired(true),
        ),
      new SlashCommandBuilder().setName("meme").setDescription("get a random ahh"),
      new SlashCommandBuilder().setName("intro").setDescription("who made this shit"),
      new SlashCommandBuilder().setName("help").setDescription("mid exam in two weeks"),
      
      // New fun commands
      new SlashCommandBuilder()
        .setName("balls 😭")
        .setDescription("dandadan")
        .addStringOption(option => 
          option.setName("question").setDescription("nigga ask me smth").setRequired(true)
        ),
      
      new SlashCommandBuilder()
        .setName("fortune")
        .setDescription("you aint passing twin"),
      
      new SlashCommandBuilder()
        .setName("joke")
        .setDescription("ahh"),
      
      new SlashCommandBuilder()
        .setName("roast")
        .setDescription("chopped shi")
        .addUserOption(option => 
          option.setName("user").setDescription("pick a struggler").setRequired(false)
        ),
      
      new SlashCommandBuilder()
        .setName("fact")
        .setDescription("fax ong"),
      
      new SlashCommandBuilder()
        .setName("choose")
        .setDescription("lemme cook")
        .addStringOption(option => 
          option.setName("options").setDescription("pizza, burger, tacos").setRequired(true)
        ),
      
      new SlashCommandBuilder()
        .setName("roll")
        .setDescription("gambling ahh")
        .addIntegerOption(option => 
          option.setName("sides").setDescription("number of sides on the dice").setRequired(false)
        ),
      
      new SlashCommandBuilder()
        .setName("flip")
        .setDescription("idk"),
      
      new SlashCommandBuilder()
        .setName("rate my ahh")
        .setDescription("are you cooked or are you cooked")
        .addStringOption(option => 
          option.setName("ts").setDescription("blud tf you want rated").setRequired(true)
        ),
      
      new SlashCommandBuilder()
        .setName("vibe")
        .setDescription("w"),
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
        "no", "aight", "sybau", "k", "lmfaooo", "can you stfu nigger", "fr", "nahh fr", "you might be cooking", "bet", "sus",
        "damn bro", "nah", "idk", "sure", "uhh", "cool", "facts", "based", "wild", "mood", "nigger", "bro added a fun fact" 
      ];
      return casualResponses[Math.floor(Math.random() * casualResponses.length)];
    }
    
    function isBasicConversation(message) {
      const lowerMessage = message.toLowerCase().trim();
      
      if (lowerMessage.length < 15) return true;
      
      const greetings = ["hi", "hey", "hello", "sup", "yo", "wassup", "what's up", "wassup", "blud"];
      if (greetings.some(g => lowerMessage.includes(g))) return true;
      
      const simpleQuestions = ["sup nigga", "wsg gang", "yo nigga sup", "ay man"];
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
        "Nigga idfk", "ye probably", "definitely gang ong", "Yes definitely", "You may rely on it",
        "As I see it, yes.", "Most likely.", "Idk blud", "yes", "Yes (nope)",
        "try again nigga", "huh what", "ts a secret", "nah gang I cant predict ts", "concentrate and ask again",
        "dont count on it", "my reply is no.", "my sources say no.", "not looking good nigga", "I doubt it",
        "no lol", "bruh what", "idk maybe", "ask someone who cares", "whatever you want", "not happening nigger"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    function getFortune() {
      const fortunes = [
        "you will fail an exam",
        "a watched pot never boils",
        "you got class tomorrow lil bro",
        "your ahh gonna get ghosted this week nigga",
        "nigga you staying unemployed",
        "Your next meal will be mid",
        "you'll get left on read by your friends",
        "someone will steal your idea and get credit for it",
        "You gonna step in something wet while wearing socks",
        "hey it could be worse",
        "Idk your fortune dawg you might be cooked",
        "you gonna fumble in front of the huzz",
        "talk behind peoples back more",
        "I hope you lose your balls",
        "nigga you poor",
        "Your ahh will get stuck in traffic when you're already late",
        "yeah Im tired rn",
        "I'll do it later",
        "She wants you bro trust",
        "your dumbahh will think of the perfect comeback hours after the argument"
      ];
      return fortunes[Math.floor(Math.random() * fortunes.length)];
    }
    
    function getJoke() {
      const jokes = [
        "You are not nooahchan",
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
