import { Routes, Route } from 'react-router-dom'
import './index.css'
import './App.css'
import Layout from './components/Layout'
import LandingPage from './components/LandingPage'
import RentalPage from './components/RentalPage'
import CartPage from './components/CartPage'
import LandlordDashboard from './components/LandlordDashboard'
import ClientDashboard from './components/ClientDashboard'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="catalogo" element={<RentalPage />} />
          <Route path="carrito" element={<CartPage />} />
          <Route path="arrendador" element={<LandlordDashboard />} />
          <Route path="cliente" element={<ClientDashboard />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
