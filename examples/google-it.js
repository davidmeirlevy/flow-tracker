const FlowTracker = require('../index');

const list = [
    {
        url: 'https://www.google.com',
        qs: {
            q: 'david'
        },
        onRespond: (response, body, {next, fail, retry}) => {
            if(body.indexOf('David - Wikipedia') === -1) {
                fail();
                console.log('failed');
            } else {
                next();
                console.log('googled success');
            }
        }
    }
];

const x = new FlowTracker(list);

x.start();
