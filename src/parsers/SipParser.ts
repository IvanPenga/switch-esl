class SipParser {
    
    parse(sipMessage: string) {
        const res = RegExp(`^(recv|send) \\d+ bytes (from|to) (tcp|udp)/\\[(\\d{1,3}.\\d{1,3}.\\d{1,3}.\\d{1,3})\\]:(\\d{1,5}) at`).exec(sipMessage);
        if (res && res.length > 5) {
            const [ message, direction, _, protocol, address, port ] = res;
            const response = 
                direction === 'recv' ? this.sipRequest(sipMessage) :
                direction === 'send' ? this.sipResponse(sipMessage) : {  };
            return { message, direction, protocol, address, port, body: response };
        }
    }

    sipRequest(sipMessage: string) {
        const body = sipMessage.split('\n').slice(2);

        if (!body) return { };
        const [ method, uri ] = body[0].split(' ');

        const response: any = { };
        for (let i = 1; i < body.length; i++) {
            const delimiter = body[i].indexOf(': ');
            if (delimiter !== -1) {
                response[body[i].slice(0, delimiter)] = body[i].slice(delimiter + 2);
            }
        }
        return { method, uri, ...response };
    }

    sipResponse(sipMessage: string) {
        const body = sipMessage.split('\n').slice(2);

        if (!body) return { };
        const [ _, protocol, code, message ] = RegExp(`(.*) (\\d+) (.*)`).exec(body[0]) || [];
        if (!code && !message) return {  };

        const response: any = { };
        for (let i = 1; i < body.length; i++) {
            const delimiter = body[i].indexOf(': ');
            if (delimiter !== -1) {
                response[body[i].slice(0, delimiter)] = body[i].slice(delimiter + 2);
            }
        }
        return { code, message, ...response };
    }
}

export default SipParser;
