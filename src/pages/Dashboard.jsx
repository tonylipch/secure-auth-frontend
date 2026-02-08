import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function Dashboard({ theme, setTheme }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: ""
  });
  const [twoFactor, setTwoFactor] = useState({
    secret: "",
    otpAuthUri: "",
    code: ""
  });
  const [status, setStatus] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [typedProfile, setTypedProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    roles: "",
    twoFactor: ""
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await api.me();
      setProfile(data);
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (!profile) return;

    const full = {
      email: profile.email || "",
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      roles: (profile.roles || []).join(", "),
      twoFactor: profile.twoFactorEnabled ? "Enabled" : "Disabled"
    };

    setTypedProfile({
      email: "",
      firstName: "",
      lastName: "",
      roles: "",
      twoFactor: ""
    });

    const keys = Object.keys(full);
    let keyIndex = 0;
    let charIndex = 0;
    const interval = setInterval(() => {
      const key = keys[keyIndex];
      const value = full[key];
      if (charIndex <= value.length) {
        setTypedProfile((prev) => ({
          ...prev,
          [key]: value.slice(0, charIndex)
        }));
        charIndex += 1;
      } else {
        keyIndex += 1;
        charIndex = 0;
        if (keyIndex >= keys.length) {
          clearInterval(interval);
        }
      }
    }, 18);

    return () => clearInterval(interval);
  }, [profile]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    const errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = "This field is required";
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = "This field is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "This field must be at least 8 characters";
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      await api.changePassword(passwordForm);
      setStatus("Password updated successfully");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.message || "Failed to update password");
    }
  };

  const handleSetup2fa = async () => {
    setStatus("");
    setError("");
    try {
      const data = await api.setup2fa();
      setTwoFactor((prev) => ({
        ...prev,
        secret: data.secret,
        otpAuthUri: data.otpAuthUri
      }));
    } catch (err) {
      setError(err.message || "Failed to setup 2FA");
    }
  };

  const handleVerify2fa = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    const errors = {};
    if (!twoFactor.code) {
      errors.twoFactorCode = "This field is required";
    } else if (!/^\d{6}$/.test(twoFactor.code)) {
      errors.twoFactorCode = "This field must be 6 digits";
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      await api.verify2fa({ code: twoFactor.code });
      setStatus("2FA enabled");
      setTwoFactor((prev) => ({ ...prev, code: "" }));
      await loadProfile();
    } catch (err) {
      setError(err.message || "Invalid code");
    }
  };

  const handleDisable2fa = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    const errors = {};
    if (!twoFactor.code) {
      errors.twoFactorCode = "This field is required";
    } else if (!/^\d{6}$/.test(twoFactor.code)) {
      errors.twoFactorCode = "This field must be 6 digits";
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      await api.disable2fa({ code: twoFactor.code });
      setStatus("2FA disabled");
      setTwoFactor({ secret: "", otpAuthUri: "", code: "" });
      await loadProfile();
    } catch (err) {
      setError(err.message || "Failed to disable 2FA");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[color:var(--muted)]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen app-shell">
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
              onClick={handleLogout}
              className="btn-primary rounded-full px-5 py-2"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10 lg:grid-cols-2">
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

        <section className="card p-6">
          <h2 className="text-lg font-semibold text-[color:var(--text)]">
            Change password
          </h2>
          <form className="mt-4 space-y-3" onSubmit={handleChangePassword}>
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
                onClick={handleSetup2fa}
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
              <form className="space-y-3" onSubmit={handleVerify2fa}>
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
              <form onSubmit={handleDisable2fa}>
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
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="card w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-[color:var(--text)]">
              Sign out?
            </h3>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Are you sure you want to sign out from this device?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="btn-primary w-full"
                onClick={cancelLogout}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-strong w-full"
                onClick={confirmLogout}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
