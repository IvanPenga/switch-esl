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
        console.log('Connected', response);
        esl.api('status')
            .then(status => {
                console.log(status);
            })
            .catch(error => {
                console.log('Error on status command', error);
            })
    })
    .catch(error => {
        console.log('Connection error', error);
    })