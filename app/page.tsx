import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Bot, MessageSquare, ImageIcon } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-2">Fun Discord Bot</h1>
        <p className="text-center text-slate-600 mb-8">Your AI-powered Discord companion</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Chat Responses
              </CardTitle>
              <CardDescription>AI-powered funny responses to messages</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                The bot uses AI to generate humorous responses to messages in your Discord server.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Command Detection
              </CardTitle>
              <CardDescription>Responds to specific commands</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Trigger the bot with commands like !joke, !meme, or let it detect keywords in conversations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Image Responses
              </CardTitle>
              <CardDescription>Uploads images based on commands</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                The bot can upload relevant images when specific commands or keywords are detected.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bot Status</CardTitle>
            <CardDescription>Check if your bot is online and working</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <p className="text-sm font-medium">Online and ready to chat</p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

