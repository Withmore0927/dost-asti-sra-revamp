import 'dotenv/config';
import app from './app';
import { nodeProcess } from './utils';

const PORT = process.env.PORT;

const APP_NAME = process.env.APP_NAME;

app.listen(PORT, () =>
  console.log(`${APP_NAME} is listening on port: ${PORT}`),
);

// shutdown Immediately on unhandled Rejection or Uncaught Exception
process.on('uncaughtException', nodeProcess.closeServerOnUncaughtException);
process.on('unhandledRejection', nodeProcess.closeServerOnUnhandledRejection);

// gracefully shutdown on SIGTERM AND SIGINT signal
process.on('SIGINT', nodeProcess.shutdownGraceFully);
process.on('SIGTERM', nodeProcess.shutdownGraceFully);
