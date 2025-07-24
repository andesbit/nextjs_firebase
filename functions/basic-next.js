exports.nextjsFunc = onRequest(
  {
    region: 'us-central1',
    memory: '1GiB',
    timeoutSeconds: 60,
  },
  async (req, res) => {
    try {
      logger.info("Attempting to load Next.js");
      
      // Verificar que .next existe
      const fs = require('fs');
      const path = require('path');
      const nextPath = path.join(__dirname, '../.next');
      
      if (!fs.existsSync(nextPath)) {
        throw new Error('.next directory not found at: ' + nextPath);
      }
      
      logger.info("Found .next directory, initializing Next.js");
      
      const next = require('next');
      const app = next({ dev: false, dir: '../' });
      
      await app.prepare();
      const handle = app.getRequestHandler();
      
      logger.info("Next.js initialized successfully");
      return handle(req, res);
      
    } catch (error) {
      logger.error('Detailed error:', {
        message: error.message,
        stack: error.stack,
        cwd: process.cwd(),
        nextPath: require('path').join(__dirname, '../.next')
      });
      
      res.status(500).json({ 
        error: 'Next.js initialization failed',
        message: error.message 
      });
    }
  }
);