import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/database.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// User signup
export const signup = async (req, res) => {
  try {
    const { username, firstName, lastName, mobile, password } = req.body;

    // Check if user already exists (by username or mobile)
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .or(`username.eq.${username},mobile.eq.${mobile}`);

    if (existingUser && existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this username or mobile number already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user in database
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          username: username,
          first_name: firstName,
          last_name: lastName,
          mobile: mobile,
          password_hash: passwordHash
        }
      ])
      .select('id, username, first_name, last_name, mobile, created_at')
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user account'
      });
    }

    // Generate JWT token
    const token = generateToken(newUser.id);

    // Return success response (don't include password hash)
    res.status(201).json({
      success: true,
      message: 'User account created successfully',
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          mobile: newUser.mobile,
          createdAt: newUser.created_at
        },
        token
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during signup'
    });
  }
};

// User login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const { data: user, error: findError } = await supabaseAdmin
      .from('users')
      .select('id, username, first_name, last_name, mobile, password_hash, created_at')
      .eq('username', username)
      .single();

    if (findError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Update last login timestamp (optional)
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          mobile: user.mobile,
          createdAt: user.created_at
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

// Verify token and get user profile
export const getProfile = async (req, res) => {
  try {
    // User info is already available from auth middleware
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: {
          id: req.user.id,
          username: req.user.username,
          firstName: req.user.first_name,
          lastName: req.user.last_name,
          mobile: req.user.mobile,
          createdAt: req.user.created_at
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile'
    });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    // Generate new token for the authenticated user
    const newToken = generateToken(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token'
    });
  }
};

// Logout (optional - mainly for client-side token removal)
export const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is mainly handled client-side
    // But we can log the logout event or invalidate refresh tokens if implemented
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};