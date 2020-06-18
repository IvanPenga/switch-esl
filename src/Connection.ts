import { Socket } from 'net';
import { ConnectOptions } from './interfaces';
import { ConnectionState } from './enums';

class Connection {

    socket: Socket = new Socket();
    connectOptions: ConnectOptions;
    connectionState: ConnectionState = ConnectionState.Closed;
    logger: any;

    currentPromise: { resolve:Function, reject:Function } = { resolve: () => {}, reject: () => {} }

    constructor(connectOptions: ConnectOptions, logger: any){
        this.connectOptions = connectOptions;
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

    connect() {
        return new Promise<string>((resolve, reject) => {
            this.connectionState = ConnectionState.Connecting;
            this.currentPromise = { resolve, reject };

            this.socket.connect({
                host: this.connectOptions.host,
                port: this.connectOptions.port,
            });
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