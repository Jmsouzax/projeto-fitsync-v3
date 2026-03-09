import { useState } from 'react';
import {
  Sparkles,
  Brain,
  UtensilsCrossed,
  Dumbbell,
  Flame,
  Droplets,
  RefreshCw,
  CheckCircle2,
  Circle,
  Bell,
  Search,
  ChevronRight,
  ChevronDown,
  Zap,
  Target,
  Clock,
  TrendingUp,
  Apple,
  Info,
  FlaskConical,
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { ExerciseModal } from '../ExerciseModal';
import { getExerciseDetail, ExerciseDetail } from '../../data/exerciseData';
import { dailyNutrition } from '../../data/foodData';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  muscle: string;
  completed: boolean;
}

const exercises: Exercise[] = [
  { id: '1', name: 'Supino Reto com Barra', sets: 4, reps: '8-10', weight: '80kg', muscle: 'Peito', completed: true },
  { id: '2', name: 'Crucifixo com Halteres', sets: 3, reps: '12-15', weight: '18kg', muscle: 'Peito', completed: true },
  { id: '3', name: 'Desenvolvimento Militar', sets: 4, reps: '8-10', weight: '50kg', muscle: 'Ombro', completed: false },
  { id: '4', name: 'Elevação Lateral', sets: 3, reps: '15-20', weight: '10kg', muscle: 'Ombro', completed: false },
  { id: '5', name: 'Tríceps Pulley', sets: 4, reps: '10-12', weight: '30kg', muscle: 'Tríceps', completed: false },
];

const muscleColors: Record<string, string> = {
  Peito: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Ombro: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Tríceps: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  Costas: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Bíceps: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  Pernas: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
};

function CircularProgress({
  value,
  max,
  color,
  size = 100,
}: {
  value: number;
  max: number;
  color: string;
  size?: number;
}) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth="6"
        fill="none"
        className="dark:stroke-zinc-800 stroke-slate-200"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth="6"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
}

