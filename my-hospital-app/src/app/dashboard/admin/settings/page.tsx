'use client';
import DashboardNavbar from '../../../../components/DashboardNavbar';
export default function AdminSettingsPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Admin Portal" navLinks={[]} userName="Admin" />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold mb-8">System Settings</h1>
                <p>This page will contain forms to manage application-wide variables (e.g., consultation fee, hospital name, default currency).</p>
            </main>
        </div>
    );
}