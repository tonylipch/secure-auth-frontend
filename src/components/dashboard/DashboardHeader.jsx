import ThemeToggle from "../ThemeToggle.jsx";

export default function DashboardHeader({ theme, setTheme, onLogout }) {
  return (
    <header className="border-b border-slate/10 bg-[color:var(--card)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--text)]">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button
            onClick={onLogout}
            className="btn-primary rounded-full px-5 py-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
