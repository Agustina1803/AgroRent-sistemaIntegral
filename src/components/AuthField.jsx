import { useId, useState } from 'react';

const EYE_OPEN = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EYE_CLOSED = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M3 3l18 18" />
    <path d="M10.6 10.7a2 2 0 002.8 2.8" />
    <path d="M9.4 5.3A9.6 9.6 0 0112 5c6.4 0 10 7 10 7a17 17 0 01-2.2 3.2" />
    <path d="M6.2 6.2A17 17 0 002 12s3.6 7 10 7c1.2 0 2.3-.2 3.3-.6" />
  </svg>
);

export default function AuthField({
  label,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  icon,
  autoComplete,
  placeholder,
  required = true,
  withToggle = false,
  ...rest
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && revealed ? 'text' : type;

  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ');
  const wrapClass = [
    'auth__input-wrap',
    icon ? 'auth__input-wrap--icon' : '',
    withToggle && isPassword ? 'auth__input-wrap--toggle' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`auth__field ${error ? 'auth__field--error' : ''}`}>
      <label className="auth__label" htmlFor={id}>
        {label}
        {required && <span className="auth__required" aria-hidden="true">*</span>}
      </label>

      <div className={wrapClass}>
        {icon && <span className="auth__icon" aria-hidden="true">{icon}</span>}
        <input
          id={id}
          className="auth__input"
          type={inputType}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          {...rest}
        />
        {withToggle && isPassword && (
          <button
            type="button"
            className="auth__toggle"
            onClick={() => setRevealed(!revealed)}
            aria-label={revealed ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={revealed}
          >
            {revealed ? EYE_OPEN : EYE_CLOSED}
          </button>
        )}
      </div>

      {hint && !error && <span className="auth__hint" id={hintId}>{hint}</span>}
      {error && <span className="auth__error" id={errorId}>{error}</span>}
    </div>
  );
}
