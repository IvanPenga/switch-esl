import { ESLResponse } from '../../src/interfaces';
import JsonEvents from './jsonEvents';
import PlainEvents from './plainEvents';

enum ContentType {
    Json = 'text/event-json',
    Plain = 'text/event-plain',
    XML = 'text/event-xml',
    Response = 'api/response',
    Reply = 'command/reply',
    Disconnect = 'text/disconnect-notice',
    Auth = 'auth/request',
    Log = 'log/data',
    Unknown = 'some/unknown/type'
}

const eslResponseBase = {
    'Content-Length': 20,
    length: 20,
    buffering: false
}

const goodJson: ESLResponse = {
    headers: { 'Content-Type': ContentType.Json, 'Content-Length': 20 }, 
    body: JsonEvents.good[0],
    ...eslResponseBase
}
const badJson: ESLResponse = {
    headers: { 'Content-Type': ContentType.Json, 'Content-Length': 20 }, 
    body: JsonEvents.bad[0],
    ...eslResponseBase
}
const goodPlain: ESLResponse = {
    headers: { 'Content-Type': ContentType.Plain, 'Content-Length': 20 }, 
    body: PlainEvents.good[0],
    ...eslResponseBase
}
const badPlain: ESLResponse = {
    headers: { 'Content-Type': ContentType.Plain, 'Content-Length': 20 }, 
    body: PlainEvents.bad[0],
    ...eslResponseBase 
}
const badUnknownHeader: ESLResponse = {
    headers: { 'Content-Type': ContentType.Unknown, 'Content-Length': 20 }, 
    body: PlainEvents.good[0],
    ...eslResponseBase  
}
const badNoBodyJson: ESLResponse = {
    headers: { 'Content-Type': ContentType.Json, 'Content-Length': 20 }, 
    body: '',
    ...eslResponseBase
}

export default {
    goodJson,
    badJson,
    goodPlain,
    badPlain,
    badUnknownHeader,
    badNoBodyJson,
}



/*
case 'text/event-json':  return this.parseJSONEvent(response.body);
case 'text/event-plain': return this.parseStringEvent(response.body);
case 'text/event-xml':   return this.parseStringEvent(response.body);
case 'api/response':     return this.parseStringCommand(response.body);
case 'command/reply':    return this.parseStringCommand(response.headers['Reply-Text']);
case 'text/disconnect-notice': return this.parseStringEvent(response.body, 'disconnect');
case 'auth/request': return this.parseStringEvent(response.body, 'auth');
case 'log/data': return this.parseStringEvent(response.body, 'log');


const one = {
    headers: {
        'Content-Length': 20,
        'Content-Type': 'app',
    }
    body: {

    },
    length: 30,
    buffering: false
}
*/