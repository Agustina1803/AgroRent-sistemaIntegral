import { Routes, Route } from 'react-router-dom'
import './index.css'
import './App.css'
import Layout from './components/Layout'
import LandingPage from './components/LandingPage'
import RentalPage from './components/RentalPage'
import CartPage from './components/CartPage'
import LandlordDashboard from './components/LandlordDashboard'
import ClientDashboard from './components/ClientDashboard'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import ForgotPasswordPage from './components/ForgotPasswordPage'
import NotFoundPage from './components/NotFoundPage'
import RequireAuth from './components/RequireAuth'
import RequireRole from './components/RequireRole'
import { AuthProvider } from './components/AuthContext'

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="catalogo" element={<RentalPage />} />
            <Route
              path="carrito"
              element={
                <RequireAuth>
                  <CartPage />
                </RequireAuth>
              }
            />
            <Route
              path="arrendador"
              element={
                <RequireRole rol="arrendador">
                  <LandlordDashboard />
                </RequireRole>
              }
            />
            <Route
              path="cliente"
              element={
                <RequireRole rol="cliente">
                  <ClientDashboard />
                </RequireRole>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
          <Route path="registro" element={<RegisterPage />} />
          <Route path="recuperar-clave" element={<ForgotPasswordPage />} />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
