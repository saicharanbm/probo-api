const createClientOrderBook = (data: {
  yes: {
    [key: number]: {
      total: number;
      orders?: {
        sell: {
          [key: string]: number;
        };
        req: {
          [key: string]: number;
        };
      };
    };
  };
  no: {
    [key: number]: {
      total: number;
      orders?: {
        sell: {
          [key: string]: number;
        };
        req: {
          [key: string]: number;
        };
      };
    };
  };
}) => {
  const clientOrderBook = JSON.parse(JSON.stringify(data));
  Object.keys(clientOrderBook.yes).forEach((key) => {
    delete clientOrderBook.yes[parseInt(key)].orders;
  });

  Object.keys(clientOrderBook.no).forEach((key) => {
    delete clientOrderBook.no[parseInt(key)].orders;
  });
  return clientOrderBook;
};

export { createClientOrderBook };
