import React, { useState, useEffect } from 'react';
import { X, Save, User, Building, Phone, Mail, Calendar, CreditCard, DollarSign } from 'lucide-react';
import { Employee, EmployeeStatus } from '../../types';
import { useData } from '../../context/DataContext';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Employee | null;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  employeeToEdit,
}) => {
  const { departments, addEmployee, updateEmployee } = useData();

  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    department: departments[0] || 'Qurilish va Muhandislik',
    email: '',
    phone: '+998 ',
    telegram: '',
    linkedin: '',
    birthDate: '1995-01-01',
    hireDate: '2024-01-01',
    status: 'Faol' as EmployeeStatus,
    salary: 15000000,
    bonusRate: 10,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    gender: 'Erkak' as 'Erkak' | 'Ayol',
    address: 'Toshkent shahri',
    passportSeria: 'AA 1234567',
    jshshir: '31234567890123',
    vacationDaysLeft: 18,
    notes: '',
  });

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        fullName: employeeToEdit.fullName,
        position: employeeToEdit.position,
        department: employeeToEdit.department,
        email: employeeToEdit.email,
        phone: employeeToEdit.phone,
        telegram: employeeToEdit.telegram || '',
        linkedin: employeeToEdit.linkedin || '',
        birthDate: employeeToEdit.birthDate,
        hireDate: employeeToEdit.hireDate,
        status: employeeToEdit.status,
        salary: employeeToEdit.salary,
        bonusRate: employeeToEdit.bonusRate,
        avatar: employeeToEdit.avatar,
        gender: employeeToEdit.gender,
        address: employeeToEdit.address,
        passportSeria: employeeToEdit.passportSeria,
        jshshir: employeeToEdit.jshshir,
        vacationDaysLeft: employeeToEdit.vacationDaysLeft,
        notes: employeeToEdit.notes || '',
      });
    } else {
      setFormData({
        fullName: '',
        position: '',
        department: departments[0] || 'Qurilish va Muhandislik',
        email: '',
        phone: '+998 ',
        telegram: '',
        linkedin: '',
        birthDate: '1995-01-01',
        hireDate: new Date().toISOString().split('T')[0],
        status: 'Faol',
        salary: 15000000,
        bonusRate: 10,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        gender: 'Erkak',
        address: 'Toshkent shahri',
        passportSeria: 'AA 1234567',
        jshshir: '31234567890123',
        vacationDaysLeft: 18,
        notes: '',
      });
    }
  }, [employeeToEdit, departments, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.position.trim()) {
      alert('Iltimos, xodimning to‘liq ismi va lavozimini kiriting.');
      return;
    }

    if (employeeToEdit) {
      updateEmployee(employeeToEdit.id, formData);
    } else {
      addEmployee(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#091024] border border-amber-500/30 shadow-2xl p-6 sm:p-8 my-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white font-heading">
              {employeeToEdit ? "Xodim ma’lumotlarini tahrirlash" : "Yangi xodim qo‘shish"}
            </h3>
            <p className="text-xs text-amber-400/90 mt-0.5">
              PROJECT CITY GROUP · Kadrlar hisoboti kartochkasi
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-5">
          {/* Section 1: Asosiy ma'lumotlar */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              1. Shaxsiy va xizmat ma’lumotlari
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  To‘liq ismi (F.I.Sh.) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Masalan: Aliyev Bobur Baxtiyorovich"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Lavozimi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Masalan: Katta muhandis-konstruktor"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Bo‘limi *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Holati
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as EmployeeStatus })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="Faol">Faol</option>
                  <option value="Ta'tilda">Ta’tilda</option>
                  <option value="Sinov muddatida">Sinov muddatida</option>
                  <option value="Nofaol">Nofaol</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Jinsi
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value as 'Erkak' | 'Ayol' })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="Erkak">Erkak</option>
                  <option value="Ayol">Ayol</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Avatar / Surat URL
                </label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Moliyaviy ma'lumotlar */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              2. Ish haqi va reja
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Oylik maosh (so‘mda) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="100000"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-amber-300 font-mono focus:border-amber-400 focus:outline-none tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  KPI mukofot ulushi (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.bonusRate}
                  onChange={(e) => setFormData({ ...formData, bonusRate: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono focus:border-amber-400 focus:outline-none tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Yillik ta’til qoldig‘i (kun)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.vacationDaysLeft}
                  onChange={(e) =>
                    setFormData({ ...formData, vacationDaysLeft: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono focus:border-amber-400 focus:outline-none tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Aloqa va Ijtimoiy tarmoqlar */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              3. Bog‘lanish va ijtimoiy profillar
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Telefon raqami *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+998 (90) 123-45-67"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Elektron pochta (Email) *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nomi@projectcitygroup.uz"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Telegram profili
                </label>
                <input
                  type="text"
                  value={formData.telegram}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  placeholder="@username"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  LinkedIn havolasi
                </label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="linkedin.com/in/username"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Rasmiy sanalar va hujjatlar */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              4. Sanalar va rasmiy hujjatlar
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tug‘ilgan sanasi *
                </label>
                <input
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ishga qabul sanasi *
                </label>
                <input
                  type="date"
                  required
                  value={formData.hireDate}
                  onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Pasport seriyasi va raqami
                </label>
                <input
                  type="text"
                  value={formData.passportSeria}
                  onChange={(e) => setFormData({ ...formData, passportSeria: e.target.value })}
                  placeholder="AA 1234567"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  JSHSHIR (PINFL - 14 raqam)
                </label>
                <input
                  type="text"
                  value={formData.jshshir}
                  onChange={(e) => setFormData({ ...formData, jshshir: e.target.value })}
                  placeholder="30000000000000"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none font-mono tabular-nums"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Doimiy yashash manzili
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Toshkent sh., Mirobod tumani..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Eslatmalar / Izoh
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Xodim bo‘yicha qo‘shimcha tavsif yoki yutuqlar..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs sm:text-sm transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Save size={16} />
              <span>Saqlash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
