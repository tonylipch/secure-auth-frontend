export default function TwoFactorForm({ otpCode, setOtpCode, loading, onSubmit, onBack }) {
  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <p className="text-sm text-[color:var(--muted)]">
        Enter the code from your authenticator app.
      </p>
      <input
        type="text"
        placeholder="123456"
        className="field"
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value.trim())}
      />
      <button
        type="submit"
        disabled={loading}
        className="btn-strong w-full disabled:opacity-60"
      >
        {loading ? "Verifying..." : "Confirm 2FA"}
      </button>
      <button
        type="button"
        className="btn-primary w-full"
        onClick={onBack}
      >
        Back to login
      </button>
    </form>
  );
}
