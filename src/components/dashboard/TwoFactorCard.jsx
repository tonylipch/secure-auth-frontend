export default function TwoFactorCard({ twoFactor, setTwoFactor, fieldErrors, onSetup, onVerify, onDisable }) {
  return (
    <section className="card p-6 lg:col-span-2">
      <h2 className="text-lg font-semibold text-[color:var(--text)]">
        Two-factor authentication (2FA)
      </h2>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 text-sm text-[color:var(--muted)]">
          <p>
            Generate a secret to enable 2FA and add it to Google
            Authenticator or another app.
          </p>
          <button
            onClick={onSetup}
            className="btn-primary"
          >
            Generate secret
          </button>
          {twoFactor.secret && (
            <div className="rounded-xl bg-slate/5 p-4 text-xs">
              <p className="font-semibold text-slate">Secret:</p>
              <p className="break-all">{twoFactor.secret}</p>
              <p className="mt-2 font-semibold text-slate">OTP URI:</p>
              <p className="break-all">{twoFactor.otpAuthUri}</p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <form className="space-y-3" onSubmit={onVerify}>
            <label className={`text-xs font-semibold ${fieldErrors.twoFactorCode ? "text-red-500" : "text-[color:var(--muted)]"}`}>
              Authenticator code
            </label>
            <input
              type="text"
              placeholder="Authenticator code"
              className={`field ${fieldErrors.twoFactorCode ? "border-red-400" : ""}`}
              value={twoFactor.code}
              onChange={(e) =>
                setTwoFactor((prev) => ({ ...prev, code: e.target.value }))
              }
            />
            {fieldErrors.twoFactorCode && (
              <div className="text-xs text-red-500">{fieldErrors.twoFactorCode}</div>
            )}
            <button
              type="submit"
              className="btn-strong w-full"
            >
              Confirm 2FA
            </button>
          </form>
          <form onSubmit={onDisable}>
            <button
              type="submit"
              className="w-full rounded-xl border border-red-200 bg-red-100 px-4 py-3 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-200"
            >
              Disable 2FA
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
