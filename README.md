# switch-esl
### Implementation of Freeswitch event socket library written in Typescript

### Installation

```
npm install switch-esl
```

### Freeswitch setup 

Make sure that event_socket.conf.xml is configured properly, for example: 

```XML
<configuration name="event_socket.conf" description="Socket Client">
  <settings>
    <param name="nat-map" value="false"/>
    <param name="listen-ip" value="0.0.0.0"/>
    <param name="listen-port" value="8021"/>
    <param name="password" value="ClueCon"/>
    <param name="apply-inbound-acl" value="0.0.0.0/0"/>
  </settings>
</configuration>
```

### Usage 

Basic client usage:
```javascript
import { ESL } from 'switch-esl';

const host = '127.0.0.1';
const password = 'ClueCon';
const port = 8021;

const connection = { 
    host, 
    port
};

const reconnectOptions = {
    reconnect: true,
    interval: 5000,
    maxAttemtps: 10
}

const eslClient = new ESL({ connection, password, reconnectOptions });

eslClient.addEventListener('CHANNEL_ANSWER', (event) => {
    console.log(`Channel answered ${event["Unique-ID"]}`);
})

eslClient.addEventListener('CHANNEL_DESTROY', (event) => {
    console.log(`Channel destroyed ${event["Unique-ID"]}`);
})

eslClient.connect()
    .then(response => {
        eslClient.api('status')
            .then(response => {
                console.log(response);
            }) 
            .catch(error => {
                console.log(error);
            })
    })
    .catch(error => {
        console.log(error);
    })
```

#### More examples

Add or remove various event listeners

```javascript
//Subscribes to all events
eslClient.addEventListener('ALL', (event) => {});

//Subscribes to CHANNLE_ANSWER and CHANNEL_DESTROY events
eslClient.addEventListener(['CHANNEL_ANSWER', 'CHANNEL_DESTROY'], (event) => {});

//Logs all 'info' and above messages
eslClient.addLogListener('info', (log) => {  });

//Add event filter
eslClient.addFilter('call-direction', 'outbound');

//Remove event filter
eslClient.removeFilter('call-direction', 'outbound');

//Remove CHANNEL_ANSWER event listener
eslClient.removeEventListener('CHANNEL_ANSWER');

//Remove log listener
eslClient.removeLogListener();
```

#### More about Freeswitch Event socket library

1. mod_event_socket
https://freeswitch.org/confluence/display/FREESWITCH/mod_event_socket

2. Other Event socket library implementations
https://freeswitch.org/confluence/display/FREESWITCH/Event+Socket+Library


