import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

/**
 * Password strength meter component that visualizes password strength
 * This component checks for length, uppercase, numbers, and special characters
 */
export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  // Calculate password strength based on various criteria
  const calculateStrength = (pass: string): number => {
    if (!pass) return 0;
    
    let strength = 0;
    
    // At least 8 characters
    if (pass.length >= 8) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(pass)) strength += 1;
    
    // Contains numbers
    if (/[0-9]/.test(pass)) strength += 1;
    
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    
    return strength;
  };
  
  const strength = calculateStrength(password);
  
  const getStrengthText = () => {
    if (!password) return '';
    if (strength === 4) return 'Strong';
    if (strength === 3) return 'Good';
    if (strength === 2) return 'Fair';
    return 'Weak';
  };
  
  const getStrengthColor = () => {
    if (!password) return 'bg-gray-200';
    if (strength === 4) return 'bg-green-500';
    if (strength === 3) return 'bg-blue-500';
    if (strength === 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="mt-2">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getStrengthColor()} transition-all duration-300`}
          style={{ width: `${password ? 25 * strength : 0}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1">
        <p className="text-xs text-gray-600">
          {getStrengthText()}
        </p>
        {password && (
          <div className="text-xs text-gray-600 flex gap-4">
            <span className={strength >= 1 ? 'text-green-600' : 'text-gray-400'}>
              8+ chars
            </span>
            <span className={strength >= 2 ? 'text-green-600' : 'text-gray-400'}>
              ABC
            </span>
            <span className={strength >= 3 ? 'text-green-600' : 'text-gray-400'}>
              123
            </span>
            <span className={strength >= 4 ? 'text-green-600' : 'text-gray-400'}>
              !@#
            </span>
          </div>
        )}
      </div>
    </div>
  );
};