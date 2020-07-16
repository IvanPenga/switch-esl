import { Socket } from 'net';
import { ConnectOptions } from './interfaces';
import { ConnectionState } from './enums';

class Connection {

    socket: Socket = new Socket();
    connectionState: ConnectionState = ConnectionState.Closed;
    connectOptions: ConnectOptions;
    logger: any;

    currentPromise = { resolve: (result: string) => {}, reject: (result: string) => {} };

    constructor(connectOptions: ConnectOptions, logger: any) {
        if (connectOptions.connection instanceof Socket) {
            this.socket = connectOptions.connection;
            this.connectionState = ConnectionState.Connected;
        }

        this.connectOptions = connectOptions;
        var r = connectOptions.connection;
        
        this.logger = logger;
        this.setSocketListeners();
    }

    setSocketListeners() {
        this.socket.on('connect', () => {
            this.connectionState = ConnectionState.Authenticating;
            this.logger('Socket connected');
            this.currentPromise.resolve('Connected');
        });

        this.socket.on('end', () => {
            this.connectionState = ConnectionState.Closed;
            this.logger('Socket end');
            this.currentPromise.reject('Unable to connect. Socket end.');
        });

        this.socket.on('error', (err) => {
            this.connectionState = ConnectionState.Closed;
            this.logger('Socket error');
            this.currentPromise.reject('Unable to connect. Socket error.');
        });
        this.socket.on('close', (err) => {
            this.connectionState = ConnectionState.Closed;
            this.logger('Socket closed');
            this.currentPromise.reject('Unable to connect. Socket close.');
        });
    }

    socketDataProvided(socket: Socket) {
        return socket.remotePort && socket.remoteAddress && socket.localPort  && socket.localAddress; 
    }

    connect() {
        return new Promise<string>((resolve, reject) => {
            this.connectionState = ConnectionState.Connecting;
            if (this.connectOptions.connection instanceof Socket) {
                this.socketDataProvided(this.connectOptions.connection) ?
                    resolve('Already connected') : reject('Refuse to connect Socket. Please provide host and port instead');
            }
            else {
                this.currentPromise = { resolve, reject };
                this.socket.connect(this.connectOptions.connection);
            }
        });
    }

    send(command: string) {
        if (this.isOpen()) {
            this.socket.write(command);
            this.socket.write('\n');
            this.socket.write('\n');
        }
    }

    isOpen() {
        return this.connectionState === ConnectionState.Connected || 
               this.connectionState === ConnectionState.Authenticating;
    }

}

export default Connection;