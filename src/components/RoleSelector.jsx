import { ROLE_OPTIONS } from './authStore';

export default function RoleSelector({ value, onChange, legend = 'Tipo de usuario' }) {
  return (
    <fieldset className="auth__roles">
      <legend className="auth__label">{legend}</legend>
      <div className="auth__roles-grid">
        {ROLE_OPTIONS.map(option => {
          const active = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`auth__role ${active ? 'auth__role--active' : ''}`}
              onClick={() => onChange(option.id)}
              aria-pressed={active}
            >
              <span className="auth__role-icon" aria-hidden="true">{option.icon}</span>
              <span className="auth__role-body">
                <strong>{option.label}</strong>
                <em>{option.description}</em>
              </span>
              <span className="auth__role-dot" aria-hidden="true"></span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
