const { ESL } = require('switch-esl');

const esl = new ESL({ 
    connection: {
        host: '127.0.0.1',
        port: '8021'
    },
    password: 'ClueCon',
    reconnectOptions: {
        reconnect: true,
        interval: 5000,
        maxAttemtps: 10
    }
});

esl.connect()
    .then(response => {
        console.log('Connected');
        esl.addSipTraceListener('debug', true, (data) => {
            switch(data.direction) {
                case 'send': console.log(`--> ${data.body.code}`);   break;
                case 'recv': console.log(`<-- ${data.body.method}`); break;
            }
        })
    })
    .catch(error => {
        console.log('Connection error', error);
    })

/*
Example result:

<-- INVITE
--> 407
<-- ACK
<-- INVITE
--> 100
--> 183
--> 200
<-- ACK
<-- BYE
--> 200
<-- REGISTER
--> 200

*/