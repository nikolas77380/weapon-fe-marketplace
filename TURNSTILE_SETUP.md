# Cloudflare Turnstile Integration

Этот проект интегрирован с Cloudflare Turnstile для защиты форм от ботов.

## 🏗️ Архитектура безопасности

### Почему нужна валидация на бэкенде?

**❌ Только фронтенд валидация:**
- Легко обходится ботами
- JavaScript можно отключить
- Код можно модифицировать в браузере
- Не защищает от автоматизированных атак

**✅ Двухуровневая валидация:**
1. **Фронтенд** - быстрая предварительная проверка (UX)
2. **Бэкенд** - надежная финальная валидация (Security)

### Схема работы:

```
[Пользователь] → [Turnstile Widget] → [Фронтенд валидация] → [Бэкенд валидация] → [Cloudflare API]
     ↓              ↓                      ↓                      ↓                    ↓
   Человек      Генерирует токен      Быстрая проверка      Надежная проверка    Финальная проверка
```

## Настройка

### 1. Получение ключей

1. Перейдите в [Cloudflare Dashboard](https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/)
2. Создайте новый виджет:
   - **Widget name**: Описательное имя для вашего виджета
   - **Hostname management**: Домены где будет использоваться виджет
   - **Widget mode**: Managed, Non-Interactive, или Invisible
3. Скопируйте **Site Key** и **Secret Key**

### 2. Конфигурация переменных окружения

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here
```

#### Backend (.env)
```bash
TURNSTILE_SECRET_KEY=your_secret_key_here
```

### 3. Режимы виджета

- **Managed**: Стандартный режим с чекбоксом
- **Non-Interactive**: Невидимый режим, автоматическая проверка
- **Invisible**: Полностью невидимый режим

## Использование

### 📝 Интегрированные формы

В проекте уже интегрированы следующие формы:

1. **Форма поддержки** (`ContactCompanyModal`) - модальная форма с Turnstile
2. **Форма регистрации** (`RegisterForm`) - регистрация пользователей
3. **Форма создания продукта** (`AddProductForms`) - добавление товаров продавцами

### 🚀 Умная валидация (Рекомендуется)

```tsx
import { useTurnstile } from "@/hooks/useTurnstile";
import { turnstileConfig } from "@/lib/turnstile";

const MyForm = () => {
  const [showTurnstile, setShowTurnstile] = useState(false);
  const turnstileFrontendConfig = turnstileConfig.getFrontendConfig();
  const turnstile = useTurnstile({
    siteKey: turnstileFrontendConfig?.siteKey || "",
    onError: (error) => console.error("Turnstile error:", error),
  });

  const handleSubmit = async (formData) => {
    // Проверяем базовую валидацию
    if (!formData.name || !formData.email) {
      return;
    }

    // Если Turnstile настроен, показываем его вместо отправки
    if (turnstileFrontendConfig && !showTurnstile) {
      setShowTurnstile(true);
      return;
    }

    // Проверяем валидацию Turnstile только если он показан
    if (turnstileFrontendConfig && showTurnstile && !turnstile.isVerified) {
      return;
    }

    // Отправляем форму
    await fetch("/api/form", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        turnstileToken: turnstile.token,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Поля формы */}
      
      {/* Turnstile виджет - показываем только после нажатия кнопки */}
      {turnstileFrontendConfig && showTurnstile && (
        <Turnstile
          siteKey={turnstileFrontendConfig.siteKey}
          onVerify={turnstile.onVerify}
          onError={turnstile.onError}
          onExpire={turnstile.onExpire}
        />
      )}
      
      <button 
        type="submit" 
        disabled={turnstileFrontendConfig && showTurnstile ? !turnstile.isVerified : false}
      >
        {turnstileFrontendConfig && !showTurnstile ? "Проверить форму" : "Отправить"}
      </button>
    </form>
  );
};
```

### 📋 Примеры использования

#### Форма регистрации
```tsx
// В компоненте регистрации
const handleRegister = async (values: RegisterFormValues) => {
  // Если Turnstile настроен, показываем его вместо отправки формы
  if (turnstileFrontendConfig && !showTurnstile) {
    setShowTurnstile(true);
    return;
  }

  // Проверяем валидацию Turnstile только если он показан
  if (turnstileFrontendConfig && showTurnstile && !turnstile.isVerified) {
    return;
  }

  await onSubmit({
    ...values,
    turnstileToken: turnstileFrontendConfig ? turnstile.token : null,
  });
};
```

#### Форма создания продукта
```tsx
// В компоненте создания продукта
const onSubmit = async (values: AddProductSchemaValues) => {
  // Если Turnstile настроен, показываем его вместо отправки формы
  if (turnstileFrontendConfig && !showTurnstile) {
    setShowTurnstile(true);
    return;
  }

  // Проверяем валидацию Turnstile только если он показан
  if (turnstileFrontendConfig && showTurnstile && !turnstile.isVerified) {
    return;
  }

  await createProduct({ 
    data: productData, 
    images: values.productImages,
    turnstileToken: turnstileFrontendConfig ? turnstile.token : null,
  });
};
```

### В компонентах React (Базовая версия)

```tsx
import Turnstile from "@/components/ui/turnstile";
import { useTurnstile } from "@/hooks/useTurnstile";
import { turnstileConfig } from "@/lib/turnstile";

