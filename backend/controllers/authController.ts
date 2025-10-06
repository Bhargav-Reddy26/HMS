import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../db'; // Import your Supabase client

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

// User Registration
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const { data: userExists, error: userExistsError } = await supabase
      .from('User')
      .select('*')
      .eq('email', email);

    if (userExistsError) {
      throw userExistsError;
    }

    if (userExists && userExists.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the new user to the database
    const { data: newUser, error: newUserError } = await supabase
      .from('User')
      .insert([
        { name, email, password: hashedPassword, role },
      ])
      .select();

    if (newUserError) {
      throw newUserError;
    }

    // Conditionally create a record in the Doctor table if the role is 'doctor'
    if (role === 'doctor') {
      const { error: doctorInsertError } = await supabase
        .from('Doctor')
        .insert([
          { user_id: newUser[0].user_id } // Link the new doctor to the user ID
        ]);

      if (doctorInsertError) {
        throw doctorInsertError;
      }
    }

    // Generate a token
    const token = jwt.sign({ id: newUser[0].user_id, role: newUser[0].role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token, role: newUser[0].role });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User Login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('*')
      .eq('email', email);

    if (userError) {
      throw userError;
    }

    if (!user || user.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate and return a token
    const token = jwt.sign({ id: user[0].user_id, role: user[0].role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Logged in successfully', token, role: user[0].role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};