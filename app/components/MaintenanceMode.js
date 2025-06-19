// components/MaintenanceMode.js
export default function MaintenanceMode() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1>Failed to load page</h1>
      <p>Contact your Developer</p>
    </div>
  );
}
