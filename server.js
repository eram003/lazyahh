const { initializeBot } = require("./lib/discord-bot.js")

// Initialize the Discord bot when the server starts
async function startBot() {
  try {
    console.log("Starting Discord bot...")
    const client = await initializeBot()
    console.log("Discord bot started successfully!")

    // Handle process termination
    process.on("SIGINT", async () => {
      console.log("Received SIGINT. Bot is shutting down...")
      if (client) {
        await client.destroy()
      }
      process.exit(0)
    })

    process.on("SIGTERM", async () => {
      console.log("Received SIGTERM. Bot is shutting down...")
      if (client) {
        await client.destroy()
      }
      process.exit(0)
    })

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("Uncaught exception:", error)
      // Don't exit the process, just log the error
    })

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled promise rejection:", reason)
      // Don't exit the process, just log the error
    })
  } catch (error) {
    console.error("Failed to start Discord bot:", error)
    // Wait 10 seconds before attempting to restart
    console.log("Attempting to restart in 10 seconds...")
    setTimeout(startBot, 10000)
  }
}

startBot()

