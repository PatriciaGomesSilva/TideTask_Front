
import { useState, useEffect } from 'react';
import AuthService from '@/auth/services/auth-service';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await AuthService.isSessionValid();
      setIsAuthenticated(isValid);
    };

    checkAuth();
  }, []);

  return isAuthenticated;
}
