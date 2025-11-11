# Usar imagen base de Node.js (LTS)
FROM node:20-slim

# Instalar dependencias del sistema necesarias para Puppeteer/Chromium
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de npm (Puppeteer viene como dependencia de whatsapp-web.js)
RUN npm ci --only=production

# Copiar el resto del código
COPY . .

# Crear directorio para datos de autenticación de WhatsApp
RUN mkdir -p .wwebjs_auth

# Exponer el puerto (Railway lo configurará automáticamente)
EXPOSE 3000

# Variables de entorno para Puppeteer
# Dejar que Puppeteer descargue su propio Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
ENV PUPPETEER_CACHE_DIR=/app/.cache/puppeteer

# Comando para iniciar la aplicación
CMD ["npm", "start"]

