import React, { useState } from 'react';
import { CalendarCheck, Plus, Clock, CheckCircle2, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { VacationRecord, VacationType } from '../../types';

export const VacationsView: React.FC = () => {
  const { vacationRecords, updateVacationStatus, employees, addVacation } = useData();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [vacType, setVacType] = useState<VacationType>("Mehnat ta'tili");
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-15');
  const [daysCount, setDaysCount] = useState(15);
  const [reason, setReason] = useState('');

  const selectedEmployee = employees.find((e) => e.id === selectedEmpId);

  const filtered = vacationRecords.filter((v) => {
    return filterStatus === 'all' || v.status === filterStatus;
  });

  const activeOnLeaveCount = employees.filter((e) => e.status === "Ta'tilda").length;
  const pendingCount = vacationRecords.filter((v) => v.status === "Ko'rib chiqilmoqda").length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    addVacation({
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.fullName,
      type: vacType,
      startDate,
      endDate,
      daysCount: Number(daysCount),
      status: "Ko'rib chiqilmoqda",
      reason: reason || "Rejali yillik mehnat ta'tili jadvali asosida",
    });

    setShowModal(false);
    setReason('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white font-heading">
            Mehnat ta’tillari grafigi va arizalari
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            PROJECT CITY GROUP xodimlarining dam olish, kasallik va o‘quv ta’tillari hisobi
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={16} strokeWidth={3} />
          <span>Ta’til arizasi kiritish</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Hozirda ta’tildagilar
          </span>
          <div className="text-2xl font-extrabold text-amber-300 font-mono tabular-nums">
            {activeOnLeaveCount} nafar
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Faol ta’til muddatida</p>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Ko‘rib chiqilayotgan arizalar
          </span>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {pendingCount} ta
          </div>
          <p className="text-[11px] text-slate-500 mt-1">HR tasdig‘i kutilmoqda</p>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Jami qaydnomalar
          </span>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {vacationRecords.length} ta
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Yillik reja bo‘yicha</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs overflow-x-auto">
        <span className="text-slate-400 font-medium">Holat bo‘yicha:</span>
        {['all', "Ko'rib chiqilmoqda", 'Tasdiqlangan', 'Yakunlangan', 'Rad etilgan'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterStatus === st
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {st === 'all' ? 'Barchasi' : st}
          </button>
        ))}
      </div>

      {/* Vacation List */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Xodim</th>
                <th className="py-3.5 px-4">Ta’til turi</th>
                <th className="py-3.5 px-4">Boshlanish — Tugash</th>
                <th className="py-3.5 px-4 text-center">Davomiyligi</th>
                <th className="py-3.5 px-4">Sababi / Asos</th>
                <th className="py-3.5 px-4 text-center">Holat</th>
                <th className="py-3.5 px-4 text-right">Boshqarish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((vac) => (
                <tr key={vac.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {vac.employeeName}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-amber-300/90">
                    {vac.type}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300 tabular-nums">
                    {vac.startDate} → {vac.endDate}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-white tabular-nums">
                    {vac.daysCount} kun
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                    {vac.reason || 'Reja asosida'}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-semibold ${
                        vac.status === 'Tasdiqlangan'
                          ? 'text-emerald-400'
                          : vac.status === "Ko'rib chiqilmoqda"
                          ? 'text-amber-400'
                          : vac.status === 'Yakunlangan'
                          ? 'text-slate-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {vac.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {vac.status === "Ko'rib chiqilmoqda" && (
                        <>
                          <button
                            onClick={() => updateVacationStatus(vac.id, 'Tasdiqlangan')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-[11px] transition-colors"
                          >
                            Tasdiqlash
                          </button>
                          <button
                            onClick={() => updateVacationStatus(vac.id, 'Rad etilgan')}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-[11px] transition-colors"
                          >
                            Rad etish
                          </button>
                        </>
                      )}
                      {vac.status === 'Tasdiqlangan' && (
                        <button
                          onClick={() => updateVacationStatus(vac.id, 'Yakunlangan')}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                        >
                          Yakunlash
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Vacation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#091024] border border-amber-500/30 shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white font-heading">
                Yangi ta’til arizasi kiritish
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Xodim</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.vacationDaysLeft} kun qoldiq)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Ta’til turi</label>
                <select
                  value={vacType}
                  onChange={(e) => setVacType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="Mehnat ta'tili">Mehnat ta’tili</option>
                  <option value="Oyliksiz ta'til">Oyliksiz ta’til</option>
                  <option value="Kasallik ta'tili">Kasallik ta’tili</option>
                  <option value="O'quv ta'tili">O‘quv ta’tili</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Boshlanish sanasi</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Tugash sanasi</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Kunlar soni</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={daysCount}
                  onChange={(e) => setDaysCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-300 font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Sababi / Asos</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Yillik rejalashtirilgan ta’til..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Arizani kiritish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
