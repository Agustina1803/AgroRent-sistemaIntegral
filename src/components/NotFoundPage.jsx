import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function NotFoundPage() {
  const { isAuthenticated, panelFor } = useAuth();

  return (
    <div className="notfound">
      <div className="container notfound__inner">
        <span className="notfound__code" aria-hidden="true">404</span>
        <h1>No encontramos esa página</h1>
        <p>
          El enlace que seguiste no existe o fue movido. Podés volver al inicio o ir directo a tu panel.
        </p>
        <div className="notfound__actions">
          <Link to="/" className="btn btn--primary">Ir al inicio</Link>
          <Link to="/catalogo" className="btn btn--outline-green">Ver catálogo</Link>
          {isAuthenticated && (
            <Link to={panelFor} className="btn btn--orange">Mi panel</Link>
          )}
        </div>
      </div>
    </div>
  );
}
