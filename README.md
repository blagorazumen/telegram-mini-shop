# 🛒 Telegram Mini Shop

Магазин внутри Telegram на React + Supabase

## 🚀 Быстрый старт

```bash
npm install
cp .env.example .env
# Заполни .env своими ключами Supabase
npm run dev
```

## 📦 Стек
- React 18 + Vite
- Supabase (DB + Storage)
- Zustand (state management)
- Telegram WebApp SDK

## 🔧 Настройка Supabase

1. Создай проект на supabase.com
2. Выполни SQL-схему из документации
3. Создай бакет `products` (public)
4. Скопируй URL и anon key в .env

## 📱 Деплой на GitHub Pages

```bash
npm run deploy
```
## 🤖 Подключение к боту

1. Создай бота через @BotFather
2. Используй команду /newapp
3. Укажи URL: https://твой-ник.github.io/telegram-mini-shop/
