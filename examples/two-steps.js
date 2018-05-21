const FlowTracker = require('../index');

const store = {
  bookId: null,
  description: null
};

const list = [
    {
        url: 'https://demo.api-platform.com/books',
        json: true,
        onRespond: (response, body, {next, fail, retry}) => {
            if(!body.length) {
              retry();
            } else {
              store.bookId = body[0].id;
              next();
            }
        }
    },
    () => {
      return {
        url: `https://demo.api-platform.com/books/${store.bookId}`,
        json: true,
        onRespond(res, body, {next, fail}) => {
          if(!body) {
            fail();
          } else {
            store.description = body.description;
            next();
          }
      };
    }
];

const x = new FlowTracker(list);

x.start();
