import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="max-w-3xl w-full">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">lazyahh</h1>
          <p className="text-gray-600">just a test bot</p>
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
              <div className="text-gray-600 text-sm">type shit</div>
            </li>
            <li className="border-b pb-3">
              <div className="font-medium">/mem</div>
              <div className="text-gray-600 text-sm">idk</div>
            </li>
            <li className="border-b pb-3">
              <div className="font-medium">/intro</div>
              <div className="text-gray-600 text-sm">ahh bot</div>
            </li>
            <li className="border-b pb-3">
              <div className="font-medium">/help</div>
              <div className="text-gray-600 text-sm">health</div>
            </li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Lingan guliguli</h2>
          <p className="text-gray-600">just a bot.</p>
          <div className="mt-4">
            <Link
              href="https://discord.com/oauth2/authorize?client_id=1349820665326211123"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Add to Discord
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