const MyForm = () => {
  const turnstileFrontendConfig = turnstileConfig.getFrontendConfig();
  const turnstile = useTurnstile({
    siteKey: turnstileFrontendConfig?.siteKey || "",
    onError: (error) => console.error("Turnstile error:", error),
  });

  const handleSubmit = async (formData) => {
    // Проверяем валидацию Turnstile
    if (turnstileFrontendConfig && !turnstile.isVerified) {
      return;
    }

    // Отправляем данные с токеном
    await fetch("/api/form", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        turnstileToken: turnstile.token,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Поля формы */}
      
      {/* Turnstile виджет */}
      {turnstileFrontendConfig && (
        <Turnstile
          siteKey={turnstileFrontendConfig.siteKey}
          onVerify={turnstile.onVerify}
          onError={turnstile.onError}
          onExpire={turnstile.onExpire}
          theme="auto"
          size="normal"
        />
      )}
      
      <button 
        type="submit" 
        disabled={turnstileFrontendConfig && !turnstile.isVerified}
      >
        Submit
      </button>
    </form>
  );
};
```

### На бэкенде (Strapi)

#### Автоматическая валидация с middleware

```typescript
// В routes файле (например: src/api/product/routes/product.ts)
import { smartTurnstile, requireTurnstile } from "../../middlewares/turnstile-middleware";

export default {
  routes: [
    {
      method: "POST",
      path: "/products",
      handler: "product.create",
      config: {
        middlewares: [smartTurnstile], // Автоматическая валидация Turnstile
      },
    },
    {
      method: "POST", 
      path: "/contact",
      handler: "contact.send",
      config: {
        middlewares: [requireTurnstile], // Обязательная валидация Turnstile
      },
    },
  ],
};
```

**Примечание:** Middleware автоматически:
- Проверяет наличие `turnstileToken` в теле запроса
- Валидирует токен с Cloudflare API
- Пропускает валидацию если Turnstile не настроен (для `smartTurnstile`)
- Возвращает ошибку 400 если валидация не прошла

#### Ручная валидация в контроллерах

```typescript
import { validateTurnstileToken } from "../../../utils/turnstile";

export default {
  async create(ctx) {
    // Валидация Turnstile токена
    const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
    
    if (turnstileSecretKey) {
      const clientIP = ctx.request.ip || ctx.request.connection?.remoteAddress;
      const turnstileValidation = await validateTurnstileToken({
        token: ctx.request.body.turnstileToken,
        secretKey: turnstileSecretKey,
        remoteip: clientIP,
      });

      if (!turnstileValidation.success) {
        return ctx.badRequest("Security verification failed. Please try again.");
      }
    }

    // Обработка формы...
  }
};
```

### 📋 Обновленные API endpoints

Следующие endpoints теперь поддерживают Turnstile валидацию:

1. **POST /api/auth/local/register** - Регистрация пользователей
2. **POST /api/products** - Создание продуктов
3. **POST /api/support-form/send-email** - Отправка формы поддержки
4. **POST /api/turnstile-validation/validate** - Валидация Turnstile токенов

### 🔧 Middleware для автоматической защиты

Создан универсальный middleware для защиты любых routes:

```typescript
// Обязательная валидация
import { requireTurnstile } from "../middlewares/turnstile-middleware";

// Опциональная валидация
import { optionalTurnstile } from "../middlewares/turnstile-middleware";

