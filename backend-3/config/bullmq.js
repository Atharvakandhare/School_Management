const { Queue, Worker } = require("bullmq");
const redisConnection = require("./redis");

const defaultJobOptions = {
  removeOnComplete: {
    age: 24 * 3600, // keep up to 24 hours
    count: 1000, // keep up to 1000 jobs
  },
  removeOnFail: {
    age: 24 * 3600 * 7, // keep up to 7 days
  },
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
};

const createQueue = (name) => {
  return new Queue(name, {
    connection: redisConnection,
    defaultJobOptions,
  });
};

const createWorker = (name, processor) => {
  return new Worker(name, processor, {
    connection: redisConnection,
    concurrency: 5,
  });
};

module.exports = {
  createQueue,
  createWorker,
};
