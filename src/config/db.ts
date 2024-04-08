const config =
  process.env.NODE_ENV === 'development'
    ? {
        log: [
          {
            emit: 'event',
            level: 'query',
          },
        ],
      }
    : {
        log: [
          {
            emit: 'event',
            level: 'info',
          },
        ],
      };

export default config;
