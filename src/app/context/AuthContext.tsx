import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phone?: string;
  address?: string;
}

const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'Admin MBT',
    email: 'admin@noithat.com',
    password: 'admin123',
    role: 'admin',
    phone: '0901234567',
    address: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
  },
  {
    id: '2',
    name: 'Nguyễn Thị Mai',
    email: 'user@noithat.com',
    password: 'user123',
    role: 'customer',
    phone: '0909876543',
    address: '456 Đường Lê Lợi, Quận 3, TP.HCM',
  },
];

const DEMO_TOKEN_PREFIX = 'demo-token:';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('demo_user');
  }, []);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    if (token.startsWith(DEMO_TOKEN_PREFIX)) {
      const rawUser = localStorage.getItem('demo_user');
      if (rawUser) {
        try {
          setUser(JSON.parse(rawUser));
        } catch {
          logout();
        }
      } else {
        logout();
      }
      setIsLoading(false);
      return;
    }

    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(data => setUser(data.user))
      .catch(() => logout())
      .finally(() => setIsLoading(false));
  }, [token, logout]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return;
    } catch (err) {
      // Fallback for local demo when API server is not running.
      const demoUser = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!demoUser) {
        throw err instanceof Error ? err : new Error('Đăng nhập thất bại');
      }

      const { password: _password, ...safeUser } = demoUser;
      const demoToken = `${DEMO_TOKEN_PREFIX}${safeUser.id}`;
      localStorage.setItem('token', demoToken);
      localStorage.setItem('demo_user', JSON.stringify(safeUser));
      setToken(demoToken);
      setUser(safeUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin: user?.role === 'admin', isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
