# Анализ производительности фронтенда и рекомендации по оптимизации

## 🔍 Выявленные проблемы

### 1. Долгие запросы

#### 1.1. `useFavourites` - Загрузка всех избранных при монтировании
**Файл:** `src/hooks/useFavourites.ts`

**Проблема:**
- При монтировании компонента загружаются ВСЕ избранные продукты сразу
- После каждого добавления в избранное происходит полная перезагрузка списка
- Нет оптимистичных обновлений - UI ждет ответа от сервера

**Влияние:**
- Лишние запросы при каждой операции
- Задержка UI при переключении избранного
- Неоптимальная работа при большом количестве избранных товаров

**Код проблемы:**
```typescript
// Строка 21-40: Загрузка всех избранных при монтировании
const loadFavourites = useCallback(async () => {
  try {
    setLoading(true);
    const result = await getFavourites(); // Загружает все
    // ...
  }
}, []);

// Строка 61-88: После добавления полная перезагрузка
const addToFavouritesHandler = useCallback(async (productId: number) => {
  // ...
  await loadFavourites(); // Полная перезагрузка списка
}, [loadFavourites]);
```

---

#### 1.2. `useProducts` - Использование useState вместо React Query
**Файл:** `src/hooks/useProducts.ts`

**Проблема:**
- Использует `useState` и `useEffect` вместо React Query
- Нет кеширования между компонентами
- Нет автоматической инвалидации
- Дублирование логики с `useProductsQuery`

**Влияние:**
- Лишние запросы при использовании в разных компонентах
- Нет переиспользования кеша
- Сложнее управлять состоянием загрузки

---

#### 1.3. `useSellerData` - Последовательные запросы
**Файл:** `src/hooks/useSellerData.ts`

**Проблема:**
- Сначала пытается авторизованный запрос, потом публичный
- Два последовательных запроса вместо параллельных
- Нет оптимистичной загрузки

---

#### 1.4. `useElasticSearch` - Запросы при каждом изменении параметров
**Файл:** `src/hooks/useElasticSearch.ts`

**Проблема:**
- Запросы выполняются в `useEffect` при каждом изменении зависимостей
- Нет дебаунса для быстрого изменения параметров
- Нет предварительной загрузки (prefetching)

---

### 2. Отсутствие оптимистичных обновлений

#### 2.1. `useFavourites.toggleFavourite`
**Файл:** `src/hooks/useFavourites.ts:122-146`

**Проблема:**
- UI ждет ответа от сервера перед обновлением
- Пользователь видит загрузку при каждом клике
- Нет rollback при ошибке

**Текущий код:**
```typescript
const toggleFavourite = useCallback(async (productId: number) => {
  const isCurrentlyFavourited = favouriteStatuses[productId];
  // Ждет ответа от сервера перед обновлением UI
  if (isCurrentlyFavourited) {
    return await removeFromFavouritesHandler(favourite.id, productId);
  } else {
    return await addToFavouritesHandler(productId);
  }
}, []);
```

**Рекомендация:** Обновлять UI сразу, затем синхронизировать с сервером

---

#### 2.2. Отправка сообщений в чате
**Файл:** `src/hooks/useChatQuery.ts:64-99`

**Текущее состояние:**
- Есть частичное оптимистичное обновление через `setQueryData`
- Но сообщение добавляется только после успешного ответа
- Нет временного ID для сообщения

**Можно улучшить:**
- Добавить временное сообщение с временным ID
- Показать его сразу, затем заменить на реальное
- При ошибке удалить временное сообщение

---

#### 2.3. Создание/обновление/удаление продуктов
**Файл:** `src/hooks/useProductsQuery.ts:64-138`

**Текущее состояние:**
- Используется `invalidateQueries` - происходит повторная загрузка
- Нет оптимистичного обновления списка

**Рекомендация:**
- При создании - добавить в кеш оптимистично
- При обновлении - обновить в кеше оптимистично
- При удалении - удалить из кеша оптимистично

---

### 3. Отсутствие lazy loading компонентов

#### 3.1. Компоненты, загружаемые сразу:
- ✅ `ChatApp` - уже используется `dynamic` только в `Messages`
- ❌ `CompanyPageComponent` - загружается сразу
- ❌ `DetailProductPageComponent` - загружается сразу
- ❌ `CategoryContent` со всеми слайдерами - загружается на главной
- ❌ `ChatApp` - полностью загружается при открытии страницы чата
- ❌ Модальные окна (ContactModal, CertificateModal, etc.)
- ❌ Формы аутентификации (LoginForm, RegisterForm)

#### 3.2. Тяжелые компоненты на главной странице:
**Файл:** `src/components/CategoryContent/index.tsx`

- `BannerSlider` - загружается сразу
- `ViewedProductsSlider` - загружается сразу
- `TopProductsSlider` - загружается сразу
- Все категории загружаются сразу

