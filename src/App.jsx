import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { initTelegram } from './services/telegram'
import Home from './pages/Home'
import Cart from './pages/Cart'

function App() {
  useEffect(() => {
    initTelegram()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>  )
}

export default App
