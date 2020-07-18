import ESLBuffer from './ESLBuffer';
import Connection from './Connection';
import { EventEmitter } from 'events';
import { ConnectOptions } from './interfaces';
import { loglevel } from './types';

import utils from './utils';
import * as events from './events';

import EventParser from './EventParser';
import APICallcenter from './api/callcenter/APICallcenter';
import APIConference from './api/conference/APIConference';

import Session from './objects/Session';

class ESL extends EventEmitter {

    connection: Connection;
    buffer = new ESLBuffer();

    callbackQueue: any[] = [];
    bgapiQueue:any = {};
    eventParser: EventParser = new EventParser();

    commandsOnConnect = new Set<string>();
    currentLoglevel = '';

    connectOptions: ConnectOptions;
    logger = utils.getLogger(false);
 
    private failedReconnectAttempts = 0;
    private maxReconnectAttempts = Infinity;
    private reconnectInterval = 5000;
    private reconnectOnFailure = false;

    callcenter = APICallcenter(this.api.bind(this));
    conference = APIConference(this.api.bind(this), this.addEventListener.bind(this));

    private channelEvents = [
        'CHANNEL_ANSWER',
        'CHANNEL_APPLICATION',
        'CHANNEL_BRIDGE',
        'CHANNEL_CALLSTATE',
        'CHANNEL_CREATE',
        'CHANNEL_DATA',
        'CHANNEL_DESTROY',
        'CHANNEL_EXECUTE',
        'CHANNEL_EXECUTE_COMPLETE',
        'CHANNEL_GLOBAL',
        'CHANNEL_HANGUP',
        'CHANNEL_HANGUP_COMPLETE',
        'CHANNEL_HOLD',
        'CHANNEL_ORIGINATE',
        'CHANNEL_OUTGOING',
        'CHANNEL_PARK',
        'CHANNEL_PROGRESS',
        'CHANNEL_PROGRESS_MEDIA',
        'CHANNEL_STATE',
        'CHANNEL_UNBRIDGE',
        'CHANNEL_UNHOLD',
        'CHANNEL_UNPARK',
        'CHANNEL_UUID',
    ]

    constructor(connectOptions: ConnectOptions) {
        super();

        this.connectOptions = connectOptions; 
        
        this.logger = utils.getLogger(connectOptions.log || false);
        this.connection = new Connection(connectOptions, this.logger);
        
        this.setDefaultOptions();
        this.setSocketListeners();
        this.setEventListeners();

    }

    private setDefaultOptions() {
        if (this.connectOptions.reconnectOptions) {
            if (this.connectOptions.reconnectOptions.maxAttemtps) {
                this.maxReconnectAttempts = this.connectOptions.reconnectOptions.maxAttemtps;
            }
            if (this.connectOptions.reconnectOptions.interval) {
                this.reconnectInterval = this.connectOptions.reconnectOptions.interval;
            }
            if (this.connectOptions.reconnectOptions.reconnect) {
                this.reconnectOnFailure = this.connectOptions.reconnectOptions.reconnect;
            }
        }
    }

    private setEventListeners() {
        this.addEventListener('BACKGROUND_JOB', (event) => {
            const { resolve } = this.bgapiQueue[event["Job-UUID"]] || {  };
            delete this.bgapiQueue[event["Job-UUID"]];
            if (typeof resolve == 'function') { resolve(event._body); } 
        })
    }

    private resolveNext(response: any) {
        const { resolve, reject, parser } = this.callbackQueue.shift() || {  };
        if (typeof resolve == 'function') { 
            if (parser && typeof parser === 'function') {
                try {
                    const parsedResponse = parser(response);
                    resolve(parsedResponse);
                }
                catch(error) {
                    reject(error, response);
                }
            }
            else {
                resolve(response);
            }          
        } 
    }

    private rejectNext(response: any) {
        const { reject } = this.callbackQueue.shift() || {  };
        if (typeof reject == 'function') { reject(response); } 
    }

    private emitAllEvent(name: string, body: any) {
        if (name != 'auth' && name != 'log') this.emit('ALL', body);
    }

    private setSocketListeners(){
        this.connection.socket.on('data', (data: Buffer) => {
            this.onData(data);
        });
        this.connection.socket.on('close', () => {
            if (this.reconnectOnFailure) {
                this.reconnect();
            }            
        });
    }

