import { AlertTriangle } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-6">
      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-amber-600" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        Domain Subscription Expired
      </h1>
      <p className="text-base md:text-lg text-gray-600 max-w-lg">
        The domain subscription for this website has expired.
        <br />
        <br />
        Please contact your service provider to renew the subscription.
      </p>
    </div>
  );
}
