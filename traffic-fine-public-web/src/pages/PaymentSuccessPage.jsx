import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Load jsPDF from CDN dynamically (no npm install needed)
function loadJsPDF() {
  return new Promise((resolve, reject) => {
    if (window.jspdf) return resolve(window.jspdf.jsPDF);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => resolve(window.jspdf.jsPDF);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [fine, setFine] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("paid_fine");
    if (stored) {
      setFine(JSON.parse(stored));
    }
  }, []);

  const formattedAmount = fine
    ? Number(fine.amount || 0).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";

  async function downloadInvoice() {
    const JsPDF = await loadJsPDF();
    const doc = new JsPDF();
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-LK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-LK", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const invoiceNo = `INV-${fine.referenceNumber || "000"}-${Date.now().toString(36).toUpperCase()}`;

    // ── Page setup ──────────────────────────────────────────────────────
    const pageW = doc.internal.pageSize.getWidth();

    // ── Header bar ──────────────────────────────────────────────────────
    doc.setFillColor(8, 127, 140);
    doc.rect(0, 0, pageW, 40, "F");
    doc.setFillColor(22, 184, 157);
    doc.rect(0, 36, pageW, 4, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT INVOICE", 20, 22);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Sri Lanka Traffic Fine Management System", 20, 30);

    // ── Invoice metadata ────────────────────────────────────────────────
    let y = 54;
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text(`Invoice No: ${invoiceNo}`, 20, y);
    doc.text(`Date: ${dateStr}  |  Time: ${timeStr}`, pageW - 20, y, { align: "right" });

    // ── PAID stamp ──────────────────────────────────────────────────────
    y += 14;
    doc.setFillColor(230, 247, 237);
    doc.roundedRect(20, y - 6, 50, 14, 3, 3, "F");
    doc.setTextColor(32, 122, 71);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("✓  PAID", 28, y + 3);

    // ── Amount ──────────────────────────────────────────────────────────
    doc.setTextColor(8, 127, 140);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(`Rs. ${formattedAmount}`, pageW - 20, y + 3, { align: "right" });

    // ── Divider ─────────────────────────────────────────────────────────
    y += 20;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(20, y, pageW - 20, y);

    // ── Helper function for detail rows ─────────────────────────────────
    function drawRow(label, value, yPos) {
      doc.setTextColor(130, 154, 177);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(label, 20, yPos);

      doc.setTextColor(36, 59, 83);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(value || "N/A", 90, yPos);
    }

    // ── Fine Information section ─────────────────────────────────────────
    y += 14;
    doc.setFillColor(248, 251, 253);
    doc.roundedRect(15, y - 6, pageW - 30, 8, 2, 2, "F");
    doc.setTextColor(8, 127, 140);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Fine Information", 20, y);

    y += 14;
    drawRow("Reference Number", fine.referenceNumber, y);
    y += 12;
    drawRow("Category Code", fine.categoryCode, y);
    y += 12;
    drawRow("Fine Category", fine.categoryName, y);
    y += 12;
    drawRow("Amount", `Rs. ${formattedAmount}`, y);
    y += 12;
    drawRow("Status", "PAID", y);

    // ── Divider ─────────────────────────────────────────────────────────
    y += 14;
    doc.setDrawColor(220, 220, 220);
    doc.line(20, y, pageW - 20, y);

    // ── Driver & Officer Information section ─────────────────────────────
    y += 14;
    doc.setFillColor(248, 251, 253);
    doc.roundedRect(15, y - 6, pageW - 30, 8, 2, 2, "F");
    doc.setTextColor(8, 127, 140);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Driver & Officer Information", 20, y);

    y += 14;
    drawRow("Driver Name", fine.driverName, y);
    y += 12;
    drawRow("Vehicle Number", fine.vehicleNumber, y);
    y += 12;
    drawRow("Police Officer", fine.officerName, y);
    y += 12;
    drawRow("District", fine.districtName, y);

    // ── Footer ──────────────────────────────────────────────────────────
    y += 24;
    doc.setDrawColor(22, 184, 157);
    doc.setLineWidth(1);
    doc.line(20, y, pageW - 20, y);

    y += 10;
    doc.setTextColor(130, 154, 177);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("This is a computer-generated invoice. No signature is required.", pageW / 2, y, { align: "center" });
    y += 6;
    doc.text("Sri Lanka Traffic Fine Management System © 2026", pageW / 2, y, { align: "center" });

    // ── Save ────────────────────────────────────────────────────────────
    doc.save(`Traffic_Fine_Invoice_${fine.referenceNumber || "receipt"}.pdf`);
  }

  const s = styles;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes checkDraw {
          to { stroke-dashoffset: 0; }
        }
        .success-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: #fff;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: opacity 0.2s, box-shadow 0.2s, transform 0.15s;
        }
        .success-btn:hover { opacity: 0.93; transform: translateY(-1px); }
        .success-btn-primary {
          background: linear-gradient(90deg, #087f8c 0%, #16b89d 100%);
          box-shadow: 0 12px 28px rgba(22,184,157,0.28);
        }
        .success-btn-secondary {
          background: transparent;
          border: 1.5px solid #d1dbe6;
          color: #486581;
          box-shadow: none;
        }
        .success-btn-secondary:hover { background: #f0f4f8; }
      `}</style>

      <div style={s.page}>
        <div style={s.card}>
          {/* Animated check icon */}
          <div style={s.iconWrap}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ animation: "scaleIn 0.4s ease both" }}>
              <circle cx="12" cy="12" r="10" stroke="#16b89d" strokeWidth="2" fill="#e8faf7" />
              <path
                d="M8 12l3 3 5-5"
                stroke="#16b89d"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="20"
                strokeDashoffset="20"
                style={{ animation: "checkDraw 0.5s 0.3s ease forwards" }}
              />
            </svg>
          </div>

          <h1 style={s.heading}>Payment Successful!</h1>
          <p style={s.subtitle}>
            Your traffic fine payment has been processed successfully.
          </p>

          {fine && (
            <>
              {/* Amount card */}
              <div style={s.amountCard}>
                <p style={s.amountLabel}>Amount Paid</p>
                <p style={s.amountValue}>Rs. {formattedAmount}</p>
              </div>

              {/* Details grid */}
              <div style={s.detailsGrid}>
                <div style={s.detailItem}>
                  <span style={s.detailLabel}>Reference</span>
                  <p style={s.detailValue}>{fine.referenceNumber || "N/A"}</p>
                </div>
                <div style={s.detailItem}>
                  <span style={s.detailLabel}>Category</span>
                  <p style={s.detailValue}>{fine.categoryName || fine.categoryCode || "N/A"}</p>
                </div>
                <div style={s.detailItem}>
                  <span style={s.detailLabel}>Driver</span>
                  <p style={s.detailValue}>{fine.driverName || "N/A"}</p>
                </div>
                <div style={s.detailItem}>
                  <span style={s.detailLabel}>Vehicle</span>
                  <p style={s.detailValue}>{fine.vehicleNumber || "N/A"}</p>
                </div>
              </div>

              {/* Download Invoice */}
              <button
                className="success-btn success-btn-primary"
                onClick={downloadInvoice}
                style={{ marginTop: "24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Invoice (PDF)
              </button>
            </>
          )}

          {!fine && (
            <p style={{ color: "#829ab1", fontSize: "14px", marginTop: "16px" }}>
              No payment details found.
            </p>
          )}

          {/* Back to home */}
          <button
            className="success-btn success-btn-secondary"
            onClick={() => {
              localStorage.removeItem("paid_fine");
              navigate("/payment");
            }}
            style={{ marginTop: "12px" }}
          >
            Back to Home
          </button>

          <p style={s.footer}>
            🔒 This is a secure, computer-generated confirmation.
          </p>
        </div>

        {/* Decorative blobs */}
        <div style={s.blob1} />
        <div style={s.blob2} />
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px 18px",
    background: "linear-gradient(135deg, #071c36 0%, #0b5b7a 45%, #12b89f 100%)",
    fontFamily: "'Inter', Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute", width: "420px", height: "420px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(22,184,157,0.18) 0%, transparent 70%)",
    top: "-100px", right: "-100px", pointerEvents: "none",
  },
  blob2: {
    position: "absolute", width: "320px", height: "320px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(8,127,140,0.2) 0%, transparent 70%)",
    bottom: "-80px", left: "-60px", pointerEvents: "none",
  },
  card: {
    position: "relative", zIndex: 1, width: "100%", maxWidth: "480px",
    backgroundColor: "rgba(255,255,255,0.97)", borderRadius: "24px",
    padding: "40px 38px 32px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.32)",
    border: "1px solid rgba(255,255,255,0.4)",
    animation: "fadeUp 0.5s ease both",
    textAlign: "center",
  },
  iconWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "18px",
  },
  heading: {
    margin: "0",
    color: "#102a43",
    fontSize: "26px",
    fontWeight: "800",
    letterSpacing: "-0.4px",
    lineHeight: "1.2",
  },
  subtitle: {
    margin: "8px 0 24px",
    color: "#627d98",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  amountCard: {
    padding: "18px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #087f8c 0%, #16b89d 100%)",
    color: "#ffffff",
    marginBottom: "20px",
    boxShadow: "0 10px 24px rgba(22, 184, 157, 0.22)",
  },
  amountLabel: {
    margin: "0 0 4px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    opacity: 0.9,
  },
  amountValue: {
    margin: "0",
    fontSize: "32px",
    fontWeight: "800",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    textAlign: "left",
  },
  detailItem: {
    padding: "12px",
    borderRadius: "12px",
    backgroundColor: "#f8fbfd",
    border: "1px solid #e2e8f0",
  },
  detailLabel: {
    display: "block",
    marginBottom: "4px",
    color: "#829ab1",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },
  detailValue: {
    margin: "0",
    color: "#243b53",
    fontSize: "13px",
    fontWeight: "700",
    wordBreak: "break-word",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    color: "#829ab1",
    fontSize: "11px",
    lineHeight: "1.6",
  },
};
