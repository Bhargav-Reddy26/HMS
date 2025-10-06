'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Interface for the detailed professional information from the Doctor table
interface DoctorDetails {
  specialization: string;
  license_number: string;
  phone_number: string;
  bio: string;
  profile_picture_url: string;
  education: string;
  languages_spoken: string;
  experience_years: number;
  department_id: number;
}

// Interface for the combined data (User + Doctor)
interface DoctorProfile {
  name: string;
  email: string;
  role: string;
  Doctor: DoctorDetails;
}

export default function DoctorProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<DoctorProfile | null>(null);
  const [formData, setFormData] = useState<DoctorDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Doctor's specific navigation links
  const doctorNavLinks = [
    { name: 'Profile', href: '/dashboard/doctor/profile' },
    { name: 'Appointments', href: '/dashboard/doctor/appointments' },
    { name: 'Patients', href: '/dashboard/doctor/patients' },
  ];

  // --- Data Fetching ---
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/doctor/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        
        // Set profile data and form data for editing
        setProfileData(data);
        setFormData(data.Doctor);
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

  // --- Form Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (formData) {
      // Ensure number types are handled correctly for experience_years
      const value = e.target.name === 'experience_years' ? parseInt(e.target.value) || 0 : e.target.value;
      setFormData({ ...formData, [e.target.name]: value });
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    // Revert changes to the last fetched profile data
    if (profileData) {
      setFormData(profileData.Doctor);
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token || !formData) return;

    try {
      // API call to PUT endpoint to update doctor profile
      await axios.put('http://localhost:5000/api/doctor/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      alert('Profile updated successfully!');
      setIsEditing(false);
      // Update the read-only profile data with the new form data
      setProfileData({ ...profileData!, Doctor: formData });
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Check console for details.');
    }
  };

  // --- Loading/Error States ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold">Loading Doctor Profile...</h1>
      </div>
    );
  }

  if (!profileData || !formData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold">Error: Profile data not found.</h1>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar title="Doctor Portal" navLinks={doctorNavLinks} userName={profileData.name} />
      <main className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-8">Dr. {profileData.name}'s Profile</h1>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Credentials & Basics</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name (Read-Only) */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <input type="text" value={profileData.name} disabled className="w-full p-3 border rounded-md bg-gray-100" />
              </div>
              {/* Email (Read-Only) */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input type="email" value={profileData.email} disabled className="w-full p-3 border rounded-md bg-gray-100" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 border-b pb-2 pt-6">Professional Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Specialization */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Specialization</label>
                <input type="text" name="specialization" value={formData.specialization || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border rounded-md" />
              </div>
              
              {/* License Number */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">License Number</label>
                <input type="text" name="license_number" value={formData.license_number || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border rounded-md" />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                <input type="tel" name="phone_number" value={formData.phone_number || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border rounded-md" />
              </div>

              {/* Experience Years */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Years of Experience</label>
                <input type="number" name="experience_years" value={formData.experience_years || 0} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border rounded-md" />
              </div>

              {/* Education (Full Width) */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Education</label>
                <input type="text" name="education" value={formData.education || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border rounded-md" />
              </div>

              {/* Bio (Full Width - Textarea) */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                <textarea name="bio" value={formData.bio || ''} onChange={handleChange} disabled={!isEditing} rows={4} className="w-full p-3 border rounded-md" />
              </div>
              
              {/* Languages Spoken (Full Width) */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Languages Spoken (comma-separated)</label>
                <input type="text" name="languages_spoken" value={formData.languages_spoken || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border rounded-md" />
              </div>

            </div>
            
            {/* Action Buttons */}
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEdit}
                className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition duration-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-1/2 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}