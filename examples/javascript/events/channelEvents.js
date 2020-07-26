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

esl.addEventListener('CHANNEL_CREATE', (event) => {
    console.log(`Channel ${event["Unique-ID"]} created`);
})

esl.addEventListener('CHANNEL_DESTROY', (event) => {
    console.log(`Channel ${event["Unique-ID"]} destroyed`);
})

esl.addEventListener(['CHANNEL_ANSWER', 'CHANNEL_HANGUP'], (event) => {
    console.log(`Channel ${event["Unique-ID"]} answered or hangedup`);
})

esl.connect()
    .then(response => {
        console.log('Connected');
    })
    .catch(error => {
        console.log('Connection error', error);
    })