import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col items-center justify-center p-6 text-center font-mono">
      <div className="border border-white/15 bg-[#0f0f15] p-8 max-w-md w-full space-y-4 shadow-2xl">
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
          404 // ROUTE NOT FOUND
        </span>
        <h1 className="text-xl font-bold font-display text-white">Target Resource Unreachable</h1>
        <p className="text-xs text-zinc-400">
          The requested path does not exist in the studio portfolio directory.
        </p>
        <Link
          href="/"
          className="block w-full py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors"
        >
          Return to Studio Home
        </Link>
      </div>
    </div>
  );
}
