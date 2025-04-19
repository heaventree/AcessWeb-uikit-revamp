import React from 'react';

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Toggle: React.FC<ToggleProps> = ({
  id,
  checked,
  onChange,
  disabled = false,
  size = 'md',
}) => {
  // Size classes
  const sizes = {
    sm: {
      container: 'h-4 w-8',
      toggle: 'h-3 w-3',
      translateX: 'translate-x-4',
    },
    md: {
      container: 'h-6 w-11',
      toggle: 'h-5 w-5',
      translateX: 'translate-x-5',
    },
    lg: {
      container: 'h-8 w-14',
      toggle: 'h-7 w-7',
      translateX: 'translate-x-6',
    },
  };

  return (
    <button
      type="button"
      id={id}
      aria-pressed={checked}
      disabled={disabled}
      className={`
        ${sizes[size].container}
        ${checked ? 'bg-blue-600' : 'bg-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        relative inline-flex flex-shrink-0 rounded-full border-2 border-transparent transition-colors ease-in-out duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      `}
      onClick={onChange}
    >
      <span className="sr-only">{checked ? 'Enable' : 'Disable'}</span>
      <span
        className={`
          ${sizes[size].toggle}
          ${checked ? sizes[size].translateX : 'translate-x-0'}
          pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
        `}
      />
    </button>
  );
};

export default Toggle;