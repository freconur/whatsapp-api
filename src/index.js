const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Middlewares
app.use(cors());
app.use(express.json());

// Variables globales
let client = null;
let isReady = false;
let qrCodeData = null;

// Configuración de Puppeteer según el entorno
function getPuppeteerConfig() {
  if (isProduction) {
    // Configuración para PRODUCCIÓN (Docker, Railway, etc.)
    return {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions'
      ]
    };
  } else {
    // Configuración para DESARROLLO (más permisiva, mejor para debugging)
    return {
      headless: true, // Siempre headless para WhatsApp Web
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
        // Menos flags restrictivos para desarrollo
      ]
    };
  }
}

// Inicializar WhatsApp
function initWhatsApp() {
  const puppeteerConfig = getPuppeteerConfig();
  
  console.log(`🔧 Entorno: ${NODE_ENV}`);
  console.log(`🔧 Configuración Puppeteer: ${isProduction ? 'Producción' : 'Desarrollo'}`);
  
  client = new Client({
    authStrategy: new LocalAuth({
      dataPath: './.wwebjs_auth'
    }),
    puppeteer: puppeteerConfig
  });

  // Evento QR - MUY IMPORTANTE: Muestra el QR en la terminal
  client.on('qr', (qr) => {
    console.log('\n========================================');
    console.log('📱 ESCANEA ESTE QR CON WHATSAPP');
    console.log('========================================\n');
    qrcode.generate(qr, { small: true });
    console.log('\n========================================\n');
    qrCodeData = qr;
  });

  // Evento cuando está listo
  client.on('ready', () => {
    console.log('✅ WhatsApp conectado y listo!');
    isReady = true;
    qrCodeData = null;
  });

  // Evento de autenticación
  client.on('authenticated', () => {
    console.log('✅ Autenticado correctamente');
  });

  // Evento de error
  client.on('auth_failure', (msg) => {
    console.error('❌ Error de autenticación:', msg);
  });

  // Inicializar
  client.initialize();
}

// Endpoint para enviar mensaje
app.post('/send', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    // Validaciones
    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        error: 'phoneNumber y message son requeridos'
      });
    }

    if (!isReady) {
      return res.status(503).json({
        success: false,
        error: 'WhatsApp no está listo. Espera a que se conecte y escanea el QR que aparece en la terminal.'
      });
    }

    // Formatear número
    let number = phoneNumber.replace(/[^\d]/g, '');
    if (!phoneNumber.includes('@c.us')) {
      number = `${number}@c.us`;
    }

    // Enviar mensaje
    const result = await client.sendMessage(number, message);

    res.json({
      success: true,
      messageId: result.id._serialized,
      to: number
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint opcional para ver el QR en el navegador
app.get('/qr', async (req, res) => {
  try {
    if (!qrCodeData) {
      return res.json({
        success: false,
        message: isReady 
          ? 'Ya está conectado, no se requiere QR'
          : 'No hay QR disponible. Revisa la terminal del servidor.'
      });
    }

    // Generar QR como imagen
    const qrImage = await QRCode.toDataURL(qrCodeData, {
      width: 400,
      margin: 2
    });

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>WhatsApp QR</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: #f5f5f5;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
          }
          img {
            margin: 20px 0;
          }
          button {
            background: #25D366;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📱 Escanea este QR</h1>
          <img src="${qrImage}" alt="QR Code">
          <p>1. Abre WhatsApp en tu teléfono</p>
          <p>2. Ve a Configuración → Dispositivos vinculados</p>
          <p>3. Toca "Vincular un dispositivo"</p>
          <p>4. Escanea este código</p>
          <button onclick="location.reload()">🔄 Actualizar</button>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'WhatsApp API',
    endpoints: {
      send: 'POST /send',
      qr: 'GET /qr (Ver QR en navegador)'
    }
  });
});

// Inicializar WhatsApp
console.log('🚀 Iniciando WhatsApp...');
console.log(`🌍 Entorno: ${NODE_ENV}`);
console.log('📱 El QR aparecerá en esta terminal cuando sea necesario\n');
initWhatsApp();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor en http://localhost:${PORT}`);
  console.log(`📱 Ver QR en navegador: http://localhost:${PORT}/qr\n`);
});

// Cerrar graceful
process.on('SIGINT', async () => {
  console.log('\n⚠️ Cerrando...');
  if (client) {
    await client.destroy();
  }
  process.exit(0);
});
