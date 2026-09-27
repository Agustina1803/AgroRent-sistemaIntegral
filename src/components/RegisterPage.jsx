import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthBrandPanel from './AuthBrandPanel';
import AuthField from './AuthField';
import RoleSelector from './RoleSelector';
import { useAuth } from './AuthContext';
import { ROLES, isValidEmail, panelFor } from './authStore';

const ICONS = {
  nombre: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  email: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" />
    </svg>
  ),
  telefono: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
    </svg>
  ),
  ciudad: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  password: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" />
    </svg>
  ),
};

const EMPTY = {
  nombre: '',
  email: '',
  telefono: '',
  ciudad: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterPage() {
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [rol, setRol] = useState(ROLES.CLIENTE);
  const [remember, setRemember] = useState(true);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={panelFor(user.rol)} replace />;
  }

  const update = campo => e => {
    setForm(prev => ({ ...prev, [campo]: e.target.value }));
    setErrors(prev => ({ ...prev, [campo]: '' }));
  };

  const validate = () => {
    const found = {};

    if (!form.nombre.trim()) found.nombre = 'Ingresá tu nombre y apellido.';
    if (!form.email.trim()) found.email = 'Ingresá tu email.';
    else if (!isValidEmail(form.email)) found.email = 'El formato del email no es válido.';
    if (!form.telefono.trim()) found.telefono = 'Ingresá un teléfono de contacto.';
    if (!form.password) found.password = 'Creá una contraseña.';
    else if (form.password.length < 6) found.password = 'La contraseña debe tener al menos 6 caracteres.';
    if (!form.confirmPassword) found.confirmPassword = 'Repetí la contraseña.';
    else if (form.confirmPassword !== form.password) found.confirmPassword = 'Las contraseñas no coinciden.';
    if (!terms) found.terms = 'Tenés que aceptar los términos y condiciones.';

    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setSubmitting(true);
    const result = register({ ...form, rol }, remember);

    if (!result.ok) {
      setSubmitting(false);
      setServerError(result.error);
      return;
    }

    navigate(panelFor(result.user.rol), { replace: true });
  };

  return (
    <div className="auth">
      <AuthBrandPanel
        title="Sumate a la red de maquinaria del NOA"
        subtitle="Publicá tus equipos o reservá los de otros. La cuenta define qué panel ves al entrar."
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
            <h1>Creá tu cuenta</h1>
            <p>Es gratis y toma menos de dos minutos. Después podés cambiar de panel si cambiás de rol.</p>
          </header>

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <RoleSelector value={rol} onChange={setRol} legend="Quiero registrarme como" />

            <AuthField
              label="Nombre y apellido"
              name="nombre"
              icon={ICONS.nombre}
              value={form.nombre}
              onChange={update('nombre')}
              error={errors.nombre}
              autoComplete="name"
              placeholder="Juan Pérez"
            />

            <AuthField
              label="Email"
              name="email"
              type="email"
              inputMode="email"
              icon={ICONS.email}
              value={form.email}
              onChange={update('email')}
              error={errors.email}
              autoComplete="email"
              placeholder="tunombre@ejemplo.com"
            />

            <div className="auth__grid-2">
              <AuthField
                label="Teléfono"
                name="telefono"
                type="tel"
                inputMode="tel"
                icon={ICONS.telefono}
                value={form.telefono}
                onChange={update('telefono')}
                error={errors.telefono}
                autoComplete="tel"
                placeholder="+54 9 381 000-0000"
              />
              <AuthField
                label="Ciudad"
                name="ciudad"
                icon={ICONS.ciudad}
                value={form.ciudad}
                onChange={update('ciudad')}
                error={errors.ciudad}
                autoComplete="address-level2"
                placeholder="San Miguel de Tucumán"
                required={false}
              />
            </div>

            <div className="auth__grid-2">
              <AuthField
                label="Contraseña"
                name="password"
                type="password"
                icon={ICONS.password}
                value={form.password}
                onChange={update('password')}
                error={errors.password}
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                hint="Usá al menos 6 caracteres."
                withToggle
              />
              <AuthField
                label="Confirmar contraseña"
                name="confirmPassword"
                type="password"
                icon={ICONS.password}
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                error={errors.confirmPassword}
                autoComplete="new-password"
                placeholder="Repetí la contraseña"
                withToggle
              />
            </div>

            <div className={`auth__checkbox ${errors.terms ? 'auth__checkbox--error' : ''}`}>
              <input
                type="checkbox"
                checked={terms}
                onChange={e => {
                  setTerms(e.target.checked);
                  setErrors(prev => ({ ...prev, terms: '' }));
                }}
                aria-invalid={errors.terms ? 'true' : undefined}
                aria-describedby={errors.terms ? 'terms-error' : undefined}
              />
              <span>
                Acepto los <a href="#terminos">términos y condiciones</a> y la <a href="#privacidad">política de privacidad</a>.
              </span>
            </div>
            {errors.terms && <span className="auth__error" id="terms-error">{errors.terms}</span>}

            <label className="auth__checkbox">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
              <span>Recordarme en este dispositivo</span>
            </label>

            {serverError && (
              <div className="auth__alert auth__alert--error" role="alert">
                {serverError}
              </div>
            )}

            <button type="submit" className="btn btn--primary btn--full auth__submit" disabled={submitting}>
              {submitting ? 'Creando cuenta...' : 'Crear mi cuenta'}
            </button>

            <p className="auth__switch">
              ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
