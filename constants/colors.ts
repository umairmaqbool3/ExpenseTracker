export type ColorScheme = {
  primary: string;
  primaryLight: string;
  secondary: string;
  secondaryLight: string;
  expense: string;
  expenseLight: string;
  income: string;
  incomeLight: string;
  debt: string;
  debtLight: string;
  loan: string;
  loanLight: string;
  text: string;
  textSecondary: string;
  background: string;
  backgroundSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  card: string;
  shadow: string;
};

export const lightColors: ColorScheme = {
  primary: '#3E7BFA',
  primaryLight: '#EBF1FF',
  secondary: '#20D9D2',
  secondaryLight: '#E6F9F8',
  expense: '#FF6B6B',
  expenseLight: '#FFEDED',
  income: '#4CAF50',
  incomeLight: '#E8F5E9',
  debt: '#FF9800',
  debtLight: '#FFF3E0',
  loan: '#9C27B0',
  loanLight: '#F3E5F5',
  text: '#1A1A1A',
  textSecondary: '#757575',
  background: '#FFFFFF',
  backgroundSecondary: '#F5F7FA',
  border: '#E0E0E0',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#F57C00',
  info: '#1976D2',
  card: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkColors: ColorScheme = {
  primary: '#5B8CFF',
  primaryLight: '#1A2332',
  secondary: '#2DEDE6',
  secondaryLight: '#1A2B2A',
  expense: '#FF7A7A',
  expenseLight: '#2B1A1A',
  income: '#66BB6A',
  incomeLight: '#1A2B1A',
  debt: '#FFB74D',
  debtLight: '#2B221A',
  loan: '#BA68C8',
  loanLight: '#2A1A2B',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  border: '#333333',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  card: '#1E1E1E',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

// Default export for backward compatibility
const colors = lightColors;
export default colors;