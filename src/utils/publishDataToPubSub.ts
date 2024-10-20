import { createClient } from "redis";
const publishClient = createClient();
publishClient.on("error", (err) => {
  console.log(`There was an error creating redis publish clint. ${err}`);
});
const connectToRedis = async () => {
  try {
    await publishClient.connect();
  } catch (error) {
    console.log(`Error connecting to redis ${error}`);
  }
};

const publishDataToPubSub = async (
  data: {
    yes: {
      [key: number]: {
        total: number;
      };
    };
    no: {
      [key: number]: {
        total: number;
      };
    };
  },
  stockSymbol: string
) => {
  const orderBook = JSON.stringify(data);
  try {
    await publishClient.set(`lastMessage:${stockSymbol}`, orderBook);
    await publishClient.publish(stockSymbol, orderBook);
  } catch (error) {
    console.log(`Error publishing data: ${error}`);
  }
};

export { connectToRedis, publishDataToPubSub };
