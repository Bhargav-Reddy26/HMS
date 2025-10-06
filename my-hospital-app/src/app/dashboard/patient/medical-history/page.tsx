'use client';
import Navbar from '../../../../components/Navbar';
export default function PatientMedicalHistoryPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-8">Medical History</h1>
        <p>This page will display your medical records, including diagnoses and prescriptions.</p>
      </main>
    </div>
  );
}