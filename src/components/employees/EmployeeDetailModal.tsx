import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  Send,
  Linkedin,
  Calendar,
  Building,
  CreditCard,
  Cake,
  TrendingUp,
  Award,
  CalendarCheck,
  IdCard,
  Printer,
  Plus,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { Employee, BonusRecord, PromotionRecord, VacationRecord } from '../../types';
import { useData } from '../../context/DataContext';
import { useBranding } from '../../context/BrandingContext';
import { Logo } from '../common/Logo';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (emp: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
  onEdit,
}) => {
  const { branding } = useBranding();
  const {
    bonusRecords,
    promotionRecords,
    vacationRecords,
    salaryRecords,
    addBonus,
    addPromotion,
    addVacation,
  } = useData();

  const [activeTab, setActiveTab] = useState<'info' | 'salary' | 'promotions' | 'vacations' | 'badge'>('info');

  // Bonus modal state
  const [showBonusForm, setShowBonusForm] = useState(false);
  const [bonusAmount, setBonusAmount] = useState(2000000);
  const [bonusReason, setBonusReason] = useState('');
  const [bonusType, setBonusType] = useState<BonusRecord['type']>('KPI mukofoti');

  // Promotion modal state
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [newPosition, setNewPosition] = useState('');
  const [newSalary, setNewSalary] = useState(0);
  const [promoReason, setPromoReason] = useState('');
  const [orderNumber, setOrderNumber] = useState('PCG-2026/0-K');

  // Vacation modal state
  const [showVacationForm, setShowVacationForm] = useState(false);
  const [vacType, setVacType] = useState<VacationRecord['type']>("Mehnat ta'tili");
  const [vacStart, setVacStart] = useState('2026-11-01');
  const [vacEnd, setVacEnd] = useState('2026-11-15');
  const [vacDays, setVacDays] = useState(15);
  const [vacReason, setVacReason] = useState('');

  if (!employee) return null;

  // Filter records related to this employee
  const empBonuses = bonusRecords.filter((b) => b.employeeId === employee.id);
  const empPromotions = promotionRecords.filter((p) => p.employeeId === employee.id);
  const empVacations = vacationRecords.filter((v) => v.employeeId === employee.id);
  const empSalaries = salaryRecords.filter((s) => s.employeeId === employee.id);

  // Financial calculations
  const grossSalary = employee.salary + Math.round(employee.salary * (employee.bonusRate / 100));
  const incomeTax = Math.round(grossSalary * 0.12);
  const netSalary = grossSalary - incomeTax;

  const handleCreateBonus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bonusReason.trim()) {
      alert("Iltimos, mukofot sababini ko'rsating");
      return;
    }
    addBonus({
      employeeId: employee.id,
      employeeName: employee.fullName,
      amount: Number(bonusAmount),
      reason: bonusReason,
      date: new Date().toISOString().split('T')[0],
      type: bonusType,
      approvedBy: branding.ceoName,
    });
    setShowBonusForm(false);
    setBonusReason('');
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosition.trim()) {
      alert("Yangi lavozim nomini kiriting");
      return;
    }
    addPromotion({
      employeeId: employee.id,
      employeeName: employee.fullName,
      previousPosition: employee.position,
      newPosition: newPosition,
      previousSalary: employee.salary,
      newSalary: Number(newSalary || employee.salary * 1.2),
      effectiveDate: new Date().toISOString().split('T')[0],
      orderNumber: orderNumber,
      reason: promoReason,
    });
    setShowPromoForm(false);
  };

  const handleCreateVacation = (e: React.FormEvent) => {
    e.preventDefault();
    addVacation({
      employeeId: employee.id,
      employeeName: employee.fullName,
      type: vacType,
      startDate: vacStart,
      endDate: vacEnd,
      daysCount: Number(vacDays),
      status: "Ko'rib chiqilmoqda",
      reason: vacReason,
    });
    setShowVacationForm(false);
  };

  const printBadge = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#080E21] border border-amber-500/30 shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header with PCG Branding */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0E1738] via-[#0B132B] to-[#070D1F] border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Logo size="md" variant="full" />
            <div className="hidden sm:block h-8 w-px bg-slate-700" />
            <div className="hidden sm:block">
              <span className="text-xs text-amber-400 font-bold tracking-wider uppercase">
                Xodimning rasmiy profili
              </span>
              <p className="text-xs text-slate-400 font-mono">ID: {employee.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(employee)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              Tahrirlash
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Hero Card of the Employee */}
        <div className="p-6 bg-slate-900/50 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={employee.avatar}
              alt={employee.fullName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/50 shadow-xl"
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
                {employee.fullName}
              </h2>
              <p className="text-sm font-semibold text-amber-400">
                {employee.position}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                <span>{employee.department}</span>
                <span>·</span>
                <span className="text-slate-300 font-medium">{employee.status}</span>
                <span>·</span>
                <span className="font-mono tabular-nums">{employee.phone}</span>
              </div>
            </div>
          </div>

          {/* Key numbers */}
          <div className="flex sm:flex-col items-end gap-1 text-right bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">
              Asosiy oylik
            </span>
            <span className="text-lg font-bold text-amber-300 font-mono tabular-nums">
              {employee.salary.toLocaleString('uz-UZ')} so‘m
            </span>
            <span className="text-[11px] text-emerald-400">
              +{employee.bonusRate}% KPI bonusi
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-[#080E21] border-b border-slate-800 flex gap-2 overflow-x-auto">
          {[
            { id: 'info', label: 'Umumiy ma’lumot' },
            { id: 'salary', label: 'Ish haqi & Mukofotlar', count: empBonuses.length },
            { id: 'promotions', label: 'Martaba tarixi', count: empPromotions.length },
            { id: 'vacations', label: 'Ta’tillar jadvali', count: empVacations.length },
            { id: 'badge', label: 'Xodim guvohnomasi (ID Card)' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === t.id
                  ? 'border-amber-400 text-amber-300 bg-amber-400/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{t.label}</span>
              {t.count !== undefined && t.count > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-400 text-[10px]">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: INFO */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                    Elektron pochta
                  </span>
                  <a
                    href={`mailto:${employee.email}`}
                    className="text-xs font-semibold text-slate-200 hover:text-amber-300 break-all"
                  >
                    {employee.email}
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                    Telefon raqami
                  </span>
                  <a
                    href={`tel:${employee.phone}`}
                    className="text-xs font-semibold text-slate-200 hover:text-amber-300 font-mono tabular-nums"
                  >
                    {employee.phone}
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                    Telegram profili
                  </span>
                  <span className="text-xs font-semibold text-amber-400 font-mono">
                    {employee.telegram || 'Ko‘rsatilmagan'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                    Tug‘ilgan kuni
                  </span>
                  <span className="text-xs font-semibold text-slate-200 font-mono tabular-nums">
                    {employee.birthDate}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                    Ishga qabul sanasi
                  </span>
                  <span className="text-xs font-semibold text-slate-200 font-mono tabular-nums">
                    {employee.hireDate}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                    Ta’til qoldig‘i
                  </span>
                  <span className="text-xs font-bold text-amber-300 font-mono tabular-nums">
                    {employee.vacationDaysLeft} ish kuni
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                    Pasport seriyasi
                  </span>
                  <span className="text-xs font-semibold text-slate-200 font-mono">
                    {employee.passportSeria}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                    JSHSHIR (PINFL)
                  </span>
                  <span className="text-xs font-semibold text-slate-200 font-mono tabular-nums">
                    {employee.jshshir}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                    LinkedIn
                  </span>
                  <span className="text-xs font-semibold text-blue-400 truncate block">
                    {employee.linkedin || 'Kiritilmagan'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                  Doimiy yashash manzili
                </span>
                <p className="text-xs text-slate-300">{employee.address}</p>
              </div>

              {employee.notes && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                    HR Eslatmalari
                  </span>
                  <p className="text-xs text-slate-300">{employee.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SALARY & BONUSES */}
          {activeTab === 'salary' && (
            <div className="space-y-6">
              {/* Financial Calculation Card */}
              <div className="glass-panel-gold rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Joriy oylik maosh hisob-kitobi (Standart model)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Asosiy maosh:</span>
                    <span className="font-bold text-white font-mono tabular-nums">
                      {employee.salary.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Rejali KPI bonusi:</span>
                    <span className="font-bold text-amber-300 font-mono tabular-nums">
                      +{(employee.salary * (employee.bonusRate / 100)).toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">JShDS soliq (12%):</span>
                    <span className="font-bold text-rose-300 font-mono tabular-nums">
                      -{incomeTax.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Qo‘lga tegadigan (Net):</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
                      {netSalary.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                </div>
              </div>

              {/* Action: Add Bonus */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    Berilgan mukofotlar va rag‘batlantirishlar
                  </h4>
                  <p className="text-xs text-slate-400">
                    Kompaniya buyruqlari asosida to‘langan premiyalar
                  </p>
                </div>
                <button
                  onClick={() => setShowBonusForm(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus size={14} />
                  <span>Yangi mukofot belgilash</span>
                </button>
              </div>

              {/* Bonus Form Modal / Drawer */}
              {showBonusForm && (
                <form
                  onSubmit={handleCreateBonus}
                  className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-4"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-amber-300">
                      Yangi mukofot buyrug‘i
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowBonusForm(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Mukofot summasi (so‘m)
                      </label>
                      <input
                        type="number"
                        min="100000"
                        step="100000"
                        required
                        value={bonusAmount}
                        onChange={(e) => setBonusAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-amber-300 font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Mukofot turi
                      </label>
                      <select
                        value={bonusType}
                        onChange={(e) => setBonusType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                      >
                        <option value="KPI mukofoti">KPI mukofoti</option>
                        <option value="Kvartal bonusi">Kvartal bonusi</option>
                        <option value="Bayramona mukofot">Bayramona mukofot</option>
                        <option value="Yillik bonus">Yillik bonus</option>
                        <option value="Loyiha bonusi">Loyiha bonusi</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-300 mb-1">
                        Mukofotlash asosi va sababi
                      </label>
                      <input
                        type="text"
                        required
                        value={bonusReason}
                        onChange={(e) => setBonusReason(e.target.value)}
                        placeholder="Masalan: PCG Tower loyihasini muvaffaqiyatli topshirgani uchun"
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBonusForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-400"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                    >
                      Mukofotni tasdiqlash
                    </button>
                  </div>
                </form>
              )}

              {/* Bonus List */}
              <div className="space-y-3">
                {empBonuses.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    Ushbu xodim uchun alohida mukofotlar hali kiritilmagan
                  </p>
                ) : (
                  empBonuses.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{b.type}</span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {b.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{b.reason}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Tasdiqladi: {b.approvedBy}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
                        +{b.amount.toLocaleString('uz-UZ')} so‘m
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PROMOTIONS */}
          {activeTab === 'promotions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    Karyera va lavozim tarixi
                  </h4>
                  <p className="text-xs text-slate-400">
                    PROJECT CITY GROUP tarkibidagi martaba o‘sishi dinamikasi
                  </p>
                </div>
                <button
                  onClick={() => setShowPromoForm(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus size={14} />
                  <span>Lavozimni ko‘tarish</span>
                </button>
              </div>

              {showPromoForm && (
                <form
                  onSubmit={handleCreatePromo}
                  className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-4"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-amber-300">
                      Yangi lavozim va maosh buyrug‘i
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPromoForm(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Yangi lavozim nomi *
                      </label>
                      <input
                        type="text"
                        required
                        value={newPosition}
                        onChange={(e) => setNewPosition(e.target.value)}
                        placeholder="Masalan: Bosh loyiha koordinatori"
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Yangi oylik maosh (so‘m) *
                      </label>
                      <input
                        type="number"
                        min="1000000"
                        step="500000"
                        required
                        value={newSalary || employee.salary}
                        onChange={(e) => setNewSalary(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-amber-300 font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Buyruq raqami (Kadrlar)
                      </label>
                      <input
                        type="text"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Ko‘tarish asosi
                      </label>
                      <input
                        type="text"
                        value={promoReason}
                        onChange={(e) => setPromoReason(e.target.value)}
                        placeholder="Muvaffaqiyatli ko‘rsatkichlar asosida"
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPromoForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-400"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                    >
                      Buyruqni tasdiqlash
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {empPromotions.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    Lavozim ko‘tarilishi bo‘yicha alohida buyruqlar mavjud emas
                  </p>
                ) : (
                  empPromotions.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">{p.orderNumber}</span>
                        <span className="text-slate-500 font-mono tabular-nums">
                          {p.effectiveDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="line-through text-slate-500">{p.previousPosition}</span>
                        <span className="text-amber-400 font-bold">→</span>
                        <span className="font-bold text-amber-300">{p.newPosition}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-400 pt-1 border-t border-slate-800">
                        <span>{p.reason}</span>
                        <span className="font-mono text-emerald-400 tabular-nums">
                          {p.previousSalary.toLocaleString('uz-UZ')} →{' '}
                          {p.newSalary.toLocaleString('uz-UZ')} so‘m
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: VACATIONS */}
          {activeTab === 'vacations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    Mehnat ta’tillari jadvali
                  </h4>
                  <p className="text-xs text-slate-400">
                    Qoldiq: <span className="text-amber-300 font-bold">{employee.vacationDaysLeft} kun</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowVacationForm(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus size={14} />
                  <span>Ta’til arizasi kiritish</span>
                </button>
              </div>

              {showVacationForm && (
                <form
                  onSubmit={handleCreateVacation}
                  className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-4"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-amber-300">
                      Yangi ta’til so‘rovi
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowVacationForm(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Ta’til turi
                      </label>
                      <select
                        value={vacType}
                        onChange={(e) => setVacType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                      >
                        <option value="Mehnat ta'tili">Mehnat ta’tili</option>
                        <option value="Oyliksiz ta'til">Oyliksiz ta’til</option>
                        <option value="Kasallik ta'tili">Kasallik ta’tili</option>
                        <option value="O'quv ta'tili">O‘quv ta’tili</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Muddat (kunlar soni)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={vacDays}
                        onChange={(e) => setVacDays(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Boshlanish sanasi
                      </label>
                      <input
                        type="date"
                        required
                        value={vacStart}
                        onChange={(e) => setVacStart(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Tugash sanasi
                      </label>
                      <input
                        type="date"
                        required
                        value={vacEnd}
                        onChange={(e) => setVacEnd(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono tabular-nums"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-300 mb-1">
                        Sababi / Asos
                      </label>
                      <input
                        type="text"
                        value={vacReason}
                        onChange={(e) => setVacReason(e.target.value)}
                        placeholder="Rejali mehnat ta’tili..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowVacationForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-400"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                    >
                      So‘rovni yuborish
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {empVacations.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    Ta’tillar qaydnomasi mavjud emas
                  </p>
                ) : (
                  empVacations.map((v) => (
                    <div
                      key={v.id}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{v.type}</span>
                          <span className="text-slate-400 font-mono text-[11px] tabular-nums">
                            {v.startDate} — {v.endDate} ({v.daysCount} kun)
                          </span>
                        </div>
                        {v.reason && <p className="text-xs text-slate-400 mt-1">{v.reason}</p>}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          v.status === 'Tasdiqlangan'
                            ? 'text-emerald-400'
                            : v.status === "Ko'rib chiqilmoqda"
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PRINTABLE ID BADGE */}
          {activeTab === 'badge' && (
            <div className="space-y-6 flex flex-col items-center">
              <div className="flex items-center justify-between w-full max-w-md pb-2">
                <span className="text-xs text-slate-400">
                  Rasmiy xizmat guvohnomasi (Chop etish uchun tayyor)
                </span>
                <button
                  onClick={printBadge}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer size={14} />
                  <span>Chop etish</span>
                </button>
              </div>

              {/* Printable ID Card Container */}
              <div className="w-80 rounded-2xl bg-gradient-to-b from-[#0F1E4A] via-[#0B132B] to-[#070D1F] border-2 border-amber-400/40 p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden print-include">
                {/* Metallic holographic top line */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-300 via-white to-amber-500" />

                {/* Company Logo Header */}
                <div className="w-full flex items-center justify-between pb-4 border-b border-white/15">
                  <Logo size="xs" variant="symbol" />
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-white font-heading tracking-wider">
                      {branding.companyName}
                    </span>
                    <p className="text-[9px] text-amber-300 font-mono tracking-widest uppercase">
                      XIZMAT GUVOHNOMASI
                    </p>
                  </div>
                </div>

                {/* Photo with double frame */}
                <div className="my-5 relative">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-400/70 p-0.5 bg-gradient-to-tr from-amber-400 to-slate-200 shadow-xl">
                    <img
                      src={employee.avatar}
                      alt={employee.fullName}
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-1 rounded-full bg-[#0B132B] border border-amber-400/60 text-amber-400">
                    <ShieldCheck size={14} />
                  </div>
                </div>

                {/* Name & Position */}
                <h3 className="text-base font-extrabold text-white font-heading leading-tight">
                  {employee.fullName}
                </h3>
                <p className="text-xs font-semibold text-amber-300 mt-1">
                  {employee.position}
                </p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {employee.department}
                </p>

                {/* Meta details */}
                <div className="w-full grid grid-cols-2 gap-2 text-left my-4 pt-3 border-t border-white/10 text-[10px]">
                  <div>
                    <span className="text-slate-400 block">ID RAQAM:</span>
                    <span className="text-white font-mono font-bold">{employee.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">AMAL QILISH:</span>
                    <span className="text-white font-mono font-bold">2027-12-31</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">JSHSHIR:</span>
                    <span className="text-white font-mono">{employee.jshshir.slice(0, 10)}...</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">TIZIM:</span>
                    <span className="text-emerald-400 font-bold">PCG PASS</span>
                  </div>
                </div>

                {/* QR Code and Verification Barcode */}
                <div className="w-full pt-2 flex items-center justify-between border-t border-white/10">
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] text-slate-400">RASMIY MUHR</span>
                    <span className="text-[9px] font-bold text-amber-400">TASDIQLANDI</span>
                  </div>
                  <div className="w-10 h-10 bg-white p-1 rounded-lg">
                    {/* SVG QR placeholder */}
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-slate-900">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 2h2v2h-2v-2zm-4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm0 6h2v2h-2v-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
