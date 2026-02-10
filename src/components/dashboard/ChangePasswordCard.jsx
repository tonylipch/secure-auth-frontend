export default function ChangePasswordCard({ passwordForm, setPasswordForm, fieldErrors, onSubmit }) {
  return (
    <section className="card p-6">
      <h2 className="text-lg font-semibold text-[color:var(--text)]">
        Change password
      </h2>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <label className={`text-xs font-semibold ${fieldErrors.currentPassword ? "text-red-500" : "text-[color:var(--muted)]"}`}>
          Current password
        </label>
        <input
          type="password"
          placeholder="Current password"
          className={`field ${fieldErrors.currentPassword ? "border-red-400" : ""}`}
          value={passwordForm.currentPassword}
          onChange={(e) =>
            setPasswordForm((prev) => ({
              ...prev,
              currentPassword: e.target.value
            }))
          }
        />
        {fieldErrors.currentPassword && (
          <div className="text-xs text-red-500">{fieldErrors.currentPassword}</div>
        )}
        <label className={`text-xs font-semibold ${fieldErrors.newPassword ? "text-red-500" : "text-[color:var(--muted)]"}`}>
          New password
        </label>
        <input
          type="password"
          placeholder="New password"
          className={`field ${fieldErrors.newPassword ? "border-red-400" : ""}`}
          value={passwordForm.newPassword}
          onChange={(e) =>
            setPasswordForm((prev) => ({
              ...prev,
              newPassword: e.target.value
            }))
          }
        />
        {fieldErrors.newPassword && (
          <div className="text-xs text-red-500">{fieldErrors.newPassword}</div>
        )}
        <button
          type="submit"
          className="btn-strong w-full"
        >
          Update password
        </button>
      </form>
    </section>
  );
}