// Умная валидация (пропускает если не настроено)
import { smartTurnstile } from "../middlewares/turnstile-middleware";
```

## Компоненты

- `Turnstile` - React компонент для отображения виджета
- `useTurnstile` - Базовый хук для управления состоянием Turnstile
- `useSmartTurnstile` - Умный хук с двухуровневой валидацией
- `TurnstileFormWrapper` - Универсальная обертка для интеграции в любые формы
- `turnstileConfig` - Конфигурация ключей
- `validateTurnstileToken` - Утилита для валидации токена на бэкенде

## 🎯 Преимущества двухуровневой валидации

### Для пользователей:
- ⚡ **Быстрый отклик** - фронтенд проверка мгновенная
- 🎨 **Лучший UX** - нет задержек при отправке формы
- 🔄 **Автоматический retry** - система сама перепроверяет токены

### Для разработчиков:
- 🛡️ **Максимальная безопасность** - двойная защита
- 🔧 **Гибкость** - можно отключить бэкенд валидацию для тестов
- 📊 **Мониторинг** - детальные логи валидации
- 🚀 **Производительность** - оптимизированные запросы

### Для безопасности:
- 🚫 **Защита от ботов** - невозможно обойти обе проверки
- 🔒 **Валидация токенов** - проверка на подлинность
- 🌐 **IP проверка** - дополнительная защита по IP
- ⏰ **Время жизни токенов** - защита от replay атак

## Безопасность

- **Site Key** - публичный ключ, безопасен для использования на фронтенде
- **Secret Key** - приватный ключ, должен храниться только на бэкенде
- Токены имеют ограниченное время жизни
- Каждый токен можно использовать только один раз

## 🧪 Тестирование

### Быстрый тест

1. **Настройте тестовые ключи:**
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
   
   # Backend (.env)
   TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
   ```

2. **Запустите серверы:**
   ```bash
   # Backend
   cd marketplace-api && npm run develop
   
   # Frontend  
   cd marketplace && npm run dev
   ```

3. **Протестируйте формы:**
   - Откройте форму регистрации
   - Заполните поля и нажмите "Создать аккаунт"
   - Должен появиться Turnstile виджет
   - После прохождения проверки форма отправится

### Проверка логов

В консоли бэкенда вы должны увидеть:
```
✅ Turnstile validation passed
=== CUSTOM REGISTER CONTROLLER CALLED ===
```

## 🔧 Решение проблем

### Ошибка 400 Bad Request

Если вы видите ошибку `400 Bad Request` в Network tab:

1. **Проверьте site key:**
   ```bash
   # Убедитесь, что ключ правильно настроен
   echo $NEXT_PUBLIC_TURNSTILE_SITE_KEY
   ```

2. **Используйте тестовые ключи для разработки:**
   ```bash
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
   ```

3. **Проверьте домен в Cloudflare Dashboard:**
   - Убедитесь, что ваш домен добавлен в "Hostname management"
   - Для localhost используйте `localhost` или `127.0.0.1`

### Виджет не загружается

1. **Проверьте консоль браузера** на ошибки JavaScript
2. **Убедитесь, что скрипт загружается:**
   ```javascript
   // В консоли браузера
   console.log(window.turnstile);
   ```

3. **Проверьте блокировку рекламы:**
   - Некоторые блокировщики рекламы блокируют Turnstile
   - Попробуйте отключить их временно

### Форма отправляется без валидации

1. **Проверьте логику валидации:**
   ```typescript
   // Убедитесь, что проверка работает
   if (turnstileFrontendConfig && !turnstile.isVerified) {
     return; // Не отправлять форму
   }
   ```

2. **Проверьте состояние Turnstile:**
   ```typescript
   console.log("Turnstile verified:", turnstile.isVerified);
   console.log("Turnstile token:", turnstile.token);
   ```

## Отладка

### Тестовые ключи

Для разработки можно использовать тестовые ключи:

```bash
# Тестовый site key (всегда проходит валидацию)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA

# Тестовый secret key
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

**Важно:** Тестовые ключи работают только в development режиме. В production используйте реальные ключи из Cloudflare Dashboard.

### Логирование

Включите детальное логирование в консоли браузера для отладки:

```javascript
// В консоли браузера
window.turnstile = {
  render: (element, options) => {
    console.log('Turnstile render:', options);
    return 'test-widget-id';
  },
  reset: (widgetId) => console.log('Turnstile reset:', widgetId),
  remove: (widgetId) => console.log('Turnstile remove:', widgetId),
  getResponse: (widgetId) => 'test-token'
};
```

## Поддержка

- [Cloudflare Turnstile Documentation](https://developers.cloudflare.com/turnstile/)
- [Widget Management Dashboard](https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/)