    public onData(data: Buffer) {
        this.buffer.getResponses(data).forEach(response => {
            const parsedResponse = this.eventParser.parseResponse(response);
            if (parsedResponse) {
                if (parsedResponse.isEvent) {
                    setImmediate(() => { 
                        this.emitAllEvent(parsedResponse.name, parsedResponse.body);
                        this.emit(`${parsedResponse.name}`, parsedResponse.body);
                    })
                }
                else { this.resolveNext(parsedResponse.body); }
            }
        });
    }

    private reconnect() {
        if (this.maxReconnectAttempts > this.failedReconnectAttempts) {
            setTimeout(() => {
                this.buffer.empty();
                this.logger('Reconnecting...');
                this.connect()
                    .then(() => { this.failedReconnectAttempts = 0; })
                    .catch(e => { this.failedReconnectAttempts++; this.logger('Unable to connect.');                
                });
            }, this.reconnectInterval);
        }
    }

    private executeOnConnect() {
        this.commandsOnConnect.forEach((command) => {
            this.send(command);
        });
    }

    send(command: string, parser?: (result: string) => { }){
        this.connection.send(command);
        return this.promise<string>(parser);
    }

    api(command: string, parser?: (result: string) => { }) {
        return this.send(`api ${command}`, parser);
    }

    sendmsg(command: string, app: string, arg = '') {
        this.connection.socket.write(`sendmsg\n`);
        this.connection.socket.write(`call-command: ${command}\n`);
        this.connection.socket.write(`execute-app-name: ${app}\n`);
        this.connection.socket.write(`execute-app-arg: ${arg}\n\n`);
        return this.promise<string>();
    }

    bgapi(command: string) {
        return new Promise((resolve, reject) => {
            this.send(`bgapi ${command}`)
                .then(result => {
                    if (result.startsWith('+')) {
                        this.bgapiQueue[result.slice(-36)] = {
                            resolve, reject
                        };
                    }
                    else {
                        reject(`Unable to execute background api. ${result}`);
                    }
                })
                .catch(error => {
                    reject(error);
                }) 
        })
    }

    private promise<T>(parser?: (result: string) => { }) {
        return new Promise<T>((resolve, reject) => {
            if (!this.connection.isOpen()) { reject('Connection is closed'); }
            else { this.callbackQueue.push({ resolve, reject, parser }); }
        });
    }

    async connect() {
        try {
            this.logger('Connecting...');
            const connection = await this.connection.connect();
            if (connection) {
                this.logger('Authenticating...');
                return await this.authenticate();              
            }
        }
        catch(error) {
            throw new Error(error);
        }
    }

    private async authenticate() {
        try {
            const authResponse = await this.send(`auth ${this.connectOptions.password}`);
            if (authResponse.startsWith('+OK')) { 
                this.logger('Authentication success');
                this.executeOnConnect();
                return authResponse; 
            }
            else { 
                this.logger('Unable to authenticate');
                throw new Error('Invalid credentials.');
            }
        }
        catch(error) {
            throw new Error(error);
        }
    }
    
    addLogListener(loglevel: loglevel, callback: (log: string) => void) {
        this.send(`log ${loglevel}`).catch(() => {
            this.logger('Unable to add log listener');
        });
        this.commandsOnConnect.add(`log ${loglevel}`);
        this.currentLoglevel = loglevel;
        this.addListener('log', callback);
    }

    removeLogListener() {
        this.send(`nolog`).catch(() => {
            this.logger('Unable to remove log listener');
        });
        this.commandsOnConnect.delete(`log ${this.currentLoglevel}`);
        this.removeAllListeners('log');
    }


    listen(callback: (session: Session) => void) {

        const channels: {
            [key: string]: Session
        } = {  };

        this.addEventListener(this.channelEvents, (event) => {
            const uuid = event["Unique-ID"];
            if (channels[uuid]) { channels[uuid].emit(event["Event-Name"], event); }
        });

        this.addEventListener('CHANNEL_CREATE', (event) => {
            const uuid = event["Unique-ID"];
            channels[uuid] = new Session(event);
            callback(channels[uuid]);
        });

        this.addEventListener('CHANNEL_DESTROY', (event) => {
            const uuid = event["Unique-ID"];
            delete channels[uuid];
        });

    }

