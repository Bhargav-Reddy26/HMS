'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface DoctorDetails {
  specialization: string;
  license_number: string;
  phone_number: string;
  bio: string;
  profile_picture_url: string;
  education: string;
  languages_spoken: string;
  experience_years: number;
}

interface DoctorProfile {
  name: string;
  email: string;
  role: string;
  Doctor: DoctorDetails;
}

export default function DoctorProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/doctor/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Failed to fetch doctor profile data:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold">Loading Doctor Profile...</h1>
      </div>
    );
  );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold">Doctor profile not found.</h1>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar />
      <main className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
          {/* Profile details will be displayed here */}
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Personal & Professional Information</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <p className="p-3 bg-gray-200 rounded-md">{profileData.name}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <p className="p-3 bg-gray-200 rounded-md">{profileData.email}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Specialization</label>
              <p className="p-3 bg-gray-200 rounded-md">{profileData.Doctor.specialization}</p>
            </div>
            {/* Add more fields for other data here */}
          </div>
        </div>
      </main>
    </div>
  );
}