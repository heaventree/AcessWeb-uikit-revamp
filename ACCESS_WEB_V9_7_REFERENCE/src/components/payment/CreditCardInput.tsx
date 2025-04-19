import { useState, useEffect, useRef } from 'react';

// Types for credit card input
interface CreditCardInputProps {
  onChange: (isValid: boolean, cardData: CreditCardData) => void;
  className?: string;
}

export interface CreditCardData {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
  isValid: boolean;
}

// Credit card type definitions
interface CardType {
  name: string;
  pattern: RegExp;
  format: RegExp;
  lengths: number[];
  cvvLength: number;
  validator: (value: string) => boolean;
}

// Card type definitions
const CARD_TYPES: CardType[] = [
  {
    name: 'visa',
    pattern: /^4/,
    format: /(\d{1,4})/g,
    lengths: [16],
    cvvLength: 3,
    validator: (value: string) => {
      return /^4\d{12}(?:\d{3})?$/.test(value.replace(/\s+/g, ''));
    }
  },
  {
    name: 'mastercard',
    pattern: /^5[1-5]/,
    format: /(\d{1,4})/g,
    lengths: [16],
    cvvLength: 3,
    validator: (value: string) => {
      return /^5[1-5]\d{14}$/.test(value.replace(/\s+/g, ''));
    }
  },
  {
    name: 'amex',
    pattern: /^3[47]/,
    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
    lengths: [15],
    cvvLength: 4,
    validator: (value: string) => {
      return /^3[47]\d{13}$/.test(value.replace(/\s+/g, ''));
    }
  },
  {
    name: 'discover',
    pattern: /^(6011|65|64[4-9]|622)/,
    format: /(\d{1,4})/g,
    lengths: [16],
    cvvLength: 3,
    validator: (value: string) => {
      return /^(6011|65|64[4-9]|622)\d{12,15}$/.test(value.replace(/\s+/g, ''));
    }
  }
];

