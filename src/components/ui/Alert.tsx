// components/ui/Alert.tsx
import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export const Alert: React.FC<AlertProps> = ({ children, variant = 'default' }) => {
  const baseStyles = "p-2 rounded-lg border";
  const variantStyles = variant === 'destructive' 
    ? "bg-sky-50 border-sky-950 text-sky-900" 
    : "bg-gray-50 border-gray-200 text-gray-700";

  return (
    <div className={`${baseStyles} ${variantStyles}`}>
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-sm">{children}</div>
);