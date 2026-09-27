import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthBrandPanel from './AuthBrandPanel';
import AuthField from './AuthField';
import { useAuth } from './AuthContext';
import { isValidEmail } from './authStore';

const EMAIL_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" />
  </svg>
);

const LOCK_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" />
  </svg>
);

export default function ForgotPasswordPage() {
  const { requestPasswordReset, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const handleRequest = e => {
    e.preventDefault();
    setNotice('');
    setError('');

    if (!email.trim()) {
      setErrors({ email: 'Ingresá el email con el que te registraste.' });
      return;
    }
    if (!isValidEmail(email)) {
      setErrors({ email: 'El formato del email no es válido.' });
      return;
    }

    setErrors({});
    const result = requestPasswordReset(email);
    setStep('reset');
    setNotice(result.message);
  };

  const handleReset = e => {
    e.preventDefault();
    setError('');
    setNotice('');

    const found = {};
    if (!password) found.password = 'Escribí una nueva contraseña.';
    else if (password.length < 6) found.password = 'La contraseña debe tener al menos 6 caracteres.';
    if (!confirmPassword) found.confirmPassword = 'Repetí la nueva contraseña.';
    else if (confirmPassword !== password) found.confirmPassword = 'Las contraseñas no coinciden.';

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const result = resetPassword(email, password, confirmPassword);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate('/login', { replace: true, state:{ reset: true } });
  };

  return (
    <div className="auth">
      <AuthBrandPanel
        title="Recuperá el acceso a tu cuenta"
        subtitle="Te ayudamos a volver a entrar. Vas a necesitar el email con el que te registraste en AgroRent."
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
            <h1>{step === 'request' ? 'Recuperá tu contraseña' : 'Elegí una nueva contraseña'}</h1>
            <p>
              {step === 'request'
                ? 'Ingresá tu email y te enviamos las instrucciones para restablecerla.'
                : 'Ahora definí la contraseña que vas a usar desde ahora en adelante.'}
            </p>
          </header>

          {step === 'request' ? (
            <form className="auth__form" onSubmit={handleRequest} noValidate>
              <AuthField
                label="Email con el que te registraste"
                name="email"
                type="email"
                inputMode="email"
                icon={EMAIL_ICON}
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setErrors({});
                }}
                error={errors.email}
                autoComplete="email"
                placeholder="tunombre@ejemplo.com"
              />

              <button type="submit" className="btn btn--primary btn--full auth__submit">
                Enviar instrucciones
              </button>

              <p className="auth__switch">
                ¿Te acordaste? <Link to="/login">Volver al inicio de sesión</Link>
              </p>
            </form>
          ) : (
            <form className="auth__form" onSubmit={handleReset} noValidate>
              {notice && (
                <div className="auth__alert auth__alert--success" role="status">
                  {notice}
                </div>
              )}

              <p className="auth__reset-for">
                Cuenta: <strong>{email}</strong>
              </p>

              <AuthField
                label="Nueva contraseña"
                name="password"
                type="password"
                icon={LOCK_ICON}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: '' }));
                }}
                error={errors.password}
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                hint="Usá al menos 6 caracteres."
                withToggle
              />

              <AuthField
                label="Confirmar nueva contraseña"
                name="confirmPassword"
                type="password"
                icon={LOCK_ICON}
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                error={errors.confirmPassword}
                autoComplete="new-password"
                placeholder="Repetí la contraseña"
                withToggle
              />

              {error && (
                <div className="auth__alert auth__alert--error" role="alert">
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn--primary btn--full auth__submit">
                Guardar nueva contraseña
              </button>

              <button
                type="button"
                className="auth__link-button"
                onClick={() => {
                  setStep('request');
                  setNotice('');
                  setError('');
                }}
              >
                Usar otro email
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
