'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';

export default function DoctorAppointmentsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar />
      <main className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-8">My Appointments</h1>
        <p>This page will display your upcoming and past appointments.</p>
      </main>
    </div>
  );
}