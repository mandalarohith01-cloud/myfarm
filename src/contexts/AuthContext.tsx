import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  mobile: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

interface SignupData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  mobile: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  // Check for existing token on app start
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // For demo purposes, create a mock successful login
      // Remove this when backend is properly configured
      if (username === 'demo' && password === 'demo') {
        const mockUser = {
          id: 'demo-user-id',
          username: 'demo',
          firstName: 'Demo',
          lastName: 'User',
          mobile: '9876543210',
          createdAt: new Date().toISOString()
        };
        const mockToken = 'demo-token-' + Date.now();
        
        setUser(mockUser);
        setToken(mockToken);
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        return true;
      }

      // Try to connect to backend, but fallback to demo mode if it fails
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
          const { user: userData, token: authToken } = data.data;
          setUser(userData);
          setToken(authToken);
          
          // Store in localStorage
          localStorage.setItem('auth_token', authToken);
          localStorage.setItem('auth_user', JSON.stringify(userData));
          
          return true;
        } else {
          setError(data.message || 'Login failed');
          return false;
        }
      } catch (fetchError) {
        // Backend not available, use demo mode for any valid credentials
        console.log('Backend not available, using demo mode');
        
        if (username && password) {
          const mockUser = {
            id: 'demo-user-' + Date.now(),
            username: username,
            firstName: 'Demo',
            lastName: 'Farmer',
            mobile: '9876543210',
            createdAt: new Date().toISOString()
          };
          const mockToken = 'demo-token-' + Date.now();
          
          setUser(mockUser);
          setToken(mockToken);
          localStorage.setItem('auth_token', mockToken);
          localStorage.setItem('auth_user', JSON.stringify(mockUser));
          return true;
        } else {
          setError('Please enter valid credentials');
          return false;
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to connect to backend, but fallback to demo mode if it fails
      try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (data.success) {
          const { user: newUser, token: authToken } = data.data;
          setUser(newUser);
          setToken(authToken);
          
          // Store in localStorage
          localStorage.setItem('auth_token', authToken);
          localStorage.setItem('auth_user', JSON.stringify(newUser));
          
          return true;
        } else {
          setError(data.message || 'Signup failed');
          return false;
        }
      } catch (fetchError) {
        // Backend not available, use demo mode for valid signup data
        console.log('Backend not available, using demo mode for signup');
        
        if (userData.username && userData.password && userData.firstName && userData.lastName) {
          const mockUser = {
            id: 'demo-user-' + Date.now(),
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobile: userData.mobile,
            createdAt: new Date().toISOString()
          };
          const mockToken = 'demo-token-' + Date.now();
          
          setUser(mockUser);
          setToken(mockToken);
          localStorage.setItem('auth_token', mockToken);
          localStorage.setItem('auth_user', JSON.stringify(mockUser));
          return true;
        } else {
          setError('Please fill in all required fields');
          return false;
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('User logging out, crops should be preserved in localStorage');
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    // Note: We intentionally do NOT remove crop data on logout
    // Crop data remains in localStorage with user-specific keys
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      signup,
      logout,
      isLoading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};