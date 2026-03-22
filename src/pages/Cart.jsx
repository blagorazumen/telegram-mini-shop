import { useCartStore } from '../store/useCartStore'
import { getTelegramUser } from '../services/telegram'
import { supabase } from '../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'

function Cart() {
  const { items, getTotal, removeItem, updateQuantity, clearCart } = useCartStore()
  const navigate = useNavigate()
  const tgUser = getTelegramUser()

  async function handleCheckout() {
    if (!tgUser) {
      alert('Пожалуйста, откройте магазин через Telegram')
      return
    }

    const order = {
      user_id: tgUser.id,
      user_username: tgUser.username,
      total_amount: getTotal(),
      items: items,
      status: 'pending'
    }

    const { error } = await supabase.from('orders').insert([order])

    if (error) {
      alert('Ошибка оформления: ' + error.message)
    } else {
      alert('Заказ оформлен! Менеджер свяжется с вами.')
      clearCart()
      navigate('/')
      
      // Закрыть Mini App после заказа
      if (window.Telegram?.WebApp) {
        setTimeout(() => {
          window.Telegram.WebApp.close()
        }, 1500)
      }
    }
  }

  if (items.length === 0) {
    return (
      <div className="page cart-empty">
        <h1>🛒 Корзина пуста</h1>
        <Link to="/" className="btn-back">Вернуться в магазин</Link>
      </div>
    )
  }

  return (
    <div className="page cart">
      <header className="header">
        <h1>🛒 Корзина</h1>
        <Link to="/" className="back-link">← Назад</Link>
      </header>
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image_url || 'https://via.placeholder.com/100'} alt={item.name} />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <span>{item.price / 100} ₽</span>
            </div>
            <div className="cart-item-controls">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button className="btn-remove" onClick={() => removeItem(item.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <span>Итого:</span>
        <span className="total-amount">{getTotal() / 100} ₽</span>
      </div>

      <button className="btn-checkout" onClick={handleCheckout}>
        Оформить заказ
      </button>
    </div>
  )
}

export default Cart
