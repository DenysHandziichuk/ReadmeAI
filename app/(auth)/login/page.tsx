export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <a
        href="/api/auth/github"
        className="rounded bg-black px-6 py-3 font-medium text-white"
      >
        Sign in with GitHub
      </a>
    </main>
  );
}
