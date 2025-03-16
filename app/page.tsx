import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="max-w-3xl w-full">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">lazyahh</h1>
          <p className="text-gray-600">A simple Discord bot that responds with minimal effort</p>
        </header>

        <div className="flex flex-col md:flex-row gap-6 mb-10 items-center justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cute%20ducky-lcqDXEa2bV3oJaJfisoOmOVfkoBFN7.jpeg"
            alt="White duck with orange beak"
            width={250}
            height={250}
            className="rounded-lg"
          />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/duck-9At3m13kikJggjKeqR8LyVlndi61O3.png"
            alt="White duck swimming in water"
            width={250}
            height={250}
            className="rounded-lg"
          />
        </div>

        <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-semibold mb-4">Commands</h2>
          <ul className="space-y-4">
            <li className="border-b pb-3">
              <div className="font-medium">/chat [message]</div>
              <div className="text-gray-600 text-sm">Chat with the bot - it might respond with minimal effort</div>
            </li>
            <li className="border-b pb-3">
              <div className="font-medium">/meme</div>
              <div className="text-gray-600 text-sm">Get a random meme</div>
            </li>
            <li className="border-b pb-3">
              <div className="font-medium">/intro</div>
              <div className="text-gray-600 text-sm">Show information about the bot developer</div>
            </li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">About</h2>
          <p className="text-gray-600">
            lazyahh is a Discord bot that responds to basic conversations with short, casual phrases like "no", "aight",
            and "sybau". It's designed to be minimal and straightforward, just like its responses.
          </p>
          <div className="mt-4">
            <Link
              href="https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2048&scope=bot%20applications.commands"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Add to Discord
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