export function CreditCardInput({ onChange, className = '' }: CreditCardInputProps) {
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  
  // Validation state
  const [cardType, setCardType] = useState<CardType | null>(null);
  const [isCardNumberValid, setIsCardNumberValid] = useState<boolean | null>(null);
  const [isCardNameValid, setIsCardNameValid] = useState<boolean | null>(null);
  const [isCardExpiryValid, setIsCardExpiryValid] = useState<boolean | null>(null);
  const [isCardCVCValid, setIsCardCVCValid] = useState<boolean | null>(null);

  // Focus state for animation
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Refs for input elements
  const cardNumberRef = useRef<HTMLInputElement>(null);
  const cardNameRef = useRef<HTMLInputElement>(null);
  const cardExpiryRef = useRef<HTMLInputElement>(null);
  const cardCVCRef = useRef<HTMLInputElement>(null);

  // Animation timers
  const animationTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // Detect card type based on number
  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    
    if (cleanNumber.length > 0) {
      const detectedCard = CARD_TYPES.find(card => card.pattern.test(cleanNumber));
      setCardType(detectedCard || null);
    } else {
      setCardType(null);
    }
  }, [cardNumber]);
  
  // Format card number with spaces
  function formatCardNumber(value: string): string {
    const cleanValue = value.replace(/\s+/g, '').replace(/\D/g, '');
    
    if (cardType) {
      const parts = cleanValue.match(cardType.format);
      if (parts) {
        return parts.join(' ');
      }
    }
    
    // Default format for unknown card types (4 digits groups)
    const parts = cleanValue.match(/(\d{1,4})/g);
    if (parts) {
      return parts.join(' ');
    }
    
    return cleanValue;
  }
  
  // Format expiry date
  function formatExpiry(value: string): string {
    const cleanValue = value.replace(/\D/g, '');
    
    if (cleanValue.length > 2) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
    }
    
    return cleanValue;
  }
  
  // Validate card number (using Luhn algorithm)
  function validateCardNumber(number: string): boolean {
    if (!number || !cardType) return false;
    
    const cleanNumber = number.replace(/\s+/g, '');
    
    // Length check
    if (!cardType.lengths.includes(cleanNumber.length)) {
      return false;
    }
    
    // Card specific validation
    if (!cardType.validator(cleanNumber)) {
      return false;
    }

    // Luhn algorithm validation
    let sum = 0;
    let shouldDouble = false;
    
    // Loop from right to left
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  }
  
  // Validate expiry date
  function validateExpiry(expiry: string): boolean {
    if (!expiry) return false;
    
    const parts = expiry.split('/');
    if (parts.length !== 2) return false;
    
    const month = parseInt(parts[0], 10);
    const year = parseInt(`20${parts[1]}`, 10);
    
    // Check if month is valid
    if (month < 1 || month > 12) return false;
    
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Check if expiry date is in the future
    return (year > currentYear || (year === currentYear && month >= currentMonth));
  }
  
  // Validate CVV/CVC
  function validateCVC(cvc: string): boolean {
    if (!cvc || !cardType) return false;
    
    const cleanCVC = cvc.replace(/\D/g, '');
    return cleanCVC.length === cardType.cvvLength;
  }
  
  // Validate cardholder name
  function validateCardName(name: string): boolean {
    return name.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(name);
  }
  
  // Handle card number input
  function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const formattedValue = formatCardNumber(value);
    setCardNumber(formattedValue);
    
    // Clear any existing validation timer
    if (animationTimers.current.cardNumber) {
      clearTimeout(animationTimers.current.cardNumber);
    }
    
    // Set validation after a small delay to allow for typing
    animationTimers.current.cardNumber = setTimeout(() => {
      const isValid = validateCardNumber(formattedValue);
      setIsCardNumberValid(formattedValue.length > 0 ? isValid : null);
      
      // Auto-focus next field if valid and at max length
      if (isValid && cardType) {
        const maxLength = cardType.name === 'amex' ? 17 : 19; // Including spaces
        if (formattedValue.length >= maxLength && cardNameRef.current) {
          cardNameRef.current.focus();
        }
      }
      
      sendFormDataToParent();
    }, 300);
  }
  
  // Handle cardholder name input
  function handleCardNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setCardName(value);
    
    // Clear any existing validation timer
    if (animationTimers.current.cardName) {
      clearTimeout(animationTimers.current.cardName);
    }
    
    // Set validation after a small delay to allow for typing
    animationTimers.current.cardName = setTimeout(() => {
      const isValid = validateCardName(value);
      setIsCardNameValid(value.length > 0 ? isValid : null);
      sendFormDataToParent();
    }, 300);
  }
  
  // Handle expiry date input
  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const formattedValue = formatExpiry(value);
    setCardExpiry(formattedValue);
    
    // Clear any existing validation timer
    if (animationTimers.current.cardExpiry) {
      clearTimeout(animationTimers.current.cardExpiry);
    }
    
    // Set validation after a small delay to allow for typing
    animationTimers.current.cardExpiry = setTimeout(() => {
      const isValid = validateExpiry(formattedValue);
      setIsCardExpiryValid(formattedValue.length > 0 ? isValid : null);
      
      // Auto-focus next field if valid and at max length
      if (isValid && formattedValue.length >= 5 && cardCVCRef.current) {
        cardCVCRef.current.focus();
      }
      
      sendFormDataToParent();
    }, 300);
  }
  
  // Handle CVC input
  function handleCVCChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, '');
    setCardCVC(value);
    
    // Clear any existing validation timer
    if (animationTimers.current.cardCVC) {
      clearTimeout(animationTimers.current.cardCVC);
    }
    
    // Set validation after a small delay to allow for typing
    animationTimers.current.cardCVC = setTimeout(() => {
      const isValid = validateCVC(value);
      setIsCardCVCValid(value.length > 0 ? isValid : null);
      sendFormDataToParent();
    }, 300);
  }
  
  // Send form data to parent component
  function sendFormDataToParent() {
    const isCardNumberValidated = isCardNumberValid === true;
    const isCardNameValidated = isCardNameValid === true;
    const isCardExpiryValidated = isCardExpiryValid === true;
    const isCardCVCValidated = isCardCVCValid === true;
    
    const isFormValid = 
      isCardNumberValidated && 
      isCardNameValidated && 
      isCardExpiryValidated && 
      isCardCVCValidated;
    
    onChange(isFormValid, {
      number: cardNumber,
      name: cardName,
      expiry: cardExpiry,
      cvc: cardCVC,
      isValid: isFormValid
    });
  }
  
  // Focus and blur handlers for animation
  const handleFocus = (field: string) => {
    setFocusedField(field);
  };
  
  const handleBlur = () => {
    setFocusedField(null);
  };
  
  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      Object.values(animationTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);
  
  // Get validation class for input fields
  const getValidationClass = (isValid: boolean | null) => {
    if (isValid === null) return '';
    return isValid ? 'border-green-500' : 'border-red-500';
  };

  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm ${className}`}>
      <div className="mb-5 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
        <div className="flex space-x-2">
          {/* Card type icons */}
          <div className={`w-8 h-5 rounded opacity-50 ${cardType?.name === 'visa' || !cardType ? 'opacity-100' : ''}`}>
            <svg viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Visa">
              <rect width="32" height="20" fill="#F3F4F6" rx="4"/>
              <path d="M13.04 8.168l-1.664 4.664h-1.12L11.44 8.8c.064-.32.272-.544.56-.624.288-.08.608.016.8.272.16.208.208.464.24.72zm4.384-1.2v5.872h-1.056v-5.872h1.056zm4.832 4.016c.432.448.4 1.136-.064 1.552-.32.288-.752.416-1.184.416-.752 0-1.504-.272-2.112-.672l.512-.832c.432.336.96.624 1.52.624.208 0 .448-.048.592-.208.144-.176.144-.48-.064-.624-.72-.464-2.48-.336-2.48-1.904 0-.608.512-1.232 1.136-1.376.656-.144 1.36 0 1.92.352l-.448.832c-.352-.224-.784-.368-1.2-.336-.16 0-.336.032-.464.128-.112.112-.16.288-.064.416.224.576 2.4.24 2.4 1.632zm1.728-4.016l1.664 4.672h-1.12l-1.664-4.672h1.12zm-5.856 0l1.664 4.672h-1.12l-1.664-4.672h1.12z" fill="#2563EB"/>
            </svg>
          </div>
          <div className={`w-8 h-5 rounded opacity-50 ${cardType?.name === 'mastercard' ? 'opacity-100' : ''}`}>
            <svg viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mastercard">
              <rect width="32" height="20" fill="#F3F4F6" rx="4"/>
              <path d="M21.92 14h-12v-8h12v8z" fill="#F3F4F6"/>
              <circle cx="13.92" cy="10" r="4" fill="#EB001B"/>
              <circle cx="17.92" cy="10" r="4" fill="#F79E1B"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M15.92 7.2c.704.813 1.132 1.874 1.132 3.04 0 1.166-.428 2.227-1.132 3.04a4.266 4.266 0 01-1.132-3.04c0-1.166.428-2.227 1.132-3.04z" fill="#FF5F00"/>
            </svg>
          </div>
          <div className={`w-8 h-5 rounded opacity-50 ${cardType?.name === 'amex' ? 'opacity-100' : ''}`}>
            <svg viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="American Express">
              <rect width="32" height="20" fill="#F3F4F6" rx="4"/>
              <path d="M18.92 10.24V6h4.24v1.04h-3.04v.96h2.96v.96h-2.96v1.28h3.04v-1.28h1.2v2.24h-5.44v-1.28l-1.04 1.28h-1.28l-1.04-1.28V12h-6.7l-.48-1.12-.48 1.12h-1.68V6h2.4l.24.64L9 6h3.92v.4l.32-.4h7.68zm-4.16.8h-1.92l-1.12-2.8v2.8h-2.72l-.4-1.04h-2.4l-.48 1.04h-1.2l2.16-4.8H8.2l1.92 4.32V6.24h1.84l1.04 2.56.96-2.56h1.76v4.8h-1.04v.16zm-7.2-1.84l-.72-1.84-.8 1.84h1.52z" fill="#006FCF"/>
            </svg>
          </div>
          <div className={`w-8 h-5 rounded opacity-50 ${cardType?.name === 'discover' ? 'opacity-100' : ''}`}>
            <svg viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Discover">
              <rect width="32" height="20" fill="#F3F4F6" rx="4"/>
              <path d="M11.92 11c-.44 0-.8-.36-.8-.8s.36-.8.8-.8.8.36.8.8-.36.8-.8.8zm7.44-3.84H9.52v5.68h9.84V7.16z" fill="#4D4D4D"/>
              <path d="M13.28 10.16c0 .84-.68 1.52-1.52 1.52-.84 0-1.52-.68-1.52-1.52 0-.84.68-1.52 1.52-1.52.84 0 1.52.68 1.52 1.52z" fill="#F47216"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Card number */}
        <div className="relative">
          <label 
            htmlFor="card-number" 
            className={`block text-sm font-medium mb-1 transform origin-left transition-all duration-200 ${
              focusedField === 'number' || cardNumber ? 'text-blue-600 scale-90 -translate-y-6' : 'text-gray-700'
            }`}
          >
            Card Number
          </label>
          <div 
            className={`relative overflow-hidden rounded-md transition-all duration-300 ${
              focusedField === 'number' ? 'ring-2 ring-blue-500 border-transparent' : 'border border-gray-300'
            } ${getValidationClass(isCardNumberValid)}`}
          >
            <input
              id="card-number"
              type="text"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              ref={cardNumberRef}
              value={cardNumber}
              onChange={handleCardNumberChange}
              onFocus={() => handleFocus('number')}
              onBlur={handleBlur}
              className="block w-full border-0 p-3 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm"
              maxLength={19}
              aria-invalid={isCardNumberValid === false}
              aria-describedby={isCardNumberValid === false ? 'card-number-error' : undefined}
            />
            {isCardNumberValid === false && (
              <svg className="absolute right-3 top-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
              </svg>
            )}
            {isCardNumberValid === true && (
              <svg className="absolute right-3 top-3 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          {isCardNumberValid === false && (
            <p id="card-number-error" className="mt-1 text-sm text-red-600 animate-fadeIn">
              Please enter a valid card number
            </p>
          )}
        </div>
        
        {/* Card holder name */}
        <div className="relative">
          <label 
            htmlFor="card-name" 
            className={`block text-sm font-medium mb-1 transform origin-left transition-all duration-200 ${
              focusedField === 'name' || cardName ? 'text-blue-600 scale-90 -translate-y-6' : 'text-gray-700'
            }`}
          >
            Cardholder Name
          </label>
          <div 
            className={`relative overflow-hidden rounded-md transition-all duration-300 ${
              focusedField === 'name' ? 'ring-2 ring-blue-500 border-transparent' : 'border border-gray-300'
            } ${getValidationClass(isCardNameValid)}`}
          >
            <input
              id="card-name"
              type="text"
              autoComplete="cc-name"
              placeholder="John Smith"
              ref={cardNameRef}
              value={cardName}
              onChange={handleCardNameChange}
              onFocus={() => handleFocus('name')}
              onBlur={handleBlur}
              className="block w-full border-0 p-3 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm"
              aria-invalid={isCardNameValid === false}
              aria-describedby={isCardNameValid === false ? 'card-name-error' : undefined}
            />
            {isCardNameValid === false && (
              <svg className="absolute right-3 top-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
              </svg>
            )}
            {isCardNameValid === true && (
              <svg className="absolute right-3 top-3 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          {isCardNameValid === false && (
            <p id="card-name-error" className="mt-1 text-sm text-red-600 animate-fadeIn">
              Please enter the name exactly as it appears on the card
            </p>
          )}
        </div>
        
        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          {/* Expiry date */}
          <div className="relative">
            <label 
              htmlFor="card-expiry" 
              className={`block text-sm font-medium mb-1 transform origin-left transition-all duration-200 ${
                focusedField === 'expiry' || cardExpiry ? 'text-blue-600 scale-90 -translate-y-6' : 'text-gray-700'
              }`}
            >
              Expiry Date
            </label>
            <div 
              className={`relative overflow-hidden rounded-md transition-all duration-300 ${
                focusedField === 'expiry' ? 'ring-2 ring-blue-500 border-transparent' : 'border border-gray-300'
              } ${getValidationClass(isCardExpiryValid)}`}
            >
              <input
                id="card-expiry"
                type="text"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                ref={cardExpiryRef}
                value={cardExpiry}
                onChange={handleExpiryChange}
                onFocus={() => handleFocus('expiry')}
                onBlur={handleBlur}
                className="block w-full border-0 p-3 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm"
                maxLength={5}
                aria-invalid={isCardExpiryValid === false}
                aria-describedby={isCardExpiryValid === false ? 'card-expiry-error' : undefined}
              />
              {isCardExpiryValid === false && (
                <svg className="absolute right-3 top-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                </svg>
              )}
              {isCardExpiryValid === true && (
                <svg className="absolute right-3 top-3 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            {isCardExpiryValid === false && (
              <p id="card-expiry-error" className="mt-1 text-sm text-red-600 animate-fadeIn">
                Enter a valid future date
              </p>
            )}
          </div>
          
          {/* CVC */}
          <div className="relative">
            <label 
              htmlFor="card-cvc" 
              className={`block text-sm font-medium mb-1 transform origin-left transition-all duration-200 ${
                focusedField === 'cvc' || cardCVC ? 'text-blue-600 scale-90 -translate-y-6' : 'text-gray-700'
              }`}
            >
              CVC / Security Code
            </label>
            <div 
              className={`relative overflow-hidden rounded-md transition-all duration-300 ${
                focusedField === 'cvc' ? 'ring-2 ring-blue-500 border-transparent' : 'border border-gray-300'
              } ${getValidationClass(isCardCVCValid)}`}
            >
              <input
                id="card-cvc"
                type="password"
                autoComplete="cc-csc"
                placeholder={cardType?.name === 'amex' ? '4 digits' : '3 digits'}
                ref={cardCVCRef}
                value={cardCVC}
                onChange={handleCVCChange}
                onFocus={() => handleFocus('cvc')}
                onBlur={handleBlur}
                className="block w-full border-0 p-3 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm"
                maxLength={cardType?.name === 'amex' ? 4 : 3}
                aria-invalid={isCardCVCValid === false}
                aria-describedby={isCardCVCValid === false ? 'card-cvc-error' : undefined}
              />
              {isCardCVCValid === false && (
                <svg className="absolute right-3 top-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                </svg>
              )}
              {isCardCVCValid === true && (
                <svg className="absolute right-3 top-3 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            {isCardCVCValid === false && (
              <p id="card-cvc-error" className="mt-1 text-sm text-red-600 animate-fadeIn">
                {cardType?.name === 'amex' ? 'Enter 4-digit code' : 'Enter 3-digit code'}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center">
          <svg className="h-4 w-4 text-green-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
          </svg>
          <span>Your data is securely encrypted</span>
        </div>
      </div>
    </div>
  );
}