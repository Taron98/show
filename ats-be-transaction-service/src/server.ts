/** @format */

import { openConnectionToDb } from '@atservicesv2/common';
import { app } from './app';
import { Logger } from '@atservicesv2/common';

const port = process.env.PORT || 3000;

const logger = Logger({
  service: __filename,
});

app.listen(port, async () => {
  // Notify the developer
  logger.info(`The service has been started successfully on port ${port}!`);
  await openConnectionToDb();
  // List all routes
  app._router.stack
    .filter(r => r.route)
    .map(r => {
      const method = Object.keys(r.route.methods)[0];
      const path = `http://localhost:${port}${r.route.path}`;
      const formatString = '\x1b[36m%s\x1b[0m\t\x1b[33m%s\x1b[0m';
      logger.info(formatString, method, path);
    });
});
