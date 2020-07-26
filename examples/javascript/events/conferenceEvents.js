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

function onCreate(conference, event) {
    console.log(`Conference ${conference.uuid} created`);
}

function onAddMember(conference, member, event) {
    console.log(`Member ${member.uuid} joined conference ${conference.uuid}`);
}

function onDelMember(conference, member, event) {
    console.log(`Member ${member.uuid} left conference ${conference.uuid}`);
}

function onDestroy(conference, member, event) {
    console.log(`Conference ${conference.uuid} destroyed`, conference);
}

esl.conference.listen(onCreate, onAddMember, onDelMember, onDestroy);

esl.connect()
    .then(response => {
        console.log('Connected');
    })
    .catch(error => {
        console.log('Connection error', error);
    })

/*
Connected
Conference 1efdc99e-404a-4510-a81e-1d6a813a14ea created
Member b0045298-6124-49b7-bfd6-72080b7fd873 joined conference 1efdc99e-404a-4510-a81e-1d6a813a14ea
Member f76e6320-9862-40cf-8d31-99efa5a8e51d joined conference 1efdc99e-404a-4510-a81e-1d6a813a14ea
Member f76e6320-9862-40cf-8d31-99efa5a8e51d left conference 1efdc99e-404a-4510-a81e-1d6a813a14ea
Member b0045298-6124-49b7-bfd6-72080b7fd873 left conference 1efdc99e-404a-4510-a81e-1d6a813a14ea
Conference 1efdc99e-404a-4510-a81e-1d6a813a14ea destroyed Conference {
  uuid: '1efdc99e-404a-4510-a81e-1d6a813a14ea',
  name: '12345',
  createdAt: '1595748934712921',
  destroyedAt: '1595748956872843',
  members: {
    '54': ConferenceMember {
      id: '54',
      uuid: 'b0045298-6124-49b7-bfd6-72080b7fd873',
      channelName: 'sofia/internal/1000@127.0.0.1',
      joinedAt: '1595748934752837',
      leftAt: '1595748956852851'
    },
    '55': ConferenceMember {
      id: '55',
      uuid: 'f76e6320-9862-40cf-8d31-99efa5a8e51d',
      channelName: 'sofia/internal/1001@127.0.0.1',
      joinedAt: '1595748935952835',
      leftAt: '1595748945432845'
    }
  }
}
*/