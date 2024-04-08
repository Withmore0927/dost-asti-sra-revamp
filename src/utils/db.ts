import { PrismaClient } from '@prisma/client';

let connection: any;

if (process.env.NODE_ENV === 'development') {
  connection = new PrismaClient({
    errorFormat: 'pretty',
    log: [
      {
        emit: 'event',
        level: 'query',
      },
    ],
  });

  connection.$on('query', async (e: any) => {
    console.log(`${e.query} ${e.params}`);
  });
} else {
  connection = new PrismaClient({
    errorFormat: 'pretty',
    log: [{ level: 'info', emit: 'event' }],
  });

  connection.$on('event', async (e: any) => {
    console.log(`${e.event}`);
  });
}

export default connection;
