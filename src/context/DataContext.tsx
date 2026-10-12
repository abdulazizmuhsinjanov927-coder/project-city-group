import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, SalaryRecord, BonusRecord, PromotionRecord, VacationRecord } from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_SALARY_RECORDS,
  INITIAL_BONUS_RECORDS,
  INITIAL_PROMOTION_RECORDS,
  INITIAL_VACATION_RECORDS,
  INITIAL_DEPARTMENTS,
} from '../data/initialData';

interface DataContextType {
  employees: Employee[];
  salaryRecords: SalaryRecord[];
  bonusRecords: BonusRecord[];
  promotionRecords: PromotionRecord[];
  vacationRecords: VacationRecord[];
  departments: string[];
  addEmployee: (emp: Omit<Employee, 'id'>) => Employee;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addSalaryRecord: (record: Omit<SalaryRecord, 'id'>) => void;
  updateSalaryStatus: (id: string, status: SalaryRecord['status']) => void;
  addBonus: (bonus: Omit<BonusRecord, 'id'>) => void;
  addPromotion: (promotion: Omit<PromotionRecord, 'id'>) => void;
  addVacation: (vac: Omit<VacationRecord, 'id'>) => void;
  updateVacationStatus: (id: string, status: VacationRecord['status']) => void;
  addDepartment: (name: string) => void;
  resetToDefaultData: () => void;
  exportDataAsJson: () => string;
  importDataFromJson: (jsonStr: string) => boolean;
}