    addEventListener(event: 'ADD_SCHEDULE', fn: (event: events.AddSchedule) => void): void;
    addEventListener(event: 'API', fn: (event: events.Api) => void): void;
    addEventListener(event: 'BACKGROUND_JOB', fn: (event: events.BackgroundJob) => void): void;
    addEventListener(event: 'CALL_DETAIL', fn: (event: events.CallDetail) => void): void;
    addEventListener(event: 'CALL_SECURE', fn: (event: events.CallSecure) => void): void;
    addEventListener(event: 'CALL_SETUP_REQ', fn: (event: events.CallSetupReq) => void): void;
    addEventListener(event: 'CALL_UPDATE', fn: (event: events.CallUpdate) => void): void;
    addEventListener(event: 'CDR', fn: (event: events.Cdr) => void): void;
    addEventListener(event: 'CHANNEL_ANSWER', fn: (event: events.ChannelAnswer) => void): void;
    addEventListener(event: 'CHANNEL_APPLICATION', fn: (event: events.ChannelApplication) => void): void;
    addEventListener(event: 'CHANNEL_BRIDGE', fn: (event: events.ChannelBridge) => void): void;
    addEventListener(event: 'CHANNEL_CALLSTATE', fn: (event: events.ChannelCallstate) => void): void;
    addEventListener(event: 'CHANNEL_CREATE', fn: (event: events.ChannelCreate) => void): void;
    addEventListener(event: 'CHANNEL_DATA', fn: (event: events.ChannelData) => void): void;
    addEventListener(event: 'CHANNEL_DESTROY', fn: (event: events.ChannelDestroy) => void): void;
    addEventListener(event: 'CHANNEL_EXECUTE', fn: (event: events.ChannelExecute) => void): void;
    addEventListener(event: 'CHANNEL_EXECUTE_COMPLETE', fn: (event: events.ChannelExecuteComplete) => void): void;
    addEventListener(event: 'CHANNEL_GLOBAL', fn: (event: events.ChannelGlobal) => void): void;
    addEventListener(event: 'CHANNEL_HANGUP', fn: (event: events.ChannelHangup) => void): void;
    addEventListener(event: 'CHANNEL_HANGUP_COMPLETE', fn: (event: events.ChannelHangupComplete) => void): void;
    addEventListener(event: 'CHANNEL_HOLD', fn: (event: events.ChannelHold) => void): void;
    addEventListener(event: 'CHANNEL_ORIGINATE', fn: (event: events.ChannelOriginate) => void): void;
    addEventListener(event: 'CHANNEL_OUTGOING', fn: (event: events.ChannelOutgoing) => void): void;
    addEventListener(event: 'CHANNEL_PARK', fn: (event: events.ChannelPark) => void): void;
    addEventListener(event: 'CHANNEL_PROGRESS', fn: (event: events.ChannelProgress) => void): void;
    addEventListener(event: 'CHANNEL_PROGRESS_MEDIA', fn: (event: events.ChannelProgressMedia) => void): void;
    addEventListener(event: 'CHANNEL_STATE', fn: (event: events.ChannelState) => void): void;
    addEventListener(event: 'CHANNEL_UNBRIDGE', fn: (event: events.ChannelUnbridge) => void): void;
    addEventListener(event: 'CHANNEL_UNHOLD', fn: (event: events.ChannelUnhold) => void): void;
    addEventListener(event: 'CHANNEL_UNPARK', fn: (event: events.ChannelUnpark) => void): void;
    addEventListener(event: 'CHANNEL_UUID', fn: (event: events.ChannelUuid) => void): void;
    addEventListener(event: 'CLONE', fn: (event: events.Clone) => void): void;
    addEventListener(event: 'CODEC', fn: (event: events.Codec) => void): void;
    addEventListener(event: 'COMMAND', fn: (event: events.Command) => void): void;
    addEventListener(event: 'CONFERENCE_DATA', fn: (event: events.ConferenceData) => void): void;
    addEventListener(event: 'CONFERENCE_DATA_QUERY', fn: (event: events.ConferenceDataQuery) => void): void;
    addEventListener(event: 'CUSTOM', fn: (event: events.Custom) => void): void;
    addEventListener(event: 'DEL_SCHEDULE', fn: (event: events.DelSchedule) => void): void;
    addEventListener(event: 'DETECTED_SPEECH', fn: (event: events.DetectedSpeech) => void): void;
    addEventListener(event: 'DETECTED_TONE', fn: (event: events.DetectedTone) => void): void;
    addEventListener(event: 'DEVICE_STATE', fn: (event: events.DeviceState) => void): void;
    addEventListener(event: 'DTMF', fn: (event: events.Dtmf) => void): void;
    addEventListener(event: 'EXE_SCHEDULE', fn: (event: events.ExeSchedule) => void): void;
    addEventListener(event: 'FAILURE', fn: (event: events.Failure) => void): void;
    addEventListener(event: 'GENERAL', fn: (event: events.General) => void): void;
    addEventListener(event: 'HEARTBEAT', fn: (event: events.Heartbeat) => void): void;
    addEventListener(event: 'LOG', fn: (event: events.Log) => void): void;
    addEventListener(event: 'MEDIA_BUG_START', fn: (event: events.MediaBugStart) => void): void;
    addEventListener(event: 'MEDIA_BUG_STOP', fn: (event: events.MediaBugStop) => void): void;
    addEventListener(event: 'MESSAGE', fn: (event: events.Message) => void): void;
    addEventListener(event: 'MESSAGE_QUERY', fn: (event: events.MessageQuery) => void): void;
    addEventListener(event: 'MESSAGE_WAITING', fn: (event: events.MessageWaiting) => void): void;
    addEventListener(event: 'MODULE_LOAD', fn: (event: events.ModuleLoad) => void): void;
    addEventListener(event: 'MODULE_UNLOAD', fn: (event: events.ModuleUnload) => void): void;
    addEventListener(event: 'NAT', fn: (event: events.Nat) => void): void;
    addEventListener(event: 'NOTALK', fn: (event: events.Notalk) => void): void;
    addEventListener(event: 'NOTIFY', fn: (event: events.Notify) => void): void;
    addEventListener(event: 'NOTIFY_IN', fn: (event: events.NotifyIn) => void): void;
    addEventListener(event: 'PHONE_FEATURE', fn: (event: events.PhoneFeature) => void): void;
    addEventListener(event: 'PHONE_FEATURE_SUBSCRIBE', fn: (event: events.PhoneFeatureSubscribe) => void): void;
    addEventListener(event: 'PLAYBACK_START', fn: (event: events.PlaybackStart) => void): void;
    addEventListener(event: 'PLAYBACK_STOP', fn: (event: events.PlaybackStop) => void): void;
    addEventListener(event: 'PRESENCE_IN', fn: (event: events.PresenceIn) => void): void;
    addEventListener(event: 'PRESENCE_OUT', fn: (event: events.PresenceOut) => void): void;
    addEventListener(event: 'PRESENCE_PROBE', fn: (event: events.PresenceProbe) => void): void;
    addEventListener(event: 'PRIVATE_COMMAND', fn: (event: events.PrivateCommand) => void): void;
    addEventListener(event: 'PUBLISH', fn: (event: events.Publish) => void): void;
    addEventListener(event: 'QUEUE_LEN', fn: (event: events.QueueLen) => void): void;
    addEventListener(event: 'RECORD_START', fn: (event: events.RecordStart) => void): void;
    addEventListener(event: 'RECORD_STOP', fn: (event: events.RecordStop) => void): void;
    addEventListener(event: 'RECV_INFO', fn: (event: events.RecvInfo) => void): void;
    addEventListener(event: 'RECV_MESSAGE', fn: (event: events.RecvMessage) => void): void;
    addEventListener(event: 'RECV_RTCP_MESSAGE', fn: (event: events.RecvRtcpMessage) => void): void;
    addEventListener(event: 'RECYCLE', fn: (event: events.Recycle) => void): void;
    addEventListener(event: 'RELOADXML', fn: (event: events.Reloadxml) => void): void;
    addEventListener(event: 'REQUEST_PARAMS', fn: (event: events.RequestParams) => void): void;
    addEventListener(event: 'RE_SCHEDULE', fn: (event: events.ReSchedule) => void): void;
    addEventListener(event: 'ROSTER', fn: (event: events.Roster) => void): void;
    addEventListener(event: 'SEND_INFO', fn: (event: events.SendInfo) => void): void;
    addEventListener(event: 'SEND_MESSAGE', fn: (event: events.SendMessage) => void): void;
    addEventListener(event: 'SESSION_HEARTBEAT', fn: (event: events.SessionHeartbeat) => void): void;
    addEventListener(event: 'SHUTDOWN', fn: (event: events.Shutdown) => void): void;
    addEventListener(event: 'STARTUP', fn: (event: events.Startup) => void): void;
    addEventListener(event: 'SUBCLASS_ANY', fn: (event: events.SubclassAny) => void): void;
    addEventListener(event: 'TALK', fn: (event: events.Talk) => void): void;
    addEventListener(event: 'TRAP', fn: (event: events.Trap) => void): void;
    addEventListener(event: 'UNPUBLISH', fn: (event: events.Unpublish) => void): void;

