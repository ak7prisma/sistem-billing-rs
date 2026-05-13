/**
 * Format date from various types (Firestore Timestamp, Date object, or ISO string)
 * to Indonesian locale string.
 */
export const formatDate = (date: any, options?: Intl.DateTimeFormatOptions) => {
  if (!date) return "N/A";
  
  let d: Date;
  
  // Handle Firestore Timestamp
  if (date && typeof date === 'object' && 'seconds' in date) {
    d = new Date(date.seconds * 1000);
  } 
  // Handle Date object
  else if (date instanceof Date) {
    d = date;
  } 
  // Handle string or number
  else {
    d = new Date(date);
  }

  // Check if valid date
  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  return d.toLocaleDateString("id-ID", options || defaultOptions);
};

/**
 * Format date with time
 */
export const formatDateTime = (date: any) => {
  return formatDate(date, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
