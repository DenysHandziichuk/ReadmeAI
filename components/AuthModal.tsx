"use client";

type Props = {
  onClose: () => void;
};

export default function AuthModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-zinc-900 rounded-xl w-full max-w-sm p-6 space-y-5 border border-zinc-800">
        <h2 className="text-xl font-semibold text-white">
          Sign in to continue
        </h2>

        <p className="text-sm text-zinc-400">
          Connect your GitHub account to generate README files for your
          repositories.
        </p>

        <a
          href="/api/auth/github"
          className="block w-full text-center px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition"
        >
          Sign in with GitHub
        </a>

        <button
          onClick={onClose}
          className="block w-full text-center text-sm text-zinc-500 hover:text-zinc-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