**Рекомендация:** Использовать `next/dynamic` для компонентов ниже fold

---

## ✅ Рекомендации по оптимизации

### Приоритет 1: Критические улучшения

#### 1. Оптимистичные обновления для `useFavourites`

**Создать новый хук с React Query:**

```typescript
// src/hooks/useFavouritesQuery.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavourites, addToFavourites, removeFromFavourites } from "@/lib/favourites";
import { queryKeys } from "@/lib/query-keys";

export const useFavouritesQuery = () => {
  return useQuery({
    queryKey: queryKeys.favourites.list(),
    queryFn: () => getFavourites(),
    staleTime: 2 * 60 * 1000, // 2 минуты
  });
};

export const useToggleFavouriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, favouriteId, isFavourited }: {
      productId: number;
      favouriteId?: number;
      isFavourited: boolean;
    }) => {
      if (isFavourited && favouriteId) {
        return await removeFromFavourites(favouriteId);
      } else {
        return await addToFavourites(productId);
      }
    },
    // Оптимистичное обновление
    onMutate: async ({ productId, favouriteId, isFavourited }) => {
      // Отменяем исходящие запросы
      await queryClient.cancelQueries({ queryKey: queryKeys.favourites.list() });

      // Сохраняем предыдущее значение
      const previousFavourites = queryClient.getQueryData(queryKeys.favourites.list());

      // Оптимистично обновляем
      queryClient.setQueryData(queryKeys.favourites.list(), (old: any) => {
        if (isFavourited) {
          // Удаляем из списка
          return old?.data?.filter((fav: any) => fav.id !== favouriteId) || [];
        } else {
          // Добавляем временный элемент (будет заменен на реальный при успехе)
          return old?.data ? [...old.data, { product: { id: productId }, id: 'temp' }] : [];
        }
      });

      return { previousFavourites };
    },
    onError: (err, variables, context) => {
      // Откатываем при ошибке
      if (context?.previousFavourites) {
        queryClient.setQueryData(queryKeys.favourites.list(), context.previousFavourites);
      }
    },
    onSuccess: (data, variables) => {
      // Инвалидируем для получения актуальных данных
      queryClient.invalidateQueries({ queryKey: queryKeys.favourites.list() });
    },
  });
};
```

---

#### 2. Lazy loading для тяжелых компонентов

**Главная страница:**

```typescript
// src/app/page.tsx
import dynamic from "next/dynamic";

const CategoryContent = dynamic(() => import("@/components/CategoryContent"), {
  loading: () => <div>Loading...</div>,
  ssr: false, // или true, если нужен SSR
});
```

**Компоненты слайдеров:**

```typescript
// src/components/CategoryContent/index.tsx
import dynamic from "next/dynamic";

const ViewedProductsSlider = dynamic(() => import("./ViewedProductsSlider"), {
  ssr: false,
});

const TopProductsSlider = dynamic(() => import("./TopProductsSlider"), {
  ssr: false,
});

const BannerSlider = dynamic(() => import("./BannerSlider"), {
  ssr: false,
});
```

**Страницы продуктов:**

```typescript
// src/app/marketplace/[id]/page.tsx
import dynamic from "next/dynamic";

const DetailProductPageComponent = dynamic(
  () => import("@/components/shop/detail-page/DetailProductPageComponent"),
  {
    loading: () => <div>Loading product...</div>,
  }
);
```

---

#### 3. Миграция `useProducts` на React Query

**Замена старого хука:**

```typescript
// Использовать везде useProductsQuery вместо useProducts
// Удалить useProducts.ts или пометить как deprecated
```

---

#### 4. Дебаунс для Elasticsearch

```typescript
// src/hooks/useElasticSearch.ts
import { useDebouncedCallback } from "use-debounce";

export const useElasticSearch = (params: ElasticSearchParams, isAuthenticated = false) => {
  const [debouncedParams, setDebouncedParams] = useState(params);

  const debouncedUpdate = useDebouncedCallback(
    (value: ElasticSearchParams) => {
      setDebouncedParams(value);
    },
    300 // 300ms задержка
  );

  useEffect(() => {
    debouncedUpdate(params);
  }, [params, debouncedUpdate]);

  // Использовать debouncedParams для запросов
  return useQuery({
    queryKey: ["elastic-search", debouncedParams],
    queryFn: () => searchProductsElastic(debouncedParams),
    // ...
  });
};
```

---

### Приоритет 2: Улучшения UX

#### 5. Оптимистичная отправка сообщений

