import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Users,
  UserPlus,
  TrendingUp,
  Activity,
  Mail,
  X,
  CheckCircle,
  Clock,
  Dumbbell,
  BarChart3,
  Calendar,
  Search,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Student {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending';
  workoutsThisWeek: number;
  lastWorkout: string;
  avatar: string;
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Lucas Silva',
    email: 'lucas@email.com',
    status: 'active',
    workoutsThisWeek: 4,
    lastWorkout: 'Hoje às 14:30',
    avatar: 'https://ui-avatars.com/api/?name=Lucas+Silva&background=10b981&color=fff',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    status: 'active',
    workoutsThisWeek: 5,
    lastWorkout: 'Ontem às 18:00',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=3b82f6&color=fff',
  },
  {
    id: '3',
    name: 'João Pedro',
    email: 'joao@email.com',
    status: 'pending',
    workoutsThisWeek: 0,
    lastWorkout: 'Aguardando aceite',
    avatar: 'https://ui-avatars.com/api/?name=João+Pedro&background=f59e0b&color=fff',
  },
];

export function PersonalDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentEmail) return;

    setInviteStatus('loading');

    // Simula envio de convite
    setTimeout(() => {
      const newStudent: Student = {
        id: Math.random().toString(36).substr(2, 9),
        name: newStudentEmail.split('@')[0],
        email: newStudentEmail,
        status: 'pending',
        workoutsThisWeek: 0,
        lastWorkout: 'Aguardando aceite',
        avatar: `https://ui-avatars.com/api/?name=${newStudentEmail.split('@')[0]}&background=8b5cf6&color=fff`,
      };

      setStudents([...students, newStudent]);
      setInviteStatus('success');

      setTimeout(() => {
        setShowAddModal(false);
        setNewStudentEmail('');
        setInviteStatus('idle');
      }, 1500);
    }, 1500);
  };

  const activeStudents = students.filter((s) => s.status === 'active').length;
  const pendingStudents = students.filter((s) => s.status === 'pending').length;
  const totalWorkouts = students.reduce((sum, s) => sum + s.workoutsThisWeek, 0);

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dark:text-white text-slate-900">Dashboard Personal</h1>
          <p className="text-sm dark:text-zinc-400 text-slate-500 mt-1">
            Gerencie seus alunos e acompanhe o desempenho
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 8px 24px rgba(59,130,246,0.35)', fontWeight: 600 }}
        >
          <UserPlus className="w-4 h-4" />
          Adicionar Aluno
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Alunos Ativos', value: activeStudents, icon: Users, color: '#10b981', bg: 'bg-emerald-500/10' },
          { label: 'Aguardando', value: pendingStudents, icon: Clock, color: '#f59e0b', bg: 'bg-orange-500/10' },
          { label: 'Treinos na Semana', value: totalWorkouts, icon: Dumbbell, color: '#3b82f6', bg: 'bg-blue-500/10' },
          { label: 'Taxa de Adesão', value: '87%', icon: TrendingUp, color: '#8b5cf6', bg: 'bg-purple-500/10' },
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

      {/* Students List */}
      <div className="dark:bg-zinc-900 bg-white rounded-3xl p-6 dark:border-zinc-800 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="dark:text-white text-slate-900">Meus Alunos</h3>
            <p className="text-sm dark:text-zinc-400 text-slate-500 mt-0.5">
              {students.length} aluno{students.length !== 1 ? 's' : ''} no total
            </p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 dark:text-zinc-500 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar aluno..."
              className="pl-9 pr-4 py-2 rounded-xl text-sm dark:bg-zinc-800 bg-slate-50 dark:border-zinc-700 border border-slate-200 dark:text-zinc-200 text-slate-700 dark:placeholder:text-zinc-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-64"
            />
          </div>
        </div>

        <div className="space-y-3">
          {students.map((student) => (
            <motion.div
              key={student.id}
              layout
              onClick={() => student.status === 'active' && navigate(`/personal/aluno/${student.id}`)}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${student.status === 'pending'
                  ? 'dark:bg-orange-500/5 bg-orange-50 dark:border-orange-500/20 border-orange-200'
                  : 'dark:bg-zinc-800/50 bg-slate-50 dark:border-zinc-700 border-slate-200 cursor-pointer hover:dark:border-blue-500/50 hover:border-blue-300'
                }`}
            >
              <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm dark:text-white text-slate-900" style={{ fontWeight: 600 }}>
                    {student.name}
                  </p>
                  {student.status === 'pending' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      Pendente
                    </span>
                  )}
                </div>
                <p className="text-xs dark:text-zinc-500 text-slate-400">{student.email}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs dark:text-zinc-500 text-slate-400">Treinos na semana</p>
                  <p className="text-sm dark:text-white text-slate-900" style={{ fontWeight: 700 }}>
                    {student.workoutsThisWeek}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs dark:text-zinc-500 text-slate-400">Último treino</p>
                  <p className="text-sm dark:text-zinc-300 text-slate-700">{student.lastWorkout}</p>
                </div>
                {student.status === 'active' && (
                  <ChevronRight className="w-5 h-5 dark:text-zinc-600 text-slate-400" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Student Modal */}
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
                      Adicionar Aluno
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
                      O aluno receberá um e-mail com o convite para se juntar à sua equipe.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleAddStudent}>
                    <div className="mb-4">
                      <label className="block text-sm dark:text-zinc-300 text-slate-700 mb-2" style={{ fontWeight: 500 }}>
                        E-mail do Aluno
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 dark:text-zinc-500 text-slate-400" />
                        <input
                          type="email"
                          value={newStudentEmail}
                          onChange={(e) => setNewStudentEmail(e.target.value)}
                          placeholder="aluno@email.com"
                          disabled={inviteStatus === 'loading'}
                          className="w-full pl-10 pr-4 py-3 rounded-xl dark:bg-zinc-800 bg-slate-50 border dark:border-zinc-700 border-slate-200 dark:text-white text-slate-900 placeholder:dark:text-zinc-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
                          required
                        />
                      </div>
                    </div>

                    <div className="dark:bg-blue-500/10 bg-blue-50 dark:border-blue-500/20 border border-blue-200 rounded-xl p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Activity className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-blue-600 dark:text-blue-400 mb-1" style={{ fontWeight: 600 }}>
                            Como funciona:
                          </p>
                          <ul className="text-blue-600/80 dark:text-blue-400/80 space-y-1 text-xs">
                            <li>• Se o e-mail já existir, o aluno será vinculado automaticamente</li>
                            <li>• Caso contrário, será criado um registro pendente</li>
                            <li>• O aluno receberá uma notificação por e-mail</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={inviteStatus === 'loading' || !newStudentEmail}
                      className="w-full py-3 rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', fontWeight: 600 }}
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
