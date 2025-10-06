// backend/routes/doctor/profileRoutes.ts
import { Router, Request, Response } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();

// @route   GET /api/doctor/profile
// @desc    Get the profile of the authenticated doctor
// @access  Private
router.get('/profile', protect, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Fetch data from both User and Doctor tables using a join
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
          experience_years
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
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

export default router;