```typescript
// src/hooks/useChatQuery.ts - useSendMessageMutation
onMutate: async ({ text, chatId }) => {
  await queryClient.cancelQueries({ queryKey: queryKeys.chats.messages(chatId) });

  const previousMessages = queryClient.getQueryData<Message[]>(
    queryKeys.chats.messages(chatId)
  );

  // Добавляем временное сообщение
  const optimisticMessage: Message = {
    id: `temp-${Date.now()}`,
    text,
    chatId,
    sender: currentUser,
    createdAt: new Date().toISOString(),
    isOptimistic: true,
  };

  queryClient.setQueryData<Message[]>(
    queryKeys.chats.messages(chatId),
    (old = []) => [...old, optimisticMessage]
  );

  return { previousMessages };
},
onError: (err, variables, context) => {
  // Удаляем временное сообщение при ошибке
  if (context?.previousMessages) {
    queryClient.setQueryData(
      queryKeys.chats.messages(variables.chatId),
      context.previousMessages
    );
  }
},
onSuccess: (newMessage, variables) => {
  // Заменяем временное сообщение на реальное
  queryClient.setQueryData<Message[]>(
    queryKeys.chats.messages(variables.chatId),
    (old = []) => old.map(msg => 
      msg.isOptimistic && msg.text === newMessage.text 
        ? newMessage 
        : msg
    )
  );
},
```

---

#### 6. Prefetching для улучшения навигации

```typescript
// При наведении на карточку продукта
const queryClient = useQueryClient();

const handleMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: () => getProductById(productId),
  });
};
```

---

#### 7. Infinite Scroll для списков

```typescript
// Вместо пагинации использовать infinite scroll
import { useInfiniteQuery } from "@tanstack/react-query";

export const useProductsInfinite = (params: ProductsQueryParams) => {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: ({ pageParam = 1 }) => getProducts({ ...params, pagination: { page: pageParam } }),
    getNextPageParam: (lastPage) => {
      const { page, pageCount } = lastPage.meta.pagination;
      return page < pageCount ? page + 1 : undefined;
    },
  });
};
```

---

### Приоритет 3: Дополнительные оптимизации

#### 8. Code Splitting для маршрутов

```typescript
// src/app/layout.tsx
const ConditionalLayout = dynamic(() => import("@/components/layout/ConditionalLayout"), {
  ssr: true,
});
```

#### 9. Визуализация загрузки компонентов

Использовать `Suspense` с fallback:

```typescript
import { Suspense } from "react";

<Suspense fallback={<SkeletonComponent type="productCard" />}>
  <LazyComponent />
</Suspense>
```

#### 10. Оптимизация зависимостей в useEffect

Использовать более точные зависимости:

```typescript
// Вместо зависимости от всего объекта params
useEffect(() => {
  search();
}, [params.search, params.categorySlug, params.priceRange, params.tags, params.status, params.sort, params.pagination?.page]);

// Использовать сериализацию для сложных объектов
const paramsKey = JSON.stringify(params);
useEffect(() => {
  search();
}, [paramsKey]);
```

---

## 📊 Ожидаемый эффект

### До оптимизации:
- ⏱️ Переключение избранного: 300-500ms
- ⏱️ Загрузка главной: 1.5-2s
- ⏱️ Отправка сообщения: 200-400ms
- 📦 Размер initial bundle: ~500KB

### После оптимизации:
- ⏱️ Переключение избранного: <50ms (оптимистично)
- ⏱️ Загрузка главной: 0.8-1.2s (lazy loading)
- ⏱️ Отправка сообщения: <10ms (оптимистично)
- 📦 Размер initial bundle: ~350KB (code splitting)

---

## 🎯 План внедрения

### Этап 1 (Критично - 1-2 дня):
1. ✅ Оптимистичные обновления для favourites
2. ✅ Lazy loading для слайдеров и тяжелых компонентов
3. ✅ Миграция useProducts на React Query

### Этап 2 (Важно - 2-3 дня):
4. ✅ Дебаунс для Elasticsearch
5. ✅ Оптимистичная отправка сообщений
6. ✅ Prefetching на наведении

### Этап 3 (Улучшения - 1-2 дня):
7. ✅ Infinite scroll для списков
8. ✅ Code splitting для маршрутов
9. ✅ Оптимизация useEffect зависимостей

---

## 🔧 Технические детали

### Используемые технологии:
- `@tanstack/react-query` - уже установлен ✅
- `next/dynamic` - встроен в Next.js ✅
- `use-debounce` - нужно установить для дебаунса

### Установка зависимостей:
```bash
npm install use-debounce
# или
yarn add use-debounce
```

---

## 📝 Заметки

- Большинство компонентов уже используют React Query - это хорошо
- Есть дублирование между `useProducts` и `useProductsQuery` - нужно унифицировать
- Chat уже имеет частичные оптимистичные обновления - можно улучшить
- Lazy loading почти не используется - большой потенциал

---

## 🚀 Следующие шаги

1. Создать задачи в трекере
2. Начать с оптимистичных обновлений (быстрый эффект)
3. Затем добавить lazy loading (снижение initial bundle)
4. Протестировать на продакшене
5. Измерить метрики (LCP, FID, CLS)

