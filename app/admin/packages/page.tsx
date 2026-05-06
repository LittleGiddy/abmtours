// app/admin/packages/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Package {
  _id: string;
  title: string;
  category: string;
  cardImage: string;
  shortDescription: string;
}

export default function AdminPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/packages");
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await fetch(`/api/packages/${id}`, { method: "DELETE" });
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Safari Packages</h1>
          <Link
            href="/admin/packages/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create New Package
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={pkg.cardImage}
                  alt={pkg.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{pkg.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{pkg.category}</p>
                <p className="text-gray-700 mb-4 line-clamp-2">{pkg.shortDescription}</p>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/packages/edit/${pkg._id}`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePackage(pkg._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}