import { subscriberClient } from "./createPublisherAndSubscriberClient";
import { ResponseStatus } from "./types";
const waitForTheResponse = (
  id: string
): Promise<{
  response: {};
  statusCode: ResponseStatus;
}> => {
  return new Promise((resolve, reject) => {
    subscriberClient.subscribe(id, (message) => {
      const result = JSON.parse(message);
      // Unsubscribe after receiving result
      subscriberClient.unsubscribe(id);

      // If result has error
      if (result) {
        resolve(result);
      } else {
        reject("Something went wrong.");
      }
    });
  });
};

export { waitForTheResponse };
