import React, { useState } from 'react';
import { TrendingUp, Plus, Award, Calendar, CheckCircle2, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PromotionRecord } from '../../types';

export const PromotionsView: React.FC = () => {
  const { promotionRecords, employees, addPromotion } = useData();

  const [showModal, setShowModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [newPosition, setNewPosition] = useState('');
  const [newSalary, setNewSalary] = useState(20000000);
  const [orderNumber, setOrderNumber] = useState('PCG-2026/0-K');
  const [reason, setReason] = useState('');

  const selectedEmployee = employees.find((e) => e.id === selectedEmpId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !newPosition.trim()) return;

    addPromotion({
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.fullName,
      previousPosition: selectedEmployee.position,
      newPosition: newPosition,
      previousSalary: selectedEmployee.salary,
      newSalary: Number(newSalary),
      effectiveDate: new Date().toISOString().split('T')[0],
      orderNumber: orderNumber,
      reason: reason || "Yillik samaradorlik ko'rsatkichlari asosida lavozim ko'tarilishi",
    });

    setShowModal(false);
    setNewPosition('');
    setReason('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white font-heading">
            Martaba va Lavozim ko‘tarilishi tarixi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            PROJECT CITY GROUP xodimlarining xizmat pog‘onalari va maosh o‘sishi hisobi
          </p>
        </div>

        <button
          onClick={() => {
            if (selectedEmployee) setNewSalary(Math.round(selectedEmployee.salary * 1.2));
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={16} strokeWidth={3} />
          <span>Lavozimni ko‘tarish</span>
        </button>
      </div>

      {/* Promotion KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Jami qayd etilgan o‘sishlar
          </span>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {promotionRecords.length} ta
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Rasmiy buyruqlar asosida</p>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            O‘rtacha maosh o‘sishi
          </span>
          <div className="text-2xl font-extrabold text-amber-300 font-mono tabular-nums">
            +28.5%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Karyera o‘sishi hisobiga</p>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            So‘nggi buyruq
          </span>
          <div className="text-sm font-bold text-emerald-400 truncate">
            {promotionRecords[0]?.employeeName || 'Mavjud emas'}
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            {promotionRecords[0]?.effectiveDate}
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider">
          Rasmiy buyruqlar va o‘zgarishlar xronologiyasi
        </h3>

        <div className="space-y-4 pt-2">
          {promotionRecords.map((promo) => {
            const increment = promo.newSalary - promo.previousSalary;
            const percent = Math.round((increment / promo.previousSalary) * 100);

            return (
              <div
                key={promo.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">
                        {promo.employeeName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="font-mono text-amber-400 font-semibold">{promo.orderNumber}</span>
                        <span>·</span>
                        <span className="font-mono">{promo.effectiveDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 font-mono tabular-nums">
                      +{percent}% o‘sish (+{increment.toLocaleString('uz-UZ')} so‘m)
                    </span>
                    <p className="text-[10px] text-slate-500">Oylik maosh indeksi</p>
                  </div>
                </div>

                {/* Transition flow */}
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 line-through">{promo.previousPosition}</span>
                    <span className="text-amber-400 font-bold">→</span>
                    <span className="text-white font-bold">{promo.newPosition}</span>
                  </div>
                  <div className="font-mono text-slate-300 tabular-nums">
                    {promo.previousSalary.toLocaleString('uz-UZ')} →{' '}
                    <span className="text-amber-300 font-bold">{promo.newSalary.toLocaleString('uz-UZ')} so‘m</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 italic">
                  Asos: {promo.reason}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Promotion Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#091024] border border-amber-500/30 shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white font-heading">
                Lavozimni ko‘tarish buyrug‘i
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Xodim</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => {
                    setSelectedEmpId(e.target.value);
                    const emp = employees.find((emp) => emp.id === e.target.value);
                    if (emp) setNewSalary(Math.round(emp.salary * 1.25));
                  }}
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
                <label className="block text-xs text-slate-300 mb-1">Yangi lavozim *</label>
                <input
                  type="text"
                  required
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  placeholder="Masalan: Bosh loyiha direktori"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Yangi maosh (so‘m) *</label>
                <input
                  type="number"
                  min="1000000"
                  step="500000"
                  required
                  value={newSalary}
                  onChange={(e) => setNewSalary(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-300 font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Kadrlar buyruq raqami</label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">O‘sish asosi (Sababi)</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Loyihaviy rejalarni yuksak darajada bajarganligi..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white resize-none"
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
                  Buyruqni tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
