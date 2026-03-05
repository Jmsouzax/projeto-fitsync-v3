import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'personal' | 'nutritionist';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  whatsapp?: string;
  professionalId?: string; // CREF ou CRN
  plan?: 'monthly' | 'semester' | 'annual';
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, role: UserRole, additionalData?: Partial<User>) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Verifica se há usuário salvo no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('fitsync_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    // Simulação de login - em produção, isso seria uma chamada API
    // Para demonstração, aceita qualquer email/senha
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=10b981&color=fff`,
    };

    setUser(mockUser);
    localStorage.setItem('fitsync_user', JSON.stringify(mockUser));
  };

  const register = async (email: string, password: string, role: UserRole, additionalData?: Partial<User>) => {
    try {
      // Chama o nosso novo Backend Node.js
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          tipoPlano: additionalData?.plan || 'mensal',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar usuário no backend');
      }

      // Se o backend retornar sucesso, logamos no frontend
      const newUser: User = {
        id: data.user.id,
        name: additionalData?.name || email.split('@')[0],
        email,
        role,
        avatar: `https://ui-avatars.com/api/?name=${(additionalData?.name || email.split('@')[0]).replace(' ', '+')}&background=10b981&color=fff`,
        whatsapp: additionalData?.whatsapp,
        professionalId: additionalData?.professionalId,
        plan: additionalData?.plan,
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      localStorage.setItem('fitsync_user', JSON.stringify(newUser));

    } catch (error: any) {
      console.error('Erro no catch do register:', error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitsync_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
