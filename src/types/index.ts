export type EmployeeStatus = 'Faol' | "Ta'tilda" | 'Sinov muddatida' | 'Nofaol';

export interface Employee {
  id: string;
  fullName: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  telegram?: string;
  linkedin?: string;
  birthDate: string; // YYYY-MM-DD
  hireDate: string;  // YYYY-MM-DD
  status: EmployeeStatus;
  salary: number; // in UZS
  bonusRate: number; // percentage or fixed
  avatar: string;
  gender: 'Erkak' | 'Ayol';
  address: string;
  passportSeria: string;
  jshshir: string;
  vacationDaysLeft: number;
  notes?: string;
}

export type VacationType = "Mehnat ta'tili" | "Oyliksiz ta'til" | "Kasallik ta'tili" | "O'quv ta'tili";
export type VacationStatus = 'Tasdiqlangan' | "Ko'rib chiqilmoqda" | 'Rad etilgan' | 'Yakunlangan';

export interface VacationRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  type: VacationType;
  startDate: string;
  endDate: string;
  daysCount: number;
  status: VacationStatus;
  reason?: string;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  month: string; // e.g., '2026-10'
  baseSalary: number;
  bonus: number;
  deduction: number;
  tax: number; // 12% income tax
  netSalary: number;
  status: "To'langan" | 'Kutilmoqda' | 'Tasdiqlangan';
  paymentDate?: string;
}

export interface BonusRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  reason: string;
  date: string;
  type: 'KPI mukofoti' | 'Kvartal bonusi' | 'Bayramona mukofot' | 'Yillik bonus' | 'Loyiha bonusi';
  approvedBy: string;
}

export interface PromotionRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  previousPosition: string;
  newPosition: string;
  previousSalary: number;
  newSalary: number;
  effectiveDate: string;
  orderNumber: string; // e.g. PCG-2026/08-K
  reason: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'Administrator' | 'HR Rahbari' | 'Moliya direktori';
  avatar: string;
  email: string;
}

export interface BrandingConfig {
  companyName: string;
  companyShortName: string;
  title: string;
  subtitle?: string;
  logoUrl: string | null;
  usePresetLogoImage: boolean;
  officialAddress: string;
  officialPhone: string;
  officialEmail: string;
  officialWebsite: string;
  tin: string; // STIR / INN
  mfo: string;
  accountNumber: string;
  ceoName: string;
  hrLeadName: string;
  currency: string;
}

export type ActiveTab = 
  | 'dashboard' 
  | 'employees' 
  | 'payroll' 
  | 'promotions' 
  | 'vacations' 
  | 'birthdays' 
  | 'reports' 
  | 'settings';
