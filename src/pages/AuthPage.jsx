import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, oauthGoogleUrl } from "../api.js";
import ThemeToggle from "../components/ThemeToggle.jsx";
import HeroSection from "../components/auth/HeroSection.jsx";
import LoginForm from "../components/auth/LoginForm.jsx";
import RegisterForm from "../components/auth/RegisterForm.jsx";
import TwoFactorForm from "../components/auth/TwoFactorForm.jsx";

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
        <HeroSection switchMode={switchMode} />
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
              <LoginForm
                loginData={loginData}
                setLoginData={setLoginData}
                fieldErrors={fieldErrors}
                loading={loading}
                onSubmit={handleLogin}
              />
            )}

            {mode === "login" && requires2fa && (
              <TwoFactorForm
                otpCode={otpCode}
                setOtpCode={setOtpCode}
                loading={loading}
                onSubmit={handle2fa}
                onBack={() => {
                  setRequires2fa(false);
                  setTempToken("");
                  setOtpCode("");
                }}
              />
            )}

            {mode === "register" && (
              <RegisterForm
                registerData={registerData}
                setRegisterData={setRegisterData}
                fieldErrors={fieldErrors}
                loading={loading}
                onSubmit={handleRegister}
              />
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
