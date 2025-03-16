# Lazyahh Bot

Simply no.

## Features

- nothing

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- A Discord account
- An OpenAI API key

### Discord Bot Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application and give it a name
3. Go to the "Bot" tab and click "Add Bot"
4. Under the "Privileged Gateway Intents" section, enable:
   - Message Content Intent
   - Server Members Intent
   - Presence Intent
5. Save your changes
6. Copy the bot token (you'll need this later)
7. Go to the "OAuth2" tab, then "URL Generator"
8. Select the following scopes:
   - bot
   - applications.commands
9. Select the following bot permissions:
   - Send Messages
   - Embed Links
   - Attach Files
   - Read Message History
   - Use Slash Commands
10. Copy the generated URL and open it in your browser to add the bot to your server

### Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

## Commands

- `/meme` - Get a random meme
- `/chat [message]` - Chat with the bot
- `/intro` - Show information about the bot developer

