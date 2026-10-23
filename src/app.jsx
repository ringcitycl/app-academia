import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  ChevronRight,
  TrendingUp,
  UserCheck,
  DollarSign,
  BookOpen,
  Filter,
  Receipt,
  Download,
  Phone,
  Mail,
  Smartphone,
  Maximize2,
  Minimize2,
  Check,
  X,
  Edit,
  Trash2,
  ArrowUpRight,
  Bell,
  Sparkles
} from 'lucide-react';

// Initial Mock Data
const initialStudents = [
  { id: 1, name: 'Sofía Martínez', phone: '+56 9 1234 5678', email: 'sofia.m@gmail.com', status: 'Activo', paymentStatus: 'Al día', plan: 'Plan Mensual Completo', lastPaymentDate: '2026-10-01' },
  { id: 2, name: 'Mateo Hernández', phone: '+56 9 8765 4321', email: 'mateo.h@gmail.com', status: 'Activo', paymentStatus: 'Pendiente', plan: '3 Días por Semana', lastPaymentDate: '2026-09-15' },
  { id: 3, name: 'Valentina López', phone: '+56 9 5555 1234', email: 'valen.lopez@gmail.com', status: 'Activo', paymentStatus: 'Al día', plan: 'Plan Vip Personalizado', lastPaymentDate: '2026-10-05' },
  { id: 4, name: 'Lucas Silva', phone: '+56 9 4444 3322', email: 'lucas.silva@outlook.com', status: 'Pendiente', paymentStatus: 'Vencido', plan: 'Plan Básico 2D', lastPaymentDate: '2026-08-20' },
  { id: 5, name: 'Camila Torres', phone: '+56 9 9988 7766', email: 'cami.torres@gmail.com', status: 'Inactivo', paymentStatus: 'Vencido', plan: 'Plan Mensual Completo', lastPaymentDate: '2026-07-10' },
  { id: 6, name: 'Diego Ramírez', phone: '+56 9 2233 4455', email: 'diego.r@gmail.com', status: 'Activo', paymentStatus: 'Al día', plan: '3 Días por Semana', lastPaymentDate: '2026-10-12' },
];

const initialClasses = [
  { id: 101, title: 'Yoga & Mindfulness', time: '08:00 AM - 09:15 AM', instructor: 'Elena Rostova', room: 'Salón A', capacity: 15, enrolled: 12, days: 'Lun - Mié - Vie' },
  { id: 102, title: 'Cross Training Intenso', time: '10:00 AM - 11:00 AM', instructor: 'Carlos Mendoza', room: 'Zona Box', capacity: 20, enrolled: 18, days: 'Mar - Jue' },
  { id: 103, title: 'Pilates Reformer', time: '05:00 PM - 06:00 PM', instructor: 'Lucía Fernández', room: 'Salón B', capacity: 10, enrolled: 10, days: 'Lun - Mié' },
  { id: 104, title: 'Funcional Avanzado', time: '07:00 PM - 08:00 PM', instructor: 'Carlos Mendoza', room: 'Zona Box', capacity: 18, enrolled: 14, days: 'Todos los días' },
];

const initialPayments = [
  { id: 'PAY-1001', studentId: 1, studentName: 'Sofía Martínez', amount: 45000, date: '2026-10-01', method: 'Transferencia', concept: 'Mensualidad Octubre', status: 'Aprobado' },
  { id: 'PAY-1002', studentId: 3, studentName: 'Valentina López', amount: 65000, date: '2026-10-05', method: 'Tarjeta Crédito', concept: 'Plan VIP Octubre', status: 'Aprobado' },
  { id: 'PAY-1003', studentId: 6, studentName: 'Diego Ramírez', amount: 38000, date: '2026-10-12', method: 'Efectivo', concept: 'Cuota Mensual Octubre', status: 'Aprobado' },
  { id: 'PAY-1004', studentId: 2, studentName: 'Mateo Hernández', amount: 38000, date: '2026-09-15', method: 'Transferencia', concept: 'Mensualidad Septiembre', status: 'Aprobado' },
];

