'use client';
import DashboardNavbar from '../../../../components/DashboardNavbar';
export default function AdminDepartmentsPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Admin Portal" navLinks={[]} userName="Admin" />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold mb-8">Department Management</h1>
                <p>This page will allow CRUD operations (Create, Read, Update, Delete) on the Departments table.</p>
            </main>
        </div>
    );
}