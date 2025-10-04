import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/usersSlice';

import type { ReactNode } from 'react';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }
  return children;
}
