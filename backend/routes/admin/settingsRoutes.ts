// backend/routes/admin/settingsRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();

interface AuthRequest extends Request {
  user?: { id: string; role: string; };
}

// Middleware to ensure only Admins can access these routes
const restrictToAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Must be an Admin' });
    }
    next();
};

const SETTINGS_ROW_ID = 1; // Target the single row in the Settings table

// --- GET ALL SETTINGS (READ) ---
// @route   GET /api/admin/settings
// @desc    Get the single, current hospital settings object
// @access  Private (Admin Only)
router.get('/settings', protect, restrictToAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { data: settings, error } = await supabase
            .from('Settings')
            .select('*')
            .limit(1)
            .single(); // <--- This is the method causing the crash on zero rows

        if (error && error.code !== 'PGRST116') { // PGRST116 is Supabase's 'no rows found' code
            throw error;
        }
        
        if (!settings) {
            // Handle the case of no settings found (PGRST116) gracefully by returning a 404 or default
            return res.status(404).json({ message: 'Settings record not found. Please create initial record.' });
        }

        res.status(200).json(settings);
    } catch (err: any) {
        console.error('Settings GET Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- UPDATE SETTINGS (PUT) ---
// @route   PUT /api/admin/settings
// @desc    Update the single, current hospital settings object
// @access  Private (Admin Only)
router.put('/settings', protect, restrictToAdmin, async (req: Request, res: Response) => {
    try {
        const updatedData = req.body;

        const { data: updatedSettings, error } = await supabase
            .from('Settings')
            .update(updatedData)
            .eq('id', SETTINGS_ROW_ID) // CRITICAL: Target the single row
            .select();

        if (error) throw error;
        if (!updatedSettings || updatedSettings.length === 0) {
             return res.status(404).json({ message: 'Settings record not found.' });
        }

        res.status(200).json({ message: 'Settings updated successfully', settings: updatedSettings[0] });
    } catch (err: any) {
        console.error('Settings PUT Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;