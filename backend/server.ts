// backend/server.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import patientProfileRoutes from './routes/patient/profileRoutes';
import patientAppointmentRoutes from './routes/patient/appointmentRoutes';
import doctorProfileRoutes from './routes/doctor/profileRoutes';
import doctorAppointmentRoutes from './routes/doctor/appointmentRoutes'; // NEW IMPORT

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// --- Authentication Route ---
app.use('/api/auth', authRoutes);

// --- Patient Module Routes ---
app.use('/api/patient', patientProfileRoutes);
app.use('/api/patient', patientAppointmentRoutes);

// --- Doctor Module Routes (FIXED: Linking both files explicitly) ---
app.use('/api/doctor', doctorProfileRoutes);
app.use('/api/doctor', doctorAppointmentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});