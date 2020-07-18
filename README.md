# switch-esl

 Implementation of Freeswitch event socket library written in Typescript.

## Installation

```
npm install switch-esl
```

## Freeswitch setup 

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

## Usage 

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

## More examples

### Add or remove various event listeners

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

### Custom API parser

When executing api functions via eslClient.api function you can add custom parser to parse response.
If parser is omitted, function will return raw response (string) from Freeswitch. 

```javascript
function parseFunction(result: any) {
    const row = result.split('\n').slice(1,-1);
    if (row[0]) {
        const [ name, instanceId, uuid, type ] = row[0].split('|');
        return { name, instanceId, uuid, type };
    }
}

async function getAgent() {
    const rawAgent    = await eslClient.api('callcenter_config agent list 1000@default');
    const parsedAgent = await eslClient.api('callcenter_config agent list 1000@default', parseFunction);

    console.log(rawAgent);
    console.log(parsedAgent);
}

getAgent();
```
Result:
```
name|instance_id|uuid|type|contact|status|state|max_no_answer|wrap_up_time|reject_delay_time|busy_delay_time|no_answer_delay_time|last_bridge_start|last_bridge_end|last_offered_call|last_status_change|no_answer_count|calls_answered|talk_time|ready_time|external_calls_count
1000@default|single_box||callback|[leg_timeout=10]user/1000@default|Available|Waiting|3|10|10|60|0|0|0|1593414818|1593423623|0|0|0|0|0
+OK

{
  name: '1000@default',
  instanceId: 'single_box',
  uuid: '',
  type: 'callback'
}
```

### Callcenter API functions

ESL object exposes callcenter object which contains functions to control mod_callcenter.
Examples:

```javascript
await eslClient.callcenter.agentAdd('My agent', 'callback');
await eslClient.callcenter.queueCountTiers('support');
await eslClient.callcenter.tierAdd('support', 'My agent', '1', '2');
```

### Session listener 

'listen' function can subscribe to channel events for current session.
Callback function is fired on every CHANNEL_CREATE event.
Return value is Session object which is extension of EventEmitter.
Example usage:

```javascript
eslClient.listen((session) => {
    
    console.log(`New session is created with uuid: ${session.uuid}`);

    session.on('CHANNEL_ANSWER', (data) => {
        console.log(data);
    })

    session.on('CHANNEL_DESTROY', (data) => {
        console.log(data);
    })
})
```

### Conference listener

eslClient.conference.listen function takes four callbacks as arguments,
onCreate, onAddMember, onDelMember and onDestroy. onCreate callback is called
when conference is created (first member joins conference) and other callbacks are
called only if conference was created after 'listen' function was called. 
conference object will append new values on itself through its lifecycle.
event object contains all values from ConferenceMaintenance event.

Example usage:
```javascript
eslClient.conference.listen(
    (conference, event) => {
        console.log('Created: ', conference);
    },
    (conference, member, event) => {
        console.log('Member add: ', conference);
    },
    (conference, member, event) => {
        console.log('Member del: ', conference);
    },
    (conference, event) => {
        console.log('Destroyed: ', conference);
    },
);
```

Example result:
```
Created:  Conference {
  uuid: '8eaf4d9f-109c-40d9-9581-2af1bbb3f676',
  name: '1000',
  createdAt: '1594884345056391',
  destroyedAt: '',
  members: {}
}
Member add:  Conference {
  uuid: '8eaf4d9f-109c-40d9-9581-2af1bbb3f676',
  name: '1000',
  createdAt: '1594884345056391',
  destroyedAt: '',
  members: {
    '12': ConferenceMember {
      id: '12',
      uuid: 'c904171f-5d3f-4b37-ad34-2b179fb8eda5',
      channelName: 'sofia/internal/0000000000@127.0.0.1',
      joinedAt: '1594884345076393',
      leftAt: ''
    }
  }
}
Member add:  Conference {
  uuid: '8eaf4d9f-109c-40d9-9581-2af1bbb3f676',
  name: '1000',
  createdAt: '1594884345056391',
  destroyedAt: '',
  members: {
    '12': ConferenceMember {
      id: '12',
      uuid: 'c904171f-5d3f-4b37-ad34-2b179fb8eda5',
      channelName: 'sofia/internal/0000000000@127.0.0.1',
      joinedAt: '1594884345076393',
      leftAt: ''
    },
    '13': ConferenceMember {
      id: '13',
      uuid: 'f1ccd10c-8048-4b2e-954b-02b089277c0c',
      channelName: 'sofia/internal/0000000000@127.0.0.1',
      joinedAt: '1594884352316894',
      leftAt: ''
    }
  }
}
Member del:  Conference {
  uuid: '8eaf4d9f-109c-40d9-9581-2af1bbb3f676',
  name: '1000',
  createdAt: '1594884345056391',
  destroyedAt: '',
  members: {
    '12': ConferenceMember {
      id: '12',
      uuid: 'c904171f-5d3f-4b37-ad34-2b179fb8eda5',
      channelName: 'sofia/internal/0000000000@127.0.0.1',
      joinedAt: '1594884345076393',
      leftAt: ''
    },
    '13': ConferenceMember {
      id: '13',
      uuid: 'f1ccd10c-8048-4b2e-954b-02b089277c0c',
      channelName: 'sofia/internal/0000000000@127.0.0.1',
      joinedAt: '1594884352316894',
      leftAt: '1594884358439043'
    }
  }
}
Member del:  Conference {
  uuid: '8eaf4d9f-109c-40d9-9581-2af1bbb3f676',
  name: '1000',
  createdAt: '1594884345056391',
  destroyedAt: '',
  members: {
    '12': ConferenceMember {
      id: '12',
      uuid: 'c904171f-5d3f-4b37-ad34-2b179fb8eda5',
      channelName: 'sofia/internal/0000000000@127.0.0.1',
      joinedAt: '1594884345076393',
      leftAt: '1594884364396466'
    },
    '13': ConferenceMember {
      id: '13',
      uuid: 'f1ccd10c-8048-4b2e-954b-02b089277c0c',
      channelName: 'sofia/internal/0000000000@127.0.0.1',
      joinedAt: '1594884352316894',
      leftAt: '1594884358439043'
    }
  }
}
Destroyed:  Conference {
  uuid: '8eaf4d9f-109c-40d9-9581-2af1bbb3f676',
  name: '1000',
  createdAt: '1594884345056391',
  destroyedAt: '1594884364396466',
  members: {
    '12': ConferenceMember {
      id: '12',
      uuid: 'c904171f-5d3f-4b37-ad34-2b179fb8eda5',
      channelName: 'sofia/internal/0000000000@127.0.0.1',
      joinedAt: '1594884345076393',
      leftAt: '1594884364396466'
    },
    '13': ConferenceMember {
      id: '13',
      uuid: 'f1ccd10c-8048-4b2e-954b-02b089277c0c',
      channelName: 'sofia/internal/0000000000@127.0.0.1',
      joinedAt: '1594884352316894',
      leftAt: '1594884358439043'
    }
  }
}
```

## More about Freeswitch Event socket library

1. mod_event_socket
https://freeswitch.org/confluence/display/FREESWITCH/mod_event_socket

2. Other Event socket library implementations
https://freeswitch.org/confluence/display/FREESWITCH/Event+Socket+Library


