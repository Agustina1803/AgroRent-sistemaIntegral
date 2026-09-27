import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthBrandPanel from './AuthBrandPanel';
import AuthField from './AuthField';
import RoleSelector from './RoleSelector';
import { useAuth } from './AuthContext';
import { DEMO_ACCOUNTS, ROLES, isValidEmail, panelFor } from './authStore';

const EMAIL_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <polyline points="3 7 12 13 21 7" />
  </svg>
);

const LOCK_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 018 0v3" />
  </svg>
);

const EMPTY = { email: '', password: '' };

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState(EMPTY);
  const [rol, setRol] = useState(ROLES.CLIENTE);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from;
  const justReset = Boolean(location.state?.reset);

  if (isAuthenticated) {
    return <Navigate to={from?.pathname || panelFor(user.rol)} replace />;
  }

  const update = campo => e => {
    setForm(prev => ({ ...prev, [campo]: e.target.value }));
    setErrors(prev => ({ ...prev, [campo]: '' }));
  };

  const validate = () => {
    const found = {};
    if (!form.email.trim()) found.email = 'Ingresá tu email.';
    else if (!isValidEmail(form.email)) found.email = 'El formato del email no es válido.';
    if (!form.password) found.password = 'Ingresá tu contraseña.';
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setSubmitting(true);
    const result = login(form.email, form.password, rol, remember);

    if (!result.ok) {
      setSubmitting(false);
      setServerError(result.error);
      return;
    }

    const target = from?.pathname || panelFor(result.user.rol);
    navigate(target, { replace: true });
  };

  const fillDemo = account => {
    setRol(account.rol);
    setForm({ email: account.email, password: account.password });
    setErrors({});
    setServerError('');
  };

  return (
    <div className="auth">
      <AuthBrandPanel
        title="Alquilá maquinaria agrícola sin vueltas"
        subtitle="Una sola cuenta para publicar y para reservar. Elegí cómo vas a usar AgroRent."
      />

      <main className="auth__panel">
        <div className="auth__panel-inner">
          <Link to="/" className="auth__back" aria-label="Volver al inicio de AgroRent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Volver al inicio
          </Link>

          <header className="auth__header">
            <h1>Ingresá a tu cuenta</h1>
            <p>Gestioná tus máquinas, alquileres y calificaciones desde un solo lugar.</p>
          </header>

          {justReset && (
            <div className="auth__alert auth__alert--success" role="status">
              Tu contraseña se actualizó. Ya podés ingresar con la nueva.
            </div>
          )}

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <RoleSelector value={rol} onChange={setRol} legend="Ingresá como" />

            <AuthField
              label="Email"
              name="email"
              type="email"
              inputMode="email"
              icon={EMAIL_ICON}
              value={form.email}
              onChange={update('email')}
              error={errors.email}
              autoComplete="email"
              placeholder="tunombre@ejemplo.com"
            />

            <div className="auth__password-row">
              <AuthField
                label="Contraseña"
                name="password"
                type="password"
                icon={LOCK_ICON}
                value={form.password}
                onChange={update('password')}
                error={errors.password}
                autoComplete="current-password"
                placeholder="Tu contraseña"
                withToggle
              />
              <Link to="/recuperar-clave" className="auth__forgot">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <label className="auth__checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              <span>Recordarme en este dispositivo</span>
            </label>

            {serverError && (
              <div className="auth__alert auth__alert--error" role="alert">
                {serverError}
              </div>
            )}

            <button type="submit" className="btn btn--primary btn--full auth__submit" disabled={submitting}>
              {submitting ? 'Ingresando...' : 'Ingresar'}
            </button>

            <div className="auth__divider"><span>o ingresá con</span></div>

            <div className="auth__social">
              <button type="button" className="auth__social-btn" onClick={() => setServerError('El acceso con Google todavía no está disponible en esta versión de prueba.')}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 01-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z" />
                  <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0012 24z" />
                  <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 010-4.6V6.7H1.4a12 12 0 000 10.8l4-3.1z" />
                  <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 001.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
                </svg>
                Google
              </button>
              <button type="button" className="auth__social-btn" onClick={() => setServerError('El acceso con Apple todavía no está disponible en esta versión de prueba.')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16.4 12.7c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9-.7 0-1.9-.9-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.2 1.7 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.8.8 3.1.8 1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7 0 0-2.6-1-2.6-3.9zM14.1 5.1c.6-.8 1.1-1.9 1-3-1 0-2.2.7-2.9 1.4-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.9-1.3z" />
                </svg>
                Apple
              </button>
            </div>

            <p className="auth__switch">
              ¿No tenés cuenta? <Link to="/registro">Registrate gratis</Link>
            </p>
          </form>

          <section className="auth__demo" aria-labelledby="demo-title">
            <h2 className="auth__demo-title" id="demo-title">Cuentas de prueba</h2>
            <p className="auth__demo-text">Hacé clic en una para completar el formulario automáticamente.</p>
            <div className="auth__demo-grid">
              {DEMO_ACCOUNTS.map(account => (
                <button key={account.email} type="button" className="auth__demo-btn" onClick={() => fillDemo(account)}>
                  <span className="auth__demo-role" data-rol={account.rol}>
                    {account.rol === ROLES.ARRENDADOR ? 'Arrendador' : 'Cliente'}
                  </span>
                  <span className="auth__demo-email">{account.email}</span>
                  <span className="auth__demo-pass">Contraseña: {account.password}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
