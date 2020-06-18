import ESLBuffer from './ESLBuffer';
import Connection from './Connection';
import { EventEmitter } from 'events';
import { ConnectOptions, CommandResponse, ApiResponse } from './interfaces';
import { loglevel } from './types';

import utils from './utils';

import { 
    ConferenceMaintenance,
    AddSchedule,
    Api,
    BackgroundJob,
    CallDetail,
    CallSecure,
    CallSetupReq,
    CallUpdate,
    Cdr,
    ChannelAnswer,
    ChannelApplication,
    ChannelBridge,
    ChannelCallstate,
    ChannelCreate,
    ChannelData,
    ChannelDestroy,
    ChannelExecute,
    ChannelExecuteComplete,
    ChannelGlobal,
    ChannelHangup,
    ChannelHangupComplete,
    ChannelHold,
    ChannelOriginate,
    ChannelOutgoing,
    ChannelPark,
    ChannelProgress,
    ChannelProgressMedia,
    ChannelState,
    ChannelUnbridge,
    ChannelUnhold,
    ChannelUnpark,
    ChannelUuid,
    Clone,
    Codec,
    Command,
    ConferenceData,
    ConferenceDataQuery,
    Custom,
    DelSchedule,
    DetectedSpeech,
    DetectedTone,
    DeviceState,
    Dtmf,
    ExeSchedule,
    Failure,
    General,
    Heartbeat,
    Log,
    MediaBugStart,
    MediaBugStop,
    Message,
    MessageQuery,
    MessageWaiting,
    ModuleLoad,
    ModuleUnload,
    Nat,
    Notalk,
    Notify,
    NotifyIn,
    PhoneFeature,
    PhoneFeatureSubscribe,
    PlaybackStart,
    PlaybackStop,
    PresenceIn,
    PresenceOut,
    PresenceProbe,
    PrivateCommand,
    Publish,
    QueueLen,
    RecordStart,
    RecordStop,
    RecvInfo,
    RecvMessage,
    RecvRtcpMessage,
    Recycle,
    Reloadxml,
    RequestParams,
    ReSchedule,
    Roster,
    SendInfo,
    SendMessage,
    SessionHeartbeat,
    Shutdown,
    Startup,
    SubclassAny,
    Talk,
    Trap,
    Unpublish
} from './events';
import EventParser from './EventParser';

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
 
    failedReconnectAttempts = 0;

    constructor(connectOptions: ConnectOptions = { host: '127.0.0.1', port: 8021, password: 'ClueCon',
        reconnectOptions: { reconnect: false, interval: 3000, maxAttemtps: Infinity }}) {
        super();

        this.connectOptions = connectOptions; 
        
        this.logger = utils.getLogger(connectOptions.log || false);
        this.connection = new Connection(connectOptions, this.logger);
        
        this.setSocketListeners();
        this.setEventListeners();
    }

    private setEventListeners() {
        this.addEventListener('BACKGROUND_JOB', (event) => {
            const { resolve } = this.bgapiQueue[event["Job-UUID"]] || {  };
            delete this.bgapiQueue[event["Job-UUID"]];
            if (typeof resolve == 'function') { resolve(event) }; 
        })
    }


    cbuffer:Buffer = Buffer.alloc(0);

    private resolveNext(response: any) {
        const { resolve } = this.callbackQueue.shift() || {  };
        if (typeof resolve == 'function') { resolve(response) }; 
    }

    private rejectNext(response: any) {
        const { reject } = this.callbackQueue.shift() || {  };
        if (typeof reject == 'function') { reject(response) }; 
    }

    private emitAllEvent(name: string, body: any) {
        if (name != 'auth' && name != 'log') this.emit('ALL', body);
    }

    private setSocketListeners(){

        this.connection.socket.on('data', (data: Buffer) => {

            //console.log("got some data!");
            //console.log(data + "");
            this.cbuffer = Buffer.concat([this.cbuffer, data], this.cbuffer.length + data.length);

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
        });

        this.connection.socket.on('close', () => {
            if (this.connectOptions.reconnectOptions?.reconnect){
                this.reconnect();
            }            
        });

    }

    private reconnect() {
        if ((this.connectOptions.reconnectOptions?.maxAttemtps || Infinity) > this.failedReconnectAttempts) {
            setTimeout(() => {
                this.buffer.empty();
                this.logger('Reconnecting...');
                this.connect()
                    .then(() => { this.failedReconnectAttempts = 0; })
                    .catch(e => { this.failedReconnectAttempts++; this.logger('Unable to connect.');                
                });
            }, this.connectOptions.reconnectOptions?.interval || 5000);
        }
    }

    private executeOnConnect() {
        this.commandsOnConnect.forEach((command) => {
            this.send(command);
        });
    }

    send(command: string){
        this.connection.send(command);
        return this.promise<string>();
    }

    api(command: string) {

    }

    bgapi(command: string) {
        return new Promise(async (resolve, reject) => {
              try {
                  const result = await this.send(`bgapi ${command}`);
                  if (result.startsWith('+')) {
                      this.bgapiQueue[result.slice(-36)] = {
                          resolve, reject
                      };
                  }
                  else {
                      reject(`Unable to execute background api. ${result}`);
                  }
              }
              catch(error) {
                  reject(error);
              }  
        })
    }

    private promise<T>(command?: any) {
        return new Promise<T>((resolve, reject) => {
            if (!this.connection.isOpen()) { reject('Connection is closed'); }
            else { 
                this.callbackQueue.push({ resolve, reject }); }
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
            const authResponse = await this.send(`auth ${this.connection.connectOptions.password}`);
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
        this.send(`log ${loglevel}`).catch(() => {});
        this.commandsOnConnect.add(`log ${loglevel}`);
        this.currentLoglevel = loglevel;
        this.addListener('log', callback);
    }

    removeLogListener() {
        this.send(`nolog`).catch(() => {});
        this.commandsOnConnect.delete(`log ${this.currentLoglevel}`);
        this.removeAllListeners('log');
    }

    addEventListener(event:'ADD_SCHEDULE',   fn: (event: AddSchedule) => void): void;
    addEventListener(event:'API',   fn: (event: Api) => void): void;
    addEventListener(event:'BACKGROUND_JOB',   fn: (event: BackgroundJob) => void): void;
    addEventListener(event:'CALL_DETAIL',   fn: (event: CallDetail) => void): void;
    addEventListener(event:'CALL_SECURE',   fn: (event: CallSecure) => void): void;
    addEventListener(event:'CALL_SETUP_REQ',   fn: (event: CallSetupReq) => void): void;
    addEventListener(event:'CALL_UPDATE',   fn: (event: CallUpdate) => void): void;
    addEventListener(event:'CDR',   fn: (event: Cdr) => void): void;
    addEventListener(event:'CHANNEL_ANSWER',   fn: (event: ChannelAnswer) => void): void;
    addEventListener(event:'CHANNEL_APPLICATION',   fn: (event: ChannelApplication) => void): void;
    addEventListener(event:'CHANNEL_BRIDGE',   fn: (event: ChannelBridge) => void): void;
    addEventListener(event:'CHANNEL_CALLSTATE',   fn: (event: ChannelCallstate) => void): void;
    addEventListener(event:'CHANNEL_CREATE',   fn: (event: ChannelCreate) => void): void;
    addEventListener(event:'CHANNEL_DATA',   fn: (event: ChannelData) => void): void;
    addEventListener(event:'CHANNEL_DESTROY',   fn: (event: ChannelDestroy) => void): void;
    addEventListener(event:'CHANNEL_EXECUTE',   fn: (event: ChannelExecute) => void): void;
    addEventListener(event:'CHANNEL_EXECUTE_COMPLETE',   fn: (event: ChannelExecuteComplete) => void): void;
    addEventListener(event:'CHANNEL_GLOBAL',   fn: (event: ChannelGlobal) => void): void;
    addEventListener(event:'CHANNEL_HANGUP',   fn: (event: ChannelHangup) => void): void;
    addEventListener(event:'CHANNEL_HANGUP_COMPLETE',   fn: (event: ChannelHangupComplete) => void): void;
    addEventListener(event:'CHANNEL_HOLD',   fn: (event: ChannelHold) => void): void;
    addEventListener(event:'CHANNEL_ORIGINATE',   fn: (event: ChannelOriginate) => void): void;
    addEventListener(event:'CHANNEL_OUTGOING',   fn: (event: ChannelOutgoing) => void): void;
    addEventListener(event:'CHANNEL_PARK',   fn: (event: ChannelPark) => void): void;
    addEventListener(event:'CHANNEL_PROGRESS',   fn: (event: ChannelProgress) => void): void;
    addEventListener(event:'CHANNEL_PROGRESS_MEDIA',   fn: (event: ChannelProgressMedia) => void): void;
    addEventListener(event:'CHANNEL_STATE',   fn: (event: ChannelState) => void): void;
    addEventListener(event:'CHANNEL_UNBRIDGE',   fn: (event: ChannelUnbridge) => void): void;
    addEventListener(event:'CHANNEL_UNHOLD',   fn: (event: ChannelUnhold) => void): void;
    addEventListener(event:'CHANNEL_UNPARK',   fn: (event: ChannelUnpark) => void): void;
    addEventListener(event:'CHANNEL_UUID',   fn: (event: ChannelUuid) => void): void;
    addEventListener(event:'CLONE',   fn: (event: Clone) => void): void;
    addEventListener(event:'CODEC',   fn: (event: Codec) => void): void;
    addEventListener(event:'COMMAND',   fn: (event: Command) => void): void;
    addEventListener(event:'CONFERENCE_DATA',   fn: (event: ConferenceData) => void): void;
    addEventListener(event:'CONFERENCE_DATA_QUERY',   fn: (event: ConferenceDataQuery) => void): void;
    addEventListener(event:'CUSTOM',   fn: (event: Custom) => void): void;
    addEventListener(event:'DEL_SCHEDULE',   fn: (event: DelSchedule) => void): void;
    addEventListener(event:'DETECTED_SPEECH',   fn: (event: DetectedSpeech) => void): void;
    addEventListener(event:'DETECTED_TONE',   fn: (event: DetectedTone) => void): void;
    addEventListener(event:'DEVICE_STATE',   fn: (event: DeviceState) => void): void;
    addEventListener(event:'DTMF',   fn: (event: Dtmf) => void): void;
    addEventListener(event:'EXE_SCHEDULE',   fn: (event: ExeSchedule) => void): void;
    addEventListener(event:'FAILURE',   fn: (event: Failure) => void): void;
    addEventListener(event:'GENERAL',   fn: (event: General) => void): void;
    addEventListener(event:'HEARTBEAT',   fn: (event: Heartbeat) => void): void;
    addEventListener(event:'LOG',   fn: (event: Log) => void): void;
    addEventListener(event:'MEDIA_BUG_START',   fn: (event: MediaBugStart) => void): void;
    addEventListener(event:'MEDIA_BUG_STOP',   fn: (event: MediaBugStop) => void): void;
    addEventListener(event:'MESSAGE',   fn: (event: Message) => void): void;
    addEventListener(event:'MESSAGE_QUERY',   fn: (event: MessageQuery) => void): void;
    addEventListener(event:'MESSAGE_WAITING',   fn: (event: MessageWaiting) => void): void;
    addEventListener(event:'MODULE_LOAD',   fn: (event: ModuleLoad) => void): void;
    addEventListener(event:'MODULE_UNLOAD',   fn: (event: ModuleUnload) => void): void;
    addEventListener(event:'NAT',   fn: (event: Nat) => void): void;
    addEventListener(event:'NOTALK',   fn: (event: Notalk) => void): void;
    addEventListener(event:'NOTIFY',   fn: (event: Notify) => void): void;
    addEventListener(event:'NOTIFY_IN',   fn: (event: NotifyIn) => void): void;
    addEventListener(event:'PHONE_FEATURE',   fn: (event: PhoneFeature) => void): void;
    addEventListener(event:'PHONE_FEATURE_SUBSCRIBE',   fn: (event: PhoneFeatureSubscribe) => void): void;
    addEventListener(event:'PLAYBACK_START',   fn: (event: PlaybackStart) => void): void;
    addEventListener(event:'PLAYBACK_STOP',   fn: (event: PlaybackStop) => void): void;
    addEventListener(event:'PRESENCE_IN',   fn: (event: PresenceIn) => void): void;
    addEventListener(event:'PRESENCE_OUT',   fn: (event: PresenceOut) => void): void;
    addEventListener(event:'PRESENCE_PROBE',   fn: (event: PresenceProbe) => void): void;
    addEventListener(event:'PRIVATE_COMMAND',   fn: (event: PrivateCommand) => void): void;
    addEventListener(event:'PUBLISH',   fn: (event: Publish) => void): void;
    addEventListener(event:'QUEUE_LEN',   fn: (event: QueueLen) => void): void;
    addEventListener(event:'RECORD_START',   fn: (event: RecordStart) => void): void;
    addEventListener(event:'RECORD_STOP',   fn: (event: RecordStop) => void): void;
    addEventListener(event:'RECV_INFO',   fn: (event: RecvInfo) => void): void;
    addEventListener(event:'RECV_MESSAGE',   fn: (event: RecvMessage) => void): void;
    addEventListener(event:'RECV_RTCP_MESSAGE',   fn: (event: RecvRtcpMessage) => void): void;
    addEventListener(event:'RECYCLE',   fn: (event: Recycle) => void): void;
    addEventListener(event:'RELOADXML',   fn: (event: Reloadxml) => void): void;
    addEventListener(event:'REQUEST_PARAMS',   fn: (event: RequestParams) => void): void;
    addEventListener(event:'RE_SCHEDULE',   fn: (event: ReSchedule) => void): void;
    addEventListener(event:'ROSTER',   fn: (event: Roster) => void): void;
    addEventListener(event:'SEND_INFO',   fn: (event: SendInfo) => void): void;
    addEventListener(event:'SEND_MESSAGE',   fn: (event: SendMessage) => void): void;
    addEventListener(event:'SESSION_HEARTBEAT',   fn: (event: SessionHeartbeat) => void): void;
    addEventListener(event:'SHUTDOWN',   fn: (event: Shutdown) => void): void;
    addEventListener(event:'STARTUP',   fn: (event: Startup) => void): void;
    addEventListener(event:'SUBCLASS_ANY',   fn: (event: SubclassAny) => void): void;
    addEventListener(event:'TALK',   fn: (event: Talk) => void): void;
    addEventListener(event:'TRAP',   fn: (event: Trap) => void): void;
    addEventListener(event:'UNPUBLISH',   fn: (event: Unpublish) => void): void;

    addEventListener(event:'ALL', fn: (event: any) => void): void;
    
    addEventListener(event: 'CUSTOM conference::maintenance', fn: (event: ConferenceMaintenance) => void): void;
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
            this.send(`event json ${e}`).catch(() => { });
            this.commandsOnConnect.add(`event json ${e}`);
            this.addListener(e, callback);
        });
    }

    removeEventListener(event: string) {
        this.removeAllListeners(event);
        this.commandsOnConnect.delete(`event json ${event}`);
    }

    addFilter(key: string, value: string) {
        this.send(`filter ${key} ${value}`).catch(() => { });
        this.commandsOnConnect.add(`filter ${key} ${value}`);
        return this.send(`filter ${key} ${value}`);
    }

    removeFilter(key: string, value: string) {
        this.send(`filter delete ${key} ${value}`).catch(() => { });
        this.commandsOnConnect.delete(`filter delete ${key} ${value}`);
    }
}

export default ESL;