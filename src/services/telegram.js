export function initTelegram() {
  const tg = window.Telegram?.WebApp
  
  if (tg) {
    tg.ready()
    tg.expand()
    
    document.documentElement.style.setProperty('--tg-theme-bg-color', tg.backgroundColor || '#ffffff')
    document.documentElement.style.setProperty('--tg-theme-text-color', tg.textColor || '#000000')
    document.documentElement.style.setProperty('--tg-theme-button-color', tg.buttonColor || '#3390ec')
    document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.buttonTextColor || '#ffffff')
    document.documentElement.style.setProperty('--tg-theme-hint-color', tg.hintColor || '#999999')
    document.documentElement.style.setProperty('--tg-theme-link-color', tg.linkColor || '#3390ec')
  }
  
  return tg
}

export function getTelegramUser() {
  const tg = window.Telegram?.WebApp
  return tg?.initDataUnsafe?.user || null
}
