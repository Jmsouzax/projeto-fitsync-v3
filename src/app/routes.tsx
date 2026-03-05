import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './components/pages/Dashboard';
import { Workouts } from './components/pages/Workouts';
import { Diet } from './components/pages/Diet';
import { Evolution } from './components/pages/Evolution';
import { Profile } from './components/pages/Profile';
import { Login } from './components/pages/Login';
import { Register } from './components/pages/Register';
import { PersonalDashboard } from './components/pages/PersonalDashboard';
import { NutritionistDashboard } from './components/pages/NutritionistDashboard';
import { CreateWorkout } from './components/pages/CreateWorkout';
import { StudentDetails } from './components/pages/StudentDetails';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/cadastro',
    Component: Register,
  },
  {
    path: '/',
    element: <ProtectedRoute allowedRoles={['student']} />,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          { index: true, Component: Dashboard },
          { path: 'treinos', Component: Workouts },
          { path: 'dieta', Component: Diet },
          { path: 'evolucao', Component: Evolution },
          { path: 'perfil', Component: Profile },
        ],
      },
    ],
  },
  {
    path: '/personal',
    element: <ProtectedRoute allowedRoles={['personal']} />,
    children: [
      {
        path: '/personal',
        Component: Layout,
        children: [
          { index: true, Component: PersonalDashboard },
          { path: 'criar-treino', Component: CreateWorkout },
          { path: 'aluno/:id', Component: StudentDetails },
          { path: 'perfil', Component: Profile },
        ],
      },
    ],
  },
  {
    path: '/nutritionist',
    element: <ProtectedRoute allowedRoles={['nutritionist']} />,
    children: [
      {
        path: '/nutritionist',
        Component: Layout,
        children: [
          { index: true, Component: NutritionistDashboard },
          { path: 'perfil', Component: Profile },
        ],
      },
    ],
  },
]);
