import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import useTypewriter from "../hooks/useTypewriter.js";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import ProfileCard from "../components/dashboard/ProfileCard.jsx";
import ChangePasswordCard from "../components/dashboard/ChangePasswordCard.jsx";
import TwoFactorCard from "../components/dashboard/TwoFactorCard.jsx";
import LogoutModal from "../components/dashboard/LogoutModal.jsx";

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

  const typedProfile = useTypewriter(profile);

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
      <DashboardHeader theme={theme} setTheme={setTheme} onLogout={handleLogout} />

      <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10 lg:grid-cols-2">
        <ProfileCard typedProfile={typedProfile} error={error} status={status} />

        <ChangePasswordCard
          passwordForm={passwordForm}
          setPasswordForm={setPasswordForm}
          fieldErrors={fieldErrors}
          onSubmit={handleChangePassword}
        />

        <TwoFactorCard
          twoFactor={twoFactor}
          setTwoFactor={setTwoFactor}
          fieldErrors={fieldErrors}
          onSetup={handleSetup2fa}
          onVerify={handleVerify2fa}
          onDisable={handleDisable2fa}
        />
      </main>

      {showLogoutConfirm && (
        <LogoutModal onCancel={cancelLogout} onConfirm={confirmLogout} />
      )}
    </div>
  );
}