const STORAGE_KEYS = {
  EMPLOYEES: 'pcg_db_employees_v1',
  SALARY: 'pcg_db_salaries_v1',
  BONUSES: 'pcg_db_bonuses_v1',
  PROMOTIONS: 'pcg_db_promotions_v1',
  VACATIONS: 'pcg_db_vacations_v1',
  DEPARTMENTS: 'pcg_db_departments_v1',
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      if (saved) return JSON.parse(saved);
    } catch { /* empty */ }
    return INITIAL_EMPLOYEES;
  });

  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SALARY);
      if (saved) return JSON.parse(saved);
    } catch { /* empty */ }
    return INITIAL_SALARY_RECORDS;
  });

  const [bonusRecords, setBonusRecords] = useState<BonusRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BONUSES);
      if (saved) return JSON.parse(saved);
    } catch { /* empty */ }
    return INITIAL_BONUS_RECORDS;
  });

  const [promotionRecords, setPromotionRecords] = useState<PromotionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
      if (saved) return JSON.parse(saved);
    } catch { /* empty */ }
    return INITIAL_PROMOTION_RECORDS;
  });

  const [vacationRecords, setVacationRecords] = useState<VacationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VACATIONS);
      if (saved) return JSON.parse(saved);
    } catch { /* empty */ }
    return INITIAL_VACATION_RECORDS;
  });

  const [departments, setDepartments] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
      if (saved) return JSON.parse(saved);
    } catch { /* empty */ }
    return INITIAL_DEPARTMENTS;
  });

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
      localStorage.setItem(STORAGE_KEYS.SALARY, JSON.stringify(salaryRecords));
      localStorage.setItem(STORAGE_KEYS.BONUSES, JSON.stringify(bonusRecords));
      localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(promotionRecords));
      localStorage.setItem(STORAGE_KEYS.VACATIONS, JSON.stringify(vacationRecords));
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments));
    } catch (e) {
      console.error('Error persisting database to local storage', e);
    }
  }, [employees, salaryRecords, bonusRecords, promotionRecords, vacationRecords, departments]);

  const addEmployee = (data: Omit<Employee, 'id'>): Employee => {
    const newId = `pcg-${String(employees.length + 1).padStart(3, '0')}`;
    const newEmp: Employee = { ...data, id: newId };
    setEmployees((prev) => [newEmp, ...prev]);

    // Also auto-generate salary record for current month
    const baseSalary = newEmp.salary;
    const bonus = Math.round(baseSalary * (newEmp.bonusRate / 100));
    const gross = baseSalary + bonus;
    const tax = Math.round(gross * 0.12);
    const net = gross - tax;

    const newSalary: SalaryRecord = {
      id: `sal-${Date.now()}`,
      employeeId: newId,
      employeeName: newEmp.fullName,
      position: newEmp.position,
      department: newEmp.department,
      month: '2026-10',
      baseSalary,
      bonus,
      deduction: 0,
      tax,
      netSalary: net,
      status: 'Kutilmoqda',
    };
    setSalaryRecords((prev) => [newSalary, ...prev]);

    return newEmp;
  };

  const updateEmployee = (id: string, updated: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updated } : emp))
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const addSalaryRecord = (record: Omit<SalaryRecord, 'id'>) => {
    const newRec: SalaryRecord = {
      ...record,
      id: `sal-${Date.now()}`,
    };
    setSalaryRecords((prev) => [newRec, ...prev]);
  };

  const updateSalaryStatus = (id: string, status: SalaryRecord['status']) => {
    setSalaryRecords((prev) =>
      prev.map((rec) =>
        rec.id === id
          ? {
              ...rec,
              status,
              paymentDate: status === "To'langan" ? new Date().toISOString().split('T')[0] : rec.paymentDate,
            }
          : rec
      )
    );
  };

  const addBonus = (bonus: Omit<BonusRecord, 'id'>) => {
    const newBonus: BonusRecord = {
      ...bonus,
      id: `bon-${Date.now()}`,
    };
    setBonusRecords((prev) => [newBonus, ...prev]);

    // Also optionally reflect in the current month's salary record
    setSalaryRecords((prev) =>
      prev.map((rec) => {
        if (rec.employeeId === bonus.employeeId && rec.month === '2026-10') {
          const newBonusTotal = rec.bonus + bonus.amount;
          const gross = rec.baseSalary + newBonusTotal - rec.deduction;
          const tax = Math.round(gross * 0.12);
          const net = gross - tax;
          return {
            ...rec,
            bonus: newBonusTotal,
            tax,
            netSalary: net,
          };
        }
        return rec;
      })
    );
  };

  const addPromotion = (promo: Omit<PromotionRecord, 'id'>) => {
    const newPromo: PromotionRecord = {
      ...promo,
      id: `pro-${Date.now()}`,
    };
    setPromotionRecords((prev) => [newPromo, ...prev]);

    // Update employee position and salary
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === promo.employeeId
          ? {
              ...emp,
              position: promo.newPosition,
              salary: promo.newSalary,
            }
          : emp
      )
    );
  };

  const addVacation = (vac: Omit<VacationRecord, 'id'>) => {
    const newVac: VacationRecord = {
      ...vac,
      id: `vac-${Date.now()}`,
    };
    setVacationRecords((prev) => [newVac, ...prev]);

    // Update employee's remaining vacation days
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === vac.employeeId
          ? {
              ...emp,
              vacationDaysLeft: Math.max(0, emp.vacationDaysLeft - vac.daysCount),
              status: vac.status === 'Tasdiqlangan' ? "Ta'tilda" : emp.status,
            }
          : emp
      )
    );
  };

  const updateVacationStatus = (id: string, status: VacationRecord['status']) => {
    setVacationRecords((prev) =>
      prev.map((vac) => {
        if (vac.id === id) {
          // If approved, set employee status to "Ta'tilda"
          if (status === 'Tasdiqlangan') {
            setEmployees((ePrev) =>
              ePrev.map((e) => (e.id === vac.employeeId ? { ...e, status: "Ta'tilda" } : e))
            );
          } else if (status === 'Yakunlangan' || status === 'Rad etilgan') {
            setEmployees((ePrev) =>
              ePrev.map((e) => (e.id === vac.employeeId ? { ...e, status: 'Faol' } : e))
            );
          }
          return { ...vac, status };
        }
        return vac;
      })
    );
  };

  const addDepartment = (name: string) => {
    if (!departments.includes(name)) {
      setDepartments((prev) => [...prev, name]);
    }
  };

  const resetToDefaultData = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setSalaryRecords(INITIAL_SALARY_RECORDS);
    setBonusRecords(INITIAL_BONUS_RECORDS);
    setPromotionRecords(INITIAL_PROMOTION_RECORDS);
    setVacationRecords(INITIAL_VACATION_RECORDS);
    setDepartments(INITIAL_DEPARTMENTS);
  };

  const exportDataAsJson = (): string => {
    return JSON.stringify({
      employees,
      salaryRecords,
      bonusRecords,
      promotionRecords,
      vacationRecords,
      departments,
      exportedAt: new Date().toISOString(),
      company: 'PROJECT CITY GROUP',
    }, null, 2);
  };

  const importDataFromJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.employees && Array.isArray(data.employees)) {
        setEmployees(data.employees);
        if (data.salaryRecords) setSalaryRecords(data.salaryRecords);
        if (data.bonusRecords) setBonusRecords(data.bonusRecords);
        if (data.promotionRecords) setPromotionRecords(data.promotionRecords);
        if (data.vacationRecords) setVacationRecords(data.vacationRecords);
        if (data.departments) setDepartments(data.departments);
        return true;
      }
    } catch (e) {
      console.error('Failed to parse JSON backup', e);
    }
    return false;
  };

  return (
    <DataContext.Provider
      value={{
        employees,
        salaryRecords,
        bonusRecords,
        promotionRecords,
        vacationRecords,
        departments,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addSalaryRecord,
        updateSalaryStatus,
        addBonus,
        addPromotion,
        addVacation,
        updateVacationStatus,
        addDepartment,
        resetToDefaultData,
        exportDataAsJson,
        importDataFromJson,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
