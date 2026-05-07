# Vercel Access Token Setup Guide

Если вы видите уведомление **"Please set your Vercel Access Token in the extension..."** в VS Code, выполните следующие шаги:

## 1. Создайте токен доступа Vercel
1. Перейдите в настройки [Vercel Dashboard Settings](https://vercel.com/account/settings/tokens).
2. Нажмите **"Create"**.
3. Введите название (например, `VS Code Extension`).
4. Выберите область доступа (свой аккаунт или команду).
5. Нажмите **"Create"** и **скопируйте токен** (вы не увидите его снова!).

## 2. Установите токен в VS Code
1. Откройте VS Code.
2. Нажмите `Cmd + Shift + P` (Mac) или `Ctrl + Shift + P` (Windows).
3. Найдите: **"Vercel: Set Access Token"**.
4. Вставьте скопированный токен.
5. Нажмите `Enter`.

## Почему это полезно:
- **Environment Variables**: Вы сможете видеть и синхронизировать переменные окружения Vercel локально.
- **Deployments**: Вы сможете видеть статус развертывания прямо в боковой панели.

> [!TIP]
> Если вы не планируете использовать расширение Vercel, вы можете просто отключить его, но установка токена улучшит ваш опыт разработки.
