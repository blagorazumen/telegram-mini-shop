import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useCartStore } from '../store/useCartStore'
import { Link } from 'react-router-dom'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
    
    if (error) {
      console.error('Error fetching products:', error)
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  function handleAddToCart(product) {
    addItem(product)
    
    // Вибрация при добавлении (Telegram Haptic Feedback)
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
    }
  }

  if (loading) {
    return <div className="loading">Загрузка товаров...</div>
  }

  return (
    <div className="page home">
      <header className="header">        <h1>🛒 ABSIT</h1>
        <Link to="/cart" className="cart-link">
          Корзина <span className="cart-count">🛒</span>
        </Link>
      </header>

      <div className="products-grid">
        {products.length === 0 ? (
          <p className="no-products">Товары пока не добавлены</p>
        ) : (
          products.map(product => (
            <div key={product.id} className="product-card">
              <img 
                src={product.image_url || 'https://via.placeholder.com/300'} 
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">{product.price / 100} ₽</span>
                <button 
                  className="btn-add"
                  onClick={() => handleAddToCart(product)}
                >
                  + В корзину
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Home
