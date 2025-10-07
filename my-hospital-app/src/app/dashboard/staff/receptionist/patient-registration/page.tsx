'use client';

import DashboardNavbar from '../../../../../components/DashboardNavbar';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ReceptionistPatientRegistrationPage() {
    const router = useRouter();
    // Placeholder for Staff name and links
    const staffName = 'Receptionist User';
    const staffNavLinks = [
        { name: 'Patient Reg', href: '/dashboard/staff/receptionist/patient-registration' },
        { name: 'Appointments', href: '/dashboard/staff/appointments' },
    ];

    const [formData, setFormData] = useState({
        // User fields
        name: '', email: '', password: '', confirmPassword: '',
        // Patient Profile fields (matching database)
        aadhaar_number: '', father_name: '', mother_name: '',
        additional_phone_number: '', blood_group: '', age: '',
        gender: '', street: '', city: '', district: '', state: '', country: '',
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            setIsSubmitting(false);
            return;
        }

        try {
            // 1. Send all data to the backend for User and Patient record creation
            await axios.post('http://localhost:5000/api/auth/register', {
                // User Table Data
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'patient', 
                
                // Patient Table Data (CRITICAL: Must be sent in the payload for backend logic)
                aadhaar_number: formData.aadhaar_number,
                father_name: formData.father_name,
                mother_name: formData.mother_name,
                additional_phone_number: formData.additional_phone_number,
                blood_group: formData.blood_group,
                age: parseInt(formData.age) || null,
                gender: formData.gender,
                street: formData.street,
                city: formData.city,
                district: formData.district,
                state: formData.state,
                country: formData.country,
            });
            
            alert(`Patient ${formData.name} registered successfully!`);
            
            // Clear form after successful registration
            setFormData({
                name: '', email: '', password: '', confirmPassword: '',
                aadhaar_number: '', father_name: '', mother_name: '',
                additional_phone_number: '', blood_group: '', age: '',
                gender: '', street: '', city: '', district: '', state: '', country: '',
            });

        } catch (err) {
            setError('Registration failed. Check if email/Aadhaar number is already in use.');
            console.error('Staff Patient Reg Error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Receptionist Portal" navLinks={staffNavLinks} userName={staffName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">New Patient Registration</h1>
                
                <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                    {error && <p className="text-red-500 text-center mb-4 p-2 border border-red-300 rounded-md">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* --- Login Credentials --- */}
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Login Credentials</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Email Address (Login ID)</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full p-3 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Confirm Password</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full p-3 border rounded-md" />
                            </div>
                        </div>

                        {/* --- Patient Details --- */}
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2 pt-4">Patient Profile Details</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Personal */}
                            <div className="md:col-span-1">
                                <label className="block text-gray-700">Aadhaar Number</label>
                                <input type="text" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleChange} className="w-full p-3 border rounded-md" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-gray-700">Father's Name</label>
                                <input type="text" name="father_name" value={formData.father_name} onChange={handleChange} className="w-full p-3 border rounded-md" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-gray-700">Mother's Name</label>
                                <input type="text" name="mother_name" value={formData.mother_name} onChange={handleChange} className="w-full p-3 border rounded-md" />
                            </div>

                            {/* Medical/Contact */}
                            <div className="md:col-span-1">
                                <label className="block text-gray-700">Blood Group</label>
                                <input type="text" name="blood_group" value={formData.blood_group} onChange={handleChange} className="w-full p-3 border rounded-md" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-gray-700">Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-3 border rounded-md" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-gray-700">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border rounded-md">
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* --- Address Details --- */}
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2 pt-4">Address Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700">Street</label>
                                <input type="text" name="street" value={formData.street} onChange={handleChange} className="w-full p-3 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-700">City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-3 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-700">District</label>
                                <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full p-3 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-700">State</label>
                                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-3 border rounded-md" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 text-white rounded-md font-semibold transition duration-300 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isSubmitting ? 'Registering Patient...' : 'Register Patient'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}