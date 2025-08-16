// app/maintenance/page.tsx
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Failed to Load</h1>
      <p className="mb-4">
        <Link href="/" className="text-blue-600 underline">
          Click here to load again
        </Link>
      </p>
      <p>If the problem persists, contact your developer.</p>
    </div>
  );
}
