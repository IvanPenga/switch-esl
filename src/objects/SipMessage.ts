class SipRequest {
    public method = '';
    public uri = '';
    [ attr: string ]: string;
}

class SipResponse {
    public code = '';
    public message = '';
    [ attr: string ]: string;
}

class SipMessage {
    public message = '';
    public direction = '';
    public protocol = '';
    public address = '';
    public port = '';
    public body: SipRequest | SipResponse = {
        code: '', message: '', method: '', uri: ''
    }; 
}

export default SipMessage;