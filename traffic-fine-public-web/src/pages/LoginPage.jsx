import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./LoginPage.css";

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/payment", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validateField(name, value) {
    if (!value.trim()) {
      return "This field is required.";
    }

    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return "Please enter a valid email address.";
      }
    }

    if (name === "password" && value.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setError("");
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }

  function validateForm() {
    const newErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      const err = validateField(name, value);
      if (err) newErrors[name] = err;
    });
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const formIsValid = Object.entries(formData).every(
    ([name, value]) => !validateField(name, value)
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/payment");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-badge">
          <span className="auth-badge-icon">🛡</span>
          Driver Portal
        </div>

        <h1 className="auth-heading">Welcome Back</h1>
        <p className="auth-subtitle">
          Sign in to your account to view and pay your traffic fines securely.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">
              Email Address
              <span className="auth-required">*</span>
            </label>
            <div className="auth-input-wrapper">
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`auth-input ${fieldErrors.email ? "input-error" : ""}`}
                autoComplete="email"
              />
              <span className="auth-input-icon">✉</span>
            </div>
            {fieldErrors.email && (
              <span className="auth-field-error">⚠ {fieldErrors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="login-password" className="auth-label">
              Password
              <span className="auth-required">*</span>
            </label>
            <div className="auth-input-wrapper">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`auth-input ${fieldErrors.password ? "input-error" : ""}`}
                autoComplete="current-password"
              />
              <span className="auth-input-icon">🔒</span>
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {fieldErrors.password && (
              <span className="auth-field-error">⚠ {fieldErrors.password}</span>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div className="auth-error-banner">
              <span className="auth-error-icon">!</span>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading || !formIsValid}
          >
            {loading && <span className="auth-btn-spinner" />}
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="auth-divider">or</div>

          <p className="auth-switch">
            Don&apos;t have an account?{" "}
            <Link to="/signup">Create Account</Link>
          </p>
        </form>

        <p className="auth-footer">
          Sri Lanka Traffic Fine Management System
          <br />
          Your information is protected with industry-standard encryption.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
