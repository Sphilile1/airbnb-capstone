import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('admin_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) return;
    api('/api/users/me')
      .then(data => {
        if (!['admin', 'host'].includes(data.role)) throw new Error('Not authorized');
        setUser(data);
      })
      .catch(() => logout());
  }, []);

  const login = async (email, password) => {
    const data = await api('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (!['admin', 'host'].includes(data.user.role)) {
      throw new Error('This account is not authorized for the admin dashboard');
    }

    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
