
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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post("/fines/create", formData);
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
      border: "1px solid rgba(255, 255, 255, 0.35)",
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
      letterSpacing: "0.8px",
      textTransform: "uppercase",
      marginBottom: "18px",
    },

    heading: {
      margin: "0",
      color: "#102a43",
      fontSize: "32px",
      fontWeight: "800",
      letterSpacing: "-0.5px",
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
      border: "1px solid #d9e2ec",
      backgroundColor: "#f8fbfd",
      color: "#102a43",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
      transition: "all 0.2s ease",
    },

    helperText: {
      color: "#829ab1",
      fontSize: "11px",
      marginTop: "1px",
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
      background: loading
        ? "#8bbcb5"
        : "linear-gradient(90deg, #087f8c 0%, #16b89d 100%)",
      color: "white",
      fontSize: "14px",
      fontWeight: "800",
      letterSpacing: "0.8px",
      cursor: loading ? "not-allowed" : "pointer",
      boxShadow: "0 12px 24px rgba(22, 184, 157, 0.24)",
    },

    footer: {
      textAlign: "center",
      marginTop: "18px",
      color: "#829ab1",
      fontSize: "11px",
      lineHeight: "1.6",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topBadge}>
          <span>✓</span>
          Secure Government Service
        </div>

        <h1 style={styles.heading}>Pay Your Traffic Fine</h1>

        <p style={styles.subtitle}>
          Enter the information shown on your traffic fine sheet. Your fine
          details will be verified before the payment is initiated.
        </p>

        <form onSubmit={handleSubmit}>
          <h2 style={styles.sectionTitle}>Fine information</h2>

          <div style={styles.grid}>
            <div style={styles.field}>
              <label htmlFor="referenceNumber" style={styles.label}>
                Fine reference number
                <span style={styles.required}>*</span>
              </label>

              <input
                id="referenceNumber"
                type="text"
                name="referenceNumber"
                placeholder="REF12346"
                value={formData.referenceNumber}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <span style={styles.helperText}>
                Enter the unique reference printed on the fine sheet.
              </span>
            </div>

            <div style={styles.field}>
              <label htmlFor="categoryCode" style={styles.label}>
                Fine category code
                <span style={styles.required}>*</span>
              </label>

              <input
                id="categoryCode"
                type="text"
                name="categoryCode"
                placeholder="C001"
                value={formData.categoryCode}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <span style={styles.helperText}>
                Use the category identifier shown on the fine.
              </span>
            </div>

            <div style={styles.fullField}>
              <label htmlFor="officerBadgeNumber" style={styles.label}>
                Police officer badge number
                <span style={styles.required}>*</span>
              </label>

              <input
                id="officerBadgeNumber"
                type="text"
                name="officerBadgeNumber"
                placeholder="Enter officer badge number"
                value={formData.officerBadgeNumber}
                onChange={handleChange}
                style={styles.input}
                required
              />
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
                type="text"
                name="driverName"
                placeholder="Enter driver full name"
                value={formData.driverName}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="driverLicenseNumber" style={styles.label}>
                Driving licence number
                <span style={styles.required}>*</span>
              </label>

              <input
                id="driverLicenseNumber"
                type="text"
                name="driverLicenseNumber"
                placeholder="B1234567"
                value={formData.driverLicenseNumber}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="vehicleNumber" style={styles.label}>
                Vehicle registration number
                <span style={styles.required}>*</span>
              </label>

              <input
                id="vehicleNumber"
                type="text"
                name="vehicleNumber"
                placeholder="CAA-1234"
                value={formData.vehicleNumber}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.notice}>
            <div style={styles.noticeIcon}>i</div>

            <div>
              Make sure the entered information matches the printed fine sheet.
              Incorrect details may prevent the payment from being processed.
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "VERIFYING FINE..." : "VERIFY AND CONTINUE"}
          </button>
        </form>

        <p style={styles.footer}>
          Your information is used only to verify and process the traffic fine
          payment.
        </p>
      </div>
    </div>
  );
}

export default FineForm;
