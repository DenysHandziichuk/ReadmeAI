import Link from "next/link";

export default function LandingPage() {
  return (
    <div>
      <h1>Start generating README for your repositories</h1>

      <Link
        href="/login"
        className="inline-block mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Get started
      </Link>
    </div>
  );
}
