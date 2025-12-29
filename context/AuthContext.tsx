
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface UserProfile {
  id: string;
  name: string;
  avatar_url: string;
  role: 'student' | 'creator' | 'admin';
  bio?: string;
  status?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  signUp: (credentials: any) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, retries = 2): Promise<UserProfile | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        const errorMsg = error.message?.toLowerCase() || '';
        const isRecursionError = errorMsg.includes('infinite recursion') || error.code === '42P17';
        
        if (isRecursionError) {
          console.warn('RLS Recursion detected in profiles table. Using fallback metadata.');
          return null;
        }

        if (error.code === 'PGRST116' && retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchProfile(userId, retries - 1);
        }
        
        return null;
      }
      return profile;
    } catch (e: any) {
      return null;
    }
  };

  const syncUserState = async (sessionUser: any) => {
    if (!sessionUser) return;

    // Tentamos buscar o perfil real
    const profile = await fetchProfile(sessionUser.id);
    
    if (profile) {
      setUser(profile);
    } else {
      // Fallback robusto caso a tabela profiles esteja inacessível por erro de RLS
      setUser({
        id: sessionUser.id,
        name: sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || 'Usuário',
        avatar_url: sessionUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${sessionUser.email}&background=0071e3&color=fff`,
        role: sessionUser.user_metadata?.role || 'student',
        status: 'active'
      });
    }
  };

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await syncUserState(session.user);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setHasSession(true);
          await syncUserState(session.user);
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setHasSession(true);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          await syncUserState(session.user);
        }
      } else {
        setHasSession(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async ({ email, password }: any) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) await syncUserState(data.user);
  };

  const signUp = async ({ email, password, name }: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: 'student' }
      }
    });
    if (error) throw error;
    if (data.user) await syncUserState(data.user);
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setHasSession(false);
    setLoading(false);
    window.location.href = '#/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signUp, 
      logout, 
      refreshProfile, 
      isAuthenticated: hasSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};
