import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
      <Image
        src="/next.svg"
        alt="Next.js Logo"
        width={180}
        height={50}
        priority
      />
    </main>
  );
}