    addEventListener(event:'ALL', fn: (event: any) => void): void;
    
    addEventListener(event: 'CUSTOM conference::maintenance', fn: (event: events.ConferenceMaintenance) => void): void;
    addEventListener(event: 'CUSTOM alsa::ringing', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM bert::in_sync', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM bert::lost_sync', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM bert::timeout', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM callcenter::info', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM conference::cdr', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM cv::video_detect', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM dingaling::connected', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM dingaling::login_failure', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM dingaling::login_success', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM fifo::info', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM filestring::close', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM filestring::fail', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM filestring::open', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM freeswitchc::boot_freeswitch', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM gsmopen::alarm', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM gsmopen::dump_event', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM gsmopen::incoming_sms', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM khomp::maintenance', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM khomp::sms_received', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM khomp::sms_sent', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM limit::usage', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM menu::enter', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM menu::exit', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM multicast::event', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM multicast::peerdown', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM multicast::peerup', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM name::method_name', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM parking::info', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM portaudio::audio_dev_error', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM portaudio::callheld', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM portaudio::callresumed', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM portaudio::makecall', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM portaudio::ringing', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM rtmp::attach', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM rtmp::clientcustom', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM rtmp::connect', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM rtmp::custom', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM rtmp::detach', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM rtmp::disconnect', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM rtmp::login', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM rtmp::logout', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM rtmp::register', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM rtmp::unregister', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sendfile::ack', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM skinny::alarm', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM skinny::call_state', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM skinny::device_to_user', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM skinny::expire', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM skinny::register', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM skinny::unregister', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM skinny::user_to_device', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM skinny::xml_alarm', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM skypopen::incoming_chatmessage', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM skypopen::incoming_raw', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM smpp::bind_transceiver_resp', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::error', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::expire', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::gateway_add', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::gateway_delete', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::gateway_state', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::intercepted', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::notify_refer', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::notify_watched_header', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::pre_register', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::profile_start', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::recovery_recovered', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::recovery_recv', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::recovery_send', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::register', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::register_attempt', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::register_failure', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::reinvite', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::replaced', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::sip_user_state', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::transferee', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::transferor', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::unregister', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM sofia::wrong_call_state', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM spandsp::rxfaxnegociateresult', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM spandsp::rxfaxpageresult', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM spandsp::rxfaxresult', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM spandsp::txfaxnegociateresult', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM spandsp::txfaxpageresult', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM spandsp::txfaxresult', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM test::cool', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM unimrcp::profile_close', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM unimrcp::profile_create', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM unimrcp::profile_open', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM verto::client_connect', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM verto::client_disconnect', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM verto::login', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM vmd::beep', fn: (event: any) => void): void;
    addEventListener(event: 'CUSTOM vm::maintenance ', fn: (event: any) => void): void;
    addEventListener(event: string | string[],  fn: (event: any) => void): void;

    addEventListener(event: string  | string[], callback: (event: any) => void) {
        if (typeof event === 'string') event = [ event ];
        event.forEach(e => {
            this.send(`event json ${e}`).catch(() => { 
                this.logger(`Unable to add json event listener for ${e}`);
            });
            this.commandsOnConnect.add(`event json ${e}`);
            this.addListener(e, callback);
        });
    }

    removeEventListener(event: string) {
        this.removeAllListeners(event);
        this.commandsOnConnect.delete(`event json ${event}`);
    }

    addFilter(key: string, value: string) {
        this.send(`filter ${key} ${value}`).catch(() => {
            this.logger('Unable to add filter');
        });
        this.commandsOnConnect.add(`filter ${key} ${value}`);
        return this.send(`filter ${key} ${value}`);
    }

    removeFilter(key: string, value: string) {
        this.send(`filter delete ${key} ${value}`).catch(() => { 
            this.logger('Unable to delete filter');
        });
        this.commandsOnConnect.delete(`filter delete ${key} ${value}`);
    }


}

export default ESL;