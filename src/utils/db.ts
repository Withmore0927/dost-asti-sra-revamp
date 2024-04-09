import { PrismaClient } from '@prisma/client';

const logLevel = process.env.NODE_ENV === 'development' ? 'query' : 'info';

const connection = new PrismaClient({
  errorFormat: 'pretty',
  log: [{ level: logLevel, emit: 'event' }],
});

connection.$on('info', async (e: any) => {
  console.log(`${e.event}`);
});

connection.$on('query', async (e: any) => {
  console.log(`${e.query} ${e.event}`);
});

export default connection;
