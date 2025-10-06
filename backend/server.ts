// backend/server.ts
import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import patientProfileRoutes from './routes/patient/profileRoutes';
import patientAppointmentRoutes from './routes/patient/appointmentRoutes'; // New: Import appointment routes

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Use the new authentication routes
app.use('/api/auth', authRoutes);

// Use the protected dashboard routes
app.use('/api/dashboard', dashboardRoutes);

// Use the patient module routes
app.use('/api/patient', patientProfileRoutes);
app.use('/api/patient', patientAppointmentRoutes); // New: Link appointment routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});