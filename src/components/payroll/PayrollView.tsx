import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  Printer,
  CheckCircle2,
  Clock,
  Plus,
  FileText,
  Filter,
  X,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { SalaryRecord, BonusRecord } from '../../types';
import { useData } from '../../context/DataContext';
import { useBranding } from '../../context/BrandingContext';
import { Logo } from '../common/Logo';

export const PayrollView: React.FC = () => {
  const { salaryRecords, updateSalaryStatus, employees, addBonus, bonusRecords } = useData();
  const { branding } = useBranding();

  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedSlipRecord, setSelectedSlipRecord] = useState<SalaryRecord | null>(null);

  // Bonus form modal state
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [bonusAmount, setBonusAmount] = useState(2500000);
  const [bonusReason, setBonusReason] = useState('');
  const [bonusType, setBonusType] = useState<BonusRecord['type']>('KPI mukofoti');

  const filteredRecords = salaryRecords.filter((rec) => {
    const matchesMonth = rec.month === selectedMonth;
    const matchesStatus = filterStatus === 'all' || rec.status === filterStatus;
    return matchesMonth && matchesStatus;
  });

  // Aggregates
  const totalBase = filteredRecords.reduce((sum, r) => sum + r.baseSalary, 0);
  const totalBonus = filteredRecords.reduce((sum, r) => sum + r.bonus, 0);
  const totalTax = filteredRecords.reduce((sum, r) => sum + r.tax, 0);
  const totalNet = filteredRecords.reduce((sum, r) => sum + r.netSalary, 0);
  const totalPaid = filteredRecords
    .filter((r) => r.status === "To'langan")
    .reduce((sum, r) => sum + r.netSalary, 0);

  const handleAddBonus = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === selectedEmpId);
    if (!emp) return;

    addBonus({
      employeeId: emp.id,
      employeeName: emp.fullName,
      amount: Number(bonusAmount),
      reason: bonusReason,
      date: new Date().toISOString().split('T')[0],
      type: bonusType,
      approvedBy: branding.ceoName,
    });
    setShowBonusModal(false);
    setBonusReason('');
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top action bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white font-heading">
            Ish haqi va Mukofotlar jamg‘armasi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            PROJECT CITY GROUP xodimlariga hisoblangan oylik to‘lovlar va daromad soliqlari
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
          >
            <option value="2026-10">2026 Oktyabr</option>
            <option value="2026-09">2026 Sentyabr</option>
            <option value="2026-08">2026 Avgust</option>
          </select>

          <button
            onClick={() => setShowBonusModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Mukofot belgilash</span>
          </button>
        </div>
      </div>

      {/* Aggregate Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Asosiy oklad fondi
          </span>
          <div className="text-xl font-bold text-white font-mono tabular-nums">
            {totalBase.toLocaleString('uz-UZ')} <span className="text-xs font-normal text-slate-400">so‘m</span>
          </div>
          <p className="text-[11px] text-slate-500">{filteredRecords.length} nafar xodim hisobi</p>
        </div>

        <div className="glass-card rounded-2xl p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Hisoblangan mukofotlar
          </span>
          <div className="text-xl font-bold text-amber-300 font-mono tabular-nums">
            +{totalBonus.toLocaleString('uz-UZ')} <span className="text-xs font-normal text-slate-400">so‘m</span>
          </div>
          <p className="text-[11px] text-amber-400/80">KPI va loyiha bonuslari</p>
        </div>

        <div className="glass-card rounded-2xl p-4 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            JShDS daromad solig‘i (12%)
          </span>
          <div className="text-xl font-bold text-rose-300 font-mono tabular-nums">
            -{totalTax.toLocaleString('uz-UZ')} <span className="text-xs font-normal text-slate-400">so‘m</span>
          </div>
          <p className="text-[11px] text-slate-500">Davlat byudjetiga to‘lov</p>
        </div>

        <div className="glass-panel-gold rounded-2xl p-4 space-y-1">
          <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
            Sof to‘lov (Net fond)
          </span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono tabular-nums">
            {totalNet.toLocaleString('uz-UZ')} <span className="text-xs font-normal text-slate-400">so‘m</span>
          </div>
          <p className="text-[11px] text-slate-300">
            To‘langan: {Math.round((totalPaid / (totalNet || 1)) * 100)}%
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        <span className="text-slate-400 font-medium">To‘lov holati:</span>
        {['all', "To'langan", 'Kutilmoqda', 'Tasdiqlangan'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterStatus === st
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {st === 'all' ? 'Barchasi' : st}
          </button>
        ))}
      </div>

      {/* Payroll Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Xodim / Lavozim</th>
                <th className="py-3.5 px-4 text-right">Asosiy oklad</th>
                <th className="py-3.5 px-4 text-right">Mukofot</th>
                <th className="py-3.5 px-4 text-right">Soliq (12%)</th>
                <th className="py-3.5 px-4 text-right">Sof maosh (Net)</th>
                <th className="py-3.5 px-4 text-center">Holat</th>
                <th className="py-3.5 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-bold text-white">{rec.employeeName}</p>
                      <p className="text-[11px] text-amber-400/90">{rec.position}</p>
                      <span className="text-[10px] text-slate-500">{rec.department}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    {rec.baseSalary.toLocaleString('uz-UZ')} so‘m
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-amber-300 tabular-nums font-semibold">
                    +{rec.bonus.toLocaleString('uz-UZ')} so‘m
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-rose-300 tabular-nums">
                    -{rec.tax.toLocaleString('uz-UZ')} so‘m
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-400 tabular-nums font-bold text-sm">
                    {rec.netSalary.toLocaleString('uz-UZ')} so‘m
                  </td>
                  <td className="py-3 px-4 text-center">
                    <select
                      value={rec.status}
                      onChange={(e) =>
                        updateSalaryStatus(rec.id, e.target.value as SalaryRecord['status'])
                      }
                      className={`px-2 py-1 rounded-lg text-xs font-semibold border ${
                        rec.status === "To'langan"
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : rec.status === 'Tasdiqlangan'
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      <option value="To'langan">To‘langan</option>
                      <option value="Kutilmoqda">Kutilmoqda</option>
                      <option value="Tasdiqlangan">Tasdiqlangan</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedSlipRecord(rec)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                      title="Maosh varaqasini ko‘rish"
                    >
                      <FileText size={13} />
                      <span>Varaqa</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bonus Award Modal */}
      {showBonusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#091024] border border-amber-500/30 shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white font-heading">
                Yangi mukofot belgilash
              </h3>
              <button
                onClick={() => setShowBonusModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddBonus} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Xodimni tanlang
                </label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.position})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Mukofot turi
                </label>
                <select
                  value={bonusType}
                  onChange={(e) => setBonusType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="KPI mukofoti">KPI mukofoti</option>
                  <option value="Kvartal bonusi">Kvartal bonusi</option>
                  <option value="Bayramona mukofot">Bayramona mukofot</option>
                  <option value="Yillik bonus">Yillik bonus</option>
                  <option value="Loyiha bonusi">Loyiha bonusi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Mukofot miqdori (so‘m)
                </label>
                <input
                  type="number"
                  min="500000"
                  step="500000"
                  required
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-amber-300 font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Mukofotlash asosi (Sababi)
                </label>
                <textarea
                  rows={2}
                  required
                  value={bonusReason}
                  onChange={(e) => setBonusReason(e.target.value)}
                  placeholder="Loyihani muddatidan oldin topshirgani uchun..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBonusModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Mukofotni tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Payslip Modal */}
      {selectedSlipRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white text-slate-900 p-8 shadow-2xl border border-slate-200 print-include">
            <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
              <div className="flex items-center gap-3">
                <Logo size="md" variant="light" />
              </div>
              <div className="text-right">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  ISH HAQI HISOB VARAQASI
                </h3>
                <p className="text-xs text-slate-600 font-mono mt-0.5">
                  Davr: {selectedSlipRecord.month}
                </p>
                <button
                  onClick={() => setSelectedSlipRecord(null)}
                  className="mt-2 text-slate-400 hover:text-slate-800 text-xs no-print"
                >
                  Yopish
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
              <div>
                <span className="text-slate-500 block">Xodim F.I.Sh.:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedSlipRecord.employeeName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Lavozimi va Bo‘limi:</span>
                <span className="font-semibold text-slate-900">
                  {selectedSlipRecord.position} ({selectedSlipRecord.department})
                </span>
              </div>
            </div>

            {/* Breakdown table */}
            <table className="w-full text-xs my-4 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="py-2 px-3 text-left">Ko‘rsatkich nomi</th>
                  <th className="py-2 px-3 text-right">Summa (so‘m)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td className="py-2 px-3">Asosiy lavozim maoshi (Oklad)</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">
                    {selectedSlipRecord.baseSalary.toLocaleString('uz-UZ')}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Mukofot va qo‘shimcha to‘lovlar (KPI)</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold text-emerald-700">
                    +{selectedSlipRecord.bonus.toLocaleString('uz-UZ')}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3">JAMI HISOBLANGAN (Gross)</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">
                    {(selectedSlipRecord.baseSalary + selectedSlipRecord.bonus).toLocaleString('uz-UZ')}
                  </td>
                </tr>
                <tr className="text-rose-700">
                  <td className="py-2 px-3">Jismoniy shaxslar daromad solig‘i (12%)</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">
                    -{selectedSlipRecord.tax.toLocaleString('uz-UZ')}
                  </td>
                </tr>
                <tr className="bg-amber-50 font-bold text-slate-950 text-sm border-t-2 border-slate-900">
                  <td className="py-3 px-3">QO‘LGA TEGADIGAN SOF SUMMA (Net):</td>
                  <td className="py-3 px-3 text-right font-mono">
                    {selectedSlipRecord.netSalary.toLocaleString('uz-UZ')} so‘m
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Signature & Stamp area */}
            <div className="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-slate-300 text-xs">
              <div>
                <p className="text-slate-600">Bosh buxgalter / CFO:</p>
                <div className="h-10 border-b border-dashed border-slate-400 mt-2" />
                <p className="text-[10px] text-slate-500 mt-1">Imzo va sana</p>
              </div>
              <div className="text-right">
                <p className="text-slate-600">Xodim imzosi:</p>
                <div className="h-10 border-b border-dashed border-slate-400 mt-2" />
                <p className="text-[10px] text-slate-500 mt-1">Imzo va sana</p>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3 no-print">
              <button
                onClick={() => setSelectedSlipRecord(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-semibold"
              >
                Yopish
              </button>
              <button
                onClick={handlePrintSlip}
                className="px-5 py-2 rounded-xl bg-[#0B132B] text-white text-xs font-bold flex items-center gap-2"
              >
                <Printer size={15} />
                <span>Varaqani chop etish</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
