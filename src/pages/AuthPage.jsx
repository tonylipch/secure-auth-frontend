import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, oauthGoogleUrl } from "../api.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

const initialRegister = {
  email: "",
  password: "",
  firstName: "",
  lastName: ""
};

export default function AuthPage({ theme, setTheme }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState(initialRegister);
  const [fieldErrors, setFieldErrors] = useState({});
  const [requires2fa, setRequires2fa] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setRequires2fa(false);
    setTempToken("");
    setOtpCode("");
    setError("");
    setFieldErrors({});
  };

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");

  const validateLogin = () => {
    const errors = {};
    if (!loginData.email) errors.email = "Email is required";
    else if (!validateEmail(loginData.email)) errors.email = "Invalid email";
    if (!loginData.password) errors.password = "Password is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    const errors = {};
    if (!registerData.firstName) errors.firstName = "First name is required";
    if (!registerData.lastName) errors.lastName = "Last name is required";
    if (!registerData.email) errors.email = "Email is required";
    else if (!validateEmail(registerData.email)) errors.email = "Invalid email";
    if (!registerData.password) errors.password = "Password is required";
    else if (registerData.password.length < 8) {
      errors.password = "Min 8 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const data = await api.login(loginData);
      if (data?.requiresTwoFactor) {
        setRequires2fa(true);
        setTempToken(data.tempToken);
        return;
      }
      localStorage.setItem("accessToken", data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateRegister()) return;
    setLoading(true);
    try {
      const data = await api.register(registerData);
      localStorage.setItem("accessToken", data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handle2fa = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login2fa({
        tempToken,
        code: otpCode
      });
      localStorage.setItem("accessToken", data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="absolute right-6 top-6">
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-center">
          <h1 className="mt-4 text-4xl font-bold text-[color:var(--text)] md:text-5xl">
            Secure account hub for modern authentication
          </h1>
          <p className="mt-4 max-w-xl text-base text-[color:var(--muted)]">
            Sign in with email and password, Google OAuth, and optional 2FA.
            Tokens are stored locally and attached to API requests.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              className="btn-strong rounded-full px-6"
              onClick={() => switchMode("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              className="btn-strong rounded-full px-6"
              onClick={() => switchMode("register")}
            >
              Create account
            </button>
            <a
              href="https://github.com/tonylipch/secure-auth-backend"
              className="btn-dark inline-flex items-center gap-2 rounded-full px-6"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.019c0 4.43 2.865 8.188 6.839 9.514.5.092.682-.218.682-.484 0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.907-.62.069-.608.069-.608 1.003.071 1.53 1.033 1.53 1.033.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.094.389-1.99 1.029-2.692-.103-.253-.446-1.27.098-2.646 0 0 .84-.27 2.75 1.027A9.563 9.563 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.297 2.748-1.027 2.748-1.027.546 1.376.203 2.393.1 2.646.64.702 1.028 1.598 1.028 2.692 0 3.848-2.339 4.695-4.566 4.943.36.311.68.923.68 1.86 0 1.342-.012 2.423-.012 2.752 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.019C22 6.484 17.523 2 12 2Z" />
              </svg>
              GitHub
            </a>
          </div>
        </section>
        <section className="flex items-center">
          <div className="card w-full p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[color:var(--text)]">
                {mode === "login" ? "Sign in" : "Register"}
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={mode === "login" ? "pill-active" : "pill-inactive"}
                  onClick={() => switchMode("login")}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className={mode === "register" ? "pill-active" : "pill-inactive"}
                  onClick={() => switchMode("register")}
                >
                  Register
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {mode === "login" && !requires2fa && (
              <form className="mt-6 space-y-4" onSubmit={handleLogin}>
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
            )}

            {mode === "login" && requires2fa && (
              <form className="mt-6 space-y-4" onSubmit={handle2fa}>
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
                  onClick={() => {
                    setRequires2fa(false);
                    setTempToken("");
                    setOtpCode("");
                  }}
                >
                  Back to login
                </button>
              </form>
            )}

            {mode === "register" && (
              <form className="mt-6 space-y-4" onSubmit={handleRegister}>
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
            )}

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate/10" />
              <span className="text-xs text-[color:var(--muted)]">or</span>
              <div className="h-px flex-1 bg-slate/10" />
            </div>

            <a
              href={oauthGoogleUrl}
              className="mt-4 flex w-full justify-center"
            >
              <img
                src={
                  theme === "dark"
                    ? "/google-signin/google-signin-dark.svg"
                    : "/google-signin/google-signin-light.svg"
                }
                alt="Sign in with Google"
                className="h-12 w-auto"
                loading="lazy"
              />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
