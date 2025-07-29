export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  export const formatMonthYear = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };
  
  export const getCurrentMonthRange = (): { start: string; end: string } => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  };
  
  export const getPreviousMonthRange = (): { start: string; end: string } => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    
    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  };
  
  export const getDateRangeForLastNDays = (days: number): { start: string; end: string } => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  };
  
  export const groupTransactionsByDate = <T extends { date: string }>(
    transactions: T[]
  ): Record<string, T[]> => {
    return transactions.reduce((groups, transaction) => {
      const date = transaction.date.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {} as Record<string, T[]>);
  };