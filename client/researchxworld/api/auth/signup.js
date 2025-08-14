import { neon } from '@neondatabase/serverless';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, userType, password } = req.body;
  const sql = neon(process.env.DATABASE_URL);

  try {
    // Check if user exists
    const existingUser = await sql`
      SELECT email FROM users WHERE email = ${email}
    `;
    
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    await sql`
      INSERT INTO users (first_name, last_name, email, user_type, password)
      VALUES (${firstName}, ${lastName}, ${email}, ${userType}, ${hashedPassword})
    `;

    return res.status(201).json({ 
      success: true,
      message: 'Account created successfully' 
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}