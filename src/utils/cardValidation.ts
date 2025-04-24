interface CardValidationResult {
  isValid: boolean;
  cardType: string;
}

export const validateCardNumber = (cardNumber: string): CardValidationResult => {
  // Remove all non-digit characters
  const cleanedNumber = cardNumber.replace(/\D/g, '');

  // Check if the number is empty or contains non-digits
  if (!cleanedNumber || !/^\d+$/.test(cleanedNumber)) {
    return { isValid: false, cardType: 'Invalid' };
  }

  // Define card patterns
  const cardPatterns = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
  };

  // Check Luhn algorithm
  const luhnCheck = (num: string): boolean => {
    let sum = 0;
    let isEven = false;

    // Loop through values starting from the rightmost side
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i));

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  // Check card type and Luhn algorithm
  for (const [cardType, pattern] of Object.entries(cardPatterns)) {
    if (pattern.test(cleanedNumber)) {
      return {
        isValid: luhnCheck(cleanedNumber),
        cardType: cardType.charAt(0).toUpperCase() + cardType.slice(1),
      };
    }
  }

  return { isValid: false, cardType: 'Unknown' };
};

export const validateExpirationDate = (month: string, year: string): boolean => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based

  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10) + 2000; // Assuming 2-digit year

  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;
  if (expMonth < 1 || expMonth > 12) return false;

  return true;
};

export const validateCVV = (cvv: string, cardType: string): boolean => {
  const cleanedCVV = cvv.replace(/\D/g, '');
  
  if (cardType === 'Amex') {
    return /^\d{4}$/.test(cleanedCVV);
  }
  
  return /^\d{3}$/.test(cleanedCVV);
}; 