const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.nextjsFunc = onRequest(
  {
    region: 'us-central1',
    memory: '1GiB',
    timeoutSeconds: 60,
    maxInstances: 3,
    cors: true, // Habilita CORS automáticamente
    invoker: 'public', // Permite invocaciones públicas
  },
  async (req, res) => {
    try {
      // Headers CORS adicionales si es necesario
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      // Manejar preflight requests
      if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
      }

      logger.info("=== Starting Next.js Function ===", {
        url: req.url,
        method: req.method,
        cwd: process.cwd()
      });

      // Verificar que .next existe
      const fs = require('fs');
      const path = require('path');
      const nextPath = path.join(__dirname, '../.next');
      
      logger.info("Checking for .next directory at:", nextPath);
      
      if (!fs.existsSync(nextPath)) {
        logger.error(".next directory not found!");
        return res.status(500).json({
          error: '.next directory not found',
          path: nextPath,
          files: fs.readdirSync(__dirname + '/..')
        });
      }

      logger.info("Found .next directory, listing contents:");
      const nextContents = fs.readdirSync(nextPath);
      logger.info("Next.js build contents:", nextContents);

      // Verificar archivos críticos
      const requiredFiles = ['BUILD_ID', 'server'];
      for (const file of requiredFiles) {
        const filePath = path.join(nextPath, file);
        if (!fs.existsSync(filePath)) {
          logger.error(`Missing required file: ${file}`);
          return res.status(500).json({
            error: `Missing required Next.js file: ${file}`,
            available: nextContents
          });
        }
      }

      logger.info("All required Next.js files found, initializing...");

      const next = require('next');
      logger.info("Next.js module loaded successfully");

      const app = next({
        dev: false,
        dir: '../',
        customServer: true,
        quiet: false
      });

      logger.info("Next.js app created, preparing...");
      await app.prepare();
      logger.info("Next.js app prepared successfully");

      const handle = app.getRequestHandler();
      logger.info("Next.js handler obtained, processing request");

      return handle(req, res);

    } catch (error) {
      logger.error('Detailed Next.js error:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code
      });

      if (!res.headersSent) {
        res.status(500).json({
          error: 'Next.js initialization failed',
          message: error.message,
          stack: error.stack
        });
      }
    }
  }
);