import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useCartStore } from '../store/useCartStore'
import { Link } from 'react-router-dom'

function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const addItem = useCartStore(state => state.addItem)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [selectedCategory])

  async function loadCategories() {
    try {
      console.log('Загружаю категории...')
      const { data: cats, error: catsError } = await supabase
        .from('categories')
        .select('*')
      
      if (catsError) {
        console.error('Ошибка категорий:', catsError)
        throw catsError
      }
      
      console.log('Категории загружены:', cats)
      setCategories(cats || [])
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err)
      setError('Не удалось загрузить категории')
    }
  }

  async function loadProducts() {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Загружаю товары, категория:', selectedCategory)
      
      let query = supabase
        .from('products')        .select('*')

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory)
      }

      const { data: productsData, error: productsError } = await query
      
      if (productsError) {
        console.error('Ошибка товаров:', productsError)
        throw productsError
      }
      
      console.log('Товары загружены:', productsData)
      console.log('Количество товаров:', productsData?.length || 0)
      
      setProducts(productsData || [])
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err)
      setError('Не удалось загрузить товары. Проверьте подключение к базе данных.')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="page home">
        <header className="header">
          <h1>ABSIT SHOP</h1>
          <Link to="/cart" className="cart-link">🛒 Корзина</Link>
        </header>
        <div className="error-state" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <p>❌ {error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px' }}>
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page home">
        <header className="header">
          <h1>ABSIT SHOP</h1>
          <Link to="/cart" className="cart-link">🛒 Корзина</Link>
        </header>
        <div className="loading" style={{ textAlign: 'center', padding: '50px' }}>          Загрузка...
        </div>
      </div>
    )
  }

  return (
    <div className="page home">
      <div style={{ background: '#f0f0f0', color: '#000', padding: '10px', marginBottom: '10px', borderRadius: '5px', fontSize: '12px' }}>
        <p>📊 Категорий: {categories.length}</p>
        <p>📦 Товаров: {products.length}</p>
        <p>🔍 Выбрана категория: {selectedCategory || 'Все'}</p>
      </div>

      <header className="header">
        <h1>ABSIT SHOP</h1>
        <Link to="/cart" className="cart-link">🛒 Корзина</Link>
      </header>

      <div className="categories-filter">
        <button
          className={`category-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          Все
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-card">
              <img
                src={product.image_url || 'https://via.placeholder.com/300x200?text=Нет+изображения'}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Ошибка+загрузки'
                }}
              />
              <div className="product-info">                <h3>{product.name}</h3>
                <p className="product-desc">{product.description || 'Описание отсутствует'}</p>
                <div className="product-footer">
                  <span className="product-price">
                    {typeof product.price === 'number' ? `${product.price} ₽` : 'Цена не указана'}
                  </span>
                  <button
                    className="btn-add"
                    onClick={() => addItem(product)}
                  >
                    + В корзину
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '50px', gridColumn: '1/-1' }}>
            <p>😕 Товаров пока нет</p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              {selectedCategory ? 'В этой категории нет товаров' : 'Добавьте товары в базу данных'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
