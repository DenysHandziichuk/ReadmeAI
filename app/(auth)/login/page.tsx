export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <a
        href="/api/auth/github"
        className="px-6 py-3 rounded bg-black text-white font-medium"
      >
        Sign in with GitHub
      </a>
    </main>
  );
}
