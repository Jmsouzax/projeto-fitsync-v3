import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Zap,
  RefreshCw,
  Plus,
  Flame,
  Droplets,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Coffee,
  Apple,
  Sun,
  Moon,
  Cookie,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { FoodModal } from '../FoodModal';
import { getFoodNutrition, FoodNutrition } from '../../data/foodData';

interface FoodItem {
  id: string;
  name: string;
  qty: string;
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
  done: boolean;
}

interface Meal {
  id: string;
  label: string;
  icon: React.ElementType;
  time: string;
  totalCal: number;
  items: FoodItem[];
  expanded: boolean;
  color: string;
}

const initialMeals: Meal[] = [
  {
    id: '1',
    label: 'Café da Manhã',
    icon: Coffee,
    time: '07:00',
    totalCal: 520,
    color: '#f59e0b',
    expanded: false,
    items: [
      { id: 'f1', name: 'Ovos mexidos', qty: '3 unidades', cal: 210, protein: 18, carbs: 2, fat: 15, done: true },
      { id: 'f2', name: 'Aveia cozida', qty: '60g', cal: 220, protein: 7, carbs: 40, fat: 4, done: true },
      { id: 'f3', name: 'Banana', qty: '1 média', cal: 90, protein: 1, carbs: 23, fat: 0, done: true },
    ],
  },
  {
    id: '2',
    label: 'Almoço',
    icon: Sun,
    time: '12:30',
    totalCal: 680,
    color: '#10b981',
    expanded: true,
    items: [
      { id: 'f4', name: 'Frango grelhado', qty: '200g', cal: 280, protein: 52, carbs: 0, fat: 6, done: true },
      { id: 'f5', name: 'Arroz integral', qty: '150g', cal: 165, protein: 4, carbs: 34, fat: 1, done: true },
      { id: 'f6', name: 'Feijão preto', qty: '100g', cal: 130, protein: 9, carbs: 23, fat: 0, done: false },
      { id: 'f7', name: 'Salada verde', qty: 'à vontade', cal: 30, protein: 2, carbs: 5, fat: 0, done: false },
      { id: 'f8', name: 'Azeite de oliva', qty: '10ml', cal: 90, protein: 0, carbs: 0, fat: 10, done: false },
    ],
  },
  {
    id: '3',
    label: 'Pré-Treino',
    icon: Zap,
    time: '15:30',
    totalCal: 340,
    color: '#3b82f6',
    expanded: false,
    items: [
      { id: 'f9', name: 'Whey Protein', qty: '30g', cal: 120, protein: 25, carbs: 3, fat: 1, done: false },
      { id: 'f10', name: 'Batata-doce', qty: '100g', cal: 90, protein: 2, carbs: 21, fat: 0, done: false },
      { id: 'f11', name: 'Café preto', qty: '200ml', cal: 5, protein: 0, carbs: 0, fat: 0, done: false },
      { id: 'f12', name: 'Maçã', qty: '1 média', cal: 80, protein: 0, carbs: 21, fat: 0, done: false },
    ],
  },
  {
    id: '4',
    label: 'Jantar',
    icon: Moon,
    time: '19:30',
    totalCal: 580,
    color: '#8b5cf6',
    expanded: false,
    items: [
      { id: 'f13', name: 'Salmão grelhado', qty: '180g', cal: 310, protein: 40, carbs: 0, fat: 15, done: false },
      { id: 'f14', name: 'Quinoa', qty: '100g', cal: 120, protein: 4, carbs: 21, fat: 2, done: false },
      { id: 'f15', name: 'Brócolis cozido', qty: '150g', cal: 55, protein: 4, carbs: 10, fat: 0, done: false },
    ],
  },
  {
    id: '5',
    label: 'Lanche Noturno',
    icon: Cookie,
    time: '21:30',
    totalCal: 220,
    color: '#f97316',
    expanded: false,
    items: [
      { name: 'Cottage', qty: '150g', cal: 100, protein: 16, carbs: 5, fat: 2, done: false },
      { name: 'Amendoim', qty: '30g', cal: 170, protein: 7, carbs: 6, fat: 14, done: false },
    ],
  },
];

