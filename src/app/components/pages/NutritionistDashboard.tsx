import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Apple,
  Activity,
  Mail,
  X,
  CheckCircle,
  Clock,
  FileText,
  TrendingDown,
  Search,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Patient {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending';
  lastConsultation: string;
  currentWeight: number;
  goalWeight: number;
  avatar: string;
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Ana Costa',
    email: 'ana@email.com',
    status: 'active',
    lastConsultation: 'Há 3 dias',
    currentWeight: 68.5,
    goalWeight: 63.0,
    avatar: 'https://ui-avatars.com/api/?name=Ana+Costa&background=10b981&color=fff',
  },
  {
    id: '2',
    name: 'Roberto Lima',
    email: 'roberto@email.com',
    status: 'active',
    lastConsultation: 'Há 1 semana',
    currentWeight: 92.3,
    goalWeight: 85.0,
    avatar: 'https://ui-avatars.com/api/?name=Roberto+Lima&background=f59e0b&color=fff',
  },
  {
    id: '3',
    name: 'Juliana Mendes',
    email: 'juliana@email.com',
    status: 'pending',
    lastConsultation: 'Aguardando aceite',
    currentWeight: 0,
    goalWeight: 0,
    avatar: 'https://ui-avatars.com/api/?name=Juliana+Mendes&background=8b5cf6&color=fff',
  },
];

