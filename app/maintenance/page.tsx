
export default function MaintenancePage() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f8f9fa",
      textAlign: "center",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        ⚠ Domain Subscription Expired
      </h1>

      <p style={{ fontSize: "18px", maxWidth: "500px" }}>
        The domain subscription for this website has expired.
        <br /><br />
        Please contact your service provider to renew the subscription.
      </p>
    </div>
  );
}
