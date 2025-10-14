# Elasticsearch Quick Start Guide

## 🚀 Быстрый старт

### 1. Запуск Elasticsearch в Docker

```bash
# Создайте docker-compose файл для Elasticsearch
cat > docker-compose.elasticsearch.yml << EOF
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.15.0
    container_name: marketplace-elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
      - "9300:9300"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

volumes:
  elasticsearch_data:
EOF

# Запустите Elasticsearch
docker-compose -f docker-compose.elasticsearch.yml up -d
```

### 2. Настройка API

```bash
cd marketplace-api

# Добавьте переменные окружения в .env
echo "ELASTICSEARCH_URL=http://localhost:9200" >> .env
echo "ELASTICSEARCH_USERNAME=elastic" >> .env
echo "ELASTICSEARCH_PASSWORD=changeme" >> .env

# Установите зависимости (уже установлены)
# npm install

# Синхронизируйте данные с Elasticsearch
npm run sync-elasticsearch

# Запустите API
npm run dev
```

### 3. Проверка работы

```bash
# Проверьте Elasticsearch
curl http://localhost:9200

# Проверьте API
curl "http://localhost:1337/api/products/search/elastic/public?search=test"

# Проверьте агрегации
curl "http://localhost:1337/api/products/aggregations/public"
```

## 📋 Новые API Endpoints

### Поиск продуктов
- `GET /api/products/search/elastic/public` - Публичный поиск
- `GET /api/products/search/elastic` - Авторизованный поиск

### Агрегации для фильтров
- `GET /api/products/aggregations/public` - Публичные агрегации
- `GET /api/products/aggregations` - Авторизованные агрегации

### Параметры запроса

#### Поиск
- `search` - Поисковый запрос
- `categorySlug` - Фильтр по категории
- `priceRange` - JSON строка с min/max ценами
- `tags` - Массив slug тегов
- `status` - Статус продукта
- `sort` - Сортировка (например, "price:asc")
- `page` - Номер страницы
- `pageSize` - Количество элементов на странице

#### Агрегации
- `categorySlug` - Фильтр по категории
- `priceRange` - JSON строка с min/max ценами
- `tags` - Массив slug тегов
- `status` - Статус продукта

## 🎯 Использование на фронтенде

### Хуки для поиска

```typescript
import { useElasticSearch, useElasticAggregations } from '@/hooks/useElasticSearch';

function SearchComponent() {
  const { data: products, meta, loading, error } = useElasticSearch({
    search: 'laptop',
    categorySlug: 'electronics',
    pagination: { page: 1, pageSize: 10 }
  });

  const { aggregations } = useElasticAggregations({
    categorySlug: 'electronics'
  });

  return (
    <div>
      {/* Рендер продуктов и фильтров */}
    </div>
  );
}
```

## 🔧 Автоматическая синхронизация

Продукты автоматически индексируются в Elasticsearch при:
- Создании нового продукта
- Обновлении существующего продукта
- Удалении продукта

## 📊 Мониторинг

```bash
# Статус индекса
curl "http://localhost:9200/products/_stats"

# Поиск по всем продуктам
curl "http://localhost:9200/products/_search?pretty"

# Маппинг индекса
curl "http://localhost:9200/products/_mapping?pretty"
```

## 🐛 Устранение неполадок

### Elasticsearch не запускается
```bash
# Проверьте логи
docker logs marketplace-elasticsearch

# Проверьте статус
docker ps | grep elasticsearch
```

### API не может подключиться к Elasticsearch
- Проверьте переменные окружения
- Убедитесь, что Elasticsearch запущен на порту 9200
- Проверьте настройки сети

### Синхронизация не работает
```bash
# Удалите индекс и пересоздайте
curl -X DELETE "http://localhost:9200/products"
npm run sync-elasticsearch
```

## 📈 Производительность

Для продакшена рекомендуется:
- Увеличить heap size Elasticsearch
- Настроить количество шардов и реплик
- Использовать кэширование агрегаций
- Оптимизировать запросы

## 🔒 Безопасность

Для продакшена:
- Включите безопасность Elasticsearch
- Используйте HTTPS
- Настройте аутентификацию
- Ограничьте доступ к портам
