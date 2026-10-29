import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('nova_mart_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authService.getProfile();
      setUser(data.data);
    } catch {
      localStorage.removeItem('nova_mart_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);

    if (data?.data?.requiresOtp) {
      return {
        requiresOtp: true,
        email: data.data.email,
        devOtp: data.data.devOtp,
        message: data.message,
      };
    }

    localStorage.setItem('nova_mart_token', data.data.token);
    setUser(data.data.user);
    return data.data.user;
  };

  const verifyOtp = async ({ email, otp }) => {
    const { data } = await authService.verifyOtp({ email, otp });
    localStorage.setItem('nova_mart_token', data.data.token);
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async (userData) => {
    const { data } = await authService.register(userData);
    localStorage.setItem('nova_mart_token', data.data.token);
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = () => {
    localStorage.removeItem('nova_mart_token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const { data } = await authService.updateProfile(profileData);
    setUser(data.data);
    return data.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        verifyOtp,
        register,
        logout,
        updateProfile,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
