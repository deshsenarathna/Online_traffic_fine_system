import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./LoginPage.css";

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    phoneNumber: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function validateField(name, value) {
    if (!value.trim()) {
      return "This field is required.";
    }

    switch (name) {
      case "fullName":
        if (!/^[A-Za-z]+(?: [A-Za-z]+)+$/.test(value.trim())) {
          return "Enter your full name (first and last name).";
        }
        break;

      case "email": {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          return "Please enter a valid email address.";
        }
        break;
      }

      case "password":
        if (value.length < 6) {
          return "Password must be at least 6 characters.";
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          return "Passwords do not match.";
        }
        break;

      case "licenseNumber":
        if (!/^[A-Z]\d{7}$/.test(value.trim())) {
          return "Format: 1 uppercase letter + 7 digits (e.g., B1234567)";
        }
        break;

      case "phoneNumber":
        if (!/^0\d{9}$/.test(value.replace(/\s/g, ""))) {
          return "Enter a valid 10-digit phone number (e.g., 0771234567)";
        }
        break;

      default:
        break;
    }

    return "";
  }

  function handleChange(event) {
    const { name, value } = event.target;
    let normalizedValue = value;

    if (name === "licenseNumber") {
      normalizedValue = value.toUpperCase().replace(/\s/g, "");
    }

    if (name === "fullName") {
      normalizedValue = value.replace(/[^A-Za-z ]/g, "").replace(/\s+/g, " ");
    }

    const updatedFormData = { ...formData, [name]: normalizedValue };
    setFormData(updatedFormData);

    // Validate current field
    setFieldErrors((prev) => ({
      ...prev,
      [name]: validateField(name, normalizedValue),
    }));

    // Re-validate confirm password if password changes
    if (name === "password" && updatedFormData.confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword:
          updatedFormData.confirmPassword !== normalizedValue
            ? "Passwords do not match."
            : "",
      }));
    }

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
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup({
        fullName: formData.fullName.trim(),
        email: formData.email,
        password: formData.password,
        licenseNumber: formData.licenseNumber,
        phoneNumber: formData.phoneNumber.replace(/\s/g, ""),
      });

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function renderFieldError(fieldName) {
    return (
      fieldErrors[fieldName] && (
        <span className="auth-field-error">⚠ {fieldErrors[fieldName]}</span>
      )
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card signup-card">
        <div className="auth-badge">
          <span className="auth-badge-icon">🛡</span>
          New Driver Registration
        </div>

        <h1 className="auth-heading">Create Your Account</h1>
        <p className="auth-subtitle">
          Register to access the online traffic fine payment system. All fields
          are required.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form-grid">
            {/* Full Name */}
            <div className="auth-field full-width">
              <label htmlFor="signup-fullName" className="auth-label">
                Full Name
                <span className="auth-required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="signup-fullName"
                  name="fullName"
                  type="text"
                  placeholder="Kamal Perera"
                  maxLength={60}
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`auth-input ${fieldErrors.fullName ? "input-error" : ""}`}
                  autoComplete="name"
                />
                <span className="auth-input-icon">👤</span>
              </div>
              {renderFieldError("fullName")}
            </div>

            {/* Email */}
            <div className="auth-field full-width">
              <label htmlFor="signup-email" className="auth-label">
                Email Address
                <span className="auth-required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="signup-email"
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
              {renderFieldError("email")}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label htmlFor="signup-password" className="auth-label">
                Password
                <span className="auth-required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`auth-input ${fieldErrors.password ? "input-error" : ""}`}
                  autoComplete="new-password"
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
              {renderFieldError("password")}
            </div>

            {/* Confirm Password */}
            <div className="auth-field">
              <label htmlFor="signup-confirmPassword" className="auth-label">
                Confirm Password
                <span className="auth-required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="signup-confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`auth-input ${fieldErrors.confirmPassword ? "input-error" : ""}`}
                  autoComplete="new-password"
                />
                <span className="auth-input-icon">🔒</span>
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
              {renderFieldError("confirmPassword")}
            </div>

            {/* License Number */}
            <div className="auth-field">
              <label htmlFor="signup-licenseNumber" className="auth-label">
                License Number
                <span className="auth-required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="signup-licenseNumber"
                  name="licenseNumber"
                  type="text"
                  placeholder="B1234567"
                  maxLength={8}
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`auth-input ${fieldErrors.licenseNumber ? "input-error" : ""}`}
                />
                <span className="auth-input-icon">🪪</span>
              </div>
              {renderFieldError("licenseNumber")}
            </div>

            {/* Phone Number */}
            <div className="auth-field">
              <label htmlFor="signup-phoneNumber" className="auth-label">
                Phone Number
                <span className="auth-required">*</span>
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="signup-phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="0771234567"
                  maxLength={10}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`auth-input ${fieldErrors.phoneNumber ? "input-error" : ""}`}
                  autoComplete="tel"
                />
                <span className="auth-input-icon">📱</span>
              </div>
              {renderFieldError("phoneNumber")}
            </div>
          </div>

          {/* Success banner */}
          {success && (
            <div className="auth-success-banner">
              <span className="auth-success-icon">✓</span>
              {success}
            </div>
          )}

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
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="auth-divider">or</div>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
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

export default SignupPage;
