## Запуск проекта

### Docker
1. Создайте .env в backend/
    ```env
    
    PORT=4000
    BITRIX_WEBHOOK_URL="https://b24-r6r0d1.bitrix24.kz/rest/1/{TOKEN}/"

    # ID каталогов 
    BITRIX_DEVICES_SECTION_ID=11 
    BITRIX_PARTS_SECTION_ID=9
    BITRIX_SERVICES_SECTION_ID=7

2. Соберите и запустите:
   
   ```bash
   # Поднятие образа
   docker-compose up --build

3. Доступ:

  Frontend: http://localhost:3000

  Backend API: http://localhost:4000 

### Локально
1. Установите зависимости:
   
   ```bash
   cd backend && npm install
   cd ../webapp && npm install
   
2. Создайте .env в backend/
    ```env
    
    PORT=4000
    BITRIX_WEBHOOK_URL="https://b24-r6r0d1.bitrix24.kz/rest/1/{TOKEN}/"

    BITRIX_DEVICES_SECTION_ID=11 
    BITRIX_PARTS_SECTION_ID=9
    BITRIX_SERVICES_SECTION_ID=7
 
3. Запустите backend:

    ```bash
   cd backend
    npm run dev
4. Запустите webapp:

    ```bash
   cd webapp
    npm run dev
5. Доступ:

  Frontend: http://localhost:3000

  Backend API: http://localhost:4000

## Особенности
Также как было в документе было реализованно
- **Кэширование поиска** на фронтенде, для бэкенда стоило бы создавать образец redis, было принято решение сделать на фронте  
- **Оптимистичный UX**  
- **Доступность (a11y)** — поддержка клавиатурной навигации и экранных читалок  
- **Тёмная тема** — переключение светлой/тёмной темы  

## Демо Проекта


| Наш формат (`Product`)                | Bitrix поле    | Пример         |
| ------------------------------------- | -------------- | -------------- |
| `id`                                  | `PRODUCT_ID`   | 12345          |
| `name`                                | `PRODUCT_NAME` | "Ноутбук Dell" |
| `price`                               | `PRICE`        | 55000          |
| `quantity: number`                    | `QUANTITY`     | 2              |
| `currency`                            | `CURRENCY_ID`  | "RUB"          |




<img width="1267" height="632" alt="image" src="https://github.com/user-attachments/assets/8554016c-6e4c-4560-be7b-75939d08490a" />
<img width="1246" height="803" alt="image" src="https://github.com/user-attachments/assets/0dbb8e08-a0b3-473a-8f96-7046587e4e51" />
<img width="1250" height="868" alt="image" src="https://github.com/user-attachments/assets/3ba9a88e-f8e2-4be0-ab12-973edd4dd0dd" />
<img width="580" height="284" alt="image" src="https://github.com/user-attachments/assets/56d04654-3738-4d96-96da-2b59d6d3dc0d" />

## Примеры запросов (Валидных и не валидных)


<img width="1602" height="356" alt="image" src="https://github.com/user-attachments/assets/253634bd-ed95-4784-b623-201443e65810" />
<img width="1473" height="659" alt="image" src="https://github.com/user-attachments/assets/056c1a44-660e-4d7b-83e6-7063e91ff555" />
<img width="1487" height="605" alt="image" src="https://github.com/user-attachments/assets/3c205836-5f30-480e-b7bb-ab110bad41a5" />


<img width="1498" height="611" alt="image" src="https://github.com/user-attachments/assets/304d0405-4980-403f-a4e9-0136ee6f968b" />
<img width="1495" height="665" alt="image" src="https://github.com/user-attachments/assets/5dbcd307-324f-4fd4-b94d-5e208b6e691b" />

  
