import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <div className="bg-background py-24 sm:py-32 border-b border-foreground/10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-7xl">
          Do your best work.
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-foreground/60 font-medium">
          The most straightforward way to find companies that respect your craft. No noise, just great roles.
        </p>

        <div className="mt-12 max-w-2xl mx-auto">
          <div className="flex items-center border-2 border-foreground/10 p-2 rounded-xl focus-within:border-foreground transition-colors bg-background">
            <div className="flex-grow flex items-center pl-4">
              <Search className="h-5 w-5 text-foreground/40" />
              <input
                type="text"
                className="w-full bg-transparent border-0 focus:ring-0 p-3 text-lg outline-none text-foreground placeholder-foreground/40"
                placeholder="Software Engineer, Designer..."
              />
            </div>
            <button className="bg-foreground text-background px-8 py-3 rounded-lg font-semibold hover:bg-foreground/90 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