export function NutritionistDashboard() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientEmail) return;

    setInviteStatus('loading');

    setTimeout(() => {
      const newPatient: Patient = {
        id: Math.random().toString(36).substr(2, 9),
        name: newPatientEmail.split('@')[0],
        email: newPatientEmail,
        status: 'pending',
        lastConsultation: 'Aguardando aceite',
        currentWeight: 0,
        goalWeight: 0,
        avatar: `https://ui-avatars.com/api/?name=${newPatientEmail.split('@')[0]}&background=3b82f6&color=fff`,
      };

      setPatients([...patients, newPatient]);
      setInviteStatus('success');

      setTimeout(() => {
        setShowAddModal(false);
        setNewPatientEmail('');
        setInviteStatus('idle');
      }, 1500);
    }, 1500);
  };

  const activePatients = patients.filter((p) => p.status === 'active').length;
  const pendingPatients = patients.filter((p) => p.status === 'pending').length;
  const avgWeightLoss = patients
    .filter((p) => p.currentWeight > 0)
    .reduce((sum, p) => sum + (p.currentWeight - p.goalWeight), 0) / activePatients || 0;

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dark:text-white text-slate-900">Dashboard Nutricionista</h1>
          <p className="text-sm dark:text-zinc-400 text-slate-500 mt-1">
            Gerencie seus pacientes e planos alimentares
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 24px rgba(245,158,11,0.35)', fontWeight: 600 }}
        >
          <UserPlus className="w-4 h-4" />
          Adicionar Paciente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pacientes Ativos', value: activePatients, icon: Users, color: '#10b981', bg: 'bg-emerald-500/10' },
          { label: 'Aguardando', value: pendingPatients, icon: Clock, color: '#8b5cf6', bg: 'bg-purple-500/10' },
          { label: 'Consultas Mês', value: 24, icon: FileText, color: '#f59e0b', bg: 'bg-orange-500/10' },
          { label: 'Perda Média', value: `${avgWeightLoss.toFixed(1)}kg`, icon: TrendingDown, color: '#3b82f6', bg: 'bg-blue-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="dark:bg-zinc-900 bg-white rounded-3xl p-5 dark:border-zinc-800 border border-slate-200">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <p className="dark:text-white text-slate-900 text-2xl" style={{ fontWeight: 800 }}>{value}</p>
            <p className="text-xs dark:text-zinc-500 text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Patients List */}
      <div className="dark:bg-zinc-900 bg-white rounded-3xl p-6 dark:border-zinc-800 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="dark:text-white text-slate-900">Meus Pacientes</h3>
            <p className="text-sm dark:text-zinc-400 text-slate-500 mt-0.5">
              {patients.length} paciente{patients.length !== 1 ? 's' : ''} no total
            </p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 dark:text-zinc-500 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar paciente..."
              className="pl-9 pr-4 py-2 rounded-xl text-sm dark:bg-zinc-800 bg-slate-50 dark:border-zinc-700 border border-slate-200 dark:text-zinc-200 text-slate-700 dark:placeholder:text-zinc-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 w-64"
            />
          </div>
        </div>

        <div className="space-y-3">
          {patients.map((patient) => (
            <motion.div
              key={patient.id}
              layout
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                patient.status === 'pending'
                  ? 'dark:bg-purple-500/5 bg-purple-50 dark:border-purple-500/20 border-purple-200'
                  : 'dark:bg-zinc-800/50 bg-slate-50 dark:border-zinc-700 border-slate-200'
              }`}
            >
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm dark:text-white text-slate-900" style={{ fontWeight: 600 }}>
                    {patient.name}
                  </p>
                  {patient.status === 'pending' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      Pendente
                    </span>
                  )}
                </div>
                <p className="text-xs dark:text-zinc-500 text-slate-400">{patient.email}</p>
              </div>
              <div className="flex items-center gap-6">
                {patient.status === 'active' && (
                  <>
                    <div className="text-right">
                      <p className="text-xs dark:text-zinc-500 text-slate-400">Peso Atual</p>
                      <p className="text-sm dark:text-white text-slate-900" style={{ fontWeight: 700 }}>
                        {patient.currentWeight} kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs dark:text-zinc-500 text-slate-400">Meta</p>
                      <p className="text-sm text-emerald-500" style={{ fontWeight: 700 }}>
                        {patient.goalWeight} kg
                      </p>
                    </div>
                  </>
                )}
                <div className="text-right">
                  <p className="text-xs dark:text-zinc-500 text-slate-400">Última consulta</p>
                  <p className="text-sm dark:text-zinc-300 text-slate-700">{patient.lastConsultation}</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border dark:border-zinc-600 border-slate-300 dark:text-zinc-400 text-slate-600 hover:dark:border-orange-500 hover:border-orange-400 hover:dark:text-orange-400 hover:text-orange-600 transition-all">
                  <Apple className="w-3 h-3" />
                  Ver Dieta
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-md dark:bg-zinc-900 bg-white rounded-3xl p-6 border dark:border-zinc-800 border-slate-200 shadow-2xl pointer-events-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="dark:text-white text-slate-900" style={{ fontWeight: 700 }}>
                      Adicionar Paciente
                    </h3>
                    <p className="text-sm dark:text-zinc-400 text-slate-500 mt-1">
                      Envie um convite por e-mail
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="w-8 h-8 rounded-xl dark:bg-zinc-800 bg-slate-100 dark:text-zinc-400 text-slate-500 hover:dark:bg-zinc-700 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {inviteStatus === 'success' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h4 className="dark:text-white text-slate-900 mb-2" style={{ fontWeight: 600 }}>
                      Convite Enviado!
                    </h4>
                    <p className="text-sm dark:text-zinc-400 text-slate-500">
                      O paciente receberá um e-mail com o convite para acessar o plano nutricional.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleAddPatient}>
                    <div className="mb-4">
                      <label className="block text-sm dark:text-zinc-300 text-slate-700 mb-2" style={{ fontWeight: 500 }}>
                        E-mail do Paciente
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 dark:text-zinc-500 text-slate-400" />
                        <input
                          type="email"
                          value={newPatientEmail}
                          onChange={(e) => setNewPatientEmail(e.target.value)}
                          placeholder="paciente@email.com"
                          disabled={inviteStatus === 'loading'}
                          className="w-full pl-10 pr-4 py-3 rounded-xl dark:bg-zinc-800 bg-slate-50 border dark:border-zinc-700 border-slate-200 dark:text-white text-slate-900 placeholder:dark:text-zinc-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:opacity-50"
                          required
                        />
                      </div>
                    </div>

                    <div className="dark:bg-orange-500/10 bg-orange-50 dark:border-orange-500/20 border border-orange-200 rounded-xl p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Activity className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-orange-600 dark:text-orange-400 mb-1" style={{ fontWeight: 600 }}>
                            Como funciona:
                          </p>
                          <ul className="text-orange-600/80 dark:text-orange-400/80 space-y-1 text-xs">
                            <li>• Se o e-mail já existir, o paciente será vinculado automaticamente</li>
                            <li>• Caso contrário, será criado um registro pendente</li>
                            <li>• O paciente receberá uma notificação por e-mail</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={inviteStatus === 'loading' || !newPatientEmail}
                      className="w-full py-3 rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', fontWeight: 600 }}
                    >
                      {inviteStatus === 'loading' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Enviando convite...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Enviar Convite
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
