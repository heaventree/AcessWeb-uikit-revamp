import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

/**
 * Password strength indicator that provides visual feedback
 * about the security level of the entered password
 */
export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  // Calculate password strength
  const calculateStrength = (): { score: number; label: string; color: string } => {
    if (!password) {
      return { score: 0, label: 'None', color: 'bg-gray-200' };
    }
    
    // Basic scoring system
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
    
    // Score interpretation
    switch (true) {
      case (score >= 6):
        return { score: 4, label: 'Very Strong', color: 'bg-green-500' };
      case (score >= 4):
        return { score: 3, label: 'Strong', color: 'bg-green-400' };
      case (score >= 3):
        return { score: 2, label: 'Moderate', color: 'bg-yellow-500' };
      case (score >= 1):
        return { score: 1, label: 'Weak', color: 'bg-red-500' };
      default:
        return { score: 0, label: 'None', color: 'bg-gray-200' };
    }
  };
  
  const strength = calculateStrength();
  
  return (
    <div className="mt-1 mb-4">
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
          <div 
            className={`h-2.5 rounded-full ${strength.color}`} 
            style={{ width: `${(strength.score / 4) * 100}%` }}
            role="progressbar"
            aria-valuenow={strength.score}
            aria-valuemin={0}
            aria-valuemax={4}
          />
        </div>
        <span className="text-xs text-gray-600 min-w-[80px]">{strength.label}</span>
      </div>
      
      {/* Accessibility helpers and tips */}
      <div className="mt-1">
        <p className="text-xs text-gray-500">
          {strength.score < 2 && (
            "Aim for at least 8 characters with uppercase, lowercase, numbers, and special characters."
          )}
        </p>
      </div>
    </div>
  );
};