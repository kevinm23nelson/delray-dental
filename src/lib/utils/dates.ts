// src/lib/utils/dates.ts

// Helper to adjust for timezone offset when saving to Postgres DATE type
export function standardizeDate(dateString: string | Date | undefined): Date {
    if (!dateString) {
      const date = new Date();
      // Add one day to compensate for Postgres DATE handling
      date.setDate(date.getDate() + 1);
      return date;
    }
  
    const date = new Date(dateString);
    // Add one day to compensate for Postgres DATE handling
    date.setDate(date.getDate() + 1);
    return date;
  }
  
  export function formatDateForInput(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
  
  export function formatDateForDisplay(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }