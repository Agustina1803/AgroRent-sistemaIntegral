import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useAuth } from './AuthContext'
import { ROLE_LABEL } from './authStore'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const denied = location.state?.denied

  return (
    <>
      <Header />
      {denied && (
        <div className="access-alert">
          <div className="container access-alert__inner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>
              Tu cuenta es de tipo <strong>{ROLE_LABEL[user.rol]}</strong>, por eso no podés ver el panel de{' '}
              <strong>{ROLE_LABEL[denied.required]}</strong>. Te mostramos el tuyo.
            </p>
            <button type="button" onClick={() => navigate(location.pathname, { replace: true })}>
              Entendido
            </button>
          </div>
        </div>
      )}
      <Outlet />
      <Footer />
    </>
  )
}
