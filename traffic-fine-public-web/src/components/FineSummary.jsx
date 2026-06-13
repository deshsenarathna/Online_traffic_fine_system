
function FineSummary({ fine, onPay, loading, onBack }) {
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
      margin: "10px 0 28px",
      color: "#627d98",
      fontSize: "14px",
      lineHeight: "1.7",
    },

    amountCard: {
      padding: "22px",
      borderRadius: "18px",
      background: "linear-gradient(135deg, #087f8c 0%, #16b89d 100%)",
      color: "#ffffff",
      marginBottom: "26px",
      boxShadow: "0 14px 28px rgba(22, 184, 157, 0.22)",
    },

    amountLabel: {
      margin: "0 0 8px",
      fontSize: "12px",
      fontWeight: "700",
      letterSpacing: "1px",
      textTransform: "uppercase",
      opacity: "0.9",
    },

    amountValue: {
      margin: "0",
      fontSize: "36px",
      fontWeight: "800",
    },

    sectionTitle: {
      margin: "0 0 16px",
      color: "#243b53",
      fontSize: "15px",
      fontWeight: "700",
    },

    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "16px",
    },

    detailItem: {
      padding: "15px",
      borderRadius: "14px",
      backgroundColor: "#f8fbfd",
      border: "1px solid #e2e8f0",
    },

    detailLabel: {
      display: "block",
      marginBottom: "7px",
      color: "#829ab1",
      fontSize: "11px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.7px",
    },

    detailValue: {
      margin: "0",
      color: "#243b53",
      fontSize: "14px",
      fontWeight: "700",
      wordBreak: "break-word",
    },

    statusBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "7px",
      padding: "7px 11px",
      borderRadius: "999px",
      backgroundColor:
        fine.status?.toUpperCase() === "PAID" ? "#e6f7ed" : "#fff6df",
      color:
        fine.status?.toUpperCase() === "PAID" ? "#207a47" : "#9a6700",
      fontSize: "12px",
      fontWeight: "800",
    },

    notice: {
      display: "flex",
      gap: "12px",
      alignItems: "flex-start",
      marginTop: "24px",
      padding: "14px",
      borderRadius: "14px",
      backgroundColor: "#effaf8",
      border: "1px solid #c6f0e8",
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

    buttonRow: {
      display: "flex",
      gap: "14px",
      marginTop: "26px",
      flexWrap: "wrap",
    },

    backButton: {
      flex: "1",
      minWidth: "160px",
      padding: "14px 18px",
      borderRadius: "14px",
      border: "1px solid #b8c7d1",
      backgroundColor: "#ffffff",
      color: "#486581",
      fontSize: "13px",
      fontWeight: "800",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.65 : 1,
    },

    payButton: {
      flex: "2",
      minWidth: "220px",
      padding: "14px 18px",
      borderRadius: "14px",
      border: "none",
      background: loading
        ? "#8bbcb5"
        : "linear-gradient(90deg, #087f8c 0%, #16b89d 100%)",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "800",
      letterSpacing: "0.6px",
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

  const formattedAmount = Number(fine.amount || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div style={styles.page}>
      <section style={styles.card}>
        <div style={styles.topBadge}>
          <span>✓</span>
          Fine Details Verified
        </div>

        <h1 style={styles.heading}>Confirm Fine Details</h1>

        <p style={styles.subtitle}>
          Review the information below carefully before continuing to the
          payment gateway.
        </p>

        <div style={styles.amountCard}>
          <p style={styles.amountLabel}>Total amount payable</p>
          <p style={styles.amountValue}>Rs. {formattedAmount}</p>
        </div>

        <h2 style={styles.sectionTitle}>Fine information</h2>

        <div style={styles.detailsGrid}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Reference number</span>
            <p style={styles.detailValue}>
              {fine.referenceNumber || "Not available"}
            </p>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Category code</span>
            <p style={styles.detailValue}>
              {fine.categoryCode || "Not available"}
            </p>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Fine category</span>
            <p style={styles.detailValue}>
              {fine.categoryName || "Not available"}
            </p>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Current status</span>
            <div style={styles.statusBadge}>
              <span>●</span>
              {fine.status || "PENDING"}
            </div>
          </div>
        </div>

        <h2
          style={{
            ...styles.sectionTitle,
            marginTop: "28px",
          }}
        >
          Driver and officer information
        </h2>

        <div style={styles.detailsGrid}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Driver name</span>
            <p style={styles.detailValue}>
              {fine.driverName || "Not available"}
            </p>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Vehicle number</span>
            <p style={styles.detailValue}>
              {fine.vehicleNumber || "Not available"}
            </p>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Police officer</span>
            <p style={styles.detailValue}>
              {fine.officerName || "Not available"}
            </p>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>District</span>
            <p style={styles.detailValue}>
              {fine.districtName || "Not available"}
            </p>
          </div>
        </div>

        <div style={styles.notice}>
          <div style={styles.noticeIcon}>i</div>

          <div>
            By clicking the payment button, you will be redirected to the
            secure PayHere payment gateway to complete the transaction.
          </div>
        </div>

        <div style={styles.buttonRow}>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              style={styles.backButton}
            >
              BACK
            </button>
          )}

          <button
            type="button"
            onClick={onPay}
            disabled={loading}
            style={styles.payButton}
          >
            {loading
              ? "INITIATING PAYMENT..."
              : `PAY RS. ${formattedAmount}`}
          </button>
        </div>

        <p style={styles.footer}>
          Payments are processed securely through the PayHere sandbox payment
          gateway.
        </p>
      </section>
    </div>
  );
}

export default FineSummary;