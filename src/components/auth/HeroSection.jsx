export default function HeroSection({ switchMode }) {
  return (
    <section className="flex flex-col justify-center">
      <h1 className="mt-4 text-4xl font-bold text-[color:var(--text)] md:text-5xl">
        Secure account hub for modern authentication
      </h1>
      <p className="mt-4 max-w-xl text-base text-[color:var(--muted)]">
        Sign in with email and password, Google OAuth, and optional 2FA.
        Tokens are stored locally and attached to API requests.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          className="btn-strong rounded-full px-6"
          onClick={() => switchMode("login")}
        >
          Sign in
        </button>
        <button
          type="button"
          className="btn-strong rounded-full px-6"
          onClick={() => switchMode("register")}
        >
          Create account
        </button>
        <a
          href="https://github.com/tonylipch/secure-auth-backend"
          className="btn-dark inline-flex items-center gap-2 rounded-full px-6"
          target="_blank"
          rel="noreferrer"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2C6.477 2 2 6.484 2 12.019c0 4.43 2.865 8.188 6.839 9.514.5.092.682-.218.682-.484 0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.907-.62.069-.608.069-.608 1.003.071 1.53 1.033 1.53 1.033.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.094.389-1.99 1.029-2.692-.103-.253-.446-1.27.098-2.646 0 0 .84-.27 2.75 1.027A9.563 9.563 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.297 2.748-1.027 2.748-1.027.546 1.376.203 2.393.1 2.646.64.702 1.028 1.598 1.028 2.692 0 3.848-2.339 4.695-4.566 4.943.36.311.68.923.68 1.86 0 1.342-.012 2.423-.012 2.752 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.019C22 6.484 17.523 2 12 2Z" />
          </svg>
          GitHub
        </a>
      </div>
    </section>
  );
}
