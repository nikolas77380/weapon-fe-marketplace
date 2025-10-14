# 📧 Frontend Email Confirmation System

## 🎯 Обзор системы

Полная система подтверждения email на фронтенде с красивым UI и автоматическими редиректами.

## 📁 Структура файлов

### **1. Страница подтверждения**
**`src/app/auth/confirm/page.tsx`** - Главная страница подтверждения email

```typescript
// Автоматическое подтверждение при переходе по ссылке
// Показывает статус: loading → success/error
// Автоматические редиректы: success → главная, error → авторизация
```

### **2. Хук для подтверждения**
**`src/hooks/useEmailConfirmation.ts`** - Переиспользуемый хук

```typescript
const { confirmEmail, isLoading, error } = useEmailConfirmation();

// Использование
const result = await confirmEmail(confirmationToken);
```

### **3. AuthContext интеграция**
**`src/context/AuthContext.tsx`** - Обновлен с поддержкой подтверждения

```typescript
const { handleEmailConfirmation } = useAuthContext();

// Автоматически сохраняет JWT и обновляет пользователя
const success = await handleEmailConfirmation(token);
```

### **4. Компонент уведомления**
**`src/components/auth/EmailConfirmationNotice.tsx`** - Красивые уведомления

```typescript
<EmailConfirmationNotice 
  email="user@example.com" 
  showSuccess={true} 
/>
```

### **5. Обновленная форма регистрации**
**`src/components/auth/RegisterForm.tsx`** - Показывает уведомления

```typescript
<RegisterForm 
  onSubmit={handleRegister}
  showEmailConfirmation={true}
  userEmail="user@example.com"
/>
```

## 🔄 Процесс работы

### **1. Регистрация пользователя**
```typescript
// Пользователь заполняет форму регистрации
const handleRegister = async (values) => {
  const response = await registerUser(values);
  
  if (response.success) {
    // Показываем уведомление о подтверждении
    setShowEmailConfirmation(true);
    setUserEmail(values.email);
  }
};
```

### **2. Отправка email**
```typescript
// Бэкенд отправляет email с ссылкой:
// https://esviem-defence.com/auth/confirm?confirmation=TOKEN
```

### **3. Переход по ссылке**
```typescript
// Пользователь переходит по ссылке
// Страница автоматически подтверждает аккаунт
useEffect(() => {
  const confirmEmail = async () => {
    const success = await handleEmailConfirmation(confirmationToken);
    
    if (success) {
      setStatus('success');
      // Автоматический редирект через 3 секунды
      setTimeout(() => router.push('/'), 3000);
    } else {
      setStatus('error');
      // Редирект на авторизацию через 5 секунд
      setTimeout(() => router.push('/auth'), 5000);
    }
  };
}, []);
```

### **4. Успешное подтверждение**
```typescript
// JWT токен сохраняется в localStorage
localStorage.setItem('jwt', data.jwt);
localStorage.setItem('user', JSON.stringify(data.user));

// Пользователь автоматически авторизован
// Редирект на главную страницу
```

## 🎨 UI/UX особенности

### **Состояния страницы подтверждения**

#### **Loading (Загрузка)**
```tsx
<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
</div>
<CardTitle>Підтвердження email...</CardTitle>
```

#### **Success (Успех)**
```tsx
<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
  <CheckCircle className="h-6 w-6 text-green-600" />
</div>
<CardTitle>Акаунт підтверджено!</CardTitle>
<Alert className="border-green-200 bg-green-50">
  <CheckCircle className="h-4 w-4 text-green-600" />
  <AlertDescription>Акаунт успішно підтверджено!</AlertDescription>
</Alert>
```

#### **Error (Ошибка)**
```tsx
<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
  <XCircle className="h-6 w-6 text-red-600" />
</div>
<CardTitle>Помилка підтвердження</CardTitle>
<Alert className="border-red-200 bg-red-50">
  <XCircle className="h-4 w-4 text-red-600" />
  <AlertDescription>Не вдалося підтвердити акаунт</AlertDescription>
</Alert>
```

### **Информация о пользователе**
```tsx
{user && status === 'success' && (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="font-semibold text-gray-900 mb-2">Інформація про акаунт:</h3>
    <div className="space-y-1 text-sm text-gray-600">
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Ім'я:</strong> {user.displayName}</p>
      <p><strong>Роль:</strong> {user.role.type === 'buyer' ? 'Покупець' : 'Продавець'}</p>
    </div>
  </div>
)}
```

## 🔧 Технические детали

### **Автоматические редиректы**
```typescript
// Успешное подтверждение → главная через 3 секунды
setTimeout(() => {
  router.push('/');
}, 3000);

// Ошибка → авторизация через 5 секунд
setTimeout(() => {
  router.push('/auth');
}, 5000);
```

### **Сохранение состояния**
```typescript
// JWT токен и пользователь сохраняются в localStorage
localStorage.setItem('jwt', data.jwt);
localStorage.setItem('user', JSON.stringify(data.user));

// AuthContext автоматически обновляется
setCurrentUser(data.user);
```

### **Обработка ошибок**
```typescript
try {
  const success = await handleEmailConfirmation(confirmationToken);
  // Обработка успеха
} catch (error) {
  console.error('Error confirming email:', error);
  setStatus('error');
  setMessage('Помилка підключення до сервера');
}
```

## 📱 Адаптивность

### **Мобильные устройства**
```css
/* Страница подтверждения адаптивна */
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 
                flex items-center justify-center p-4">
  <Card className="w-full max-w-md">
    {/* Контент */}
  </Card>
</div>
```

### **Кнопки действий**
```tsx
{status === 'success' && (
  <Button onClick={handleGoHome} className="w-full">
    Перейти на головну
  </Button>
)}

{status === 'error' && (
  <Button onClick={handleGoToAuth} variant="outline" className="w-full">
    Перейти до авторизації
  </Button>
)}
```

## 🚀 Интеграция с бэкендом

### **API запрос**
```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?confirmation=${confirmationToken}`,
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);
```

### **Обработка ответа**
```typescript
if (response.ok) {
  const data = await response.json();
  // data.jwt - JWT токен
  // data.user - данные пользователя
  // data.message - сообщение об успехе
} else {
  const data = await response.json();
  // data.error - ошибка
  // data.message - сообщение об ошибке
}
```

## 🎯 Полный флоу

### **1. Регистрация**
```
Пользователь → Форма регистрации → Бэкенд → Email отправлен
```

### **2. Подтверждение**
```
Email → Ссылка → Страница подтверждения → API запрос → Успех/Ошибка
```

### **3. Редирект**
```
Успех → Главная страница (авторизован)
Ошибка → Страница авторизации
```

## ✨ Преимущества

### **UX**
- ✅ **Автоматическое подтверждение** - без дополнительных действий
- ✅ **Красивый UI** - современный дизайн с анимациями
- ✅ **Информативность** - четкие сообщения о статусе
- ✅ **Автоматические редиректы** - удобная навигация

### **Технические**
- ✅ **Переиспользуемые компоненты** - хук и контекст
- ✅ **Обработка ошибок** - все сценарии покрыты
- ✅ **Адаптивность** - работает на всех устройствах
- ✅ **Интеграция с AuthContext** - единая система авторизации

**Система полностью готова к продакшену!** 🎉
