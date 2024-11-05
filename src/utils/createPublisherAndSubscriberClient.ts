import { createClient, RedisClientType } from "redis";
const publisherClient = createClient();
const subscriberClient = createClient();
publisherClient.on("error", (err) => {
  console.log(`There was an error creating redis publisher clint. ${err}`);
});
subscriberClient.on("error", (err) => {
  console.log(`There was an error creating redis subscriber clint. ${err}`);
});

const connectToRedis = async () => {
  try {
    publisherClient.connect();
    subscriberClient.connect();
  } catch (error) {
    console.log(`Error connecting to redis ${error}`);
  }
};
export { connectToRedis, publisherClient, subscriberClient };
