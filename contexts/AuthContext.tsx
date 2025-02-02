import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebaseConfiguration';
import { onAuthStateChanged } from 'firebase/auth';

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await AsyncStorage.setItem('@auth_status', 'true');
          await AsyncStorage.setItem('@user_id', user.uid);
          setIsAuthenticated(true);
        } else {
          await AsyncStorage.removeItem('@auth_status');
          await AsyncStorage.removeItem('@user_id');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error updating auth status:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 