
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  sendOTP: (phoneNumber: string) => boolean;
  verifyOTP: (phoneNumber: string, otp: string) => boolean;
  logout: () => void;
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
  const [generatedOTP, setGeneratedOTP] = useState<string>('');
  const [otpPhoneNumber, setOtpPhoneNumber] = useState<string>('');

  useEffect(() => {
    const authStatus = localStorage.getItem('tajAutogarageAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const sendOTP = (phoneNumber: string) => {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    setOtpPhoneNumber(phoneNumber);
    
    // In a real app, you would send this OTP via SMS
    console.log(`OTP for ${phoneNumber}: ${otp}`);
    alert(`Your OTP is: ${otp} (In production, this would be sent via SMS)`);
    
    return true;
  };

  const verifyOTP = (phoneNumber: string, otp: string) => {
    if (phoneNumber === otpPhoneNumber && otp === generatedOTP) {
      setIsAuthenticated(true);
      localStorage.setItem('tajAutogarageAuth', 'true');
      // Clear OTP data after successful verification
      setGeneratedOTP('');
      setOtpPhoneNumber('');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('tajAutogarageAuth');
    setGeneratedOTP('');
    setOtpPhoneNumber('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, sendOTP, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
