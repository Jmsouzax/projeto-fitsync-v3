import { Navigate, Outlet } from 'react-router';
import { useAuth, UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado mas não tem permissão, redireciona baseado no role
  if (user && !allowedRoles.includes(user.role)) {
    // Redireciona para o dashboard correto do usuário
    if (user.role === 'student') return <Navigate to="/" replace />;
    if (user.role === 'personal') return <Navigate to="/personal" replace />;
    if (user.role === 'nutritionist') return <Navigate to="/nutritionist" replace />;
  }

  // Se passou pelas validações, renderiza a rota
  return <Outlet />;
}
