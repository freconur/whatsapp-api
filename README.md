# WhatsApp API REST

API REST para enviar mensajes de WhatsApp usando `whatsapp-web.js`.

## 🚀 Instalación

```bash
npm install
```

## 📝 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## 🔌 Endpoints

### 1. Estado del Cliente
**GET** `/api/messages/status`

Obtiene el estado actual del cliente de WhatsApp.

**Respuesta:**
```json
{
  "success": true,
  "status": {
    "isReady": true,
    "isAuthenticated": true,
    "isAuthenticating": false,
    "hasQrCode": false,
    "message": "Cliente listo para enviar mensajes"
  }
}
```

### 2. Enviar Mensaje
**POST** `/api/messages/send`

Envía un mensaje de WhatsApp.

**Body:**
```json
{
  "phoneNumber": "521234567890",
  "message": "Hola, este es un mensaje de prueba"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "messageId": "true_1234567890@c.us_3EB0...",
    "timestamp": 1234567890,
    "from": "tu_numero@c.us",
    "to": "521234567890@c.us"
  },
  "message": "Mensaje enviado exitosamente"
}
```

### 3. Obtener Código QR
**GET** `/api/messages/qr`

Obtiene el código QR actual para autenticación (si está disponible).

## 📱 Formato de Número de Teléfono

El número debe incluir el código de país sin el signo `+`:

- México: `521234567890`
- España: `34612345678`
- Argentina: `5491123456789`

O puedes usar el formato completo: `521234567890@c.us`

## ⚠️ Primera Vez

La primera vez que ejecutes la aplicación:

1. El servidor generará un código QR en la consola
2. Escanea el código QR con WhatsApp desde tu teléfono
3. Espera a ver el mensaje: `🚀 Cliente de WhatsApp está listo para enviar mensajes!`
4. Una vez listo, puedes enviar mensajes

## 🔧 Variables de Entorno

- `PORT`: Puerto del servidor (default: 3000)
- `NODE_ENV`: Entorno de ejecución (development/production)
  - **development**: Configuración más permisiva de Puppeteer, mejor para debugging
  - **production**: Configuración optimizada para Docker/Railway con flags restrictivos

### Configuración de Puppeteer por Entorno

El proyecto detecta automáticamente el entorno y ajusta la configuración de Puppeteer:

- **Desarrollo** (`NODE_ENV=development` o sin definir):
  - Configuración más permisiva
  - Menos flags restrictivos
  - Mejor para debugging local

- **Producción** (`NODE_ENV=production`):
  - Configuración optimizada para contenedores Docker
  - Flags adicionales para mejor rendimiento en servidores
  - Optimizado para Railway, AWS, etc.

## 📦 Dependencias

- `express`: Framework web
- `whatsapp-web.js`: Cliente de WhatsApp Web
- `qrcode-terminal`: Generación de QR en consola
- `cors`: Manejo de CORS

## 🐳 Docker

El proyecto incluye un `Dockerfile` configurado para producción. Puedes construir y ejecutar la imagen con:

```bash
# Construir la imagen
docker build -t whatsapp-api .

# Ejecutar el contenedor
docker run -p 3000:3000 whatsapp-api
```

## 🚂 Despliegue en Railway

### Requisitos previos
1. Cuenta en [Railway](https://railway.app)
2. Repositorio Git (GitHub, GitLab, etc.)

### Pasos para desplegar

1. **Conectar el repositorio a Railway:**
   - Ve a tu dashboard de Railway
   - Crea un nuevo proyecto
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio

2. **Configurar el despliegue:**
   - Railway detectará automáticamente el `Dockerfile`
   - El puerto se configurará automáticamente (Railway usa la variable `PORT`)

3. **Variables de entorno (opcional):**
   - `PORT`: Railway lo configura automáticamente, no necesitas cambiarlo
   - `NODE_ENV`: Se puede configurar como `production`

4. **Primera autenticación:**
   - Una vez desplegado, accede a la URL de Railway + `/qr` (ej: `https://tu-app.railway.app/qr`)
   - Escanea el código QR con WhatsApp
   - Los datos de autenticación se guardarán en el volumen persistente de Railway

### ⚠️ Notas importantes para Railway

- **Persistencia de datos**: Railway mantiene los datos del contenedor entre reinicios, pero si el servicio se elimina, perderás la autenticación de WhatsApp
- **Logs**: Puedes ver los logs en tiempo real desde el dashboard de Railway
- **QR Code**: Usa el endpoint `/qr` en el navegador para escanear el código fácilmente
- **Reinicios**: Si el servicio se reinicia, necesitarás volver a escanear el QR (a menos que los datos persistan)

### 🔍 Verificar el despliegue

Una vez desplegado, puedes verificar que funciona:
- `GET https://tu-app.railway.app/` - Debería mostrar información de la API
- `GET https://tu-app.railway.app/qr` - Muestra el código QR si es necesario

