// backend/server.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import ALL necessary route files
import authRoutes from './routes/authRoutes';
import patientProfileRoutes from './routes/patient/profileRoutes';
import patientAppointmentRoutes from './routes/patient/appointmentRoutes';
import doctorProfileRoutes from './routes/doctor/profileRoutes';
import doctorAppointmentRoutes from './routes/doctor/appointmentRoutes';

// --- Admin Module Imports (CRITICAL SECTION) ---
import adminDoctorRoutes from './routes/admin/doctorRoutes'; 
import adminPatientRoutes from './routes/admin/patientRoutes'; 
import adminProfileRoutes from './routes/admin/profileRoutes';
import staffProfileRoutes from './routes/staff/profileRoutes';
import labRoutes from './routes/staff/labRoutes'; 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

// --- Patient Routes ---
app.use('/api/patient', patientProfileRoutes);
app.use('/api/patient', patientAppointmentRoutes);

// --- Doctor Routes ---
app.use('/api/doctor', doctorProfileRoutes);
app.use('/api/doctor', doctorAppointmentRoutes);

// --- Admin Routes (FIX: Link all files explicitly) ---
app.use('/api/admin', adminDoctorRoutes); 
app.use('/api/admin', adminPatientRoutes); // Ensures /api/admin/patients is found
// app.use('/api/admin', adminStaffRoutes);   // Ensures /api/admin/staff is found
app.use('/api/admin', adminProfileRoutes);


app.use('/api/staff', staffProfileRoutes); 
app.use('/api/staff', labRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});