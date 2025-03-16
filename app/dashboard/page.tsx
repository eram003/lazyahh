"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, MessageSquare, Settings, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BotStatus {
  status: "online" | "offline"
  uptime: string
  serverCount: number
  lastRestart: string
}

interface ActivityLog {
  id: string
  username: string
  command: string
  response: string
  timestamp: string
}

export default function Dashboard() {
  const [botStatus, setBotStatus] = useState<BotStatus>({
    status: "online",
    uptime: "2 hours 15 minutes",
    serverCount: 1,
    lastRestart: "Today at 10:45 AM",
  })

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: "1",
      username: "User123",
      command: "/chat How are you?",
      response: "I'm doing great! Just hanging out in the digital realm, judging your typos. 😜",
      timestamp: "2 minutes ago",
    },
    {
      id: "2",
      username: "CoolGamer",
      command: "/meme",
      response: "[Image sent: funny_meme.jpg]",
      timestamp: "5 minutes ago",
    },
  ])

  const [isRefreshing, setIsRefreshing] = useState(false)

  // Simulate refreshing the bot status
  const refreshStatus = () => {
    setIsRefreshing(true)

    // Simulate an API call
    setTimeout(() => {
      setBotStatus({
        ...botStatus,
        uptime: "2 hours 20 minutes",
      })
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <main className="flex min-h-screen flex-col p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Bot Dashboard</h1>
        <p className="text-slate-600 mb-8">Monitor and configure your Discord bot</p>

        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="commands">Commands</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Bot Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${botStatus.status === "online" ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <p className="font-medium">{botStatus.status === "online" ? "Online" : "Offline"}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={refreshStatus} disabled={isRefreshing}>
                      {isRefreshing ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      <span className="ml-2">Refresh</span>
                    </Button>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>Server count: {botStatus.serverCount}</p>
                    <p>Uptime: {botStatus.uptime}</p>
                    <p>Last restart: {botStatus.lastRestart}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="p-2 bg-slate-100 rounded-md">
                        <div className="flex justify-between">
                          <p className="font-medium">{log.username}</p>
                          <p className="text-xs text-slate-500">{log.timestamp}</p>
                        </div>
                        <p className="text-slate-600">{log.command}</p>
                        <p className="text-slate-800 mt-1">{log.response}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>Bot activity in the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border rounded-md">
                  <p className="text-slate-500">Activity chart would appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commands">
            <Card>
              <CardHeader>
                <CardTitle>Available Commands</CardTitle>
                <CardDescription>Commands your bot responds to</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md">
                    <h3 className="font-medium">/meme</h3>
                    <p className="text-sm text-slate-600">Sends a random meme image</p>
                    <div className="mt-2 p-2 bg-slate-100 rounded text-sm">
                      <p className="font-medium">Example:</p>
                      <p className="text-slate-600">User: /meme</p>
                      <p className="text-slate-800">Bot: Here's a funny meme! [Image]</p>
                    </div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <h3 className="font-medium">/chat [message]</h3>
                    <p className="text-sm text-slate-600">Have a conversation with the AI</p>
                    <div className="mt-2 p-2 bg-slate-100 rounded text-sm">
                      <p className="font-medium">Example:</p>
                      <p className="text-slate-600">User: /chat Tell me a fun fact</p>
                      <p className="text-slate-800">
                        Bot: Did you know that honey never spoils? Archaeologists have found pots of honey in ancient
                        Egyptian tombs that are over 3,000 years old and still perfectly good to eat! 🍯
                      </p>
                    </div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <h3 className="font-medium">/intro</h3>
                    <p className="text-sm text-slate-600">Show information about the bot developer</p>
                    <div className="mt-2 p-2 bg-slate-100 rounded text-sm">
                      <p className="font-medium">Example:</p>
                      <p className="text-slate-600">User: /intro</p>
                      <p className="text-slate-800">Bot: [Shows developer info and portfolio]</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Bot Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Configure your bot's behavior and responses</p>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md">
                    <h3 className="font-medium">AI Response Style</h3>
                    <p className="text-sm text-slate-600">Currently set to: Funny</p>
                    <div className="mt-2">
                      <select className="w-full p-2 border rounded-md">
                        <option>Funny</option>
                        <option>Sarcastic</option>
                        <option>Helpful</option>
                        <option>Weird</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <h3 className="font-medium">Command Prefix</h3>
                    <p className="text-sm text-slate-600">Currently set to: /</p>
                    <div className="mt-2">
                      <input type="text" className="w-full p-2 border rounded-md" defaultValue="/" />
                    </div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <h3 className="font-medium">Response Rate</h3>
                    <p className="text-sm text-slate-600">Currently set to: Respond to 50% of messages</p>
                    <div className="mt-2">
                      <input type="range" min="0" max="100" defaultValue="50" className="w-full" />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

