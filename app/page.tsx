import AuthModal from "@/components/AuthModal";

export default function HomePage() {
  return (
    <main className="min-h-screen linear-bg flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center space-y-10">
        {/* Logo / Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-950 text-sm text-zinc-400">
          ⚡ Mode B README Generator
        </div>

        {/* Hero */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Generate Premium{" "}
          <span className="text-green-400">Product READMEs</span>
          <br />
          in seconds.
        </h1>

        <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Turn any GitHub repository into a clean, modern landing-page style
          README — with badges, structure, install steps, and GitHub commit/PR
          support.
        </p>

        {/* CTA */}
        <div className="flex justify-center">
          <AuthModal />
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 pt-10">
          {[
            {
              title: "Product-Style Output",
              desc: "Landing-page READMEs that look like real software, not templates.",
            },
            {
              title: "Instant Commit / PR",
              desc: "Push directly or open a pull request.",
            },
            {
              title: "Linear-Level UI",
              desc: "Minimal, modern, SaaS-quality experience.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-left hover:bg-zinc-900 transition"
            >
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-zinc-400 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs text-zinc-600 pt-10">
          Built by DenysHandziichuk.
        </p>
      </div>
    </main>
  );
}
