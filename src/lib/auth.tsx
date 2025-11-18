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

// Configuração do Firebase - Projeto ordem-em-dia
const firebaseConfig = {
  apiKey: "AIzaSyCkHVgsaIjwuggNKIv9rpa4M50ODyuy3L4",
  authDomain: "ordem-em-dia.firebaseapp.com",
  projectId: "ordem-em-dia",
  storageBucket: "ordem-em-dia.firebasestorage.app",
  messagingSenderId: "336386698724",
  appId: "1:336386698724:web:82c7283acb674603ac6bf1",
  measurementId: "G-D72W0Y9XJ6"
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
      console.log('[Auth] Iniciando login:', { email });
      await signInWithEmailAndPassword(auth, email, password);
      console.log('[Auth] Login realizado com sucesso');
      toast({
        title: 'Login realizado com sucesso!',
      });
    } catch (error: any) {
      console.error('[Auth] Erro no login:', error);
      console.error('[Auth] Código do erro:', error.code);
      console.error('[Auth] Mensagem do erro:', error.message);
      let message = 'Erro ao fazer login';
      
      if (error.code === 'auth/user-not-found') {
        message = 'Usuário não encontrado';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Senha incorreta';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Email inválido';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'Email ou senha incorretos';
      } else if (error.message) {
        message = error.message;
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
      console.log('[Auth] Iniciando signup:', { email: data.email });
      
      // Cria conta no backend (Firebase Admin cria o usuário)
      const response = await api.signup(data);
      console.log('[Auth] Resposta do backend:', response);
      
      if (!response.ok) {
        console.error('[Auth] Backend retornou erro:', response.error, response.details);
        throw new Error(response.error || 'Erro ao criar conta');
      }

      if (!response.data?.email) {
        console.error('[Auth] Dados incompletos do servidor:', response.data);
        throw new Error('Dados não recebidos do servidor');
      }

      console.log('[Auth] Conta criada no backend, fazendo login no Firebase Auth...');
      
      // Após criar no backend, faz login direto com email/senha no Firebase Auth
      await signInWithEmailAndPassword(auth, data.email, data.senha);
      
      console.log('[Auth] Login realizado com sucesso');
      
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Bem-vindo ao Konzup Hub',
      });
    } catch (error: any) {
      console.error('[Auth] Erro no cadastro completo:', error);
      console.error('[Auth] Código do erro:', error.code);
      console.error('[Auth] Mensagem do erro:', error.message);
      console.error('[Auth] Stack:', error.stack);
      
      // Mapeia erros específicos
      let message = 'Erro ao criar conta';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Este email já está cadastrado';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Email inválido';
      } else if (error.code === 'auth/weak-password') {
        message = 'Senha muito fraca';
      } else if (error.code === 'auth/user-not-found') {
        message = 'Usuário não encontrado. Tente fazer login.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Senha incorreta';
      } else if (error.message) {
        message = error.message;
      }
      
      toast({
        title: 'Erro ao criar conta',
        description: message,
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
