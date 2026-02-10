export default function ProfileCard({ typedProfile, error, status }) {
  return (
    <section className="card p-6">
      <h2 className="text-lg font-semibold text-[color:var(--text)]">
        Profile
      </h2>
      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {status && (
        <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {status}
        </div>
      )}
      <div className="mt-6 space-y-3 text-sm text-[color:var(--terminal-green)]">
        <p>
          <span className="font-semibold text-[color:var(--text)]">
            Email:
          </span>{" "}
          {typedProfile.email}
        </p>
        <p>
          <span className="font-semibold text-[color:var(--text)]">
            First name:
          </span>{" "}
          {typedProfile.firstName}
        </p>
        <p>
          <span className="font-semibold text-[color:var(--text)]">
            Last name:
          </span>{" "}
          {typedProfile.lastName}
        </p>
        <p>
          <span className="font-semibold text-[color:var(--text)]">
            Roles:
          </span>{" "}
          {typedProfile.roles}
        </p>
        <p>
          <span className="font-semibold text-[color:var(--text)]">
            2FA:
          </span>{" "}
          {typedProfile.twoFactor}
        </p>
      </div>
    </section>
  );
}
