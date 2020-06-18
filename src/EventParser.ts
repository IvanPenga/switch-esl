import { ESLResponse } from './interfaces';

class EventParser {

    parseJSONEvent(body: string) {
        const json = JSON.parse(body);
        const name = json['Event-Name'] === 'CUSTOM' ? `${json['Event-Name']} ${json['Event-Subclass']}`: json['Event-Name']
        return { name, body: json, isEvent: true };
    }
    
    parseStringCommand(body: string, name: string = '') {
        return { name, body: body.trim(), isEvent: false };
    }

    parseStringEvent(body: string, name: string = '') {
        return { name, body: body.trim(), isEvent: true };
    }

    parseResponse(response: ESLResponse) {

        switch(response.headers['Content-Type']) {
            case 'text/event-json':  return this.parseJSONEvent(response.body);
            case 'text/event-plain': return this.parseStringEvent(response.body);
            case 'text/event-xml':   return this.parseStringEvent(response.body);
            case 'api/response':     return this.parseStringCommand(response.body);
            case 'command/reply':    return this.parseStringCommand(response.headers['Reply-Text']);
            case 'text/disconnect-notice': return this.parseStringEvent(response.body, 'disconnect');
            case 'auth/request': return this.parseStringEvent(response.body, 'auth');
            case 'log/data': return this.parseStringEvent(response.body, 'log');
            default: return this.parseStringEvent(response.body);
        }

    }
}

export default EventParser;