# Этап сборки
FROM node:18 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Собираем приложение
RUN npm run build

# Этап финального образа
FROM nginx:alpine

# Копируем собранные файлы из предыдущего этапа
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомную конфигурацию Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем favicon.ico в корень для Nginx
COPY --from=build /app/src/favicon.ico /usr/share/nginx/html/favicon.ico

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
