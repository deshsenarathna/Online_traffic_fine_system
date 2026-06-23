
import { useState } from "react";
import apiClient from "../api/apiClient";

function FineForm({ onFineCreated }) {
  const [formData, setFormData] = useState({
    referenceNumber: "",
    categoryCode: "",
    officerBadgeNumber: "",
    driverName: "",
    driverLicenseNumber: "",
    vehicleNumber: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validationRules = {
    referenceNumber: {
      pattern: /^REF\d{5}$/,
      message: "Use REF followed by 5 digits. Example: REF12345",
    },
    categoryCode: {
      pattern: /^C\d{3}$/,
      message: "Use C followed by 3 digits. Example: C001",
    },
    officerBadgeNumber: {
      pattern: /^B\d{3}$/,
      message: "Use B followed by 3 digits. Example: B123",
    },
    driverName: {
      pattern: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
      message: "Enter a valid name using letters and spaces only.",
    },
    driverLicenseNumber: {
      pattern: /^[A-Z]\d{7}$/,
      message:
        "Use one uppercase letter followed by 7 digits. Example: B1234567",
    },
    vehicleNumber: {
      pattern: /^[A-Z]{2,3}-\d{4}$/,
      message:
        "Use 2 or 3 uppercase letters, a hyphen and 4 digits. Example: CAA-1234",
    },
  };

  function normalizeValue(name, value) {
    if (name === "driverName") {
      return value.replace(/[^A-Za-z ]/g, "").replace(/\s+/g, " ");
    }

    return value.toUpperCase().replace(/\s/g, "");
  }

  function validateField(name, value) {
    if (!value.trim()) {
      return "This field is required.";
    }

    const rule = validationRules[name];

    if (!rule.pattern.test(value.trim())) {
      return rule.message;
    }

    return "";
  }

  function handleChange(event) {
    const { name, value } = event.target;
    const normalizedValue = normalizeValue(name, value);

    setFormData((previousData) => ({
      ...previousData,
      [name]: normalizedValue,
    }));

    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [name]: validateField(name, normalizedValue),
    }));

    setError("");
  }

  function handleBlur(event) {
    const { name, value } = event.target;

    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [name]: validateField(name, value),
    }));
  }

  function validateForm() {
    const newErrors = {};

    Object.entries(formData).forEach(([name, value]) => {
      const validationError = validateField(name, value);

      if (validationError) {
        newErrors[name] = validationError;
      }
    });

    setFieldErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  const formIsValid = Object.entries(formData).every(([name, value]) => {
    const rule = validationRules[name];

    return value.trim() !== "" && rule.pattern.test(value.trim());
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post("/fines/create", {
        ...formData,
        driverName: formData.driverName.trim(),
      });

      onFineCreated(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to verify the fine details."
      );
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "32px 18px",
      background:
        "linear-gradient(135deg, #071c36 0%, #0b5b7a 45%, #12b89f 100%)",
      fontFamily: "Inter, Arial, sans-serif",
    },

    card: {
      width: "100%",
      maxWidth: "620px",
      backgroundColor: "rgba(255, 255, 255, 0.97)",
      borderRadius: "24px",
      padding: "38px",
      boxShadow: "0 24px 70px rgba(0, 0, 0, 0.28)",
    },

    topBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 14px",
      borderRadius: "999px",
      backgroundColor: "#e8faf7",
      color: "#08796d",
      fontSize: "12px",
      fontWeight: "700",
      marginBottom: "18px",
    },

    heading: {
      margin: "0",
      color: "#102a43",
      fontSize: "32px",
      fontWeight: "800",
    },

    subtitle: {
      margin: "10px 0 30px",
      color: "#627d98",
      fontSize: "14px",
      lineHeight: "1.7",
    },

    sectionTitle: {
      margin: "0 0 18px",
      color: "#243b53",
      fontSize: "15px",
      fontWeight: "700",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "20px",
    },

    field: {
      display: "flex",
      flexDirection: "column",
      gap: "7px",
    },

    fullField: {
      gridColumn: "1 / -1",
      display: "flex",
      flexDirection: "column",
      gap: "7px",
    },

    label: {
      color: "#334e68",
      fontSize: "12px",
      fontWeight: "700",
    },

    required: {
      color: "#e85d75",
      marginLeft: "3px",
    },

    input: {
      width: "100%",
      padding: "13px 14px",
      borderRadius: "12px",
      backgroundColor: "#f8fbfd",
      color: "#102a43",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
    },

    helperText: {
      color: "#829ab1",
      fontSize: "11px",
    },

    fieldError: {
      color: "#c62828",
      fontSize: "11px",
      fontWeight: "600",
      lineHeight: "1.4",
    },

    divider: {
      height: "1px",
      backgroundColor: "#e9eff5",
      margin: "28px 0",
    },

    notice: {
      display: "flex",
      gap: "12px",
      alignItems: "flex-start",
      backgroundColor: "#effaf8",
      border: "1px solid #c6f0e8",
      borderRadius: "14px",
      padding: "14px",
      marginTop: "24px",
      color: "#256d63",
      fontSize: "12px",
      lineHeight: "1.6",
    },

    noticeIcon: {
      width: "28px",
      height: "28px",
      flexShrink: "0",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#18b59f",
      color: "white",
      fontWeight: "800",
    },

    error: {
      marginTop: "20px",
      padding: "13px 14px",
      borderRadius: "12px",
      border: "1px solid #f6b8c1",
      backgroundColor: "#fff3f5",
      color: "#b4233a",
      fontSize: "13px",
      fontWeight: "600",
    },

    button: {
      width: "100%",
      marginTop: "26px",
      padding: "15px 18px",
      border: "none",
      borderRadius: "14px",
      background:
        loading || !formIsValid
          ? "#9ebbb7"
          : "linear-gradient(90deg, #087f8c 0%, #16b89d 100%)",
      color: "white",
      fontSize: "14px",
      fontWeight: "800",
      letterSpacing: "0.8px",
      cursor:
        loading || !formIsValid ? "not-allowed" : "pointer",
    },

    footer: {
      textAlign: "center",
      marginTop: "18px",
      color: "#829ab1",
      fontSize: "11px",
    },
  };

  function getInputStyle(fieldName) {
    return {
      ...styles.input,
      border: fieldErrors[fieldName]
        ? "1px solid #dc3545"
        : "1px solid #d9e2ec",
    };
  }

  function renderError(fieldName) {
    return (
      fieldErrors[fieldName] && (
        <span style={styles.fieldError}>
          {fieldErrors[fieldName]}
        </span>
      )
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topBadge}>
          <span>✓</span>
          Secure Government Service
        </div>

        <h1 style={styles.heading}>Pay Your Traffic Fine</h1>

        <p style={styles.subtitle}>
          Enter the information shown on your traffic fine sheet.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <h2 style={styles.sectionTitle}>Fine information</h2>

          <div style={styles.grid}>
            <div style={styles.field}>
              <label htmlFor="referenceNumber" style={styles.label}>
                Fine reference number
                <span style={styles.required}>*</span>
              </label>

              <input
                id="referenceNumber"
                name="referenceNumber"
                type="text"
                placeholder="REF12345"
                maxLength={8}
                value={formData.referenceNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                style={getInputStyle("referenceNumber")}
              />

              {renderError("referenceNumber")}

              <span style={styles.helperText}>
                Format: REF followed by 5 digits.
              </span>
            </div>

            <div style={styles.field}>
              <label htmlFor="categoryCode" style={styles.label}>
                Fine category code
                <span style={styles.required}>*</span>
              </label>

              <input
                id="categoryCode"
                name="categoryCode"
                type="text"
                placeholder="C001"
                maxLength={4}
                value={formData.categoryCode}
                onChange={handleChange}
                onBlur={handleBlur}
                style={getInputStyle("categoryCode")}
              />

              {renderError("categoryCode")}

              <span style={styles.helperText}>
                Format: C followed by 3 digits.
              </span>
            </div>

            <div style={styles.fullField}>
              <label htmlFor="officerBadgeNumber" style={styles.label}>
                Police officer badge number
                <span style={styles.required}>*</span>
              </label>

              <input
                id="officerBadgeNumber"
                name="officerBadgeNumber"
                type="text"
                placeholder="OFF1234"
                maxLength={7}
                value={formData.officerBadgeNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                style={getInputStyle("officerBadgeNumber")}
              />

              {renderError("officerBadgeNumber")}
            </div>
          </div>

          <div style={styles.divider} />

          <h2 style={styles.sectionTitle}>Driver information</h2>

          <div style={styles.grid}>
            <div style={styles.fullField}>
              <label htmlFor="driverName" style={styles.label}>
                Driver full name
                <span style={styles.required}>*</span>
              </label>

              <input
                id="driverName"
                name="driverName"
                type="text"
                placeholder="Kamal Perera"
                maxLength={60}
                value={formData.driverName}
                onChange={handleChange}
                onBlur={handleBlur}
                style={getInputStyle("driverName")}
              />

              {renderError("driverName")}
            </div>

            <div style={styles.field}>
              <label htmlFor="driverLicenseNumber" style={styles.label}>
                Driving licence number
                <span style={styles.required}>*</span>
              </label>

              <input
                id="driverLicenseNumber"
                name="driverLicenseNumber"
                type="text"
                placeholder="B1234567"
                maxLength={8}
                value={formData.driverLicenseNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                style={getInputStyle("driverLicenseNumber")}
              />

              {renderError("driverLicenseNumber")}
            </div>

            <div style={styles.field}>
              <label htmlFor="vehicleNumber" style={styles.label}>
                Vehicle registration number
                <span style={styles.required}>*</span>
              </label>

              <input
                id="vehicleNumber"
                name="vehicleNumber"
                type="text"
                placeholder="CAA-1234"
                maxLength={8}
                value={formData.vehicleNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                style={getInputStyle("vehicleNumber")}
              />

              {renderError("vehicleNumber")}
            </div>
          </div>

          <div style={styles.notice}>
            <div style={styles.noticeIcon}>i</div>

            <div>
              Make sure all details match the printed fine sheet.
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            style={styles.button}
            disabled={loading || !formIsValid}
          >
            {loading ? "VERIFYING FINE..." : "VERIFY AND CONTINUE"}
          </button>
        </form>

        <p style={styles.footer}>
          Your information is used only to verify and process the payment.
        </p>
      </div>
    </div>
  );
}

export default FineForm;