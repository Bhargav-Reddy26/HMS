// backend/routes/patient/appointmentRoutes.ts
import { Router, Request, Response } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();

// @route   GET /api/patient/appointments/departments
// @desc    Get all available departments for appointment booking
// @access  Private
router.get('/appointments/departments', protect, async (req: Request, res: Response) => {
  try {
    const { data: departments, error } = await supabase
      .from('Departments')
      .select('department_id, name');

    if (error) {
      throw error;
    }

    res.status(200).json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/patient/appointments/doctors/:departmentId
// @desc    Get doctors within a specific department
// @access  Private
router.get('/appointments/doctors/:departmentId', protect, async (req: Request, res: Response) => {
  try {
    const departmentId = req.params.departmentId;

    const { data: doctors, error } = await supabase
      .from('Doctor')
      .select(`
        doctor_id,
        specialization,
        User(name)
      `)
      .eq('department_id', departmentId);

    if (error) {
      throw error;
    }

    res.status(200).json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/patient/appointments/times/:doctorId/:date
// @desc    Get available time slots and price for a specific doctor on a given date
// @access  Private
router.get('/appointments/times/:doctorId/:date', protect, async (req: Request, res: Response) => {
  try {
    const mockTimeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00'];
    const mockPrice = 300; 

    res.status(200).json({ timeSlots: mockTimeSlots, price: mockPrice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/patient/appointments
// @desc    Book a new appointment
// @access  Private
router.post('/appointments', protect, async (req: Request, res: Response) => {
    try {
        const { doctorId, appointmentDate, appointmentTime, reason } = req.body;
        const patientId = req.user?.id; // Get patientId from the JWT

        if (!patientId || !doctorId || !appointmentDate || !appointmentTime || !reason) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const { data, error } = await supabase
            .from('Appointments')
            .insert([
                {
                    patient_id: patientId,
                    doctor_id: doctorId,
                    appointment_date: appointmentDate,
                    appointment_time: appointmentTime,
                    reason: reason,
                    status: 'Scheduled', // Default status for a new appointment
                },
            ])
            .select();

        if (error) {
            throw error;
        }

        res.status(201).json({ message: 'Appointment booked successfully', appointment: data[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;