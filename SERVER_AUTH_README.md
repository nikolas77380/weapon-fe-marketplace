# Серверная аутентификация в Next.js

Этот документ описывает, как использовать серверную аутентификацию в Next.js приложении.

## Файлы

### `src/lib/server-auth.ts`

Основной файл с серверными функциями аутентификации:

- `getServerSessionToken()` - получает токен сессии из cookies
- `getServerCurrentUser()` - получает данные текущего пользователя
- `requireAuth()` - проверяет аутентификацию и редиректит на /auth если пользователь не авторизован

## Использование в серверных компонентах

### Базовый пример

```tsx
import { requireAuth } from "@/lib/server-auth";

const ProtectedPage = async () => {
  const currentUser = await requireAuth();
  
  return (
    <div>
      <h1>Welcome, {currentUser.displayName}!</h1>
      {/* Ваш контент */}
    </div>
  );
};
```

### Условная проверка аутентификации

```tsx
import { getServerCurrentUser } from "@/lib/server-auth";

const OptionalAuthPage = async () => {
  const currentUser = await getServerCurrentUser();
  
  return (
    <div>
      {currentUser ? (
        <h1>Welcome, {currentUser.displayName}!</h1>
      ) : (
        <h1>Please log in</h1>
      )}
    </div>
  );
};
```

### Передача данных пользователя в компоненты

```tsx
import { requireAuth } from "@/lib/server-auth";
import UserProfile from "@/components/UserProfile";

const ProfilePage = async () => {
  const currentUser = await requireAuth();
  
  return (
    <div>
      <UserProfile user={currentUser} />
    </div>
  );
};
```

## Преимущества серверной аутентификации

1. **Лучшая производительность** - данные загружаются на сервере
2. **SEO-friendly** - контент рендерится на сервере
3. **Безопасность** - токены не передаются на клиент
4. **Простота** - меньше клиентского кода

## Миграция с клиентской аутентификации

### Было (клиентский компонент):
```tsx
"use client";
import { useAuthContext } from "@/context/AuthContext";

const Page = () => {
  const { currentUser } = useAuthContext();
  // ...
};
```

### Стало (серверный компонент):
```tsx
import { requireAuth } from "@/lib/server-auth";

const Page = async () => {
  const currentUser = await requireAuth();
  // ...
};
```

## Обработка ошибок

Функция `requireAuth()` автоматически редиректит на `/auth` если пользователь не авторизован. Если вам нужна кастомная обработка ошибок, используйте `getServerCurrentUser()`:

```tsx
import { getServerCurrentUser } from "@/lib/server-auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const currentUser = await getServerCurrentUser();
  
  if (!currentUser) {
    redirect("/custom-auth-page");
  }
  
  // ...
};
```
