import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useCartStore } from '../store/useCartStore'
import { Link } from 'react-router-dom'

function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore(state => state.addItem)

  useEffect(() => {
    loadData()
  }, [selectedCategory])

  async function loadData() {
  try {
    // Загружаем категории
    const { data: cats, error: catsError } = await supabase
      .from('categories')
      .select('*')
    
    if (catsError) {
      console.error('Ошибка категорий:', catsError)
    }
    
    setCategories(cats || [])

    // Загружаем товары
    let query = supabase
      .from('products')
      .select('*')

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory)
    }

    const { data, error: productsError } = await query
    
    if (productsError) {
      console.error('Ошибка товаров:', productsError)
    }
    
    console.log('Товары:', data)
    console.log('Категории:', cats)

    setProducts(data || [])
    setLoading(false)
  } catch (err) {
    console.error('Ошибка загрузки:', err)
    setLoading(false)
  }

  if (loading) return <div className="loading">Загрузка...</div>

  return (
    <div className="page home">
      <header className="header">
        <h1>   ABSIT SHOP</h1>
        <Link to="/cart" className="cart-link">🛒 Корзина</Link>
      </header>

      {/* Фильтр по категориям */}      <div className="categories-filter">
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

      {/* Сетка товаров */}
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img 
              src={product.image_url || 'https://via.placeholder.com/300'} 
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-desc">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">{product.price / 100} ₽</span>
                <button 
                  className="btn-add"
                  onClick={() => addItem(product)}
                >
                  + В корзину
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="empty-state">
          <p> Товаров пока нет</p>
        </div>
      )}
    </div>  )
}

export default Home
