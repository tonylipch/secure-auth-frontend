export default function LoginForm({ loginData, setLoginData, fieldErrors, loading, onSubmit }) {
  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <label className={`text-xs font-semibold ${fieldErrors.email ? "text-red-500" : "text-[color:var(--muted)]"}`}>
        Email
      </label>
      <input
        type="email"
        placeholder="Email"
        className={`field ${fieldErrors.email ? "border-red-400" : ""}`}
        value={loginData.email}
        onChange={(e) =>
          setLoginData((prev) => ({ ...prev, email: e.target.value }))
        }
      />
      {fieldErrors.email && (
        <div className="text-xs text-red-500">{fieldErrors.email}</div>
      )}
      <label className={`text-xs font-semibold ${fieldErrors.password ? "text-red-500" : "text-[color:var(--muted)]"}`}>
        Password
      </label>
      <input
        type="password"
        placeholder="Password"
        className={`field ${fieldErrors.password ? "border-red-400" : ""}`}
        value={loginData.password}
        onChange={(e) =>
          setLoginData((prev) => ({
            ...prev,
            password: e.target.value
          }))
        }
      />
      {fieldErrors.password && (
        <div className="text-xs text-red-500">{fieldErrors.password}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="btn-strong w-full disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
