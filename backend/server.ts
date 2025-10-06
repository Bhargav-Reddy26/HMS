// backend/server.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import patientProfileRoutes from './routes/patient/profileRoutes';
import patientAppointmentRoutes from './routes/patient/appointmentRoutes';
import doctorProfileRoutes from './routes/doctor/profileRoutes'; // CRITICAL: Ensure this is imported

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

// Correctly linking the patient routes
app.use('/api/patient', patientProfileRoutes);
app.use('/api/patient', patientAppointmentRoutes);

// CRITICAL FIX: Linking the doctor profile route
app.use('/api/doctor', doctorProfileRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});