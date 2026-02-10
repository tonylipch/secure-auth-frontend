export default function RegisterForm({ registerData, setRegisterData, fieldErrors, loading, onSubmit }) {
  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className={`text-xs font-semibold ${fieldErrors.firstName ? "text-red-500" : "text-[color:var(--muted)]"}`}>
            First name
          </label>
        <input
          type="text"
          placeholder="First name"
          className={`field ${fieldErrors.firstName ? "border-red-400" : ""}`}
          value={registerData.firstName}
          onChange={(e) =>
            setRegisterData((prev) => ({
              ...prev,
              firstName: e.target.value
            }))
          }
        />
        {fieldErrors.firstName && (
          <div className="text-xs text-red-500">{fieldErrors.firstName}</div>
        )}
        </div>
        <div className="space-y-2">
          <label className={`text-xs font-semibold ${fieldErrors.lastName ? "text-red-500" : "text-[color:var(--muted)]"}`}>
            Last name
          </label>
        <input
          type="text"
          placeholder="Last name"
          className={`field ${fieldErrors.lastName ? "border-red-400" : ""}`}
          value={registerData.lastName}
          onChange={(e) =>
            setRegisterData((prev) => ({
              ...prev,
              lastName: e.target.value
            }))
          }
        />
        {fieldErrors.lastName && (
          <div className="text-xs text-red-500">{fieldErrors.lastName}</div>
        )}
        </div>
      </div>
      <label className={`text-xs font-semibold ${fieldErrors.email ? "text-red-500" : "text-[color:var(--muted)]"}`}>
        Email
      </label>
      <input
        type="email"
        placeholder="Email"
        className={`field ${fieldErrors.email ? "border-red-400" : ""}`}
        value={registerData.email}
        onChange={(e) =>
          setRegisterData((prev) => ({
            ...prev,
            email: e.target.value
          }))
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
        value={registerData.password}
        onChange={(e) =>
          setRegisterData((prev) => ({
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
        {loading ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
