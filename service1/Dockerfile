# Установите нужный базовый образ
FROM node:18
# Установите рабочую директорию
WORKDIR /usr/src/app
# Скопируйте package.json и package-lock.json
COPY package*.json ./
# Установите зависимости
RUN npm install --legacy-peer-deps
# Скопируйте остальные файлы
COPY . .
# Постройте проект
RUN npm run build
# Запустите приложение
CMD [ "npm", "run", "start:prod" ]