import { Navigate, useLocation } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import { useAuth } from './AuthContext';
import { panelFor } from './authStore';

export default function RequireRole({ rol, children }) {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <RequireAuth>
      {user && user.rol !== rol ? (
        <Navigate
          to={panelFor(user.rol)}
          state={{ denied: { attempted: location.pathname, required: rol } }}
          replace
        />
      ) : (
        children
      )}
    </RequireAuth>
  );
}
