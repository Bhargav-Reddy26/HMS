// backend/routes/doctor/profileRoutes.ts
import { Router, Request, Response } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();

// Extend the Request type for the user property (assuming it's defined in middleware)
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// @route   GET /api/doctor/profile
// @desc    Get the profile of the authenticated doctor
// @access  Private
router.get('/profile', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Fetch data from both User and Doctor tables using a nested select (join)
    const { data: doctorProfile, error } = await supabase
      .from('User')
      .select(`
        user_id,
        name,
        email,
        role,
        Doctor(
          doctor_id,
          specialization,
          license_number,
          phone_number,
          bio,
          profile_picture_url,
          education,
          languages_spoken,
          experience_years,
          department_id
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error("Supabase Doctor Fetch Error:", error);
      throw error;
    }

    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.status(200).json(doctorProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/doctor/profile
// @desc    Update the profile of the authenticated doctor (professional details only)
// @access  Private
router.put('/profile', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // The frontend sends the Doctor-specific data in the body
    const updatedData = req.body;

    // Use the `update` query on the Doctor table
    const { data: updatedDoctor, error } = await supabase
      .from('Doctor')
      .update(updatedData)
      .eq('user_id', userId) // Find the doctor record by the user_id (FK)
      .select();

    if (error) {
      console.error("Supabase Doctor Update Error:", error);
      throw error;
    }

    if (!updatedDoctor || updatedDoctor.length === 0) {
      return res.status(404).json({ message: 'Doctor record not found or no changes made' });
    }

    res.status(200).json({ message: 'Profile updated successfully', updatedDoctor: updatedDoctor[0] });
  } catch (err) {
    console.error('Update request handler error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;