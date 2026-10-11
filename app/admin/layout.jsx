// app/admin/layout.js
import SideNavbar from './SIdeNavbar/SIdeNavbar';

export const metadata = {
  title: "Admin Panel",
};

export default function AdminLayout({ children }) {
  return (
    <div>
      {/* Sidebar stays fixed */}
      <SideNavbar />

      {/* Main content is spaced correctly on large screens */}
      <main className="min-h-screen transition-all duration-300 lg:ml-60 p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}
