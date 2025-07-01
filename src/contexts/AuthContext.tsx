
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  sendWhatsAppNotification: (phoneNumber: string, bikeNumber: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Simple authentication - you can change these credentials
      if (username === 'admin' && password === 'tajgarage123') {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        console.log('Login successful');
        return true;
      }
      
      console.log('Invalid credentials');
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const sendWhatsAppNotification = async (phoneNumber: string, bikeNumber: string): Promise<boolean> => {
    try {
      // For now, just log the notification - you can integrate with free WhatsApp API later
      console.log(`WhatsApp notification: RC card for bike ${bikeNumber} is ready for pickup. Phone: ${phoneNumber}`);
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      sendWhatsAppNotification 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