export function Dashboard() {
  const [exList, setExList] = useState(exercises);
  const [generatingWorkout, setGeneratingWorkout] = useState(false);
  const [generatingDiet, setGeneratingDiet] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDetail | null>(null);
  const [showMoreMacros, setShowMoreMacros] = useState(false);

  const handleOpenExercise = (name: string) => {
    const detail = getExerciseDetail(name);
    if (detail) setSelectedExercise(detail);
  };

  const handleGenerateWorkout = () => {
    setGeneratingWorkout(true);
    setTimeout(() => setGeneratingWorkout(false), 2500);
  };

  const handleGenerateDiet = () => {
    setGeneratingDiet(true);
    setTimeout(() => setGeneratingDiet(false), 2500);
  };

  const toggleExercise = (id: string) => {
    setExList((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, completed: !ex.completed } : ex))
    );
  };

  const completedCount = exList.filter((e) => e.completed).length;
  const caloriesConsumed = 1840;
  const caloriesGoal = 2800;
  const protein = 142;
  const carbs = 220;
  const fat = 58;

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? 'Bom dia' : now.getHours() < 18 ? 'Boa tarde' : 'Boa noite';
  const dateStr = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm dark:text-zinc-500 text-slate-400 capitalize">{dateStr}</p>
          <h1 className="dark:text-white text-slate-900 mt-0.5">
            {greeting}, Lucas! 👋
          </h1>
          <p className="text-sm dark:text-zinc-400 text-slate-500 mt-1">
            Você está a <span className="text-emerald-500" style={{ fontWeight: 600 }}>12 dias</span> seguido sem faltar um treino!
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 dark:text-zinc-500 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar exercícios, alimentos..."
              className="pl-9 pr-4 py-2 rounded-xl text-sm dark:bg-zinc-900 bg-white dark:border-zinc-800 border border-slate-200 dark:text-zinc-200 text-slate-700 dark:placeholder:text-zinc-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 w-64"
            />
          </div>
          <button className="relative w-10 h-10 rounded-xl dark:bg-zinc-900 bg-white dark:border-zinc-800 border border-slate-200 flex items-center justify-center dark:text-zinc-400 text-slate-500 hover:text-emerald-500 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* AI Generate Workout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerateWorkout}
          disabled={generatingWorkout}
          className="relative overflow-hidden rounded-3xl p-6 text-left cursor-pointer group"
          style={{
            background: generatingWorkout
              ? 'linear-gradient(135deg, #059669, #10b981)'
              : 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 20px 60px rgba(16, 185, 129, 0.35)',
          }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
          <div className="absolute top-4 right-14 w-8 h-8 rounded-full bg-white/15" />

          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
              {generatingWorkout ? (
                <RefreshCw className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Dumbbell className="w-6 h-6 text-white" />
              )}
            </div>
            <h3 className="text-white mb-1" style={{ fontWeight: 700 }}>
              {generatingWorkout ? 'Gerando Treino...' : 'Gerar Treino com IA'}
            </h3>
            <p className="text-white/75 text-sm leading-relaxed">
              {generatingWorkout
                ? 'IA analisando seu histórico e objetivos'
                : 'Treino personalizado baseado nos seus objetivos e histórico'}
            </p>
            {!generatingWorkout && (
              <div className="flex items-center gap-1.5 mt-4 text-white/90">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm" style={{ fontWeight: 500 }}>Powered by FitSync</span>
              </div>
            )}
            {generatingWorkout && (
              <div className="mt-4 flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full bg-white/50 animate-pulse flex-1"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.button>

        {/* AI Generate Diet Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerateDiet}
          disabled={generatingDiet}
          className="relative overflow-hidden rounded-3xl p-6 text-left cursor-pointer group"
          style={{
            background: generatingDiet
              ? 'linear-gradient(135deg, #1d4ed8, #3b82f6)'
              : 'linear-gradient(135deg, #3b82f6, #6366f1)',
            boxShadow: '0 20px 60px rgba(59, 130, 246, 0.35)',
          }}
        >
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
          <div className="absolute top-4 right-14 w-8 h-8 rounded-full bg-white/15" />

          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
              {generatingDiet ? (
                <RefreshCw className="w-6 h-6 text-white animate-spin" />
              ) : (
                <UtensilsCrossed className="w-6 h-6 text-white" />
              )}
            </div>
            <h3 className="text-white mb-1" style={{ fontWeight: 700 }}>
              {generatingDiet ? 'Montando Dieta...' : 'Montar Dieta com IA'}
            </h3>
            <p className="text-white/75 text-sm leading-relaxed">
              {generatingDiet
                ? 'IA calculando macros e montando cardápio'
                : 'Plano alimentar personalizado com base nas suas metas calóricas'}
            </p>
            {!generatingDiet && (
              <div className="flex items-center gap-1.5 mt-4 text-white/90">
                <Brain className="w-4 h-4" />
                <span className="text-sm" style={{ fontWeight: 500 }}>Nutrição inteligente</span>
              </div>
            )}
            {generatingDiet && (
              <div className="mt-4 flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full bg-white/50 animate-pulse flex-1"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.button>

        {/* Today's Workout Card */}
        <div className="dark:bg-zinc-900 bg-white rounded-3xl overflow-hidden dark:border-zinc-800 border border-slate-200 relative">
          <div className="absolute inset-0 opacity-20">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1766287453739-c3ffc3f37d05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
              alt="workout"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-zinc-900 dark:via-zinc-900/80 bg-gradient-to-t from-white via-white/80 to-transparent" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" style={{ fontWeight: 600 }}>
                HOJE
              </span>
              <div className="flex items-center gap-1.5 dark:text-zinc-400 text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs">~65 min</span>
              </div>
            </div>
            <h3 className="dark:text-white text-slate-900 mb-1" style={{ fontWeight: 700 }}>
              Push Day A
            </h3>
            <p className="text-sm dark:text-zinc-400 text-slate-500 mb-4">Peito • Ombro • Tríceps</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {['Peito', 'Ombro', 'Tríceps'].map((m) => (
                    <div
                      key={m}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}
                    >
                      {m[0]}
                    </div>
                  ))}
                </div>
                <span className="text-xs dark:text-zinc-400 text-slate-500">
                  {completedCount}/{exList.length} exercícios
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-1.5 rounded-full dark:bg-zinc-800 bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(completedCount / exList.length) * 100}%`,
                  background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Calories Card */}
        <div className="dark:bg-zinc-900 bg-white rounded-3xl p-6 dark:border-zinc-800 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs dark:text-zinc-500 text-slate-400 uppercase tracking-widest" style={{ fontWeight: 600 }}>
                Calorias
              </p>
              <h3 className="dark:text-white text-slate-900" style={{ fontWeight: 700 }}>
                {caloriesConsumed.toLocaleString('pt-BR')}
                <span className="text-sm dark:text-zinc-500 text-slate-400" style={{ fontWeight: 400 }}>
                  {' '}/ {caloriesGoal.toLocaleString('pt-BR')} kcal
                </span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500/10">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="relative">
              <CircularProgress
                value={caloriesConsumed}
                max={caloriesGoal}
                color="#f97316"
                size={90}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-sm dark:text-white text-slate-900" style={{ fontWeight: 700 }}>
                  {Math.round((caloriesConsumed / caloriesGoal) * 100)}%
                </p>
                <p className="text-xs dark:text-zinc-500 text-slate-400">meta</p>
              </div>
            </div>
            <div className="flex-1 ml-4 space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="dark:text-zinc-400 text-slate-500">Consumidas</span>
                  <span className="text-orange-500" style={{ fontWeight: 600 }}>{caloriesConsumed} kcal</span>
                </div>
                <div className="h-1.5 rounded-full dark:bg-zinc-800 bg-slate-200">
                  <div className="h-full rounded-full bg-orange-500" style={{ width: `${(caloriesConsumed / caloriesGoal) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="dark:text-zinc-400 text-slate-500">Restantes</span>
                  <span className="dark:text-zinc-300 text-slate-700" style={{ fontWeight: 600 }}>{caloriesGoal - caloriesConsumed} kcal</span>
                </div>
                <div className="h-1.5 rounded-full dark:bg-zinc-800 bg-slate-200">
                  <div className="h-full rounded-full dark:bg-zinc-600 bg-slate-300" style={{ width: `${((caloriesGoal - caloriesConsumed) / caloriesGoal) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Macros Card */}
        <div className="dark:bg-zinc-900 bg-white rounded-3xl p-6 dark:border-zinc-800 border border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs dark:text-zinc-500 text-slate-400 uppercase tracking-widest" style={{ fontWeight: 600 }}>
                Macronutrientes
              </p>
              <h3 className="dark:text-white text-slate-900">Resumo do dia</h3>
            </div>
            <Target className="w-5 h-5 dark:text-zinc-500 text-slate-400" />
          </div>
          <div className="space-y-4">
            {[
              { label: 'Proteína', value: protein, max: 200, color: '#3b82f6', unit: 'g' },
              { label: 'Carboidratos', value: carbs, max: 300, color: '#10b981', unit: 'g' },
              { label: 'Gordura', value: fat, max: 80, color: '#f97316', unit: 'g' },
            ].map(({ label, value, max, color, unit }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="dark:text-zinc-400 text-slate-500">{label}</span>
                  <span className="dark:text-zinc-200 text-slate-700" style={{ fontWeight: 600 }}>
                    {value}{unit} <span className="dark:text-zinc-500 text-slate-400" style={{ fontWeight: 400 }}>/ {max}{unit}</span>
                  </span>
                </div>
                <div className="h-2 rounded-full dark:bg-zinc-800 bg-slate-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(value / max) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Ver Mais button */}
          <button
            onClick={() => setShowMoreMacros((v) => !v)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs border transition-all dark:border-zinc-700 border-slate-200 dark:text-zinc-400 text-slate-500 dark:hover:border-emerald-500/50 hover:border-emerald-400 dark:hover:text-emerald-400 hover:text-emerald-600"
            style={{ fontWeight: 600 }}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            {showMoreMacros ? 'Ver menos' : 'Ver Mais · Vitaminas & Minerais'}
            {showMoreMacros
              ? <ChevronDown className="w-3.5 h-3.5" />
              : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {/* Expanded panel */}
          <AnimatePresence>
            {showMoreMacros && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-5">
                  {/* Extra macros */}
                  <div>
                    <p className="text-xs dark:text-zinc-500 text-slate-400 uppercase tracking-widest mb-3" style={{ fontWeight: 700 }}>
                      Detalhes
                    </p>
                    <div className="space-y-2">
                      {[
                        { label: 'Fibra', value: dailyNutrition.fiber.value, goal: dailyNutrition.fiber.goal, unit: 'g', color: '#8b5cf6' },
                        { label: 'Açúcar', value: dailyNutrition.sugar.value, goal: dailyNutrition.sugar.goal!, unit: 'g', color: '#f59e0b', isLimit: true },
                        { label: 'Gord. saturada', value: dailyNutrition.saturatedFat.value, goal: dailyNutrition.saturatedFat.goal!, unit: 'g', color: '#ef4444', isLimit: true },
                        { label: 'Sódio', value: dailyNutrition.sodium.value, goal: dailyNutrition.sodium.goal!, unit: 'mg', color: '#06b6d4', isLimit: true },
                      ].map(({ label, value, goal, unit, color, isLimit }) => (
                        <div key={label} className="flex items-center gap-2">
                          <span className="text-xs dark:text-zinc-500 text-slate-400 w-28 flex-shrink-0">{label}</span>
                          <div className="flex-1 h-1.5 rounded-full dark:bg-zinc-800 bg-slate-200 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${Math.min((value / goal) * 100, 100)}%`, backgroundColor: isLimit && value > goal ? '#ef4444' : color }}
                            />
                          </div>
                          <span className="text-xs dark:text-zinc-300 text-slate-600 flex-shrink-0 w-16 text-right" style={{ fontWeight: 600 }}>
                            {value}{unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vitamins */}
                  <div>
                    <p className="text-xs dark:text-zinc-500 text-slate-400 uppercase tracking-widest mb-3" style={{ fontWeight: 700 }}>
                      Vitaminas · % VD
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {dailyNutrition.vitamins.map((v) => (
                        <div key={v.label} className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-white"
                            style={{
                              backgroundColor: v.dv >= 200 ? '#10b981' : v.dv >= 100 ? '#3b82f6' : '#8b5cf6',
                              fontSize: '8px',
                              fontWeight: 800,
                            }}
                          >
                            {v.shortLabel}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between text-xs">
                              <span className="dark:text-zinc-500 text-slate-400 truncate">{v.shortLabel}</span>
                              <span style={{ fontWeight: 700, color: v.dv >= 100 ? '#10b981' : '#6b7280', fontSize: '11px' }}>
                                {v.dv}%
                              </span>
                            </div>
                            <div className="h-1 rounded-full dark:bg-zinc-800 bg-slate-200 mt-0.5 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${Math.min(v.dv / 4, 100)}%`,
                                  backgroundColor: v.dv >= 200 ? '#10b981' : v.dv >= 100 ? '#3b82f6' : '#8b5cf6',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Minerals */}
                  <div>
                    <p className="text-xs dark:text-zinc-500 text-slate-400 uppercase tracking-widest mb-3" style={{ fontWeight: 700 }}>
                      Minerais · % VD
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {dailyNutrition.minerals.map((m) => (
                        <div key={m.label} className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-white"
                            style={{ backgroundColor: m.color, fontSize: '8px', fontWeight: 800 }}
                          >
                            {m.shortLabel}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between text-xs">
                              <span className="dark:text-zinc-500 text-slate-400 truncate">{m.label}</span>
                              <span style={{ fontWeight: 700, color: m.dv >= 100 ? '#10b981' : m.color, fontSize: '11px' }}>
                                {m.dv}%
                              </span>
                            </div>
                            <div className="h-1 rounded-full dark:bg-zinc-800 bg-slate-200 mt-0.5 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${Math.min(m.dv, 100)}%`, backgroundColor: m.color }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer note */}
                  <p className="text-xs dark:text-zinc-600 text-slate-400 text-center pb-1">
                    Baseado nos alimentos consumidos hoje · % do Valor Diário (2.000 kcal)
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hydration Card */}
        <div className="dark:bg-zinc-900 bg-white rounded-3xl p-6 dark:border-zinc-800 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs dark:text-zinc-500 text-slate-400 uppercase tracking-widest" style={{ fontWeight: 600 }}>
                Hidratação
              </p>
              <h3 className="dark:text-white text-slate-900">
                1.8L <span className="text-sm dark:text-zinc-500 text-slate-400" style={{ fontWeight: 400 }}>/ 3L</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-cyan-500" />
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-10 rounded-lg transition-all ${i < 6 ? 'bg-cyan-500' : 'dark:bg-zinc-800 bg-slate-100'
                  }`}
                style={{
                  opacity: i < 6 ? (i < 4 ? 1 : 0.6) : 1,
                }}
              />
            ))}
          </div>
          <p className="text-xs dark:text-zinc-500 text-slate-400 text-center">
            6 de 8 copos · Faltam 1.2L para a meta
          </p>
          <button
            className="mt-3 w-full py-2 rounded-xl text-sm text-cyan-500 border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors"
            style={{ fontWeight: 500 }}
          >
            + Adicionar copo
          </button>
        </div>

        {/* Exercise List - Full Width */}
        <div className="md:col-span-2 lg:col-span-3 dark:bg-zinc-900 bg-white rounded-3xl p-6 dark:border-zinc-800 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="dark:text-white text-slate-900">Exercícios de Hoje</h3>
              <p className="text-sm dark:text-zinc-400 text-slate-500 mt-0.5">
                {completedCount} de {exList.length} concluídos · <span className="text-emerald-500" style={{ fontWeight: 500 }}>Clique no nome para ver a execução</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 rounded-full dark:bg-zinc-800 bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(completedCount / exList.length) * 100}%`,
                    background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                  }}
                />
              </div>
              <span className="text-sm" style={{ fontWeight: 600, color: '#10b981' }}>
                {Math.round((completedCount / exList.length) * 100)}%
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {exList.map((ex) => (
              <motion.div
                key={ex.id}
                layout
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${ex.completed
                    ? 'dark:bg-emerald-500/5 bg-emerald-50 dark:border-emerald-500/20 border-emerald-200'
                    : 'dark:bg-zinc-800/50 bg-slate-50 dark:border-zinc-700 border-slate-200'
                  }`}
              >
                <button
                  onClick={() => toggleExercise(ex.id)}
                  className="flex-shrink-0"
                >
                  {ex.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 dark:text-zinc-600 text-slate-300 hover:text-emerald-500 transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <button
                      onClick={() => handleOpenExercise(ex.name)}
                      className={`text-sm text-left hover:underline transition-colors group flex items-center gap-1 ${ex.completed
                          ? 'line-through dark:text-zinc-500 text-slate-400'
                          : 'dark:text-white text-slate-900 dark:hover:text-emerald-400 hover:text-emerald-600'
                        }`}
                      style={{ fontWeight: 500 }}
                    >
                      {ex.name}
                      <Info className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity dark:text-zinc-500 text-slate-400" />
                    </button>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${muscleColors[ex.muscle] || 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
                        }`}
                      style={{ fontWeight: 500 }}
                    >
                      {ex.muscle}
                    </span>
                  </div>
                  <p className="text-xs dark:text-zinc-500 text-slate-400">
                    {ex.sets} séries × {ex.reps} reps
                    {ex.weight && ` • ${ex.weight}`}
                  </p>
                </div>
                <button className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(59,130,246,0.1))',
                    borderColor: 'rgba(16,185,129,0.3)',
                    color: '#10b981',
                    fontWeight: 600,
                  }}
                >
                  <Zap className="w-3 h-3" />
                  IA: Trocar
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Cards Row */}
        {[
          { label: 'Sequência', value: '12', unit: 'dias', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Treinos mês', value: '18', unit: 'sessões', icon: Dumbbell, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Meta calórica', value: '89', unit: '% atingida', icon: Apple, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map(({ label, value, unit, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="dark:bg-zinc-900 bg-white rounded-3xl p-5 dark:border-zinc-800 border border-slate-200 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <p className="text-xs dark:text-zinc-500 text-slate-400 uppercase tracking-widest" style={{ fontWeight: 600 }}>
                {label}
              </p>
              <p className="dark:text-white text-slate-900" style={{ fontWeight: 700 }}>
                {value}{' '}
                <span className="text-sm dark:text-zinc-400 text-slate-500" style={{ fontWeight: 400 }}>{unit}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Exercise Detail Modal */}
      <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
    </div>
  );
}