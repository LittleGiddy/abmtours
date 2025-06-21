// app/maintenance/page.tsx
export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Failed to Load</h1>
      <p className="mb-4">
        <a href="/" className="text-blue-600 underline">
          Click here to load again
        </a>
      </p>
      <p>If the problem persists, contact your developer.</p>
    </div>
  );
}
