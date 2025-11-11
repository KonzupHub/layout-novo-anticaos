import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from 'firebase/auth';
import { api } from './api';
import { useToast } from '@/hooks/use-toast';
import type { SignupDto } from '@/types/shared';

// Configuração do Firebase (precisa ser preenchida com valores reais)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Inicializa Firebase apenas uma vez
let app: FirebaseApp;
let auth: Auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else {
  app = getApps()[0];
  auth = getAuth(app);
}

interface AuthContextType {
  user: FirebaseUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupDto) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          setToken(idToken);
          localStorage.setItem('konzup_token', idToken);
        } catch (error) {
          console.error('Erro ao obter token:', error);
          setToken(null);
        }
      } else {
        setToken(null);
        localStorage.removeItem('konzup_token');
      }
      
      setLoading(false);
    });

    // Verifica se há token salvo
    const savedToken = localStorage.getItem('konzup_token');
    if (savedToken) {
      setToken(savedToken);
    }

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Login realizado com sucesso!',
      });
    } catch (error: any) {
      console.error('Erro no login:', error);
      let message = 'Erro ao fazer login';
      
      if (error.code === 'auth/user-not-found') {
        message = 'Usuário não encontrado';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Senha incorreta';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Email inválido';
      }
      
      toast({
        title: 'Erro no login',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signup = async (data: SignupDto) => {
    try {
      // Cria conta no backend
      const response = await api.signup(data);
      
      if (!response.ok) {
        throw new Error(response.error || 'Erro ao criar conta');
      }

      if (!response.data?.customToken) {
        throw new Error('Token não recebido do servidor');
      }

      // Faz login com o token customizado
      await signInWithCustomToken(auth, response.data.customToken);
      
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Bem-vindo ao Konzup Hub',
      });
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast({
        title: 'Erro ao criar conta',
        description: error.message || 'Tente novamente',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('konzup_token');
      toast({
        title: 'Logout realizado',
      });
    } catch (error: any) {
      console.error('Erro no logout:', error);
      toast({
        title: 'Erro ao fazer logout',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
