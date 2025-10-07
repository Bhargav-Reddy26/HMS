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
  experience_years: number | null; // Use null to handle empty fields cleanly
  department_id: number | null;
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
        
        setProfileData(data);
        // Ensure initial form state handles nulls correctly
        setFormData({ 
            ...data.Doctor, 
            experience_years: Number(data.Doctor.experience_years) || null, // Convert 0 to null if empty
            department_id: Number(data.Doctor.department_id) || null,
        });

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;

    const { name, value, type } = e.target;
    let newValue: string | number | null = value;

    if (type === 'number') {
        // If input is empty, store null; otherwise, parse as integer
        newValue = value === '' ? null : parseInt(value);
        if (isNaN(newValue as number)) newValue = null;
    } else {
        // For text fields, store null if empty
        newValue = value === '' ? null : value;
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (profileData) {
      setFormData(profileData.Doctor);
    }
    setIsEditing(false);
  };

  // src/app/dashboard/doctor/profile/page.tsx - Inside handleSubmit function

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  if (!token || !formData) return;

  // 1. Prepare the payload by cleaning data and setting nulls for empty/zero fields
  const finalPayload = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => {
      // --- Handle Numeric Fields Safely (experience_years) ---
      if (key === 'experience_years') {
        const strValue = String(value);
        
        // If the value is an empty string, or treated as 0, send NULL to the database.
        // This avoids the database confusion with the '0' column.
        if (strValue === '' || strValue === '0' || value === 0) {
          return [key, null]; 
        }
        
        // Otherwise, send the parsed integer value.
        const numValue = parseInt(strValue);
        return [key, isNaN(numValue) ? null : numValue];
      }
      
      // --- Handle Text Fields ---
      // For all other fields (text/strings), send null if empty, otherwise send the value.
      return [key, (value === '' || value === null) ? null : value];

    }).filter(([_, v]) => v !== undefined) // Filter out undefined values
  );

  try {
    // 2. Send the cleaned payload to the PUT endpoint
    await axios.put('http://localhost:5000/api/doctor/profile', finalPayload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    alert('Profile updated successfully!');
    setIsEditing(false);
    
    // 3. Update the read-only profile data with the new (clean) form data
    setProfileData({ ...profileData!, Doctor: finalPayload as DoctorDetails });
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
                <input type="number" name="experience_years" value={formData.experience_years === null ? '' : formData.experience_years} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border rounded-md" />
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