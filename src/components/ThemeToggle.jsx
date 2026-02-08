import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-10 w-16 items-center rounded-full border border-[color:var(--card-border)] bg-[color:var(--card)] shadow-soft transition"
      aria-label="Toggle theme"
    >
      <span
        className={`absolute left-1 flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--thumb-bg)] text-[color:var(--thumb-text)] shadow transition ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {isDark ? <FiMoon className="h-4 w-4" /> : <FiSun className="h-4 w-4" />}
      </span>
    </button>
  );
}