export function Diet() {
  const [meals, setMeals] = useState(initialMeals);
  const [generating, setGenerating] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodNutrition | null>(null);

  const handleOpenFood = (name: string) => {
    const detail = getFoodNutrition(name);
    if (detail) setSelectedFood(detail);
  };

  const toggleExpand = (id: string) => {
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, expanded: !m.expanded } : m)));
  };

  const toggleFood = (mealId: string, idx: number) => {
    setMeals((prev) =>
      prev.map((m) =>
        m.id === mealId
          ? {
              ...m,
              items: m.items.map((item, i) =>
                i === idx ? { ...item, done: !item.done } : item
              ),
            }
          : m
      )
    );
  };

  const totalCal = meals.reduce((sum, m) => sum + m.totalCal, 0);
  const consumedCal = meals.reduce(
    (sum, m) => sum + m.items.filter((i) => i.done).reduce((s, i) => s + i.cal, 0),
    0
  );
  const totalProtein = meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.protein, 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.carbs, 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.fat, 0), 0);

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dark:text-white text-slate-900">Minha Dieta</h1>
          <p className="text-sm dark:text-zinc-400 text-slate-500 mt-1">
            Plano de Ganho de Massa · {totalCal} kcal/dia
          </p>
        </div>
        <button
          onClick={() => { setGenerating(true); setTimeout(() => setGenerating(false), 2500); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 8px 24px rgba(59,130,246,0.35)' }}
        >
          {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {generating ? 'Montando dieta...' : 'Montar Dieta com IA'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="lg:col-span-1 space-y-4">
          {/* Calories Overview */}
          <div className="dark:bg-zinc-900 bg-white rounded-3xl p-5 dark:border-zinc-800 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="dark:text-white text-slate-900">Calorias do Dia</h3>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-center mb-4">
              <p className="dark:text-white text-slate-900 text-4xl" style={{ fontWeight: 800 }}>
                {consumedCal}
              </p>
              <p className="text-sm dark:text-zinc-400 text-slate-500 mt-1">
                de {totalCal} kcal consumidas
              </p>
            </div>
            <div className="h-3 rounded-full dark:bg-zinc-800 bg-slate-100 overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((consumedCal / totalCal) * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #f97316, #ef4444)' }}
              />
            </div>
            <p className="text-xs text-center dark:text-zinc-500 text-slate-400">
              Restam {totalCal - consumedCal} kcal
            </p>
          </div>

          {/* Macros Summary */}
          <div className="dark:bg-zinc-900 bg-white rounded-3xl p-5 dark:border-zinc-800 border border-slate-200">
            <h3 className="dark:text-white text-slate-900 mb-4">Macros Totais</h3>
            <div className="space-y-3">
              {[
                { label: 'Proteína', value: totalProtein, unit: 'g', color: '#3b82f6', bg: 'bg-blue-500/10', goal: 200 },
                { label: 'Carboidratos', value: totalCarbs, unit: 'g', color: '#10b981', bg: 'bg-emerald-500/10', goal: 300 },
                { label: 'Gordura', value: totalFat, unit: 'g', color: '#f97316', bg: 'bg-orange-500/10', goal: 80 },
              ].map(({ label, value, unit, color, bg, goal }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="dark:text-zinc-400 text-slate-500">{label}</span>
                    <span style={{ fontWeight: 600, color }}>
                      {value}{unit} <span className="dark:text-zinc-600 text-slate-400" style={{ fontWeight: 400 }}>/ {goal}{unit}</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full dark:bg-zinc-800 bg-slate-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((value / goal) * 100, 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Food Photo */}
          <div className="dark:bg-zinc-900 bg-white rounded-3xl overflow-hidden dark:border-zinc-800 border border-slate-200">
            <div className="h-44 relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1708884867025-9a9b3ebb6b16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                alt="Healthy meal"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-zinc-900 from-white/50 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-sm dark:text-white text-slate-800" style={{ fontWeight: 600 }}>
                  Alimentação balanceada
                </p>
                <p className="text-xs dark:text-zinc-400 text-slate-500">
                  Rica em proteínas e fibras
                </p>
              </div>
            </div>
          </div>

          {/* AI Tip */}
          <div
            className="rounded-3xl p-4"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.1))',
              border: '1px solid rgba(59,130,246,0.2)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-400" style={{ fontWeight: 700 }}>Dica IA</span>
            </div>
            <p className="text-sm dark:text-zinc-300 text-slate-700">
              Consuma a proteína do jantar até 2h antes de dormir para otimizar a síntese muscular noturna.
            </p>
          </div>
        </div>

        {/* Right Column - Meal List */}
        <div className="lg:col-span-2 space-y-3">
          {meals.map((meal) => {
            const Icon = meal.icon;
            const doneFoods = meal.items.filter((i) => i.done).length;

            return (
              <motion.div
                key={meal.id}
                layout
                className="dark:bg-zinc-900 bg-white rounded-3xl dark:border-zinc-800 border border-slate-200 overflow-hidden"
              >
                {/* Meal Header */}
                <button
                  onClick={() => toggleExpand(meal.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:dark:bg-zinc-800/50 hover:bg-slate-50 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${meal.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: meal.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm dark:text-white text-slate-900" style={{ fontWeight: 600 }}>
                        {meal.label}
                      </p>
                      <span className="text-xs dark:text-zinc-500 text-slate-400">{meal.time}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs dark:text-zinc-400 text-slate-500">
                        {meal.totalCal} kcal · {doneFoods}/{meal.items.length} alimentos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {doneFoods === meal.items.length && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                    {meal.expanded ? (
                      <ChevronDown className="w-4 h-4 dark:text-zinc-500 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 dark:text-zinc-500 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Progress bar */}
                <div className="mx-5 mb-2 -mt-2 h-1 rounded-full dark:bg-zinc-800 bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(doneFoods / meal.items.length) * 100}%`,
                      backgroundColor: meal.color,
                    }}
                  />
                </div>

                {/* Expanded Food Items */}
                {meal.expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5 space-y-2"
                  >
                    <div className="pt-2 border-t dark:border-zinc-800 border-slate-100 mb-3" />
                    {meal.items.map((food) => (
                      <div
                        key={food.id}
                        className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                          food.done
                            ? 'dark:bg-emerald-500/5 bg-emerald-50 dark:border-emerald-500/20 border border-emerald-200'
                            : 'dark:bg-zinc-800/50 bg-slate-50'
                        }`}
                      >
                        <button onClick={() => toggleFood(meal.id, idx)} className="flex-shrink-0">
                          {food.done ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Circle className="w-5 h-5 dark:text-zinc-600 text-slate-300 hover:text-emerald-500 transition-colors" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => handleOpenFood(food.name)}
                            className={`text-sm text-left group flex items-center gap-1 hover:underline transition-colors ${
                              food.done
                                ? 'line-through dark:text-zinc-500 text-slate-400'
                                : 'dark:text-zinc-200 text-slate-700 dark:hover:text-emerald-400 hover:text-emerald-600'
                            }`}
                            style={{ fontWeight: 500 }}
                          >
                            {food.name}
                            <Info className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity dark:text-zinc-500 text-slate-400" />
                          </button>
                          <p className="text-xs dark:text-zinc-500 text-slate-400">{food.qty}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm dark:text-zinc-300 text-slate-700" style={{ fontWeight: 600 }}>
                            {food.cal} kcal
                          </p>
                          <p className="text-xs dark:text-zinc-600 text-slate-400">
                            P:{food.protein}g · C:{food.carbs}g · G:{food.fat}g
                          </p>
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-2.5 rounded-2xl border-2 border-dashed dark:border-zinc-700 border-slate-200 dark:text-zinc-500 text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 text-sm mt-2">
                      <Plus className="w-4 h-4" />
                      Adicionar alimento
                    </button>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Food Detail Modal */}
      <FoodModal food={selectedFood} onClose={() => setSelectedFood(null)} />
    </div>
  );
}