const initialAttendance = {
  '2026-10-23_101': { 1: 'asistio', 2: 'atraso', 3: 'asistio', 6: 'falto' },
  '2026-10-23_102': { 4: 'falto', 5: 'justificado' },
};

export default function App() {
  // Navigation & Frame settings
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, students, attendance, payments, classes
  const [isIphoneView, setIsIphoneView] = useState(true);

  // App Data (Loaded from localStorage if exists)
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('ac_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('ac_classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('ac_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('ac_attendance');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  // State Sync
  useEffect(() => {
    localStorage.setItem('ac_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ac_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('ac_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('ac_attendance', JSON.stringify(attendance));
  }, [attendance]);

  // Attendance Controls
  const [selectedClassId, setSelectedClassId] = useState(101);
  const [selectedDate, setSelectedDate] = useState('2026-10-23');

  // Search & Filter States
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState('Todos');

  // Modals
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // New Student Form
  const [newStudent, setNewStudent] = useState({ name: '', phone: '', email: '', plan: 'Plan Mensual Completo', status: 'Activo' });
  // New Payment Form
  const [newPayment, setNewPayment] = useState({ studentId: '', amount: '', method: 'Transferencia', concept: 'Mensualidad Octubre' });
  // New Class Form
  const [newClass, setNewClass] = useState({ title: '', time: '09:00 AM - 10:00 AM', instructor: '', room: 'Salón A', capacity: 15, days: 'Lun - Mié' });

  // Calculations
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const activeStudents = students.filter((s) => s.status === 'Activo').length;
    const monthlyIncome = payments.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    // Global attendance calculation
    let totalRecords = 0;
    let presentCount = 0;
    Object.values(attendance).forEach((record) => {
      Object.values(record).forEach((val) => {
        totalRecords++;
        if (val === 'asistio' || val === 'atraso') presentCount++;
      });
    });

    const attendanceRate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 92;

    return {
      activeStudents,
      totalStudents,
      monthlyIncome,
      attendanceRate,
    };
  }, [students, payments, attendance]);

  // Handlers
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name) return;

    const created = {
      id: Date.now(),
      ...newStudent,
      paymentStatus: 'Al día',
      lastPaymentDate: new Date().toISOString().split('T')[0],
    };

    setStudents([created, ...students]);
    setNewStudent({ name: '', phone: '', email: '', plan: 'Plan Mensual Completo', status: 'Activo' });
    setIsAddStudentOpen(false);
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    if (!newPayment.studentId || !newPayment.amount) return;

    const student = students.find((s) => s.id === Number(newPayment.studentId));

    const createdPayment = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: Number(newPayment.studentId),
      studentName: student ? student.name : 'Alumno Registrado',
      amount: Number(newPayment.amount),
      date: new Date().toISOString().split('T')[0],
      method: newPayment.method,
      concept: newPayment.concept,
      status: 'Aprobado',
    };

    setPayments([createdPayment, ...payments]);

    // Update student payment status to 'Al día'
    if (student) {
      setStudents(
        students.map((s) => (s.id === student.id ? { ...s, paymentStatus: 'Al día', lastPaymentDate: createdPayment.date } : s))
      );
    }

    setNewPayment({ studentId: '', amount: '', method: 'Transferencia', concept: 'Mensualidad Octubre' });
    setIsAddPaymentOpen(false);
    setSelectedReceipt(createdPayment);
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClass.title) return;

    const created = {
      id: Date.now(),
      ...newClass,
      capacity: Number(newClass.capacity),
      enrolled: 0,
    };

    setClasses([...classes, created]);
    setNewClass({ title: '', time: '09:00 AM - 10:00 AM', instructor: '', room: 'Salón A', capacity: 15, days: 'Lun - Mié' });
    setIsAddClassOpen(false);
  };

  const handleAttendanceChange = (studentId, status) => {
    const key = `${selectedDate}_${selectedClassId}`;
    setAttendance((prev) => {
      const currentClassAttendance = prev[key] || {};
      return {
        ...prev,
        [key]: {
          ...currentClassAttendance,
          [studentId]: status,
        },
      };
    });
  };

  // Filtered Students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesFilter =
      studentFilter === 'Todos' ||
      (studentFilter === 'Activos' && student.status === 'Activo') ||
      (studentFilter === 'Inactivos' && student.status === 'Inactivo') ||
      (studentFilter === 'Pendientes' && student.paymentStatus === 'Pendiente') ||
      (studentFilter === 'Vencidos' && student.paymentStatus === 'Vencido');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col items-center justify-center p-0 md:p-6 transition-colors">
      {/* View Mode Toggle Bar (Desktop Mode) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-4xl mb-4 bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700/60 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600/20 text-indigo-400 p-2 rounded-xl">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">Academia Control - iOS Edition</h1>
            <p className="text-xs text-slate-400">Simulación interactiva de aplicación móvil</p>
          </div>
        </div>

        <button
          onClick={() => setIsIphoneView(!isIphoneView)}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-all border border-slate-600/50"
        >
          {isIphoneView ? (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              Ver Pantalla Completa
            </>
          ) : (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              Vista Mockup iPhone
            </>
          )}
        </button>
      </div>

      {/* Main Container Containerizing Mobile Mockup or Full Width */}
      <div
        className={`w-full transition-all duration-300 ${
          isIphoneView
            ? 'max-w-[410px] h-[850px] rounded-[48px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden relative bg-slate-950 flex flex-col ring-1 ring-slate-700/50'
            : 'max-w-4xl h-auto min-h-[820px] md:rounded-3xl border border-slate-800 bg-slate-950 flex flex-col overflow-hidden shadow-2xl'
        }`}
      >
        {/* Simulated iOS Status Bar */}
        <div className="w-full bg-slate-950 text-white px-6 pt-3 pb-1 flex items-center justify-between select-none z-30 shrink-0">
          <span className="text-xs font-semibold tracking-tight">09:41</span>
          <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto flex items-center justify-center border border-slate-800">
            <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800"></div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[10px] font-bold">5G</span>
            <div className="w-4 h-2.5 bg-slate-200 rounded-sm relative p-0.5">
              <div className="h-full bg-slate-950 rounded-xs w-full"></div>
            </div>
          </div>
        </div>

        {/* Dynamic iOS App Header */}
        <div className="px-5 pt-3 pb-3 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-20">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">Control Pro</p>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'students' && 'Alumnos'}
              {activeTab === 'attendance' && 'Asistencia'}
              {activeTab === 'payments' && 'Pagos & Recibos'}
              {activeTab === 'classes' && 'Clases & Horarios'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-semibold text-xs text-white shadow-md ring-2 ring-indigo-400/20">
              AC
            </div>
          </div>
        </div>

        {/* Scrollable View Content Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              {/* Stats Overview Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/80 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"></div>
                  <div className="flex items-center justify-between text-indigo-400 mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded-full">+12%</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.activeStudents}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Alumnos Activos</p>
                </div>

                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/80 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl"></div>
                  <div className="flex items-center justify-between text-emerald-400 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded-full">Mes</span>
                  </div>
                  <p className="text-xl font-bold text-white">${stats.monthlyIncome.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Ingresos del Mes</p>
                </div>

                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/80 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
                  <div className="flex items-center justify-between text-blue-400 mb-2">
                    <UserCheck className="w-4 h-4" />
                    <span className="text-[10px] font-semibold bg-blue-500/10 text-blue-300 px-1.5 py-0.5 rounded-full">Global</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.attendanceRate}%</p>
                  <p className="text-xs text-slate-400 mt-0.5">% Asistencia</p>
                </div>

                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/80 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"></div>
                  <div className="flex items-center justify-between text-purple-400 mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[10px] font-semibold bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded-full">Hoy</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{classes.length}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Clases Hoy</p>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-3.5 rounded-2xl border border-indigo-500/20 backdrop-blur-sm">
                <p className="text-xs font-semibold text-indigo-300 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Acciones Rápidas
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setIsAddStudentOpen(true)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-200 text-[11px] font-medium transition"
                  >
                    <Plus className="w-4 h-4 text-indigo-400 mb-1" />
                    Nuevo Alumno
                  </button>
                  <button
                    onClick={() => setIsAddPaymentOpen(true)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-200 text-[11px] font-medium transition"
                  >
                    <DollarSign className="w-4 h-4 text-emerald-400 mb-1" />
                    Cobrar Cuota
                  </button>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-200 text-[11px] font-medium transition"
                  >
                    <UserCheck className="w-4 h-4 text-blue-400 mb-1" />
                    Tomar Lista
                  </button>
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clases Destacadas</h3>
                  <button
                    onClick={() => setActiveTab('classes')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
                  >
                    Ver todas <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2">
                  {classes.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedClassId(item.id);
                        setActiveTab('attendance');
                      }}
                      className="bg-slate-900/80 hover:bg-slate-800/90 p-3 rounded-2xl border border-slate-800/80 transition flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white leading-tight">{item.title}</h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {item.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                          {item.enrolled}/{item.capacity} cupos
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">{item.instructor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Payments Alert Card */}
              <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-amber-200">Cobros Pendientes</h4>
                    <p className="text-[11px] text-amber-300/80">
                      {students.filter((s) => s.paymentStatus === 'Pendiente' || s.paymentStatus === 'Vencido').length} alumnos requieren atención
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition"
                >
                  Gestionar
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GESTIÓN DE ALUMNOS */}
          {activeTab === 'students' && (
            <div className="space-y-3">
              {/* Search & Actions Bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Buscar alumno..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-sm rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <button
                  onClick={() => setIsAddStudentOpen(true)}
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition shadow-lg shadow-indigo-600/20"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {['Todos', 'Activos', 'Inactivos', 'Pendientes', 'Vencidos'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStudentFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                      studentFilter === filter
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Student List */}
              <div className="space-y-2">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">No se encontraron alumnos con ese criterio</div>
                ) : (
                  filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center text-xs border border-indigo-500/20">
                            {student.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white leading-tight">{student.name}</h4>
                            <p className="text-xs text-slate-400">{student.plan}</p>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            student.status === 'Activo'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : student.status === 'Pendiente'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {student.status}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            {student.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              student.paymentStatus === 'Al día'
                                ? 'bg-emerald-950 text-emerald-400'
                                : 'bg-rose-950 text-rose-400'
                            }`}
                          >
                            {student.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CONTROL DE ASISTENCIA */}
          {activeTab === 'attendance' && (
            <div className="space-y-3">
              {/* Selectors Header */}
              <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Seleccionar Clase</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.title} ({cls.time})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Fecha</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
                    />
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Asistencia Registrada</span>
                    <p className="text-xs font-bold text-emerald-400">
                      {
                        Object.values(attendance[`${selectedDate}_${selectedClassId}`] || {}).filter(
                          (v) => v === 'asistio' || v === 'atraso'
                        ).length
                      }{' '}
                      / {students.length} Alumnos
                    </p>
                  </div>
                </div>
              </div>

              {/* Attendance Quick Legend */}
              <div className="flex items-center justify-around text-[10px] text-slate-400 bg-slate-900/50 p-2 rounded-xl border border-slate-800/50">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Asistió</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Atraso</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Justificado</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Faltó</span>
              </div>

              {/* Student Attendance List */}
              <div className="space-y-2">
                {students.map((student) => {
                  const currentRecord = (attendance[`${selectedDate}_${selectedClassId}`] || {})[student.id];

                  return (
                    <div
                      key={student.id}
                      className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-semibold text-white">{student.name}</h4>
                        <p className="text-[10px] text-slate-400">{student.plan}</p>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex items-center gap-1">
                        {/* Asistió */}
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'asistio')}
                          className={`p-1.5 rounded-lg border text-xs font-medium transition ${
                            currentRecord === 'asistio'
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                          title="Asistió"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        {/* Atraso */}
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'atraso')}
                          className={`p-1.5 rounded-lg border text-xs font-medium transition ${
                            currentRecord === 'atraso'
                              ? 'bg-amber-600 text-white border-amber-500'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                          title="Atraso"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>

                        {/* Justificado */}
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'justificado')}
                          className={`p-1.5 rounded-lg border text-xs font-medium transition ${
                            currentRecord === 'justificado'
                              ? 'bg-blue-600 text-white border-blue-500'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                          title="Justificado"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                        </button>

                        {/* Faltó */}
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'falto')}
                          className={`p-1.5 rounded-lg border text-xs font-medium transition ${
                            currentRecord === 'falto'
                              ? 'bg-rose-600 text-white border-rose-500'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                          title="Faltó"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: CONTROL DE PAGOS */}
          {activeTab === 'payments' && (
            <div className="space-y-3">
              {/* Add Payment CTA Header */}
              <div className="flex items-center justify-between bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="text-xs font-bold text-white">Ingresos del Mes</h3>
                  <p className="text-lg font-extrabold text-emerald-400">${stats.monthlyIncome.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setIsAddPaymentOpen(true)}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition"
                >
                  <Plus className="w-4 h-4" /> Registrar Pago
                </button>
              </div>

              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Historial de Transacciones</h4>
                <span className="text-[10px] text-slate-500">{payments.length} Registros</span>
              </div>

              {/* Payment Records List */}
              <div className="space-y-2">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{payment.studentName}</h4>
                        <p className="text-[10px] text-slate-400">{payment.concept} • {payment.method}</p>
                        <span className="text-[10px] text-slate-500">{payment.date}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">+${Number(payment.amount).toLocaleString()}</p>
                      <button
                        onClick={() => setSelectedReceipt(payment)}
                        className="text-[10px] text-indigo-400 hover:underline flex items-center justify-end gap-0.5 mt-0.5"
                      >
                        Ver Recibo <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CONTROL DE CLASES Y HORARIOS */}
          {activeTab === 'classes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Programación Semanal</h3>
                <button
                  onClick={() => setIsAddClassOpen(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition shadow-lg shadow-indigo-600/20"
                >
                  <Plus className="w-3.5 h-3.5" /> Nueva Clase
                </button>
              </div>

              {/* Class Cards */}
              <div className="space-y-2.5">
                {classes.map((cls) => (
                  <div key={cls.id} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/20">
                          {cls.days}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1.5">{cls.title}</h4>
                      </div>
                      <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700">
                        {cls.room}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Horario</span>
                        <span className="font-medium text-slate-200">{cls.time}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Instructor</span>
                        <span className="font-medium text-slate-200">{cls.instructor}</span>
                      </div>
                    </div>

                    {/* Capacity Indicator Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Ocupación de alumnos</span>
                        <span className="font-semibold text-indigo-300">
                          {cls.enrolled} / {cls.capacity} Inscritos
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(100, (cls.enrolled / cls.capacity) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic iOS Bottom Navigation Dock Bar */}
        <div className="bg-slate-950/95 border-t border-slate-800/80 px-2 py-2 flex items-center justify-around z-20 backdrop-blur-lg shrink-0">
          {[
            { id: 'dashboard', label: 'Inicio', icon: TrendingUp },
            { id: 'students', label: 'Alumnos', icon: Users },
            { id: 'attendance', label: 'Asistencia', icon: UserCheck },
            { id: 'payments', label: 'Pagos', icon: CreditCard },
            { id: 'classes', label: 'Clases', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition ${
                  isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className={`text-[10px] font-medium mt-1 ${isActive ? 'font-bold' : ''}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Simulated iOS Home Bar Indicator */}
        <div className="w-full bg-slate-950 py-1 flex justify-center shrink-0">
          <div className="w-32 h-1 bg-slate-700/80 rounded-full"></div>
        </div>
      </div>

      {/* MODAL 1: ADD NEW STUDENT */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Agregar Nuevo Alumno</h3>
              <button onClick={() => setIsAddStudentOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. María Josefa"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Teléfono</label>
                <input
                  type="text"
                  placeholder="+56 9 0000 0000"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="alumno@ejemplo.com"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Plan / Membresía</label>
                <select
                  value={newStudent.plan}
                  onChange={(e) => setNewStudent({ ...newStudent, plan: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Plan Mensual Completo">Plan Mensual Completo</option>
                  <option value="3 Días por Semana">3 Días por Semana</option>
                  <option value="Plan Básico 2D">Plan Básico 2D</option>
                  <option value="Plan Vip Personalizado">Plan Vip Personalizado</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20"
                >
                  Guardar Alumno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTRAR PAGO */}
      {isAddPaymentOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Registrar Cobro / Cuota</h3>
              <button onClick={() => setIsAddPaymentOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Alumno</label>
                <select
                  required
                  value={newPayment.studentId}
                  onChange={(e) => setNewPayment({ ...newPayment, studentId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">-- Seleccionar Alumno --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.paymentStatus})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Monto ($)</label>
                <input
                  type="number"
                  required
                  placeholder="38000"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Método de Pago</label>
                <select
                  value={newPayment.method}
                  onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Transferencia">Transferencia Bancaria</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta Crédito">Tarjeta de Crédito</option>
                  <option value="Tarjeta Débito">Tarjeta de Débito</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Concepto</label>
                <input
                  type="text"
                  value={newPayment.concept}
                  onChange={(e) => setNewPayment({ ...newPayment, concept: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPaymentOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-emerald-600/20"
                >
                  Procesar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREAR CLASE */}
      {isAddClassOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Programar Clase</h3>
              <button onClick={() => setIsAddClassOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClass} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Título de la Clase</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Pilates Reformer"
                  value={newClass.title}
                  onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Horario</label>
                <input
                  type="text"
                  placeholder="Ej. 09:00 AM - 10:30 AM"
                  value={newClass.time}
                  onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Instructor</label>
                <input
                  type="text"
                  placeholder="Ej. Prof. Natalia"
                  value={newClass.instructor}
                  onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Salón / Lugar</label>
                  <input
                    type="text"
                    value={newClass.room}
                    onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Cupos Max.</label>
                  <input
                    type="number"
                    value={newClass.capacity}
                    onChange={(e) => setNewClass({ ...newClass, capacity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddClassOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20"
                >
                  Guardar Clase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EMISIÓN DE RECIBO DE PAGO */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Receipt Card */}
            <div className="bg-white text-slate-900 p-5 rounded-2xl space-y-3 font-mono shadow-inner">
              <div className="text-center border-b border-slate-200 pb-3">
                <h4 className="font-bold text-base uppercase tracking-wider">ACADEMIA CONTROL</h4>
                <p className="text-[10px] text-slate-500">Comprobante Oficial de Pago</p>
                <span className="text-[11px] font-semibold text-emerald-700 mt-1 inline-block">
                  COMPROBANTE #{selectedReceipt.id}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Fecha:</span>
                  <span className="font-semibold">{selectedReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Alumno:</span>
                  <span className="font-semibold">{selectedReceipt.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Concepto:</span>
                  <span className="font-semibold">{selectedReceipt.concept}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Método:</span>
                  <span className="font-semibold">{selectedReceipt.method}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 flex justify-between items-center text-sm">
                <span className="font-bold">TOTAL PAGADO:</span>
                <span className="font-extrabold text-emerald-700">${Number(selectedReceipt.amount).toLocaleString()}</span>
              </div>

              <div className="text-center text-[9px] text-slate-400 pt-2">
                ¡Gracias por su pago! Conservar este recibo para cualquier aclaración.
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition"
            >
              <CheckCircle className="w-4 h-4" /> Entendido / Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}