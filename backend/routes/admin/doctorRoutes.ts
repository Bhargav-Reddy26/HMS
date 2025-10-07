// backend/routes/admin/doctorRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();

// Extend the Request type for the user property (from authMiddleware)
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Middleware to ensure only Admins can access these routes
const restrictToAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Convert the role to lowercase to handle potential casing issues
    const userRole = req.user?.role?.toLowerCase(); 

    if (userRole !== 'admin') {
        console.warn(`ACCESS DENIED: User ID ${req.user?.id} attempted to access Admin Doctor routes with role: ${req.user?.role}`);
        return res.status(403).json({ message: 'Access denied: Must be an Admin' });
    }
    next();
};

// @route   GET /api/admin/doctors
// @desc    Get a list of all doctors with their specialization and user info
// @access  Private (Admin Only)
router.get('/doctors', protect, restrictToAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // Fetch all doctor records, joining with the User table for name and email
    const { data: doctors, error } = await supabase
      .from('Doctor')
      .select(`
        doctor_id,
        specialization,
        license_number,
        User!inner(user_id, name, email)
      `)
      .order('doctor_id', { ascending: true });

    if (error) {
      console.error("Supabase Admin Doctors Fetch Error:", error);
      throw error;
    }

    // CRITICAL FIX: Transform the data to access the nested User object correctly
    const formattedDoctors = doctors.map(doctor => {
        // Safe access: If User exists and is an array, get the first element; otherwise, use N/A
        const user = doctor.User && Array.isArray(doctor.User) && doctor.User.length > 0
                     ? doctor.User[0] 
                     : { name: 'N/A', email: 'N/A' };
        
        return {
            id: doctor.doctor_id,
            name: user.name, 
            email: user.email, 
            specialization: doctor.specialization,
            license: doctor.license_number,
        };
    });

    res.status(200).json(formattedDoctors);
  } catch (err) {
    console.error('Admin Doctor Fetch Request Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;