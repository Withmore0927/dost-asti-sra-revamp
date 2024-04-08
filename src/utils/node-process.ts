const shutdownGraceFully = (error: Error) => {
  console.error(error);
  console.log(
    `${process.env.APP_NAME} Will Gracefully Shutdown in 10 Seconds.`,
  );

  setTimeout(() => {
    console.log(`${process.env.APP_NAME} Shutdown Gracefully!`);

    process.exit(0);
  }, 10000);
};

const closeServerOnUnhandledRejection = (reason: any, promise: any) => {
  console.error(reason, 'Unhandled Rejection at Promise', promise);
  console.log(
    `${process.env.APP_NAME} Will Shutdown Immediately Because of Unhandled Promise Rejection!`,
  );

  process.exit(1);
};

const closeServerOnUncaughtException = (error: any) => {
  console.error(error);

  console.log(
    `${process.env.APP_NAME} Will Shutdown Immediately Because of Uncaught Exception!`,
  );

  process.exit(1);
};

export default {
  shutdownGraceFully,
  closeServerOnUncaughtException,
  closeServerOnUnhandledRejection,
};
