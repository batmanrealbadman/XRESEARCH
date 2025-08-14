import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, firstName, lastName, phone, institution, department } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // 1. Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
          phone,
          institution,
          department
        }
      }
    });

    if (authError) {
      return res.status(400).json({ 
        error: authError.message || 'Signup failed' 
      });
    }

    // 2. Add to profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        institution,
        department
      }]);

    if (profileError) {
      // Rollback: delete the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ 
        error: 'Profile creation failed' 
      });
    }

    return res.status(201).json({
      message: 'Signup successful',
      user: authData.user
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}