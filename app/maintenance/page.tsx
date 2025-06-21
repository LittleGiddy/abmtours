// pages/maintenance.tsx
export default function MaintenancePage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Failed to Load</h1>
      <p style={{ marginBottom: '1rem' }}>
        <a href="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>
          Click here to load again
        </a>
      </p>
      <p>If the problem persists, contact your developer.</p>
    </div>
  );
}
